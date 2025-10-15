# API接口规范文档

## 📡 API概述

本文档定义了可可西里网红狼公益网站的API接口规范，包括请求格式、响应格式、错误处理和前后端交互协议。

### 基础信息
- **API版本**: v1
- **基础URL**: `https://your-domain.com/api/v1`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: JWT Token (部分接口)

### 通用响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {
    // 具体数据内容
  },
  "message": "操作成功",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入数据验证失败",
    "details": {
      "field": "amount",
      "reason": "金额必须大于0"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🎯 API端点详情

### 1. 捐赠项目相关接口

#### 1.1 获取项目列表
```http
GET /api/v1/projects
```

**查询参数:**
- `page` (可选): 页码，默认为1
- `limit` (可选): 每页数量，默认为10，最大为50
- `status` (可选): 项目状态 (active, completed, paused)
- `featured` (可选): 是否只显示精选项目 (true/false)

**响应示例:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid-string",
        "title": "可可西里野生动物保护基金",
        "description": "支持可可西里地区野生动物的科学保护和救助工作",
        "targetAmount": 1000000,
        "currentAmount": 250000,
        "status": "active",
        "featuredImage": "https://cdn.example.com/project-image.jpg",
        "stats": {
          "totalDonors": 1250,
          "currentMonthAmount": 50000,
          "lastDonationDate": "2024-01-15T09:45:00Z"
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

#### 1.2 获取单个项目详情
```http
GET /api/v1/projects/{projectId}
```

**路径参数:**
- `projectId`: 项目ID

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "可可西里野生动物保护基金",
    "description": "详细的项目描述...",
    "targetAmount": 1000000,
    "currentAmount": 250000,
    "status": "active",
    "featuredImage": "https://cdn.example.com/project-image.jpg",
    "images": [
      "https://cdn.example.com/image1.jpg",
      "https://cdn.example.com/image2.jpg"
    ],
    "stats": {
      "totalDonors": 1250,
      "currentMonthAmount": 50000,
      "lastDonationDate": "2024-01-15T09:45:00Z",
      "averageDonation": 200
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. 捐赠相关接口

#### 2.1 创建捐赠记录
```http
POST /api/v1/donations
```

**请求体:**
```json
{
  "projectId": "uuid-string",
  "amount": 100,
  "supporterName": "张三",
  "supporterEmail": "zhangsan@example.com",
  "message": "希望可可西里的野生动物能够得到更好的保护"
}
```

**字段验证:**
- `projectId`: 必需，有效的项目ID
- `amount`: 必需，大于0的数字，最大值为100000
- `supporterName`: 必需，1-50字符
- `supporterEmail`: 可选，有效邮箱格式
- `message`: 可选，最大500字符

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "donation-uuid",
    "projectId": "project-uuid",
    "amount": 100,
    "supporterName": "张三",
    "supporterEmail": "zhangsan@example.com",
    "message": "希望可可西里的野生动物能够得到更好的保护",
    "status": "pending",
    "currency": "CNY",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 2.2 获取捐赠记录
```http
GET /api/v1/donations/{donationId}
```

**查询参数:**
- `include` (可选): 包含额外信息 (project,user)

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "donation-uuid",
    "projectId": "project-uuid",
    "project": {
      "title": "可可西里野生动物保护基金"
    },
    "amount": 100,
    "supporterName": "张三",
    "supporterEmail": "zhangsan@example.com",
    "message": "希望保护工作顺利",
    "status": "completed",
    "currency": "CNY",
    "paymentMethod": "creem",
    "creemOrderId": "creem-order-id",
    "completedAt": "2024-01-15T10:35:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 2.3 获取捐赠列表
```http
GET /api/v1/donations
```

**查询参数:**
- `projectId` (可选): 筛选特定项目的捐赠
- `status` (可选): 捐赠状态 (pending, completed, failed)
- `page` (可选): 页码，默认为1
- `limit` (可选): 每页数量，默认为20
- `sort` (可选): 排序方式 (createdAt, amount)

### 3. 支付相关接口

#### 3.1 创建支付订单
```http
POST /api/v1/payments/creem/create-order
```

**请求体:**
```json
{
  "donationId": "donation-uuid",
  "amount": 100,
  "supporterName": "张三",
  "supporterEmail": "zhangsan@example.com",
  "returnUrl": "https://your-domain.com/payment/success",
  "cancelUrl": "https://your-domain.com/payment/cancel"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "orderId": "creem-order-id",
    "checkoutUrl": "https://checkout.creem.io/pay/creem-order-id",
    "amount": 100,
    "currency": "CNY",
    "expiresAt": "2024-01-15T11:30:00Z"
  }
}
```

#### 3.2 查询支付状态
```http
GET /api/v1/payments/creem/status/{orderId}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "orderId": "creem-order-id",
    "status": "paid",
    "amount": 100,
    "currency": "CNY",
    "paidAt": "2024-01-15T10:35:00Z"
  }
}
```

#### 3.3 Creem Webhook 接收
```http
POST /api/v1/payments/creem/webhook
```

**请求头:**
- `Creem-Signature`: Webhook签名

**请求体示例:**
```json
{
  "order_id": "creem-order-id",
  "status": "paid",
  "amount": 100,
  "currency": "CNY",
  "paid_at": "2024-01-15T10:35:00Z",
  "metadata": {
    "donation_id": "donation-uuid"
  }
}
```

**响应:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

### 4. 统计相关接口

#### 4.1 获取项目统计
```http
GET /api/v1/stats/projects/{projectId}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "projectId": "project-uuid",
    "totalAmount": 250000,
    "totalDonors": 1250,
    "currentMonthAmount": 50000,
    "currentMonthDonors": 85,
    "lastDonationDate": "2024-01-15T09:45:00Z",
    "averageDonation": 200,
    "completionRate": 25,
    "dailyStats": [
      {
        "date": "2024-01-15",
        "amount": 5000,
        "donors": 25
      }
    ]
  }
}
```

#### 4.2 获取总体统计
```http
GET /api/v1/stats/overview
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 3,
    "activeProjects": 2,
    "totalAmount": 1000000,
    "totalDonors": 5000,
    "currentMonthAmount": 150000,
    "currentMonthDonors": 300,
    "topProjects": [
      {
        "id": "project-uuid",
        "title": "可可西里野生动物保护基金",
        "amount": 250000,
        "donors": 1250
      }
    ]
  }
}
```

### 5. 教育内容相关接口

#### 5.1 获取文章列表
```http
GET /api/v1/content/articles
```

**查询参数:**
- `category` (可选): 文章分类 (story, education, news, science)
- `page` (可选): 页码
- `limit` (可选): 每页数量
- `featured` (可选): 是否只显示精选文章

**响应示例:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article-uuid",
        "title": "网红狼的真实故事",
        "slug": "wolf-story",
        "excerpt": "讲述可可西里网红狼的真实故事...",
        "featuredImage": "https://cdn.example.com/article-image.jpg",
        "category": "story",
        "viewCount": 1500,
        "tags": ["网红狼", "可可西里", "野生动物保护"],
        "publishedAt": "2024-01-15T08:00:00Z",
        "createdAt": "2024-01-15T07:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 5.2 获取文章详情
```http
GET /api/v1/content/articles/{slug}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "article-uuid",
    "title": "网红狼的真实故事",
    "slug": "wolf-story",
    "content": "完整的文章内容...",
    "excerpt": "文章摘要...",
    "featuredImage": "https://cdn.example.com/article-image.jpg",
    "category": "story",
    "viewCount": 1500,
    "tags": ["网红狼", "可可西里", "野生动物保护"],
    "publishedAt": "2024-01-15T08:00:00Z",
    "createdAt": "2024-01-15T07:30:00Z",
    "updatedAt": "2024-01-15T09:00:00Z"
  }
}
```

## 🔒 错误代码定义

### 通用错误代码
- `VALIDATION_ERROR`: 输入数据验证失败 (400)
- `UNAUTHORIZED`: 未授权访问 (401)
- `FORBIDDEN`: 禁止访问 (403)
- `NOT_FOUND`: 资源不存在 (404)
- `RATE_LIMIT_EXCEEDED`: 请求频率超限 (429)
- `INTERNAL_ERROR`: 服务器内部错误 (500)

### 业务错误代码
- `PROJECT_NOT_FOUND`: 项目不存在
- `PROJECT_INACTIVE`: 项目未激活
- `DONATION_NOT_FOUND`: 捐赠记录不存在
- `PAYMENT_FAILED`: 支付失败
- `INVALID_AMOUNT`: 无效金额
- `DUPLICATE_DONATION`: 重复捐赠

## 🛡️ 安全机制

### 1. 请求验证
- 所有API请求都验证Content-Type
- 使用Zod进行输入数据验证
- 防止SQL注入和XSS攻击

### 2. 限流机制
- 普通接口: 100次/分钟/IP
- 支付接口: 10次/分钟/IP
- Webhook接口: 1000次/分钟

### 3. CORS配置
```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}
```

### 4. 签名验证 (Webhook)
```typescript
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

## 📝 API使用示例

### 前端集成示例

#### React组件示例
```typescript
// components/DonationForm.tsx
import { useState } from 'react'

export default function DonationForm({ projectId }: { projectId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const donationData = {
      projectId,
      amount: Number(formData.get('amount')),
      supporterName: formData.get('supporterName') as string,
      supporterEmail: formData.get('supporterEmail') as string,
      message: formData.get('message') as string
    }

    try {
      // 1. 创建捐赠记录
      const donationResponse = await fetch('/api/v1/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      })

      if (!donationResponse.ok) {
        const errorData = await donationResponse.json()
        throw new Error(errorData.error?.message || '创建捐赠失败')
      }

      const { data: donation } = await donationResponse.json()

      // 2. 创建支付订单
      const paymentResponse = await fetch('/api/v1/payments/creem/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: donation.id,
          ...donationData,
          returnUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('创建支付订单失败')
      }

      const { data: payment } = await paymentResponse.json()

      // 3. 跳转到支付页面
      window.location.href = payment.checkoutUrl

    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 表单字段 */}
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? '处理中...' : '立即捐赠'}
      </button>
    </form>
  )
}
```

#### API客户端封装
```typescript
// lib/api-client.ts
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data: T; error?: any }> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'API请求失败')
      }

      return data
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      } as any
    }
  }

  // 项目相关方法
  async getProjects(params?: {
    page?: number
    limit?: number
    status?: string
  }) {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/projects?${query}`)
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`)
  }

  // 捐赠相关方法
  async createDonation(data: {
    projectId: string
    amount: number
    supporterName: string
    supporterEmail?: string
    message?: string
  }) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getDonation(id: string) {
    return this.request(`/donations/${id}`)
  }

  // 支付相关方法
  async createCreemOrder(data: {
    donationId: string
    amount: number
    supporterName: string
    supporterEmail?: string
    returnUrl: string
    cancelUrl: string
  }) {
    return this.request('/payments/creem/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPaymentStatus(orderId: string) {
    return this.request(`/payments/creem/status/${orderId}`)
  }
}

export const apiClient = new ApiClient()
```

## 📊 API性能监控

### 响应时间目标
- 简单查询接口: < 100ms
- 复杂查询接口: < 500ms
- 写入操作接口: < 1000ms
- 支付相关接口: < 2000ms

### 监控指标
- 接口响应时间
- 错误率
- 请求量
- 并发数

### 日志记录
```typescript
// 记录API请求日志
function logApiRequest(req: Request, res: Response, duration: number) {
  console.log({
    method: req.method,
    url: req.url,
    status: res.status,
    duration: `${duration}ms`,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for') || 'unknown',
    timestamp: new Date().toISOString()
  })
}
```

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队