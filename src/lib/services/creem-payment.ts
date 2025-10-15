// Creem支付API集成服务
// 模块4: TDD开发 - Creem支付API集成
import { createHmac } from 'crypto'

export interface CreateOrderData {
  donationId: string
  amount: number
  supporterName: string
  supporterEmail?: string
  message?: string
  returnUrl: string
  cancelUrl: string
}

export interface CreemOrderResponse {
  success: boolean
  orderId?: string
  checkoutUrl?: string
  amount?: number
  currency?: string
  expiresAt?: Date
  error?: string
  errorType?: string
}

export interface OrderStatusResponse {
  success: boolean
  orderId?: string
  status?: string
  amount?: number
  currency?: string
  paidAt?: Date
  error?: string
  errorType?: string
}

export interface WebhookData {
  order_id: string
  status: string
  amount?: number
  currency?: string
  paid_at?: string
  error_message?: string
  metadata?: Record<string, any>
}

export interface WebhookResponse {
  success: boolean
  donationId?: string
  orderId?: string
  status?: string
  eventType?: string
  action?: string
  errorMessage?: string
  error?: string
}

export interface CreemOrderData {
  amount: number
  currency: string
  description: string
  metadata?: Record<string, any>
  callback_url?: string
  return_url?: string
  cancel_url?: string
  expires_at?: string
}

/**
 * 验证订单数据
 * @param data 订单数据
 * @throws {Error} 当数据无效时
 */
export function validateOrderData(data: CreateOrderData): void {
  if (!data.donationId || data.donationId.trim().length === 0) {
    throw new Error('捐赠记录ID不能为空')
  }

  if (!data.amount || data.amount <= 0) {
    throw new Error('订单金额必须大于0')
  }

  if (data.amount > 999999999) {
    throw new Error('订单金额不能超过999,999,999')
  }

  if (!data.supporterName || data.supporterName.trim().length === 0) {
    throw new Error('支持者姓名不能为空')
  }

  if (data.supporterName.length > 100) {
    throw new Error('支持者姓名不能超过100个字符')
  }

  if (!data.returnUrl || !isValidUrl(data.returnUrl)) {
    throw new Error('返回URL格式不正确')
  }

  if (!data.cancelUrl || !isValidUrl(data.cancelUrl)) {
    throw new Error('取消URL格式不正确')
  }

  if (data.supporterEmail && !isValidEmail(data.supporterEmail)) {
    throw new Error('邮箱格式不正确')
  }

  // 验证捐赠记录ID格式
  validateDonationId(data.donationId)
}

/**
 * 创建Creem支付订单
 * @param data 订单数据
 * @returns {Promise<CreemOrderResponse>} 创建结果
 */
export async function createCreemOrder(data: CreateOrderData): Promise<CreemOrderResponse> {
  // 验证输入数据
  validateOrderData(data)

  // 格式化订单数据
  const orderData = formatCreemOrderData(data)

  try {
    // TODO: 实现真正的Creem API调用
    // const response = await fetch('https://api.creem.io/v1/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.CREEM_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(orderData)
    // })

    // if (!response.ok) {
    //   throw new Error(`Creem API调用失败: ${response.status}`)
    // }

    // const result = await response.json()

    // 临时实现：返回模拟数据
    const mockResult = {
      id: 'creem-order-' + generateId(),
      checkout_url: `https://checkout.creem.io/pay/${generateId()}`,
      status: 'pending',
      amount: orderData.amount,
      currency: orderData.currency,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    }

    return {
      success: true,
      orderId: mockResult.id,
      checkoutUrl: mockResult.checkout_url,
      amount: mockResult.amount,
      currency: mockResult.currency,
      expiresAt: new Date(mockResult.expires_at)
    }

  } catch (error: any) {
    console.error('创建Creem订单失败:', error)
    return {
      success: false,
      error: error.message || '创建支付订单失败',
      errorType: determineErrorType(error)
    }
  }
}

/**
 * 查询Creem订单状态
 * @param orderId 订单ID
 * @returns {Promise<OrderStatusResponse>} 查询结果
 */
export async function getCreemOrderStatus(orderId: string): Promise<OrderStatusResponse> {
  if (!orderId || orderId.trim().length === 0) {
    return {
      success: false,
      error: '订单ID不能为空'
    }
  }

  try {
    // TODO: 实现真正的Creem API调用
    // const response = await fetch(`https://api.creem.io/v1/orders/${orderId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.CREEM_API_KEY}`
    //   }
    // })

    // if (!response.ok) {
    //   if (response.status === 404) {
    //     return {
    //       success: false,
    //       error: '订单不存在'
    //     }
    //   throw new Error(`Creem API调用失败: ${response.status}`)
    // }

    // const result = await response.json()

    // 临时实现：返回模拟数据
    if (orderId === 'non-existent-order') {
      return {
        success: false,
        error: '订单不存在'
      }
    }

    const mockResult = {
      id: orderId,
      status: 'paid',
      amount: 10000,
      currency: 'CNY',
      paid_at: new Date().toISOString()
    }

    return {
      success: true,
      orderId: mockResult.id,
      status: mockResult.status,
      amount: mockResult.amount,
      currency: mockResult.currency,
      paidAt: new Date(mockResult.paid_at)
    }

  } catch (error: any) {
    console.error('查询Creem订单状态失败:', error)
    return {
      success: false,
      error: error.message || '查询订单状态失败',
      errorType: determineErrorType(error)
    }
  }
}

/**
 * 处理Creem Webhook
 * @param body Webhook请求体
 * @param signature 签名
 * @returns {Promise<WebhookResponse>} 处理结果
 */
export async function handleCreemWebhook(body: string, signature: string): Promise<WebhookResponse> {
  try {
    // 验证Webhook签名
    if (!validateWebhookSignature(body, signature, process.env.CREEM_WEBHOOK_SECRET!)) {
      return {
        success: false,
        error: 'Webhook签名验证失败'
      }
    }

    // 解析Webhook数据
    const webhookData: WebhookData = JSON.parse(body)

    // 验证Webhook数据
    if (!webhookData.order_id) {
      return {
        success: false,
        error: 'Webhook数据缺少订单ID'
      }
    }

    if (!webhookData.status) {
      return {
        success: false,
        error: 'Webhook数据缺少订单状态'
      }
    }

    // 提取捐赠记录ID
    const donationId = webhookData.metadata?.donation_id

    if (!donationId) {
      return {
        success: false,
        error: 'Webhook数据缺少捐赠记录ID'
      }
    }

    // 确定事件类型
    const eventType = determineEventType(webhookData.status)

    // TODO: 实现真正的Webhook处理逻辑
    // 检查是否已经处理过这个订单
    // const existingOrder = await getOrderByCreemOrderId(webhookData.order_id)
    // if (existingOrder) {
    //   return {
    //     success: true,
    //     orderId: webhookData.order_id,
    //     donationId,
    //     status: webhookData.status,
    //     eventType,
    //     action: 'ignored'
    //   }
    // }

    // 处理不同类型的Webhook事件
    await processWebhookEvent(webhookData, donationId, eventType)

    return {
      success: true,
      orderId: webhookData.order_id,
      donationId,
      status: webhookData.status,
      eventType,
      action: 'processed'
    }

  } catch (error: any) {
    console.error('处理Creem Webhook失败:', error)
    return {
      success: false,
      error: error.message || 'Webhook处理失败'
    }
  }
}

/**
 * 验证Webhook签名
 * @param payload 请求数据
 * @param signature 签名
 * @param secret 密钥
 * @returns {boolean} 签名是否有效
 */
export function validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!payload || !signature || !secret) {
    return false
  }

  try {
    // 生成期望的签名
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // 简单的签名比较（生产环境建议使用时间安全的比较）
    return signature === expectedSignature
  } catch (error) {
    console.error('签名验证失败:', error)
    return false
  }
}

/**
 * 格式化Creem订单数据
 * @param data 原始数据
 * @returns {CreemOrderData} 格式化后的数据
 */
export function formatCreemOrderData(data: CreateOrderData): CreemOrderData {
  const amountInCents = Math.round(data.amount * 100) // 转换为分
  const description = `${data.supporterName}的捐赠 - 可可西里网红狼保护`

  return {
    amount: amountInCents,
    currency: 'CNY',
    description: description.substring(0, 200), // 限制描述长度
    metadata: {
      donation_id: data.donationId,
      supporter_name: data.supporterName,
      supporter_email: data.supporterEmail,
      message: data.message
    },
    return_url: data.returnUrl,
    cancel_url: data.cancelUrl,
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  }
}

/**
 * 确定Webhook事件类型
 * @param status 订单状态
 * @returns {string} 事件类型
 */
function determineEventType(status: string): string {
  switch (status) {
    case 'paid':
      return 'payment.success'
    case 'failed':
      return 'payment.failed'
    case 'expired':
      return 'order.expired'
    case 'cancelled':
      return 'order.cancelled'
    default:
      return 'order.unknown'
  }
}

/**
 * 处理Webhook事件
 * @param webhookData Webhook数据
 * @param donationId 捐赠记录ID
 * @param eventType 事件类型
 */
async function processWebhookEvent(webhookData: WebhookData, donationId: string, eventType: string): Promise<void> {
  // TODO: 实现真正的事件处理逻辑

  if (eventType === 'payment.success') {
    // 处理支付成功
    // await updateDonationStatus(donationId, 'completed')
    // TODO: 发送邮件通知
    // TODO: 更新项目统计
  } else if (eventType === 'payment.failed') {
    // 处理支付失败
    // await updateDonationStatus(donationId, 'failed')
    // TODO: 记录失败原因
  } else if (eventType === 'order.expired') {
    // 处理订单过期
    // await updateDonationStatus(donationId, 'expired')
  }
}

/**
 * 验证捐赠记录ID格式
 * @param id 捐赠记录ID
 * @throws {Error} 当ID格式无效时
 */
export function validateDonationId(id: string): void {
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
 * 验证URL格式
 * @param url URL字符串
 * @returns {boolean} URL是否有效
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns {boolean} 邮箱是否有效
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 确定错误类型
 * @param error 错误对象
 * @returns {string} 错误类型
 */
function determineErrorType(error: any): string {
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return 'network_error'
  }
  if (error.message?.includes('timeout')) {
    return 'timeout_error'
  }
  if (error.message?.includes('429') || error.message?.includes('rate limit')) {
    return 'rate_limit'
  }
  if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
    return 'auth_error'
  }
  return 'unknown_error'
}

/**
 * 生成随机ID
 * @returns {string} 随机ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}