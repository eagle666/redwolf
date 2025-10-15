// Webhook处理系统
// 模块5: TDD开发 - Webhook处理系统

export interface WebhookEventData {
  orderId: string
  donationId: string
  eventType: string
  status: string
  amount: number
  currency: string
  paidAt?: Date
  failedAt?: Date
  expiredAt?: Date
  errorMessage?: string
  metadata?: Record<string, any>
}

export interface WebhookProcessingResult {
  success: boolean
  eventId?: string
  processedAt?: Date
  donationUpdated?: boolean
  action?: string // 'processed' | 'ignored' | 'failed'
  reason?: string
  error?: string
  retryable?: boolean
  logId?: string
}

export interface PaymentSuccessResult {
  success: boolean
  donationStatus?: string
  completedAt?: Date
  emailSent?: boolean
  emailType?: string
  emailError?: string
  statisticsUpdated?: boolean
  projectTotalIncreased?: number
}

export interface PaymentFailureResult {
  success: boolean
  donationStatus?: string
  failureReason?: string
  failureRecorded?: boolean
}

export interface OrderExpiredResult {
  success: boolean
  donationStatus?: string
  expiredAt?: Date
  resourcesReleased?: boolean
}

export interface WebhookLogResult {
  success: boolean
  logId?: string
  loggedAt?: Date
  error?: string
}

export interface RetryResult {
  success: boolean
  retryCount?: number
  processedAt?: Date
  reason?: string
  nextRetryAt?: Date
  backoffSeconds?: number
}

export interface WebhookProcessingStatus {
  eventId: string
  status: string
  processedAt?: Date
  retryCount: number
  lastError?: string
  nextRetryAt?: Date
  eventData?: WebhookEventData
}

// 内存存储（生产环境应使用数据库）
const eventProcessingCache = new Map<string, WebhookProcessingStatus>()
const webhookLogs = new Map<string, any>()
const retryAttempts = new Map<string, number>()

/**
 * 处理Webhook事件的主要入口函数
 * @param eventData Webhook事件数据
 * @returns {Promise<WebhookProcessingResult>} 处理结果
 */
export async function processWebhookEvent(eventData: WebhookEventData): Promise<WebhookProcessingResult> {
  try {
    // 验证事件数据
    validateWebhookData(eventData)

    // 生成唯一事件ID
    const eventId = generateEventId(eventData)

    // 检查幂等性
    const isProcessed = await ensureIdempotency(eventId)
    if (isProcessed) {
      return {
        success: true,
        eventId,
        processedAt: new Date(),
        action: 'ignored',
        reason: '重复事件已被处理'
      }
    }

    // 记录事件开始处理
    await logWebhookEvent(eventData, 'processing')

    let result: WebhookProcessingResult

    let processingResult: any

    // 根据事件类型分发处理
    switch (eventData.eventType) {
      case 'payment.success':
        processingResult = await handlePaymentSuccess(eventData)
        break
      case 'payment.failed':
        processingResult = await handlePaymentFailure(eventData)
        break
      case 'order.expired':
        processingResult = await handleOrderExpired(eventData)
        break
      case 'order.cancelled':
        processingResult = await handleOrderCancelled(eventData)
        break
      default:
        throw new Error(`不支持的事件类型: ${eventData.eventType}`)
    }

    // 标记事件为已处理
    eventProcessingCache.set(eventId, {
      eventId,
      status: 'processed',
      processedAt: new Date(),
      retryCount: 0,
      eventData
    })

    result = {
      success: processingResult.success,
      donationUpdated: processingResult.success
    }

    // 记录处理结果
    if (result.success) {
      await logWebhookEvent(eventData, 'processed')
    } else {
      await logWebhookEvent(eventData, 'failed', new Error(result.error || '处理失败'))
    }

    return {
      ...result,
      eventId,
      processedAt: new Date()
    }

  } catch (error: any) {
    console.error('Webhook事件处理失败:', error)

    // 记录失败事件
    const eventId = generateEventId(eventData)
    await logWebhookEvent(eventData, 'failed', error)

    return {
      success: false,
      error: error.message || '事件处理失败',
      retryable: true,
      eventId
    }
  }
}

/**
 * 处理支付成功事件
 * @param eventData 事件数据
 * @returns {Promise<PaymentSuccessResult>} 处理结果
 */
export async function handlePaymentSuccess(eventData: WebhookEventData): Promise<PaymentSuccessResult> {
  try {
    // TODO: 实现真正的数据库更新
    // await updateDonationStatus(eventData.donationId, 'completed', eventData.paidAt)
    // await updateProjectStatistics(eventData.donationId, eventData.amount)

    // 模拟更新捐赠状态
    console.log(`更新捐赠记录 ${eventData.donationId} 状态为已完成`)

    // 模拟更新项目统计
    console.log(`更新项目统计，增加金额 ${eventData.amount}`)

    // 发送邮件通知
    let emailSent = false
    let emailError = ''

    if (eventData.metadata?.supporter_email) {
      try {
        // TODO: 实现真正的邮件发送
        // await sendDonationSuccessEmail(eventData.metadata.supporter_email, eventData)
        console.log(`发送成功邮件到 ${eventData.metadata.supporter_email}`)
        emailSent = true
      } catch (error: any) {
        emailError = error.message
        console.error('邮件发送失败:', error)
      }
    }

    return {
      success: true,
      donationStatus: 'completed',
      completedAt: eventData.paidAt || new Date(),
      emailSent,
      emailType: emailSent ? 'donation_success' : undefined,
      emailError: emailError || undefined,
      statisticsUpdated: true,
      projectTotalIncreased: eventData.amount
    }

  } catch (error: any) {
    console.error('支付成功处理失败:', error)
    return {
      success: false,
      emailError: error.message
    }
  }
}

/**
 * 处理支付失败事件
 * @param eventData 事件数据
 * @returns {Promise<PaymentFailureResult>} 处理结果
 */
export async function handlePaymentFailure(eventData: WebhookEventData): Promise<PaymentFailureResult> {
  try {
    // TODO: 实现真正的数据库更新
    // await updateDonationStatus(eventData.donationId, 'failed', eventData.failedAt)
    // await recordFailureReason(eventData.donationId, eventData.errorMessage)

    // 模拟更新捐赠状态
    console.log(`更新捐赠记录 ${eventData.donationId} 状态为失败`)

    // 模拟记录失败原因
    if (eventData.errorMessage) {
      console.log(`记录失败原因: ${eventData.errorMessage}`)
    }

    return {
      success: true,
      donationStatus: 'failed',
      failureReason: eventData.errorMessage || '支付失败',
      failureRecorded: true
    }

  } catch (error: any) {
    console.error('支付失败处理失败:', error)
    return {
      success: false
    }
  }
}

/**
 * 处理订单过期事件
 * @param eventData 事件数据
 * @returns {Promise<OrderExpiredResult>} 处理结果
 */
export async function handleOrderExpired(eventData: WebhookEventData): Promise<OrderExpiredResult> {
  try {
    // TODO: 实现真正的数据库更新
    // await updateDonationStatus(eventData.donationId, 'expired', eventData.expiredAt)
    // await releaseReservedResources(eventData.orderId)

    // 模拟更新捐赠状态
    console.log(`更新捐赠记录 ${eventData.donationId} 状态为过期`)

    // 模拟释放预留资源
    console.log(`释放订单 ${eventData.orderId} 的预留资源`)

    return {
      success: true,
      donationStatus: 'expired',
      expiredAt: eventData.expiredAt || new Date(),
      resourcesReleased: true
    }

  } catch (error: any) {
    console.error('订单过期处理失败:', error)
    return {
      success: false
    }
  }
}

/**
 * 处理订单取消事件
 * @param eventData 事件数据
 * @returns {Promise<OrderExpiredResult>} 处理结果
 */
export async function handleOrderCancelled(eventData: WebhookEventData): Promise<OrderExpiredResult> {
  try {
    // TODO: 实现真正的数据库更新
    // await updateDonationStatus(eventData.donationId, 'cancelled', new Date())
    // await releaseReservedResources(eventData.orderId)

    // 模拟更新捐赠状态
    console.log(`更新捐赠记录 ${eventData.donationId} 状态为已取消`)

    // 模拟释放预留资源
    console.log(`释放订单 ${eventData.orderId} 的预留资源`)

    return {
      success: true,
      donationStatus: 'cancelled',
      expiredAt: new Date(),
      resourcesReleased: true
    }

  } catch (error: any) {
    console.error('订单取消处理失败:', error)
    return {
      success: false
    }
  }
}

/**
 * 验证Webhook事件数据
 * @param data 事件数据
 * @throws {Error} 当数据无效时
 */
export function validateWebhookData(data: WebhookEventData): void {
  if (!data) {
    throw new Error('事件数据验证失败')
  }

  let hasError = false
  let errorMessage = '事件数据验证失败: '

  if (!data.orderId || typeof data.orderId !== 'string') {
    errorMessage += '订单ID不能为空; '
    hasError = true
  }

  if (!data.donationId || typeof data.donationId !== 'string') {
    errorMessage += '捐赠记录ID不能为空; '
    hasError = true
  }

  if (!data.eventType || typeof data.eventType !== 'string') {
    errorMessage += '事件类型不能为空; '
    hasError = true
  }

  if (!data.status || typeof data.status !== 'string') {
    errorMessage += '事件状态不能为空; '
    hasError = true
  }

  if (typeof data.amount !== 'number' || data.amount < 0) {
    errorMessage += '事件金额必须大于等于0; '
    hasError = true
  }

  if (!data.currency || typeof data.currency !== 'string') {
    errorMessage += '货币类型不能为空; '
    hasError = true
  }

  if (hasError) {
    throw new Error(errorMessage)
  }

  // 验证捐赠记录ID格式
  try {
    validateDonationId(data.donationId)
  } catch (error) {
    throw new Error('事件数据验证失败: ' + error.message)
  }
}

/**
 * 确保事件处理的幂等性
 * @param eventId 事件ID
 * @returns {Promise<boolean>} 是否已处理
 */
export async function ensureIdempotency(eventId: string): Promise<boolean> {
  const cached = eventProcessingCache.get(eventId)
  return cached && cached.status === 'processed'
}

/**
 * 生成唯一的事件ID
 * @param eventData 事件数据
 * @returns {string} 事件ID
 */
export function generateEventId(eventData: WebhookEventData): string {
  // 使用事件数据的哈希值作为ID
  const dataStr = JSON.stringify({
    orderId: eventData.orderId,
    donationId: eventData.donationId,
    eventType: eventData.eventType,
    status: eventData.status,
    timestamp: eventData.paidAt || eventData.failedAt || eventData.expiredAt || new Date()
  })

  return Buffer.from(dataStr).toString('base64').replace(/[/+=]/g, '').substring(0, 32)
}

/**
 * 记录Webhook事件日志
 * @param eventData 事件数据
 * @param status 处理状态
 * @param error 错误信息（可选）
 * @returns {Promise<WebhookLogResult>} 记录结果
 */
export async function logWebhookEvent(
  eventData: WebhookEventData,
  status: string,
  error?: Error
): Promise<WebhookLogResult> {
  try {
    const logId = generateEventId(eventData) + '_' + Date.now()
    const logEntry = {
      logId,
      eventData,
      status,
      loggedAt: new Date(),
      error: error?.message
    }

    // TODO: 实现真正的数据库日志记录
    // await db.insert(webhookLogs).values(logEntry)

    // 临时存储在内存中
    webhookLogs.set(logId, logEntry)

    console.log(`记录Webhook事件日志: ${logId}, 状态: ${status}`)

    return {
      success: true,
      logId,
      loggedAt: new Date()
    }

  } catch (error: any) {
    console.error('记录Webhook日志失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 重试失败的Webhook处理
 * @param eventId 事件ID
 * @returns {Promise<RetryResult>} 重试结果
 */
export async function retryFailedWebhook(eventId: string): Promise<RetryResult> {
  try {
    const currentRetryCount = retryAttempts.get(eventId) || 0

    // 检查是否超过最大重试次数
    const MAX_RETRY_COUNT = 3
    if (currentRetryCount >= MAX_RETRY_COUNT) {
      return {
        success: false,
        reason: '超过最大重试次数',
        retryCount: currentRetryCount
      }
    }

    // 计算退避时间（指数退避）
    const backoffSeconds = Math.pow(2, currentRetryCount)
    const nextRetryAt = new Date(Date.now() + backoffSeconds * 1000)

    // 获取原始事件数据
    const cached = eventProcessingCache.get(eventId)
    if (!cached || !cached.eventData) {
      return {
        success: false,
        reason: '找不到原始事件数据',
        retryCount: currentRetryCount
      }
    }

    // 更新重试次数
    retryAttempts.set(eventId, currentRetryCount + 1)

    // 重新处理事件
    const result = await processWebhookEvent(cached.eventData)

    if (result.success) {
      // 成功后清除重试计数
      retryAttempts.delete(eventId)
    }

    return {
      success: result.success,
      retryCount: currentRetryCount + 1,
      processedAt: result.processedAt,
      reason: result.success ? '重试成功' : result.error,
      nextRetryAt: result.success ? undefined : nextRetryAt,
      backoffSeconds: result.success ? undefined : backoffSeconds
    }

  } catch (error: any) {
    console.error('重试Webhook处理失败:', error)
    return {
      success: false,
      reason: error.message
    }
  }
}

/**
 * 获取Webhook处理状态
 * @param eventId 事件ID
 * @returns {Promise<WebhookProcessingStatus | null>} 处理状态
 */
export async function getWebhookProcessingStatus(eventId: string): Promise<WebhookProcessingStatus | null> {
  const cached = eventProcessingCache.get(eventId)
  const retryCount = retryAttempts.get(eventId) || 0

  if (!cached) {
    return null
  }

  return {
    ...cached,
    retryCount,
    lastError: cached.status === 'failed' ? '处理失败' : undefined,
    nextRetryAt: cached.status === 'failed' ? new Date(Date.now() + Math.pow(2, retryCount) * 1000) : undefined
  }
}

/**
 * 验证捐赠记录ID格式
 * @param id 捐赠记录ID
 * @throws {Error} 当ID格式无效时
 */
function validateDonationId(id: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error('捐赠记录ID不能为空')
  }

  // 简单的UUID格式验证
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    throw new Error('无效的捐赠记录ID格式')
  }
}

/**
 * 清理过期的处理缓存
 * @param maxAge 最大缓存时间（毫秒）
 */
export function cleanupExpiredCache(maxAge: number = 24 * 60 * 60 * 1000): void {
  const now = Date.now()
  const expiredIds: string[] = []

  eventProcessingCache.forEach((status, eventId) => {
    if (status.processedAt && (now - status.processedAt.getTime()) > maxAge) {
      expiredIds.push(eventId)
    }
  })

  expiredIds.forEach(eventId => {
    eventProcessingCache.delete(eventId)
    retryAttempts.delete(eventId)
  })
}

// 导出内存存储实例（用于测试和调试）
export const memoryStore = {
  eventProcessingCache,
  webhookLogs,
  retryAttempts
}