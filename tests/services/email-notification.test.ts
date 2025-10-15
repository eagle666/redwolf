import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import {
  sendDonationSuccessEmail,
  sendDonationFailureEmail,
  sendProjectUpdateEmail,
  sendThankYouEmail,
  sendAdminNotificationEmail,
  validateEmailData,
  generateEmailTemplate,
  renderEmailTemplate,
  queueEmail,
  processEmailQueue,
  getEmailDeliveryStatus,
  retryFailedEmail,
  EmailNotificationResult,
  EmailData,
  EmailTemplate,
  EmailQueueStatus
} from '@/lib/services/email-notification'

// 设置测试环境变量
beforeEach(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.NODE_ENV = 'test'
  process.env.SMTP_HOST = 'smtp.test.com'
  process.env.SMTP_PORT = '587'
  process.env.SMTP_USER = 'test@test.com'
  process.env.SMTP_PASS = 'test-password'
  process.env.FROM_EMAIL = 'noreply@redwolf.org'
  process.env.FROM_NAME = '可可西里网红狼公益网站'
})

describe('邮件通知系统测试', () => {
  describe('sendDonationSuccessEmail', () => {
    it('应该能够发送捐赠成功邮件', async () => {
      const emailData = {
        to: 'zhangsan@example.com',
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划',
        donationId: '550e8400-e29b-41d4-a716-446655440001',
        paidAt: new Date('2024-01-15T10:30:00Z'),
        message: '希望保护工作顺利'
      }

      const result = await sendDonationSuccessEmail(emailData)

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.emailId).toBeDefined()
      expect(result.sentAt).toBeInstanceOf(Date)
      expect(result.templateUsed).toBe('donation_success')
    })

    it('应该拒绝无效的邮件地址', async () => {
      const invalidEmailData = {
        to: 'invalid-email', // 无效邮箱
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划'
      }

      await expect(sendDonationSuccessEmail(invalidEmailData))
        .rejects.toThrow('邮件地址格式不正确')
    })

    it('应该处理邮件发送失败', async () => {
      // 模拟SMTP发送失败
      const emailData = {
        to: 'bounce@test.com', // 会导致发送失败的邮箱
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划'
      }

      const result = await sendDonationSuccessEmail(emailData)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.retryable).toBe(true)
    })

    it('应该支持HTML和文本格式', async () => {
      const emailData = {
        to: 'zhangsan@example.com',
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划',
        format: 'both' as const
      }

      const result = await sendDonationSuccessEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.htmlContent).toBeDefined()
      expect(result.textContent).toBeDefined()
    })
  })

  describe('sendDonationFailureEmail', () => {
    it('应该能够发送捐赠失败邮件', async () => {
      const emailData = {
        to: 'zhangsan@example.com',
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划',
        failureReason: '支付超时',
        donationId: '550e8400-e29b-41d4-a716-446655440001'
      }

      const result = await sendDonationFailureEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.emailId).toBeDefined()
      expect(result.templateUsed).toBe('donation_failure')
      expect(result.failureReasonIncluded).toBe(true)
    })

    it('应该包含重新捐赠的链接', async () => {
      const emailData = {
        to: 'zhangsan@example.com',
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划',
        projectId: '550e8400-e29b-41d4-a716-446655440000'
      }

      const result = await sendDonationFailureEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.retryLink).toBeDefined()
      expect(result.retryLink).toContain('/donate')
    })
  })

  describe('sendProjectUpdateEmail', () => {
    it('应该能够发送项目更新邮件', async () => {
      const emailData = {
        to: 'supporter@example.com',
        supporterName: '李四',
        projectName: '网红狼保护计划',
        updateTitle: '本月保护工作进展',
        updateContent: '本月成功保护了5只网红狼...',
        updateDate: new Date('2024-01-15T10:30:00Z'),
        images: ['image1.jpg', 'image2.jpg']
      }

      const result = await sendProjectUpdateEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.templateUsed).toBe('project_update')
      expect(result.updateIncluded).toBe(true)
    })

    it('应该支持批量发送', async () => {
      const emailData = {
        to: ['supporter1@example.com', 'supporter2@example.com'],
        projectName: '网红狼保护计划',
        updateTitle: '重要通知',
        updateContent: '项目有重要更新...'
      }

      const result = await sendProjectUpdateEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.recipientCount).toBe(2)
      expect(result.batchSent).toBe(true)
    })
  })

  describe('sendThankYouEmail', () => {
    it('应该能够发送感谢邮件', async () => {
      const emailData = {
        to: 'zhangsan@example.com',
        supporterName: '张三',
        totalDonations: 500,
        donationCount: 3,
        lastDonationDate: new Date('2024-01-15T10:30:00Z')
      }

      const result = await sendThankYouEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.templateUsed).toBe('thank_you')
      expect(result.personalizedContent).toBe(true)
    })

    it('应该包含捐赠统计信息', async () => {
      const emailData = {
        to: 'zhangsan@example.com',
        supporterName: '张三',
        totalDonations: 1000,
        donationCount: 5,
        lastDonationDate: new Date('2024-01-15T10:30:00Z')
      }

      const result = await sendThankYouEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.statisticsIncluded).toBe(true)
      expect(result.totalAmount).toBe(1000)
    })
  })

  describe('sendAdminNotificationEmail', () => {
    it('应该能够发送管理员通知邮件', async () => {
      const emailData = {
        to: 'admin@redwolf.org',
        subject: '新捐赠通知',
        notificationType: 'new_donation',
        data: {
          supporterName: '张三',
          amount: 100,
          projectName: '网红狼保护计划'
        },
        priority: 'high' as const
      }

      const result = await sendAdminNotificationEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.templateUsed).toBe('admin_notification')
      expect(result.priority).toBe('high')
    })

    it('应该支持不同类型的通知', async () => {
      const notificationTypes = ['new_donation', 'payment_failure', 'system_alert', 'daily_report']

      for (const type of notificationTypes) {
        const emailData = {
          to: 'admin@redwolf.org',
          notificationType: type,
          data: { test: 'data' }
        }

        const result = await sendAdminNotificationEmail(emailData)
        expect(result.success).toBe(true)
        expect(result.notificationType).toBe(type)
      }
    })
  })

  describe('validateEmailData', () => {
    it('应该验证有效的邮件数据', () => {
      const validData = {
        to: 'test@example.com',
        subject: '测试邮件',
        content: '这是测试内容'
      }

      expect(() => validateEmailData(validData)).not.toThrow()
    })

    it('应该拒绝无效的邮件地址', () => {
      const invalidData = {
        to: 'invalid-email',
        subject: '测试邮件',
        content: '这是测试内容'
      }

      expect(() => validateEmailData(invalidData))
        .toThrow('邮件地址格式不正确')
    })

    it('应该拒绝空的邮件内容', () => {
      const invalidData = {
        to: 'test@example.com',
        subject: '',
        content: ''
      }

      expect(() => validateEmailData(invalidData))
        .toThrow('邮件主题和内容不能为空')
    })

    it('应该验证批量邮件地址', () => {
      const validData = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: '批量邮件',
        content: '这是批量邮件内容'
      }

      expect(() => validateEmailData(validData)).not.toThrow()

      // 测试包含无效地址的批量邮件
      const invalidBatchData = {
        to: ['valid@example.com', 'invalid-email'],
        subject: '批量邮件',
        content: '这是批量邮件内容'
      }

      expect(() => validateEmailData(invalidBatchData))
        .toThrow('邮件地址格式不正确')
    })
  })

  describe('generateEmailTemplate', () => {
    it('应该生成捐赠成功邮件模板', () => {
      const templateData = {
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划',
        donationDate: '2024年1月15日'
      }

      const template = generateEmailTemplate('donation_success', templateData)

      expect(template).toBeDefined()
      expect(template.subject).toContain('感谢')
      expect(template.htmlContent).toContain('张三')
      expect(template.textContent).toContain('100元')
    })

    it('应该生成项目更新邮件模板', () => {
      const templateData = {
        projectName: '网红狼保护计划',
        updateTitle: '本月进展',
        updateContent: '保护工作取得新进展...'
      }

      const template = generateEmailTemplate('project_update', templateData)

      expect(template).toBeDefined()
      expect(template.subject).toContain('更新')
      expect(template.htmlContent).toContain('本月进展')
    })

    it('应该支持自定义模板', () => {
      const customTemplate = {
        subject: '自定义邮件',
        htmlContent: '<h1>Hello {{name}}</h1>',
        textContent: 'Hello {{name}}'
      }

      const templateData = { name: '张三' }
      const template = generateEmailTemplate('custom', templateData, customTemplate)

      expect(template.subject).toBe('自定义邮件')
      expect(template.htmlContent).toContain('Hello 张三')
    })

    it('应该处理模板变量替换', () => {
      const templateData = {
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划',
        invalidVar: '这个变量不存在'
      }

      const template = generateEmailTemplate('donation_success', templateData)

      expect(template.htmlContent).toContain('张三')
      expect(template.htmlContent).not.toContain('{{invalidVar}}')
    })
  })

  describe('renderEmailTemplate', () => {
    it('应该渲染HTML模板', () => {
      const template = '<h1>Hello {{name}}</h1><p>金额: {{amount}}元</p>'
      const data = { name: '张三', amount: 100 }

      const rendered = renderEmailTemplate(template, data)

      expect(rendered).toContain('<h1>Hello 张三</h1>')
      expect(rendered).toContain('<p>金额: 100元</p>')
    })

    it('应该处理条件渲染', () => {
      const template = `
        {{#if showMessage}}
        <p>消息: {{message}}</p>
        {{/if}}
        <p>金额: {{amount}}元</p>
      `

      const data1 = { showMessage: true, message: '谢谢支持', amount: 100 }
      const rendered1 = renderEmailTemplate(template, data1)
      expect(rendered1).toContain('谢谢支持')

      const data2 = { showMessage: false, amount: 100 }
      const rendered2 = renderEmailTemplate(template, data2)
      expect(rendered2).not.toContain('谢谢支持')
    })

    it('应该处理循环渲染', () => {
      const template = `
        <ul>
        {{#each items}}
        <li>{{this}}</li>
        {{/each}}
        </ul>
      `

      const data = { items: ['项目1', '项目2', '项目3'] }
      const rendered = renderEmailTemplate(template, data)

      expect(rendered).toContain('<li>项目1</li>')
      expect(rendered).toContain('<li>项目2</li>')
      expect(rendered).toContain('<li>项目3</li>')
    })
  })

  describe('queueEmail', () => {
    it('应该能够添加邮件到队列', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: '队列测试邮件',
        content: '这是队列测试内容',
        priority: 'normal' as const
      }

      const result = await queueEmail(emailData)

      expect(result.success).toBe(true)
      expect(result.queueId).toBeDefined()
      expect(result.queuedAt).toBeInstanceOf(Date)
      expect(result.position).toBeGreaterThan(0)
    })

    it('应该支持优先级队列', async () => {
      const highPriorityEmail = {
        to: 'urgent@example.com',
        subject: '紧急邮件',
        content: '紧急内容',
        priority: 'high' as const
      }

      const normalPriorityEmail = {
        to: 'normal@example.com',
        subject: '普通邮件',
        content: '普通内容',
        priority: 'normal' as const
      }

      const highResult = await queueEmail(highPriorityEmail)
      const normalResult = await queueEmail(normalPriorityEmail)

      expect(highResult.success).toBe(true)
      expect(normalResult.success).toBe(true)
      expect(highResult.position).toBeLessThan(normalResult.position)
    })

    it('应该限制队列大小', async () => {
      // 添加大量邮件到队列
      const emails = Array.from({ length: 1000 }, (_, i) => ({
        to: `test${i}@example.com`,
        subject: `测试邮件${i}`,
        content: `内容${i}`
      }))

      const results = await Promise.all(emails.map(email => queueEmail(email)))

      // 应该有一些邮件被拒绝（队列满）
      const rejectedCount = results.filter(r => !r.success).length
      expect(rejectedCount).toBeGreaterThan(0)
    })
  })

  describe('processEmailQueue', () => {
    it('应该能够处理邮件队列', async () => {
      // 先添加邮件到队列
      await queueEmail({
        to: 'test@example.com',
        subject: '队列处理测试',
        content: '测试内容'
      })

      const result = await processEmailQueue()

      expect(result.success).toBe(true)
      expect(result.processedCount).toBeGreaterThan(0)
      expect(result.failedCount).toBe(0)
    })

    it('应该批量处理邮件', async () => {
      // 添加多个邮件到队列
      const emails = Array.from({ length: 10 }, (_, i) => ({
        to: `test${i}@example.com`,
        subject: `批量测试${i}`,
        content: `内容${i}`
      }))

      await Promise.all(emails.map(email => queueEmail(email)))

      const result = await processEmailQueue({ batchSize: 5 })

      expect(result.success).toBe(true)
      expect(result.processedCount).toBe(10)
      expect(result.batchCount).toBe(2)
    })

    it('应该处理发送失败的邮件', async () => {
      // 添加会发送失败的邮件
      await queueEmail({
        to: 'bounce@test.com', // 会导致发送失败
        subject: '失败测试',
        content: '这会失败'
      })

      const result = await processEmailQueue()

      expect(result.success).toBe(true)
      expect(result.failedCount).toBeGreaterThan(0)
      expect(result.retryScheduled).toBe(true)
    })
  })

  describe('getEmailDeliveryStatus', () => {
    it('应该能够查询邮件发送状态', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: '状态查询测试',
        content: '测试内容'
      }

      const sendResult = await sendDonationSuccessEmail(emailData)

      if (sendResult.emailId) {
        const status = await getEmailDeliveryStatus(sendResult.emailId)

        expect(status).toBeDefined()
        expect(status.emailId).toBe(sendResult.emailId)
        expect(status.status).toBeDefined()
        expect(status.createdAt).toBeInstanceOf(Date)
      }
    })

    it('应该返回详细的发送信息', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: '详细信息测试',
        content: '测试内容'
      }

      const sendResult = await sendDonationSuccessEmail(emailData)

      if (sendResult.emailId) {
        const status = await getEmailDeliveryStatus(sendResult.emailId)

        expect(status).toMatchObject({
          emailId: expect.any(String),
          status: expect.any(String),
          to: expect.any(String),
          subject: expect.any(String),
          sentAt: expect.any(Date),
          deliveryAttempts: expect.any(Number),
          lastAttemptAt: expect.any(Date)
        })
      }
    })
  })

  describe('retryFailedEmail', () => {
    it('应该能够重试失败的邮件', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: '重试测试',
        content: '测试内容'
      }

      const sendResult = await sendDonationSuccessEmail(emailData)

      if (sendResult.emailId) {
        const retryResult = await retryFailedEmail(sendResult.emailId)

        expect(retryResult.success).toBe(true)
        expect(retryResult.retryCount).toBe(1)
        expect(retryResult.retriedAt).toBeInstanceOf(Date)
      }
    })

    it('应该有重试次数限制', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: '重试限制测试',
        content: '测试内容'
      }

      const sendResult = await sendDonationSuccessEmail(emailData)

      if (sendResult.emailId) {
        // 模拟已经重试3次
        for (let i = 0; i < 3; i++) {
          await retryFailedEmail(sendResult.emailId)
        }

        const retryResult = await retryFailedEmail(sendResult.emailId)

        expect(retryResult.success).toBe(false)
        expect(retryResult.reason).toContain('超过最大重试次数')
      }
    })
  })

  describe('错误处理', () => {
    it('应该处理SMTP连接错误', async () => {
      // 模拟SMTP连接错误
      process.env.SMTP_HOST = 'invalid-smtp-server.com'

      const emailData = {
        to: 'test@example.com',
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划'
      }

      const result = await sendDonationSuccessEmail(emailData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('SMTP连接失败')
      expect(result.retryable).toBe(true)

      // 恢复环境变量
      process.env.SMTP_HOST = 'smtp.test.com'
    })

    it('应该处理模板渲染错误', async () => {
      const emailData = {
        to: 'test@example.com',
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划'
      }

      // 模拟模板渲染错误
      const originalGenerate = generateEmailTemplate
      // @ts-ignore
      generateEmailTemplate = jest.fn().mockImplementation(() => {
        throw new Error('模板渲染失败')
      })

      const result = await sendDonationSuccessEmail(emailData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('模板渲染失败')

      // 恢复原始函数
      // @ts-ignore
      generateEmailTemplate = originalGenerate
    })

    it('应该处理队列溢出', async () => {
      // 模拟队列已满
      const largeBatch = Array.from({ length: 10000 }, (_, i) => ({
        to: `test${i}@example.com`,
        subject: `批量测试${i}`,
        content: `内容${i}`
      }))

      const results = await Promise.all(
        largeBatch.map(email => queueEmail(email).catch(err => ({ success: false, error: err.message })))
      )

      const failureRate = results.filter(r => !r.success).length / results.length
      expect(failureRate).toBeGreaterThan(0.5) // 至少50%失败
    })
  })

  describe('性能测试', () => {
    it('应该在合理时间内发送邮件', async () => {
      const emailData = {
        to: 'test@example.com',
        supporterName: '张三',
        donationAmount: 100,
        projectName: '网红狼保护计划'
      }

      const startTime = Date.now()
      const result = await sendDonationSuccessEmail(emailData)
      const processingTime = Date.now() - startTime

      expect(result.success).toBe(true)
      expect(processingTime).toBeLessThan(3000) // 应该在3秒内完成
    })

    it('应该支持高并发发送', async () => {
      const emails = Array.from({ length: 50 }, (_, i) => ({
        to: `test${i}@example.com`,
        supporterName: `支持者${i}`,
        donationAmount: 100,
        projectName: '网红狼保护计划'
      }))

      const startTime = Date.now()
      const results = await Promise.all(
        emails.map(email => sendDonationSuccessEmail(email))
      )
      const totalTime = Date.now() - startTime

      const successCount = results.filter(r => r.success).length
      expect(successCount).toBeGreaterThan(40) // 至少80%成功
      expect(totalTime).toBeLessThan(10000) // 50封邮件应该在10秒内完成
    })
  })
})