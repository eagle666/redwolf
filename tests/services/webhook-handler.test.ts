import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import {
  processWebhookEvent,
  handlePaymentSuccess,
  handlePaymentFailure,
  handleOrderExpired,
  validateWebhookData,
  ensureIdempotency,
  logWebhookEvent,
  retryFailedWebhook,
  getWebhookProcessingStatus,
  WebhookProcessingResult,
  WebhookEventData
} from '@/lib/services/webhook-handler'

// 设置测试环境变量
beforeEach(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.NODE_ENV = 'test'
  process.env.CREEM_WEBHOOK_SECRET = 'test-webhook-secret'
})

describe('Webhook处理系统测试', () => {
  describe('processWebhookEvent', () => {
    it('应该能够处理有效的Webhook事件', async () => {
      const eventData: WebhookEventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY',
        paidAt: new Date('2024-01-15T10:30:00Z'),
        metadata: {
          supporter_name: '张三',
          supporter_email: 'zhangsan@example.com',
          message: '支持网红狼保护工作'
        }
      }

      const result = await processWebhookEvent(eventData)

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.eventId).toBeDefined()
      expect(result.processedAt).toBeInstanceOf(Date)
      expect(result.donationUpdated).toBe(true)
    })

    it('应该拒绝无效的事件数据', async () => {
      const invalidEventData = {
        // 缺少必需字段
        orderId: 'creem-order-123'
      } as any

      await expect(processWebhookEvent(invalidEventData))
        .rejects.toThrow('事件数据验证失败')
    })

    it('应该处理重复的事件（幂等性）', async () => {
      const eventData: WebhookEventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY',
        paidAt: new Date('2024-01-15T10:30:00Z')
      }

      // 第一次处理
      const result1 = await processWebhookEvent(eventData)
      expect(result1.success).toBe(true)

      // 第二次处理（应该被忽略）
      const result2 = await processWebhookEvent(eventData)
      expect(result2.success).toBe(true)
      expect(result2.action).toBe('ignored')
      expect(result2.reason).toContain('重复事件')
    })

    it('应该记录处理失败的事件', async () => {
      const eventData: WebhookEventData = {
        orderId: 'creem-order-123',
        donationId: 'invalid-donation-id', // 无效的捐赠ID
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY',
        paidAt: new Date('2024-01-15T10:30:00Z')
      }

      const result = await processWebhookEvent(eventData)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.retryable).toBe(true)
    })
  })

  describe('handlePaymentSuccess', () => {
    it('应该能够处理支付成功事件', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        paidAt: new Date('2024-01-15T10:30:00Z'),
        metadata: {
          supporter_name: '张三',
          supporter_email: 'zhangsan@example.com'
        }
      }

      const result = await handlePaymentSuccess(eventData)

      expect(result.success).toBe(true)
      expect(result.donationStatus).toBe('completed')
      expect(result.completedAt).toBeInstanceOf(Date)
      expect(result.emailSent).toBe(true)
    })

    it('应该更新捐赠统计信息', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        paidAt: new Date('2024-01-15T10:30:00Z'),
        metadata: {
          supporter_name: '张三'
        }
      }

      const result = await handlePaymentSuccess(eventData)

      expect(result.success).toBe(true)
      expect(result.statisticsUpdated).toBe(true)
      expect(result.projectTotalIncreased).toBe(10000)
    })

    it('应该发送邮件通知', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        paidAt: new Date('2024-01-15T10:30:00Z'),
        metadata: {
          supporter_name: '张三',
          supporter_email: 'zhangsan@example.com'
        }
      }

      const result = await handlePaymentSuccess(eventData)

      expect(result.success).toBe(true)
      expect(result.emailSent).toBe(true)
      expect(result.emailType).toBe('donation_success')
    })
  })

  describe('handlePaymentFailure', () => {
    it('应该能够处理支付失败事件', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        failedAt: new Date('2024-01-15T10:30:00Z'),
        errorMessage: '支付超时'
      }

      const result = await handlePaymentFailure(eventData)

      expect(result.success).toBe(true)
      expect(result.donationStatus).toBe('failed')
      expect(result.failureReason).toBe('支付超时')
    })

    it('应该记录失败原因', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        failedAt: new Date('2024-01-15T10:30:00Z'),
        errorMessage: '银行卡余额不足'
      }

      const result = await handlePaymentFailure(eventData)

      expect(result.success).toBe(true)
      expect(result.failureRecorded).toBe(true)
      expect(result.failureReason).toBe('银行卡余额不足')
    })
  })

  describe('handleOrderExpired', () => {
    it('应该能够处理订单过期事件', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        expiredAt: new Date('2024-01-15T10:30:00Z')
      }

      const result = await handleOrderExpired(eventData)

      expect(result.success).toBe(true)
      expect(result.donationStatus).toBe('expired')
      expect(result.expiredAt).toBeInstanceOf(Date)
    })

    it('应该释放预留资源', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        expiredAt: new Date('2024-01-15T10:30:00Z')
      }

      const result = await handleOrderExpired(eventData)

      expect(result.success).toBe(true)
      expect(result.resourcesReleased).toBe(true)
    })
  })

  describe('validateWebhookData', () => {
    it('应该验证有效的事件数据', () => {
      const validData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }

      expect(() => validateWebhookData(validData)).not.toThrow()
    })

    it('应该拒绝缺少必需字段的数据', () => {
      const invalidData = {
        orderId: 'creem-order-123'
        // 缺少 donationId, eventType, status
      } as any

      expect(() => validateWebhookData(invalidData))
        .toThrow('事件数据验证失败')
    })

    it('应该拒绝无效的金额', () => {
      const invalidData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: -1000, // 负数金额
        currency: 'CNY'
      }

      expect(() => validateWebhookData(invalidData))
        .toThrow('事件金额必须大于等于0')
    })

    it('应该验证UUID格式', () => {
      const invalidData = {
        orderId: 'creem-order-123',
        donationId: 'invalid-uuid', // 无效UUID
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }

      expect(() => validateWebhookData(invalidData))
        .toThrow('无效的捐赠记录ID格式')
    })
  })

  describe('ensureIdempotency', () => {
    it('应该检查事件是否已处理', async () => {
      const eventId = 'event-123'

      // 第一次检查（未处理）
      const isProcessed1 = await ensureIdempotency(eventId)
      expect(isProcessed1).toBe(false)

      // 标记为已处理
      // await markEventAsProcessed(eventId)

      // 第二次检查（已处理）
      const isProcessed2 = await ensureIdempotency(eventId)
      expect(isProcessed2).toBe(true)
    })

    it('应该生成唯一的事件ID', () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY',
        timestamp: new Date('2024-01-15T10:30:00Z')
      }

      const eventId1 = generateEventId(eventData)
      const eventId2 = generateEventId(eventData)

      expect(eventId1).toBe(eventId2) // 相同数据应该生成相同ID
      expect(typeof eventId1).toBe('string')
      expect(eventId1.length).toBeGreaterThan(0)
    })
  })

  describe('logWebhookEvent', () => {
    it('应该记录Webhook事件日志', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }

      const result = await logWebhookEvent(eventData, 'processed')

      expect(result.success).toBe(true)
      expect(result.logId).toBeDefined()
      expect(result.loggedAt).toBeInstanceOf(Date)
    })

    it('应该记录处理失败的事件', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }

      const error = new Error('处理失败')
      const result = await logWebhookEvent(eventData, 'failed', error)

      expect(result.success).toBe(true)
      expect(result.logId).toBeDefined()
      expect(result.error).toBeDefined()
    })
  })

  describe('retryFailedWebhook', () => {
    it('应该能够重试失败的Webhook处理', async () => {
      const failedEventId = 'failed-event-123'

      const result = await retryFailedWebhook(failedEventId)

      expect(result.success).toBe(true)
      expect(result.retryCount).toBe(1)
      expect(result.processedAt).toBeInstanceOf(Date)
    })

    it('应该有重试次数限制', async () => {
      const failedEventId = 'failed-event-123'

      // 模拟已经重试3次
      // await incrementRetryCount(failedEventId, 3)

      const result = await retryFailedWebhook(failedEventId)

      expect(result.success).toBe(false)
      expect(result.reason).toContain('超过最大重试次数')
    })

    it('应该使用指数退避策略', async () => {
      const failedEventId = 'failed-event-123'

      const result = await retryFailedWebhook(failedEventId)

      expect(result.success).toBe(true)
      expect(result.nextRetryAt).toBeInstanceOf(Date)
      expect(result.backoffSeconds).toBeGreaterThan(0)
    })
  })

  describe('getWebhookProcessingStatus', () => {
    it('应该能够查询Webhook处理状态', async () => {
      const eventId = 'event-123'

      const status = await getWebhookProcessingStatus(eventId)

      expect(status).toBeDefined()
      expect(status.eventId).toBe(eventId)
      expect(status.status).toBeDefined()
      expect(status.processedAt).toBeDefined()
    })

    it('应该返回详细的处理信息', async () => {
      const eventId = 'event-123'

      const status = await getWebhookProcessingStatus(eventId)

      expect(status).toMatchObject({
        eventId: expect.any(String),
        status: expect.any(String),
        processedAt: expect.any(Date),
        retryCount: expect.any(Number),
        lastError: expect.any(String),
        nextRetryAt: expect.any(Date)
      })
    })
  })

  describe('错误处理', () => {
    it('应该处理数据库连接错误', async () => {
      // 模拟数据库连接错误
      const originalEnv = process.env.DATABASE_URL
      process.env.DATABASE_URL = 'invalid-database-url'

      const eventData: WebhookEventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }

      const result = await processWebhookEvent(eventData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('数据库连接失败')
      expect(result.retryable).toBe(true)

      // 恢复环境变量
      process.env.DATABASE_URL = originalEnv
    })

    it('应该处理邮件发送失败', async () => {
      const eventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        amount: 10000,
        currency: 'CNY',
        paidAt: new Date('2024-01-15T10:30:00Z'),
        metadata: {
          supporter_name: '张三',
          supporter_email: 'invalid-email@example.com' // 会导致发送失败
        }
      }

      const result = await handlePaymentSuccess(eventData)

      expect(result.success).toBe(true) // 主要处理成功
      expect(result.emailSent).toBe(false) // 邮件发送失败
      expect(result.emailError).toBeDefined()
    })

    it('应该处理并发事件', async () => {
      const eventData: WebhookEventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }

      // 并发处理相同事件
      const promises = Array.from({ length: 5 }, () => processWebhookEvent(eventData))
      const results = await Promise.all(promises)

      // 只有一个应该成功处理，其他应该被忽略
      const processedCount = results.filter(r => r.action !== 'ignored').length
      expect(processedCount).toBeLessThanOrEqual(1)
    })
  })

  describe('性能测试', () => {
    it('应该在合理时间内处理事件', async () => {
      const eventData: WebhookEventData = {
        orderId: 'creem-order-123',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }

      const startTime = Date.now()
      await processWebhookEvent(eventData)
      const processingTime = Date.now() - startTime

      expect(processingTime).toBeLessThan(5000) // 应该在5秒内完成
    })

    it('应该能够处理批量事件', async () => {
      const events = Array.from({ length: 10 }, (_, i) => ({
        orderId: `creem-order-${i}`,
        donationId: `550e8400-e29b-41d4-a716-44665544${i.toString().padStart(3, '0')}`,
        eventType: 'payment.success',
        status: 'paid',
        amount: 10000,
        currency: 'CNY'
      }))

      const startTime = Date.now()
      const results = await Promise.all(events.map(event => processWebhookEvent(event)))
      const totalTime = Date.now() - startTime

      expect(results.every(r => r.success)).toBe(true)
      expect(totalTime).toBeLessThan(10000) // 10个事件应该在10秒内完成
    })
  })
})

// 辅助函数
function generateEventId(eventData: any): string {
  // 简单的事件ID生成实现
  const dataStr = JSON.stringify(eventData)
  return Buffer.from(dataStr).toString('base64').substring(0, 32)
}