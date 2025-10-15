# Webhook 处理指南

## 🔄 Webhook 概述

Webhook 是实现系统间实时数据同步的关键机制。当 Creem 支付系统检测到支付事件时，会自动向我们的应用发送 HTTP 请求，包含详细的支付信息。

### Webhook 的重要性

🚀 **实时性**: 支付完成后立即通知，无需轮询
🔒 **可靠性**: 内置重试机制，确保事件送达
📊 **数据完整性**: 包含完整的支付数据和元数据
🔧 **自动化**: 触发后续业务流程，减少人工干预

## 🎯 Webhook 流程图

```
用户完成支付
       ↓
Creem 处理支付
       ↓
Creem 发送 Webhook → 我们的 API 端点
       ↓
验证签名 → 处理数据 → 更新数据库
       ↓
触发后续流程 → 发送邮件 → 通知用户
```

## 🛠️ Creem Webhook 配置

### 1. Webhook 端点设置

在 Creem 仪表板中配置：
```
端点 URL: https://your-domain.com/api/creem/webhook
事件类型: checkout.completed
安全设置: 启用签名验证
重试机制: 启用（30秒、1分钟、5分钟、1小时）
```

### 2. 支持的事件类型

```typescript
type CreemEventType =
  | 'checkout.completed'    // 支付完成
  | 'checkout.failed'       // 支付失败
  | 'checkout.cancelled'    // 支付取消
  | 'order.created'         // 订单创建
  | 'subscription.created'  // 订阅创建
  | 'subscription.updated'  // 订阅更新
  | 'subscription.cancelled'// 订阅取消
```

## 🔧 Webhook 接收端实现

### 1. 主端点实现

```typescript
// app/api/creem/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyCreemWebhook } from '@/lib/webhook-verification'
import { handlePaymentCompleted, handlePaymentFailed } from '@/lib/webhook-handlers'
import { logWebhookEvent } from '@/lib/webhook-logging'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 1. 获取请求信息
    const body = await request.text()
    const signature = request.headers.get('creem-signature')

    if (!signature) {
      logWebhookEvent({
        type: 'error',
        message: 'Missing signature',
        headers: Object.fromEntries(request.headers.entries())
      })

      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // 2. 验证 Webhook 签名
    const isValid = verifyCreemWebhook(
      body,
      signature,
      process.env.CREEM_WEBHOOK_SECRET!
    )

    if (!isValid) {
      logWebhookEvent({
        type: 'security',
        message: 'Invalid webhook signature',
        signature: signature.substring(0, 20) + '...'
      })

      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // 3. 解析事件数据
    let event: CreemWebhookEvent
    try {
      event = JSON.parse(body)
    } catch (error) {
      logWebhookEvent({
        type: 'error',
        message: 'Invalid JSON payload',
        error: error.message
      })

      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    // 4. 记录接收到的事件
    logWebhookEvent({
      type: 'received',
      eventType: event.eventType,
      eventId: event.id,
      createdAt: event.created_at
    })

    // 5. 处理不同类型的事件
    switch (event.eventType) {
      case 'checkout.completed':
        await handlePaymentCompleted(event)
        break

      case 'checkout.failed':
        await handlePaymentFailed(event)
        break

      case 'checkout.cancelled':
        await handlePaymentCancelled(event)
        break

      default:
        logWebhookEvent({
          type: 'info',
          message: `Unhandled event type: ${event.eventType}`
        })
    }

    // 6. 记录处理时间
    const processingTime = Date.now() - startTime
    logWebhookEvent({
      type: 'processed',
      eventType: event.eventType,
      eventId: event.id,
      processingTime
    })

    return NextResponse.json({
      success: true,
      processingTime
    })

  } catch (error) {
    const processingTime = Date.now() - startTime

    logWebhookEvent({
      type: 'error',
      message: 'Webhook processing failed',
      error: error.message,
      stack: error.stack,
      processingTime
    })

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
```

### 2. 签名验证实现

```typescript
// lib/webhook-verification.ts
import crypto from 'crypto'

export function verifyCreemWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Creem 使用 HMAC-SHA256 签名
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return signature === expectedSignature
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

// 时间戳验证（防止重放攻击）
export function verifyTimestamp(
  timestamp: number,
  maxAge: number = 300000 // 5分钟
): boolean {
  const now = Date.now()
  const eventTime = timestamp * 1000 // 转换为毫秒

  return Math.abs(now - eventTime) <= maxAge
}

// 完整的 Webhook 验证
export function verifyWebhook(
  payload: string,
  signature: string,
  secret: string,
  timestamp: number
): { valid: boolean; reason?: string } {
  // 1. 验证时间戳
  if (!verifyTimestamp(timestamp)) {
    return { valid: false, reason: 'Timestamp too old or too new' }
  }

  // 2. 验证签名
  if (!verifyCreemWebhook(payload, signature, secret)) {
    return { valid: false, reason: 'Invalid signature' }
  }

  return { valid: true }
}
```

## 📊 事件处理器实现

### 1. 支付完成处理器

```typescript
// lib/webhook-handlers.ts
import { prisma } from '@/lib/database'
import { sendThankYouEmail, sendAdminNotification } from '@/lib/email'
import { updateProjectStats, updateUserStats } from '@/lib/stats'
import { logPaymentEvent } from '@/lib/payment-logging'

export async function handlePaymentCompleted(event: CreemCompletedEvent) {
  const { object: checkout } = event

  try {
    await prisma.$transaction(async (tx) => {
      // 1. 更新订单状态
      const updatedOrder = await tx.donation.update({
        where: { order_id: checkout.request_id },
        data: {
          status: 'completed',
          creem_order_id: checkout.order.id,
          creem_checkout_id: checkout.id,
          completed_at: new Date(event.created_at),
          payment_method: 'creem'
        }
      })

      if (!updatedOrder) {
        throw new Error(`Order not found: ${checkout.request_id}`)
      }

      // 2. 创建捐赠记录
      const donation = await tx.donation.create({
        data: {
          order_id: checkout.order.id,
          project_id: updatedOrder.project_id,
          user_id: updatedOrder.user_id,
          amount: checkout.order.amount / 100, // 转换为元
          currency: checkout.order.currency,
          supporter_name: checkout.metadata?.supporter_name || updatedOrder.supporter_name,
          supporter_email: checkout.metadata?.supporter_email || updatedOrder.supporter_email,
          message: checkout.metadata?.custom_message || updatedOrder.message,
          payment_status: 'completed',
          payment_method: 'creem',
          is_public: checkout.metadata?.is_public !== 'false',
          is_anonymous: checkout.metadata?.is_anonymous === 'true'
        }
      })

      // 3. 更新项目统计
      await updateProjectStats(tx, updatedOrder.project_id, donation.amount)

      // 4. 更新用户统计（如果有用户ID）
      if (updatedOrder.user_id) {
        await updateUserStats(tx, updatedOrder.user_id, donation.amount)
      }

      // 5. 记录支付事件
      logPaymentEvent({
        type: 'completed',
        orderId: checkout.order.id,
        requestId: checkout.request_id,
        amount: donation.amount,
        supporterEmail: donation.supporter_email
      })

      return donation
    })

    // 6. 发送感谢邮件（异步，不阻塞事务）
    if (checkout.metadata?.supporter_email) {
      await sendThankYouEmail(checkout.metadata.supporter_email, {
        amount: checkout.order.amount / 100,
        orderId: checkout.order.id,
        supporterName: checkout.metadata.supporter_name,
        projectName: '可可西里野生动物保护'
      }).catch(error => {
        console.error('Failed to send thank you email:', error)
      })
    }

    // 7. 发送管理员通知（异步）
    await sendAdminNotification({
      type: 'new_donation',
      data: {
        amount: checkout.order.amount / 100,
        supporter: checkout.metadata?.supporter_name || '匿名支持者',
        projectName: '可可西里野生动物保护',
        timestamp: new Date(event.created_at)
      }
    }).catch(error => {
      console.error('Failed to send admin notification:', error)
    })

    console.log(`✅ Payment completed: ${checkout.order.id} - ¥${checkout.order.amount / 100}`)

  } catch (error) {
    console.error('❌ Failed to handle payment completed:', error)

    // 记录错误到数据库
    await prisma.webhook_errors.create({
      data: {
        event_id: event.id,
        event_type: event.eventType,
        error_message: error.message,
        error_stack: error.stack,
        event_data: event
      }
    })

    throw error
  }
}
```

### 2. 支付失败处理器

```typescript
export async function handlePaymentFailed(event: CreemFailedEvent) {
  const { object: checkout } = event

  try {
    // 1. 更新订单状态
    await prisma.donation.update({
      where: { order_id: checkout.request_id },
      data: {
        status: 'failed',
        creem_checkout_id: checkout.id,
        updated_at: new Date(event.created_at)
      }
    })

    // 2. 记录失败事件
    logPaymentEvent({
      type: 'failed',
      orderId: checkout.order.id,
      requestId: checkout.request_id,
      reason: checkout.failure_reason || 'Unknown reason'
    })

    // 3. 可选：发送失败通知邮件
    if (checkout.metadata?.supporter_email) {
      await sendPaymentFailedEmail(checkout.metadata.supporter_email, {
        orderId: checkout.order.id,
        reason: checkout.failure_reason
      }).catch(error => {
        console.error('Failed to send failed payment email:', error)
      })
    }

    console.log(`❌ Payment failed: ${checkout.order.id}`)

  } catch (error) {
    console.error('Failed to handle payment failed:', error)
    throw error
  }
}
```

### 3. 支付取消处理器

```typescript
export async function handlePaymentCancelled(event: CreemCancelledEvent) {
  const { object: checkout } = event

  try {
    // 1. 更新订单状态
    await prisma.donation.update({
      where: { order_id: checkout.request_id },
      data: {
        status: 'cancelled',
        creem_checkout_id: checkout.id,
        updated_at: new Date(event.created_at)
      }
    })

    // 2. 记录取消事件
    logPaymentEvent({
      type: 'cancelled',
      orderId: checkout.order.id,
      requestId: checkout.request_id
    })

    console.log(`🚫 Payment cancelled: ${checkout.order.id}`)

  } catch (error) {
    console.error('Failed to handle payment cancelled:', error)
    throw error
  }
}
```

## 📝 Webhook 事件类型定义

```typescript
// types/creem-webhook.ts
export interface CreemWebhookEvent {
  id: string
  eventType: string
  created_at: number
  object: any
}

export interface CreemCompletedEvent {
  id: string
  eventType: 'checkout.completed'
  created_at: number
  object: {
    id: string
    request_id: string
    order: {
      id: string
      customer: string
      product: string
      amount: number
      currency: string
    }
    metadata?: Record<string, string>
  }
}

export interface CreemFailedEvent {
  id: string
  eventType: 'checkout.failed'
  created_at: number
  object: {
    id: string
    request_id: string
    failure_reason?: string
    metadata?: Record<string, string>
  }
}

export interface CreemCancelledEvent {
  id: string
  eventType: 'checkout.cancelled'
  created_at: number
  object: {
    id: string
    request_id: string
    metadata?: Record<string, string>
  }
}
```

## 🔍 日志和监控

### 1. Webhook 日志记录

```typescript
// lib/webhook-logging.ts
import { prisma } from '@/lib/database'

interface WebhookLogData {
  type: 'received' | 'processed' | 'error' | 'security' | 'info'
  message: string
  eventType?: string
  eventId?: string
  signature?: string
  processingTime?: number
  error?: string
  stack?: string
  headers?: Record<string, string>
}

export async function logWebhookEvent(data: WebhookLogData) {
  try {
    await prisma.webhook_logs.create({
      data: {
        type: data.type,
        message: data.message,
        event_type: data.eventType,
        event_id: data.eventId,
        signature: data.signature,
        processing_time: data.processingTime,
        error_message: data.error,
        error_stack: data.stack,
        headers: data.headers,
        created_at: new Date()
      }
    })
  } catch (error) {
    // 避免日志记录失败影响主流程
    console.error('Failed to log webhook event:', error)
  }
}

// 控制台日志（开发环境）
if (process.env.NODE_ENV === 'development') {
  console.log(`[WEBHOOK_${data.type.toUpperCase()}]:`, {
    message: data.message,
    eventType: data.eventType,
    eventId: data.eventId,
    processingTime: data.processingTime
  })
}
```

### 2. 错误处理数据库表

```sql
-- Webhook 错误记录表
CREATE TABLE webhook_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT,
  event_type TEXT,
  error_message TEXT,
  error_stack TEXT,
  event_data JSONB,
  retry_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Webhook 日志表
CREATE TABLE webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  event_type TEXT,
  event_id TEXT,
  signature TEXT,
  processing_time INTEGER,
  error_message TEXT,
  error_stack TEXT,
  headers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);
CREATE INDEX idx_webhook_errors_resolved ON webhook_errors(resolved);
```

### 3. 性能监控

```typescript
// lib/webhook-monitoring.ts
export class WebhookMonitor {
  private static instance: WebhookMonitor
  private metrics: {
    received: number
    processed: number
    failed: number
    averageProcessingTime: number
  } = {
    received: 0,
    processed: 0,
    failed: 0,
    averageProcessingTime: 0
  }

  static getInstance(): WebhookMonitor {
    if (!WebhookMonitor.instance) {
      WebhookMonitor.instance = new WebhookMonitor()
    }
    return WebhookMonitor.instance
  }

  recordReceived() {
    this.metrics.received++
  }

  recordProcessed(processingTime: number) {
    this.metrics.processed++
    this.updateAverageProcessingTime(processingTime)
  }

  recordFailed() {
    this.metrics.failed++
  }

  private updateAverageProcessingTime(time: number) {
    const total = this.metrics.averageProcessingTime * (this.metrics.processed - 1) + time
    this.metrics.averageProcessingTime = total / this.metrics.processed
  }

  getMetrics() {
    return { ...this.metrics }
  }

  getSuccessRate() {
    return this.metrics.received > 0
      ? (this.metrics.processed / this.metrics.received) * 100
      : 0
  }
}
```

## 🚨 错误处理和重试

### 1. 错误分类处理

```typescript
// lib/webhook-error-handler.ts
export class WebhookError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'WebhookError'
  }
}

export function handleWebhookError(error: any, event: CreemWebhookEvent) {
  if (error instanceof WebhookError) {
    return {
      shouldRetry: error.retryable,
      statusCode: getStatusCode(error.code),
      message: error.message
    }
  }

  // 数据库连接错误
  if (error.code === 'ECONNREFUSED') {
    return {
      shouldRetry: true,
      statusCode: 503,
      message: 'Database connection failed'
    }
  }

  // 验证错误
  if (error.message.includes('validation')) {
    return {
      shouldRetry: false,
      statusCode: 400,
      message: 'Validation error'
    }
  }

  // 默认处理
  return {
    shouldRetry: true,
    statusCode: 500,
    message: 'Internal server error'
  }
}

function getStatusCode(errorCode: string): number {
  const statusCodes: Record<string, number> = {
    'INVALID_SIGNATURE': 401,
    'INVALID_EVENT': 400,
    'ORDER_NOT_FOUND': 404,
    'DUPLICATE_ORDER': 409,
    'DATABASE_ERROR': 500
  }

  return statusCodes[errorCode] || 500
}
```

### 2. 重试机制

```typescript
// lib/webhook-retry.ts
export class WebhookRetryManager {
  private static maxRetries = 3
  private static retryDelays = [30000, 300000, 3600000] // 30秒、5分钟、1小时

  static async shouldRetry(event: CreemWebhookEvent, attempt: number): Promise<boolean> {
    if (attempt >= this.maxRetries) {
      return false
    }

    // 检查事件时间是否过期
    const eventAge = Date.now() - (event.created_at * 1000)
    const maxAge = 24 * 60 * 60 * 1000 // 24小时

    return eventAge < maxAge
  }

  static getRetryDelay(attempt: number): number {
    return this.retryDelays[attempt] || this.retryDelays[this.retryDelays.length - 1]
  }

  static async scheduleRetry(event: CreemWebhookEvent, attempt: number): Promise<void> {
    const delay = this.getRetryDelay(attempt)

    console.log(`Scheduling webhook retry in ${delay}ms for event ${event.id}`)

    setTimeout(async () => {
      try {
        // 重新处理 webhook
        await processWebhookEvent(event)
      } catch (error) {
        console.error(`Webhook retry ${attempt + 1} failed:`, error)
      }
    }, delay)
  }
}
```

## 🔒 安全最佳实践

### 1. 签名验证

```typescript
// 必须验证每个 webhook 请求
const isValid = verifyCreemWebhook(body, signature, secret)
if (!isValid) {
  return Response.json({ error: 'Invalid signature' }, { status: 401 })
}
```

### 2. 时间戳验证

```typescript
// 防止重放攻击
const eventAge = Date.now() - (event.created_at * 1000)
if (eventAge > 300000) { // 5分钟
  return Response.json({ error: 'Event too old' }, { status: 400 })
}
```

### 3. IP 白名单（可选）

```typescript
// 限制 Creem 服务器的 IP 范围
const CREEM_IP_RANGES = [
  '192.168.1.0/24', // 示例 IP 范围
  // 添加实际的 Creem IP 范围
]

function isAllowedIP(ip: string): boolean {
  return CREEM_IP_RANGES.some(range => ipInRange(ip, range))
}
```

### 4. 数据清理

```typescript
// 清理输入数据
function sanitizeEventData(event: any): any {
  return {
    ...event,
    metadata: event.metadata ? sanitizeMetadata(event.metadata) : {}
  }
}

function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(metadata)) {
    // 只允许预定义的字段
    if (['supporter_name', 'supporter_email', 'custom_message', 'project'].includes(key)) {
      sanitized[key] = typeof value === 'string' ? value.trim() : value
    }
  }

  return sanitized
}
```

## 📊 监控和告警

### 1. 健康检查端点

```typescript
// app/api/webhook/health/route.ts
export async function GET() {
  const monitor = WebhookMonitor.getInstance()
  const metrics = monitor.getMetrics()

  const health = {
    status: 'healthy',
    metrics,
    successRate: monitor.getSuccessRate(),
    timestamp: new Date().toISOString()
  }

  // 如果成功率低于 95%，标记为不健康
  if (health.successRate < 95) {
    health.status = 'degraded'
  }

  if (health.successRate < 80) {
    health.status = 'unhealthy'
  }

  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503
  })
}
```

### 2. 告警设置

```typescript
// lib/webhook-alerts.ts
export class WebhookAlertManager {
  static async checkAlerts() {
    const monitor = WebhookMonitor.getInstance()
    const metrics = monitor.getMetrics()

    // 成功率过低告警
    if (monitor.getSuccessRate() < 90) {
      await this.sendAlert('webhook_low_success_rate', {
        successRate: monitor.getSuccessRate(),
        metrics
      })
    }

    // 处理时间过长告警
    if (metrics.averageProcessingTime > 5000) { // 5秒
      await this.sendAlert('webhook_slow_processing', {
        averageTime: metrics.averageProcessingTime,
        metrics
      })
    }
  }

  private static async sendAlert(type: string, data: any) {
    // 发送到监控系统或管理员邮箱
    console.log(`ALERT: ${type}`, data)

    // 这里可以集成实际的告警系统
    // 例如：发送 Slack 通知、邮件、短信等
  }
}
```

## 📚 测试 Webhook

### 1. 测试端点

```typescript
// app/api/webhook/test/route.ts
export async function POST(request: Request) {
  const testData = {
    id: 'test_' + Date.now(),
    eventType: 'checkout.completed',
    created_at: Math.floor(Date.now() / 1000),
    object: {
      id: 'ch_test_' + Date.now(),
      request_id: 'req_test_' + Date.now(),
      order: {
        id: 'ord_test_' + Date.now(),
        customer: 'test_customer',
        product: 'test_product',
        amount: 1000, // 10元
        currency: 'CNY'
      },
      metadata: {
        supporter_name: '测试用户',
        supporter_email: 'test@example.com',
        custom_message: '测试捐赠'
      }
    }
  }

  // 模拟 webhook 处理
  await handlePaymentCompleted(testData)

  return NextResponse.json({
    success: true,
    message: 'Test webhook processed successfully',
    data: testData
  })
}
```

### 2. 本地测试工具

```bash
#!/bin/bash
# scripts/test-webhook.sh

WEBHOOK_URL="http://localhost:3000/api/creem/webhook"
WEBHOOK_SECRET="your-webhook-secret"

# 创建测试数据
TEST_DATA='{
  "id": "test_event_123",
  "eventType": "checkout.completed",
  "created_at": 1640995200,
  "object": {
    "id": "ch_test_123",
    "request_id": "req_test_123",
    "order": {
      "id": "ord_test_123",
      "amount": 1000,
      "currency": "CNY"
    }
  }
}'

# 生成签名
SIGNATURE=$(echo -n "$TEST_DATA" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)

# 发送请求
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "creem-signature: $SIGNATURE" \
  -d "$TEST_DATA"

echo "Test webhook sent!"
```

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队