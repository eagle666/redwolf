// 邮件通知系统
// 模块6: TDD开发 - 邮件通知系统

export interface EmailData {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  content: string
  htmlContent?: string
  template?: string
  templateData?: Record<string, any>
  priority?: 'low' | 'normal' | 'high'
  attachments?: EmailAttachment[]
  headers?: Record<string, string>
}

export interface EmailAttachment {
  filename: string
  content: Buffer | string
  contentType?: string
}

export interface DonationSuccessEmailData {
  to: string
  supporterName: string
  donationAmount: number
  projectName: string
  donationId: string
  paidAt: Date
  message?: string
  format?: 'text' | 'html' | 'both'
}

export interface DonationFailureEmailData {
  to: string
  supporterName: string
  donationAmount: number
  projectName: string
  failureReason: string
  donationId: string
  projectId?: string
}

export interface ProjectUpdateEmailData {
  to: string | string[]
  supporterName?: string
  projectName: string
  updateTitle: string
  updateContent: string
  updateDate: Date
  images?: string[]
  author?: string
}

export interface ThankYouEmailData {
  to: string
  supporterName: string
  totalDonations: number
  donationCount: number
  lastDonationDate: Date
  impact?: string
}

export interface AdminNotificationEmailData {
  to: string | string[]
  subject?: string
  notificationType: 'new_donation' | 'payment_failure' | 'system_alert' | 'daily_report'
  data: Record<string, any>
  priority?: 'low' | 'normal' | 'high'
  urgency?: 'low' | 'medium' | 'high'
}

export interface EmailNotificationResult {
  success: boolean
  emailId?: string
  sentAt?: Date
  queuedAt?: Date
  templateUsed?: string
  htmlContent?: string
  textContent?: string
  error?: string
  retryable?: boolean
  deliveryProvider?: string
  messageId?: string
  retryLink?: string
  failureReasonIncluded?: boolean
  personalizedContent?: boolean
  statisticsIncluded?: boolean
  totalAmount?: number
  recipientCount?: number
  batchSent?: boolean
  updateIncluded?: boolean
  priority?: string
  notificationType?: string
  position?: number
}

export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent?: string
  variables?: string[]
}

export interface EmailQueueStatus {
  emailId: string
  status: 'queued' | 'processing' | 'sent' | 'failed' | 'retrying'
  createdAt: Date
  processedAt?: Date
  retryCount: number
  lastError?: string
  nextRetryAt?: Date
  priority: 'low' | 'normal' | 'high'
}

export interface QueueProcessResult {
  success: boolean
  processedCount: number
  failedCount: number
  batchCount?: number
  retryScheduled?: boolean
  processingTime: number
}

export interface DeliveryStatus {
  emailId: string
  status: string
  to: string | string[]
  subject: string
  createdAt: Date
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  deliveryAttempts: number
  lastAttemptAt: Date
  nextRetryAt?: Date
  lastError?: string
  metadata?: Record<string, any>
}

export interface RetryResult {
  success: boolean
  retryCount?: number
  retriedAt?: Date
  reason?: string
  nextRetryAt?: Date
}

// 内存存储（生产环境应使用数据库）
const emailQueue = new Map<string, EmailData & { priority: 'low' | 'normal' | 'high', createdAt: Date }>()
const emailDeliveryStatus = new Map<string, DeliveryStatus>()
const emailTemplates = new Map<string, EmailTemplate>()
const retryAttempts = new Map<string, number>()

// 初始化默认模板
initializeDefaultTemplates()

/**
 * 发送捐赠成功邮件
 * @param data 邮件数据
 * @returns {Promise<EmailNotificationResult>} 发送结果
 */
export async function sendDonationSuccessEmail(data: DonationSuccessEmailData): Promise<EmailNotificationResult> {
  try {
    // 验证邮件数据
    validateEmailData({
      to: data.to,
      subject: '感谢您的捐赠',
      content: '捐赠成功'
    })

    // 生成邮件模板
    const templateData = {
      supporterName: data.supporterName,
      donationAmount: data.donationAmount,
      projectName: data.projectName,
      donationDate: data.paidAt.toLocaleDateString('zh-CN'),
      donationId: data.donationId,
      message: data.message || '',
      year: new Date().getFullYear()
    }

    const template = generateEmailTemplate('donation_success', templateData)

    // 发送邮件
    const emailData: EmailData = {
      to: data.to,
      subject: template.subject,
      content: template.textContent || '',
      htmlContent: template.htmlContent,
      priority: 'high'
    }

    const result = await sendEmail(emailData)

    // 记录发送状态
    if (result.success && result.emailId) {
      emailDeliveryStatus.set(result.emailId, {
        emailId: result.emailId,
        status: 'sent',
        to: data.to,
        subject: template.subject,
        createdAt: new Date(),
        sentAt: new Date(),
        deliveryAttempts: 1,
        lastAttemptAt: new Date()
      })
    }

    return {
      ...result,
      templateUsed: 'donation_success',
      personalizedContent: true,
      htmlContent: template.htmlContent,
      textContent: template.textContent
    }

  } catch (error: any) {
    console.error('发送捐赠成功邮件失败:', error)
    return {
      success: false,
      error: error.message,
      retryable: true
    }
  }
}

/**
 * 发送捐赠失败邮件
 * @param data 邮件数据
 * @returns {Promise<EmailNotificationResult>} 发送结果
 */
export async function sendDonationFailureEmail(data: DonationFailureEmailData): Promise<EmailNotificationResult> {
  try {
    // 验证邮件数据
    validateEmailData({
      to: data.to,
      subject: '捐赠支付失败',
      content: '支付失败通知'
    })

    // 生成邮件模板
    const templateData = {
      supporterName: data.supporterName,
      donationAmount: data.donationAmount,
      projectName: data.projectName,
      failureReason: data.failureReason,
      donationId: data.donationId,
      retryUrl: data.projectId ? `https://redwolf.org/donate?project=${data.projectId}` : 'https://redwolf.org/donate',
      year: new Date().getFullYear()
    }

    const template = generateEmailTemplate('donation_failure', templateData)

    // 发送邮件
    const emailData: EmailData = {
      to: data.to,
      subject: template.subject,
      content: template.textContent || '',
      htmlContent: template.htmlContent,
      priority: 'normal'
    }

    const result = await sendEmail(emailData)

    return {
      ...result,
      templateUsed: 'donation_failure',
      failureReasonIncluded: true,
      retryLink: templateData.retryUrl,
      personalizedContent: true
    }

  } catch (error: any) {
    console.error('发送捐赠失败邮件失败:', error)
    return {
      success: false,
      error: error.message,
      retryable: true
    }
  }
}

/**
 * 发送项目更新邮件
 * @param data 邮件数据
 * @returns {Promise<EmailNotificationResult>} 发送结果
 */
export async function sendProjectUpdateEmail(data: ProjectUpdateEmailData): Promise<EmailNotificationResult> {
  try {
    const recipients = Array.isArray(data.to) ? data.to : [data.to]

    // 验证邮件数据
    for (const recipient of recipients) {
      validateEmailData({
        to: recipient,
        subject: data.updateTitle,
        content: data.updateContent
      })
    }

    // 生成邮件模板
    const templateData = {
      supporterName: data.supporterName || '亲爱的支持者',
      projectName: data.projectName,
      updateTitle: data.updateTitle,
      updateContent: data.updateContent,
      updateDate: data.updateDate.toLocaleDateString('zh-CN'),
      author: data.author || '可可西里网红狼保护团队',
      images: data.images || [],
      year: new Date().getFullYear()
    }

    const template = generateEmailTemplate('project_update', templateData)

    // 发送邮件
    const emailData: EmailData = {
      to: data.to,
      subject: template.subject,
      content: template.textContent || '',
      htmlContent: template.htmlContent,
      priority: 'normal'
    }

    const result = await sendEmail(emailData)

    return {
      ...result,
      templateUsed: 'project_update',
      updateIncluded: true,
      personalizedContent: !!data.supporterName,
      recipientCount: recipients.length,
      batchSent: recipients.length > 1
    }

  } catch (error: any) {
    console.error('发送项目更新邮件失败:', error)
    return {
      success: false,
      error: error.message,
      retryable: true
    }
  }
}

/**
 * 发送感谢邮件
 * @param data 邮件数据
 * @returns {Promise<EmailNotificationResult>} 发送结果
 */
export async function sendThankYouEmail(data: ThankYouEmailData): Promise<EmailNotificationResult> {
  try {
    // 验证邮件数据
    validateEmailData({
      to: data.to,
      subject: '感谢您的持续支持',
      content: '感谢邮件'
    })

    // 生成邮件模板
    const templateData = {
      supporterName: data.supporterName,
      totalDonations: data.totalDonations,
      donationCount: data.donationCount,
      lastDonationDate: data.lastDonationDate.toLocaleDateString('zh-CN'),
      impact: data.impact || '您的支持让我们的保护工作得以持续',
      year: new Date().getFullYear()
    }

    const template = generateEmailTemplate('thank_you', templateData)

    // 发送邮件
    const emailData: EmailData = {
      to: data.to,
      subject: template.subject,
      content: template.textContent || '',
      htmlContent: template.htmlContent,
      priority: 'normal'
    }

    const result = await sendEmail(emailData)

    return {
      ...result,
      templateUsed: 'thank_you',
      personalizedContent: true,
      statisticsIncluded: true,
      totalAmount: data.totalDonations
    }

  } catch (error: any) {
    console.error('发送感谢邮件失败:', error)
    return {
      success: false,
      error: error.message,
      retryable: true
    }
  }
}

/**
 * 发送管理员通知邮件
 * @param data 邮件数据
 * @returns {Promise<EmailNotificationResult>} 发送结果
 */
export async function sendAdminNotificationEmail(data: AdminNotificationEmailData): Promise<EmailNotificationResult> {
  try {
    const recipients = Array.isArray(data.to) ? data.to : [data.to]

    // 验证邮件数据
    for (const recipient of recipients) {
      validateEmailData({
        to: recipient,
        subject: data.subject || generateAdminSubject(data.notificationType),
        content: '管理员通知'
      })
    }

    // 生成邮件模板
    const templateData = {
      notificationType: data.notificationType,
      data: data.data,
      timestamp: new Date().toLocaleString('zh-CN'),
      priority: data.priority || 'normal',
      urgency: data.urgency || 'medium'
    }

    const template = generateEmailTemplate('admin_notification', templateData)

    // 发送邮件
    const emailData: EmailData = {
      to: data.to,
      subject: data.subject || template.subject,
      content: template.textContent || '',
      htmlContent: template.htmlContent,
      priority: data.priority || 'normal'
    }

    const result = await sendEmail(emailData)

    return {
      ...result,
      templateUsed: 'admin_notification',
      priority: data.priority || 'normal',
      notificationType: data.notificationType
    }

  } catch (error: any) {
    console.error('发送管理员通知邮件失败:', error)
    return {
      success: false,
      error: error.message,
      retryable: true
    }
  }
}

/**
 * 验证邮件数据
 * @param data 邮件数据
 * @throws {Error} 当数据无效时
 */
export function validateEmailData(data: EmailData): void {
  if (!data) {
    throw new Error('邮件数据不能为空')
  }

  // 验证收件人
  const recipients = Array.isArray(data.to) ? data.to : [data.to]
  for (const recipient of recipients) {
    if (!isValidEmail(recipient)) {
      throw new Error('邮件地址格式不正确')
    }
  }

  // 验证抄送
  if (data.cc) {
    const ccRecipients = Array.isArray(data.cc) ? data.cc : [data.cc]
    for (const recipient of ccRecipients) {
      if (!isValidEmail(recipient)) {
        throw new Error('抄送邮件地址格式不正确')
      }
    }
  }

  // 验证密送
  if (data.bcc) {
    const bccRecipients = Array.isArray(data.bcc) ? data.bcc : [data.bcc]
    for (const recipient of bccRecipients) {
      if (!isValidEmail(recipient)) {
        throw new Error('密送邮件地址格式不正确')
      }
    }
  }

  if (!data.subject || data.subject.trim().length === 0) {
    throw new Error('邮件主题不能为空')
  }

  if (!data.content || data.content.trim().length === 0) {
    throw new Error('邮件内容不能为空')
  }

  if (data.subject.length > 200) {
    throw new Error('邮件主题不能超过200个字符')
  }
}

/**
 * 生成邮件模板
 * @param templateName 模板名称
 * @param data 模板数据
 * @param customTemplate 自定义模板（可选）
 * @returns {EmailTemplate} 邮件模板
 */
export function generateEmailTemplate(
  templateName: string,
  data: Record<string, any>,
  customTemplate?: EmailTemplate
): EmailTemplate {
  let template: EmailTemplate

  if (customTemplate) {
    template = customTemplate
  } else {
    template = emailTemplates.get(templateName) || getDefaultTemplate(templateName)
  }

  // 渲染模板变量
  const renderedSubject = renderEmailTemplate(template.subject, data)
  const renderedHtmlContent = renderEmailTemplate(template.htmlContent, data)
  const renderedTextContent = template.textContent
    ? renderEmailTemplate(template.textContent, data)
    : htmlToText(renderedHtmlContent)

  return {
    subject: renderedSubject,
    htmlContent: renderedHtmlContent,
    textContent: renderedTextContent,
    variables: Object.keys(data)
  }
}

/**
 * 渲染邮件模板
 * @param template 模板字符串
 * @param data 数据
 * @returns {string} 渲染后的字符串
 */
export function renderEmailTemplate(template: string, data: Record<string, any>): string {
  let rendered = template

  // 简单的变量替换 {{variable}}
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    rendered = rendered.replace(regex, String(value || ''))
  }

  // 清除未替换的变量
  rendered = rendered.replace(/{{\s*[^}]+\s*}}/g, '')

  return rendered
}

/**
 * 添加邮件到队列
 * @param data 邮件数据
 * @returns {Promise<EmailNotificationResult>} 添加结果
 */
export async function queueEmail(data: EmailData): Promise<EmailNotificationResult> {
  try {
    // 验证邮件数据
    validateEmailData(data)

    // 生成队列ID
    const queueId = generateEmailId()

    // 检查队列大小限制
    const MAX_QUEUE_SIZE = 1000
    if (emailQueue.size >= MAX_QUEUE_SIZE) {
      return {
        success: false,
        error: '邮件队列已满，请稍后再试'
      }
    }

    // 添加到队列
    const queueItem = {
      ...data,
      priority: data.priority || 'normal',
      createdAt: new Date()
    }

    emailQueue.set(queueId, queueItem)

    // 记录发送状态
    emailDeliveryStatus.set(queueId, {
      emailId: queueId,
      status: 'queued',
      to: data.to,
      subject: data.subject,
      createdAt: new Date(),
      deliveryAttempts: 0,
      lastAttemptAt: new Date()
    })

    return {
      success: true,
      emailId: queueId,
      queuedAt: new Date(),
      position: getQueuePosition(queueId, queueItem.priority)
    }

  } catch (error: any) {
    console.error('添加邮件到队列失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 处理邮件队列
 * @param options 处理选项
 * @returns {Promise<QueueProcessResult>} 处理结果
 */
export async function processEmailQueue(options: { batchSize?: number } = {}): Promise<QueueProcessResult> {
  const startTime = Date.now()
  const batchSize = options.batchSize || 50

  try {
    // 按优先级排序队列
    const priorityOrder: Record<string, number> = { high: 0, normal: 1, low: 2 }
    const sortedQueue = Array.from(emailQueue.entries())
      .sort(([, a], [, b]) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
      .slice(0, batchSize)

    let processedCount = 0
    let failedCount = 0
    let retryScheduled = false

    for (const [queueId, emailData] of sortedQueue) {
      try {
        // 更新状态为处理中
        const status = emailDeliveryStatus.get(queueId)
        if (status) {
          status.status = 'processing'
          status.lastAttemptAt = new Date()
          status.deliveryAttempts++
        }

        // 发送邮件
        const result = await sendEmail(emailData)

        if (result.success) {
          processedCount++
          // 从队列中移除
          emailQueue.delete(queueId)

          // 更新状态
          if (status) {
            status.status = 'sent'
            status.sentAt = new Date()
          }
        } else {
          failedCount++
          // 安排重试
          if (result.retryable) {
            retryScheduled = true
            if (status) {
              status.status = 'retrying'
              status.nextRetryAt = new Date(Date.now() + Math.pow(2, status.deliveryAttempts) * 1000)
            }
          } else {
            // 永久失败，从队列中移除
            emailQueue.delete(queueId)
            if (status) {
              status.status = 'failed'
              status.lastError = result.error
            }
          }
        }
      } catch (error: any) {
        failedCount++
        console.error(`处理队列邮件 ${queueId} 失败:`, error)
      }
    }

    const processingTime = Date.now() - startTime

    return {
      success: true,
      processedCount,
      failedCount,
      batchCount: Math.ceil(sortedQueue.length / batchSize),
      retryScheduled,
      processingTime
    }

  } catch (error: any) {
    console.error('处理邮件队列失败:', error)
    return {
      success: false,
      processedCount: 0,
      failedCount: 0,
      processingTime: Date.now() - startTime
    }
  }
}

/**
 * 查询邮件发送状态
 * @param emailId 邮件ID
 * @returns {Promise<DeliveryStatus | null>} 发送状态
 */
export async function getEmailDeliveryStatus(emailId: string): Promise<DeliveryStatus | null> {
  return emailDeliveryStatus.get(emailId) || null
}

/**
 * 重试失败的邮件
 * @param emailId 邮件ID
 * @returns {Promise<RetryResult>} 重试结果
 */
export async function retryFailedEmail(emailId: string): Promise<RetryResult> {
  try {
    const currentRetryCount = retryAttempts.get(emailId) || 0

    // 检查是否超过最大重试次数
    const MAX_RETRY_COUNT = 3
    if (currentRetryCount >= MAX_RETRY_COUNT) {
      return {
        success: false,
        reason: '超过最大重试次数',
        retryCount: currentRetryCount
      }
    }

    const status = emailDeliveryStatus.get(emailId)
    if (!status) {
      return {
        success: false,
        reason: '找不到邮件记录',
        retryCount: currentRetryCount
      }
    }

    // 更新重试次数
    retryAttempts.set(emailId, currentRetryCount + 1)

    // 重新发送邮件
    const emailData = emailQueue.get(emailId)
    if (!emailData) {
      return {
        success: false,
        reason: '找不到邮件数据',
        retryCount: currentRetryCount + 1
      }
    }

    const result = await sendEmail(emailData)

    if (result.success) {
      // 成功后清理重试计数
      retryAttempts.delete(emailId)
      emailQueue.delete(emailId)

      // 更新状态
      status.status = 'sent'
      status.sentAt = new Date()

      return {
        success: true,
        retryCount: currentRetryCount + 1,
        retriedAt: new Date()
      }
    } else {
      return {
        success: false,
        reason: result.error || '发送失败',
        retryCount: currentRetryCount + 1,
        nextRetryAt: new Date(Date.now() + Math.pow(2, currentRetryCount + 1) * 1000)
      }
    }

  } catch (error: any) {
    console.error('重试邮件失败:', error)
    return {
      success: false,
      reason: error.message
    }
  }
}

/**
 * 发送邮件的核心函数
 * @param data 邮件数据
 * @returns {Promise<EmailNotificationResult>} 发送结果
 */
async function sendEmail(data: EmailData): Promise<EmailNotificationResult> {
  try {
    // TODO: 实现真正的SMTP发送
    // const transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || '587'),
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS
    //   }
    // })
    //
    // const mailOptions = {
    //   from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    //   to: Array.isArray(data.to) ? data.to.join(', ') : data.to,
    //   subject: data.subject,
    //   text: data.content,
    //   html: data.htmlContent,
    //   priority: data.priority
    // }
    //
    // const result = await transporter.sendMail(mailOptions)

    // 模拟邮件发送
    await new Promise(resolve => setTimeout(resolve, 100))

    // 模拟发送失败的情况
    if (typeof data.to === 'string' && data.to.includes('bounce')) {
      throw new Error('邮件地址无效')
    }

    const emailId = generateEmailId()

    return {
      success: true,
      emailId,
      sentAt: new Date(),
      deliveryProvider: 'mock-smtp',
      messageId: `mock-${emailId}`
    }

  } catch (error: any) {
    console.error('发送邮件失败:', error)
    return {
      success: false,
      error: error.message || '邮件发送失败',
      retryable: !error.message.includes('无效')
    }
  }
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 生成邮件ID
 * @returns {string} 邮件ID
 */
function generateEmailId(): string {
  return 'email_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

/**
 * 获取队列中的位置
 * @param queueId 队列ID
 * @param priority 优先级
 * @returns {number} 位置
 */
function getQueuePosition(queueId: string, priority: 'low' | 'normal' | 'high'): number {
  const priorityOrder: Record<string, number> = { high: 0, normal: 1, low: 2 }
  let position = 1

  emailQueue.forEach((item) => {
    const itemPriority = priorityOrder[item.priority]
    const currentPriority = priorityOrder[priority]

    if (itemPriority < currentPriority) {
      position++
    } else if (itemPriority === currentPriority && item.createdAt < new Date()) {
      position++
    }
  })

  return position
}

/**
 * 生成管理员通知主题
 * @param notificationType 通知类型
 * @returns {string} 主题
 */
function generateAdminSubject(notificationType: string): string {
  const subjects: Record<string, string> = {
    new_donation: '新捐赠通知',
    payment_failure: '支付失败通知',
    system_alert: '系统告警',
    daily_report: '每日报告'
  }

  return subjects[notificationType] || '管理员通知'
}

/**
 * 获取默认模板
 * @param templateName 模板名称
 * @returns {EmailTemplate} 默认模板
 */
function getDefaultTemplate(templateName: string): EmailTemplate {
  return {
    subject: '通知',
    htmlContent: '<p>{{content}}</p>',
    textContent: '{{content}}'
  }
}

/**
 * HTML转文本
 * @param html HTML字符串
 * @returns {string} 文本字符串
 */
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

/**
 * 初始化默认邮件模板
 */
function initializeDefaultTemplates(): void {
  // 捐赠成功邮件模板
  emailTemplates.set('donation_success', {
    subject: '感谢您对{{projectName}}的捐赠！',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>感谢捐赠</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 30px;">
          <h1 style="color: #2c3e50; text-align: center;">感谢您的捐赠！</h1>

          <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p>亲爱的 {{supporterName}}：</p>

            <p>非常感谢您对<strong>{{projectName}}</strong>的支持！您的慷慨捐赠将帮助我们更好地保护可可西里的网红狼。</p>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>捐赠详情</h3>
              <p><strong>捐赠金额：</strong>¥{{donationAmount}}</p>
              <p><strong>捐赠日期：</strong>{{donationDate}}</p>
              <p><strong>捐赠编号：</strong>{{donationId}}</p>
            </div>

            {{#if message}}
            <div style="background: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>您的留言</h3>
              <p>"{{message}}"</p>
            </div>
            {{/if}}

            <p>我们会定期向您发送项目进展报告，让您了解善款的使用情况。</p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://redwolf.org" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                查看项目详情
              </a>
            </p>
          </div>

          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>此邮件由可可西里网红狼公益网站自动发送</p>
            <p>如有疑问，请联系我们：contact@redwolf.org</p>
            <p>© {{year}} 可可西里网红狼公益网站 版权所有</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      亲爱的 {{supporterName}}：

      非常感谢您对 {{projectName}} 的支持！您的慷慨捐赠将帮助我们更好地保护可可西里的网红狼。

      捐赠详情：
      捐赠金额：¥{{donationAmount}}
      捐赠日期：{{donationDate}}
      捐赠编号：{{donationId}}

      {{#if message}}
      您的留言：
      "{{message}}"
      {{/if}}

      我们会定期向您发送项目进展报告，让您了解善款的使用情况。

      查看项目详情：https://redwolf.org

      此邮件由可可西里网红狼公益网站自动发送
      如有疑问，请联系我们：contact@redwolf.org

      © {{year}} 可可西里网红狼公益网站 版权所有
    `
  })

  // 捐赠失败邮件模板
  emailTemplates.set('donation_failure', {
    subject: '关于您的捐赠支付',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>捐赠支付失败</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 30px;">
          <h1 style="color: #dc3545; text-align: center;">捐赠支付失败</h1>

          <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p>亲爱的 {{supporterName}}：</p>

            <p>很遗憾地通知您，您对<strong>{{projectName}}</strong>的捐赠支付未能成功完成。</p>

            <div style="background: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>失败原因</h3>
              <p>{{failureReason}}</p>
            </div>

            <div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>尝试重新捐赠</h3>
              <p>您可以点击下面的链接重新尝试捐赠：</p>
              <p style="text-align: center;">
                <a href="{{retryUrl}}" style="background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                  重新捐赠
                </a>
              </p>
            </div>

            <p>如果您遇到技术问题，请随时联系我们的客服团队。</p>
          </div>

          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>此邮件由可可西里网红狼公益网站自动发送</p>
            <p>客服邮箱：support@redwolf.org</p>
            <p>© {{year}} 可可西里网红狼公益网站 版权所有</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      亲爱的 {{supporterName}}：

      很遗憾地通知您，您对 {{projectName}} 的捐赠支付未能成功完成。

      失败原因：
      {{failureReason}}

      尝试重新捐赠：
      {{retryUrl}}

      如果您遇到技术问题，请随时联系我们的客服团队。
      客服邮箱：support@redwolf.org

      此邮件由可可西里网红狼公益网站自动发送
      © {{year}} 可可西里网红狼公益网站 版权所有
    `
  })

  // 项目更新邮件模板
  emailTemplates.set('project_update', {
    subject: '{{projectName}} - {{updateTitle}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>项目更新</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 30px;">
          <h1 style="color: #2c3e50; text-align: center;">{{projectName}}</h1>
          <h2 style="color: #495057; text-align: center;">{{updateTitle}}</h2>

          <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p>亲爱的 {{supporterName}}：</p>

            <div style="margin: 20px 0;">
              {{updateContent}}
            </div>

            {{#if images.length}}
            <div style="margin: 30px 0;">
              <h3>项目照片</h3>
              {{#each images}}
              <img src="{{this}}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 5px;">
              {{/each}}
            </div>
            {{/if}}

            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6c757d;">
                <strong>发布时间：</strong>{{updateDate}}<br>
                <strong>发布者：</strong>{{author}}
              </p>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://redwolf.org" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                查看更多项目信息
              </a>
            </p>
          </div>

          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>感谢您对可可西里网红狼保护工作的持续支持！</p>
            <p>© {{year}} 可可西里网红狼公益网站 版权所有</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      亲爱的 {{supporterName}}：

      {{projectName}} - {{updateTitle}}

      {{updateContent}}

      发布时间：{{updateDate}}
      发布者：{{author}}

      感谢您对可可西里网红狼保护工作的持续支持！

      查看更多项目信息：https://redwolf.org

      © {{year}} 可可西里网红狼公益网站 版权所有
    `
  })

  // 感谢邮件模板
  emailTemplates.set('thank_you', {
    subject: '特别感谢您对可可西里网红狼的支持！',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>特别感谢</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px;">
          <h1 style="color: white; text-align: center;">特别感谢您！</h1>

          <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p>亲爱的 {{supporterName}}：</p>

            <p>我们想特别感谢您对可可西里网红狼保护工作的持续支持！</p>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>您的贡献统计</h3>
              <p><strong>累计捐赠：</strong>¥{{totalDonations}}</p>
              <p><strong>捐赠次数：</strong>{{donationCount}} 次</p>
              <p><strong>最近捐赠：</strong>{{lastDonationDate}}</p>
            </div>

            <div style="background: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>您带来的改变</h3>
              <p>{{impact}}</p>
            </div>

            <p>因为有了您这样的支持者，我们的保护工作才能够持续进行。</p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://redwolf.org/impact" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                查看您的影响力
              </a>
            </p>
          </div>

          <div style="text-align: center; color: white; font-size: 14px;">
            <p>可可西里网红狼保护团队敬上</p>
            <p>© {{year}} 可可西里网红狼公益网站 版权所有</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      亲爱的 {{supporterName}}：

      我们想特别感谢您对可可西里网红狼保护工作的持续支持！

      您的贡献统计：
      累计捐赠：¥{{totalDonations}}
      捐赠次数：{{donationCount}} 次
      最近捐赠：{{lastDonationDate}}

      您带来的改变：
      {{impact}}

      因为有了您这样的支持者，我们的保护工作才能够持续进行。

      查看您的影响力：https://redwolf.org/impact

      可可西里网红狼保护团队敬上
      © {{year}} 可可西里网红狼公益网站 版权所有
    `
  })

  // 管理员通知邮件模板
  emailTemplates.set('admin_notification', {
    subject: '管理员通知：{{notificationType}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>管理员通知</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 30px; border-left: 4px solid #007bff;">
          <h1 style="color: #2c3e50;">管理员通知</h1>

          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>通知类型：</strong>{{notificationType}}</p>
            <p><strong>时间：</strong>{{timestamp}}</p>
            <p><strong>优先级：</strong>{{priority}}</p>
            <p><strong>紧急程度：</strong>{{urgency}}</p>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>详细信息</h3>
            <pre style="background: #f8f9fa; padding: 15px; border-radius: 3px; overflow-x: auto;">{{JSON.stringify data, null, 2}}</pre>
          </div>

          <p style="text-align: center;">
            <a href="https://redwolf.org/admin" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              登录管理后台
            </a>
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      管理员通知

      通知类型：{{notificationType}}
      时间：{{timestamp}}
      优先级：{{priority}}
      紧急程度：{{urgency}}

      详细信息：
      {{JSON.stringify data, null, 2}}

      登录管理后台：https://redwolf.org/admin
    `
  })
}

// 导出内存存储实例（用于测试和调试）
export const memoryStore = {
  emailQueue,
  emailDeliveryStatus,
  emailTemplates,
  retryAttempts
}