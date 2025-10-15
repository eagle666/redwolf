# Creem 支付配置指南

## 💳 Creem 支付概述

Creem 是一个现代化的支付处理平台，专为数字产品和服务设计，支持多种支付方式，提供完整的 API 和 Webhook 功能。

### 选择 Creem 的理由

🇨🇳 **本地化支持**
- 支持中国大陆用户支付
- 集成支付宝、微信支付
- 符合国内支付习惯

💰 **费用合理**
- 交易费用透明
- 无隐藏费用
- 适合个人开发者

🔧 **集成简单**
- 完整的 API 文档
- 丰富的开发工具
- 优秀的开发者体验

🔒 **安全可靠**
- 符合 PCI DSS 标准
- 自动风险管理
- 实时欺诈检测

## 🛠️ 配置步骤

### 第一步：注册 Creem 账户

1. **访问 Creem 官网**
   - 打开 [https://creem.io](https://creem.io)
   - 点击 "Sign Up"

2. **创建账户**
   ```
   邮箱: your-email@example.com
   密码: [设置强密码]
   确认密码: [再次输入密码]
   ```

3. **完成邮箱验证**
   - 查收验证邮件
   - 点击验证链接
   - 登录账户

### 第二步：完成 KYC 认证

1. **进入设置页面**
   - 点击右上角头像
   - 选择 "Settings"

2. **填写基本信息**
   ```
   个人信息:
   - 真实姓名
   - 身份证号
   - 联系电话

   银行信息:
   - 银行卡号
   - 开户行信息
   - 联行号
   ```

3. **上传验证文件**
   - 身份证正反面照片
   - 手持身份证照片
   - 银行卡照片（可选）

4. **等待审核**
   - 通常需要 1-3 个工作日
   - 审核通过后会收到邮件通知

### 第三步：创建产品 (Product)

1. **进入产品管理**
   - 点击 "Products" 菜单
   - 点击 "Create Product"

2. **填写产品信息**
   ```
   基本信息:
   - 产品名称: 可可西里野生动物保护
   - 产品描述: 支持科学保护野生动物，维护生态平衡
   - 产品类型: Donation (捐赠)

   定价设置:
   - 定价类型: Flexible (灵活定价)
   - 最低金额: 1.00 元
   - 建议金额: 10, 50, 100, 500 元

   外观设置:
   - 产品图片: 上传网红狼相关图片
   - 品牌颜色: 选择与网站一致的颜色
   - 自定义域名: 可选
   ```

3. **配置支付设置**
   ```
   支付方式:
   - ☑️ 支付宝
   - ☑️ 微信支付
   - ☐ 银行卡支付

   其他设置:
   - 成功跳转URL: https://your-domain.com/thank-you
   - 失败跳转URL: https://your-domain.com/donate?status=failed
   - Webhook URL: https://your-domain.com/api/creem/webhook
   ```

4. **保存并发布**
   - 检查所有设置
   - 点击 "Save Product"
   - 复制产品 ID

### 第四步：获取 API 密钥

1. **进入开发者设置**
   - 点击 "Developers" 菜单
   - 点击 "API Keys"

2. **创建 API 密钥**
   ```
   密钥名称: Redwolf Production
   权限设置:
   - ☑️ Create Checkouts
   - ☑️ View Products
   - ☑️ View Orders
   - ☑️ Manage Webhooks
   ```

3. **保存密钥信息**
   ```
   API Key: creem_xxxxxxxxxxxxxxxxxx
   Webhook Secret: whsec_xxxxxxxxxxxxxxxxxx
   环境类型: Production
   ```

### 第五步：配置 Webhook

1. **进入 Webhook 设置**
   - 在 "Developers" 菜单中点击 "Webhooks"
   - 点击 "Add Webhook"

2. **配置 Webhook 信息**
   ```
   端点URL: https://your-domain.com/api/creem/webhook
   事件类型:
   - ☑️ checkout.completed (支付完成)
   - ☑️ checkout.failed (支付失败)
   - ☐ subscription.created (订阅创建)
   - ☐ subscription.cancelled (订阅取消)

   安全设置:
   - 签名验证: 启用
   - 重试机制: 启用
   ```

3. **测试 Webhook**
   - 点击 "Send Test Webhook"
   - 检查接收到的数据
   - 确认签名验证正常

### 第六步：配置环境变量

在 `.env.local` 文件中添加 Creem 配置：

```env
# Creem 支付配置
CREEM_API_KEY=creem_your_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
CREEM_PRODUCT_ID=prod_your_product_id_here

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔧 API 集成

### 创建支付会话

```typescript
// lib/creem.ts
interface CreemCheckoutRequest {
  product_id: string
  request_id?: string
  success_url?: string
  metadata?: Record<string, string>
}

interface CreemCheckoutResponse {
  id: string
  checkout_url: string
  request_id?: string
}

export async function createCreemCheckout(
  params: CreemCheckoutRequest
): Promise<CreemCheckoutResponse> {
  const response = await fetch('https://api.creem.io/v1/checkouts', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CREEM_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product_id: params.product_id,
      request_id: params.request_id,
      success_url: params.success_url,
      metadata: params.metadata
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Creem API error: ${error.message || response.statusText}`)
  }

  return response.json()
}
```

### 查询支付状态

```typescript
// lib/creem.ts
export async function getCreemCheckout(checkoutId: string) {
  const response = await fetch(
    `https://api.creem.io/v1/checkouts?id=${checkoutId}`,
    {
      headers: {
        'x-api-key': process.env.CREEM_API_KEY!
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch checkout: ${response.statusText}`)
  }

  return response.json()
}
```

### Webhook 处理

```typescript
// api/creem/webhook/route.ts
import { verifyCreemWebhook } from '@/lib/webhook-verification'
import { prisma } from '@/lib/database'

interface CreemWebhookEvent {
  eventType: string
  id: string
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

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('creem-signature')

    if (!signature) {
      return Response.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // 验证 Webhook 签名
    const isValid = verifyCreemWebhook(
      body,
      signature,
      process.env.CREEM_WEBHOOK_SECRET!
    )

    if (!isValid) {
      return Response.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event: CreemWebhookEvent = JSON.parse(body)

    // 处理不同类型的事件
    switch (event.eventType) {
      case 'checkout.completed':
        await handlePaymentCompleted(event)
        break
      case 'checkout.failed':
        await handlePaymentFailed(event)
        break
      default:
        console.log(`Unhandled event type: ${event.eventType}`)
    }

    return Response.json({ success: true })

  } catch (error) {
    console.error('Webhook processing failed:', error)
    return Response.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCompleted(event: CreemWebhookEvent) {
  const { object } = event

  await prisma.$transaction(async (tx) => {
    // 更新订单状态
    await tx.donation.update({
      where: { order_id: object.request_id },
      data: {
        status: 'completed',
        creem_order_id: object.order.id,
        completed_at: new Date(event.created_at)
      }
    })

    // 创建捐赠记录
    await tx.donation.create({
      data: {
        order_id: object.order.id,
        amount: object.order.amount / 100, // 转换为元
        supporter_name: object.metadata?.supporter_name || '匿名支持者',
        supporter_email: object.metadata?.supporter_email,
        message: object.metadata?.custom_message || '',
        payment_method: 'creem',
        status: 'completed'
      }
    })

    // 更新项目统计
    await tx.projectStats.update({
      where: { project_id: 'redwolf-protection' },
      data: {
        total_amount: { increment: object.order.amount / 100 },
        total_donors: { increment: 1 }
      }
    })
  })

  // 发送感谢邮件
  if (object.metadata?.supporter_email) {
    await sendThankYouEmail(object.metadata.supporter_email, {
      amount: object.order.amount / 100,
      order_id: object.order.id
    })
  }
}
```

## 🔐 Webhook 签名验证

```typescript
// lib/webhook-verification.ts
import crypto from 'crypto'

export function verifyCreemWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return signature === expectedSignature
}

// 验证返回 URL 签名
export function verifyReturnUrlSignature(
  queryParams: Record<string, string>
): boolean {
  const { signature, ...params } = queryParams

  // 按字母顺序排序参数
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')

  const expectedSignature = crypto
    .createHmac('sha256', process.env.CREEM_API_KEY!)
    .update(sortedParams)
    .digest('hex')

  return signature === expectedSignature
}
```

## 🎨 前端集成

### 支付组件

```typescript
// components/donation/DonationForm.tsx
'use client'
import { useState } from 'react'
import { createCreemCheckout } from '@/lib/creem'

interface DonationFormProps {
  onSuccess: () => void
}

export default function DonationForm({ onSuccess }: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [supporterInfo, setSupporterInfo] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const request_id = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const checkout = await createCreemCheckout({
        product_id: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID!,
        request_id,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you`,
        metadata: {
          supporter_name: supporterInfo.name,
          supporter_email: supporterInfo.email,
          custom_message: supporterInfo.message,
          project: 'redwolf-protection'
        }
      })

      // 保存订单信息到本地数据库
      await savePendingOrder({
        request_id,
        amount: parseFloat(amount),
        supporter_info: supporterInfo,
        status: 'pending'
      })

      // 跳转到支付页面
      window.location.href = checkout.checkout_url

    } catch (error) {
      console.error('Payment failed:', error)
      alert('支付创建失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          选择捐赠金额
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[10, 50, 100, 500].map((presetAmount) => (
            <button
              key={presetAmount}
              type="button"
              onClick={() => setAmount(presetAmount.toString())}
              className={`p-3 rounded-lg border-2 transition-colors ${
                amount === presetAmount.toString()
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              ¥{presetAmount}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="或输入自定义金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-3 w-full p-3 border rounded-lg"
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          您的姓名
        </label>
        <input
          type="text"
          value={supporterInfo.name}
          onChange={(e) => setSupporterInfo(prev => ({
            ...prev,
            name: e.target.value
          }))}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          邮箱地址（用于接收捐赠凭证）
        </label>
        <input
          type="email"
          value={supporterInfo.email}
          onChange={(e) => setSupporterInfo(prev => ({
            ...prev,
            email: e.target.value
          }))}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          留言（可选）
        </label>
        <textarea
          value={supporterInfo.message}
          onChange={(e) => setSupporterInfo(prev => ({
            ...prev,
            message: e.target.value
          }))}
          className="w-full p-3 border rounded-lg"
          rows={3}
          placeholder="写下您的支持心声..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !amount || !supporterInfo.name}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
      >
        {isLoading ? '处理中...' : '立即捐赠'}
      </button>
    </form>
  )
}
```

## 📊 测试配置

### 测试环境配置

1. **启用测试模式**
   - 在 Creem 仪表板中切换到测试模式
   - 使用测试 API 密钥

2. **测试支付流程**
   ```typescript
   // 测试用的产品 ID
   const TEST_PRODUCT_ID = 'prod_test_xxxxxxxxxxxx'

   // 测试 API 密钥
   const TEST_API_KEY = 'creem_test_xxxxxxxxxxxx'

   // 测试 Webhook 密钥
   const TEST_WEBHOOK_SECRET = 'whsec_test_xxxxxxxxxxxx'
   ```

3. **测试用例**
   ```bash
   # 测试创建支付会话
   curl -X POST https://test-api.creem.io/v1/checkouts \
     -H "x-api-key: creem_test_your_key" \
     -H "Content-Type: application/json" \
     -d '{
       "product_id": "prod_test_xxxxxxxxxxxx",
       "request_id": "test_123"
     }'
   ```

### 测试支付流程

1. **创建测试支付**
   - 使用测试产品 ID
   - 填写测试信息
   - 生成支付链接

2. **模拟支付**
   - 使用测试信用卡号
   - 完成支付流程
   - 检查 Webhook 接收

3. **验证结果**
   - 检查数据库记录
   - 验证邮件发送
   - 确认前端更新

## 🔍 监控和调试

### 支付状态监控

```typescript
// 检查支付状态
export async function checkPaymentStatus(orderId: string) {
  try {
    const checkout = await getCreemCheckout(orderId)
    return {
      status: checkout.status,
      paid: checkout.paid,
      created_at: checkout.created_at
    }
  } catch (error) {
    console.error('Failed to check payment status:', error)
    return null
  }
}
```

### 错误处理

```typescript
// 常见错误处理
const ERROR_MESSAGES = {
  'invalid_api_key': 'API 密钥无效',
  'invalid_product_id': '产品 ID 无效',
  'insufficient_funds': '余额不足',
  'payment_declined': '支付被拒绝',
  'network_error': '网络错误，请重试'
}

export function handlePaymentError(error: any) {
  const errorCode = error.code || 'unknown_error'
  return ERROR_MESSAGES[errorCode] || '支付失败，请重试'
}
```

### 日志记录

```typescript
// 支付日志记录
export function logPaymentEvent(event: {
  type: string
  orderId: string
  amount: number
  status: string
  error?: string
}) {
  console.log(`[PAYMENT_${event.type.toUpperCase()}]:`, {
    orderId: event.orderId,
    amount: event.amount,
    status: event.status,
    timestamp: new Date().toISOString(),
    error: event.error
  })
}
```

## 🔒 安全最佳实践

### 1. API 密钥安全
- 🔒 使用环境变量存储密钥
- 🔒 不要在前端代码中暴露 API 密钥
- 🔄 定期轮换 API 密钥

### 2. Webhook 安全
- ✅ 始终验证 Webhook 签名
- 🔒 使用 HTTPS 接收 Webhook
- 🔄 实施重试机制

### 3. 数据验证
- ✅ 验证支付金额
- ✅ 检查订单状态
- 🔒 防止重复支付

### 4. 错误处理
- 🔄 实施优雅的错误处理
- 📊 记录详细的错误日志
- 🔒 不要暴露敏感信息

## 📚 更多资源

- [Creem API 文档](https://docs.creem.io/api-reference)
- [Creem Webhook 指南](https://docs.creem.io/learn/webhooks/introduction)
- [支付集成最佳实践](https://docs.creem.io/guides/payment-integration)
- [错误代码参考](https://docs.creem.io/reference/error-codes)

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队