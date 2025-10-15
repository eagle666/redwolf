# 测试策略和质量保证文档

## 🎯 测试策略概述

本文档定义了可可西里网红狼公益网站的全面测试策略，确保代码质量、功能正确性和用户体验。

### 测试金字塔
```
    🔺 E2E Tests (5%)
       端到端用户流程测试
   🟠 Integration Tests (15%)
      组件间和API集成测试
 🟢 Unit Tests (80%)
    单个函数和组件测试
```

### 测试覆盖率目标
- **单元测试覆盖率**: ≥ 80%
- **集成测试覆盖率**: ≥ 70%
- **E2E测试覆盖率**: 主要用户流程 100%
- **关键路径测试**: 100%

## 🧪 单元测试策略

### 1. 测试框架和工具
- **Jest**: 测试运行器和断言库
- **@testing-library/react**: React组件测试
- **@testing-library/jest-dom**: DOM断言扩展
- **ts-jest**: TypeScript支持

### 2. 测试文件组织结构
```
src/
├── components/
│   └── donation/
│       ├── DonationForm.tsx
│       └── __tests__/
│           ├── DonationForm.test.tsx
│           └── DonationForm.utils.test.ts
├── lib/
│   ├── api.ts
│   └── __tests__/
│       └── api.test.ts
├── api/
│   └── donations/
│       └── route.ts
└── tests/
    ├── __mocks__/
    ├── fixtures/
    └── setup.ts
```

### 3. 数据模型测试示例

#### 捐赠记录模型测试
```typescript
// tests/models/donations.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { db } from '@/lib/db'
import { donations } from '@/drizzle/schema'
import { createDonation, updateDonationStatus, getDonationById } from '@/lib/models/donations'

describe('捐赠记录模型', () => {
  beforeEach(async () => {
    // 清理测试数据
    await db.delete(donations)
  })

  afterEach(async () => {
    // 清理测试数据
    await db.delete(donations)
  })

  describe('createDonation', () => {
    it('应该能够创建有效的捐赠记录', async () => {
      const donationData = {
        projectId: 'test-project-id',
        amount: 100,
        supporterName: '测试用户',
        supporterEmail: 'test@example.com',
        message: '测试消息'
      }

      const result = await createDonation(donationData)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.amount).toBe(100)
      expect(result.supporterName).toBe('测试用户')
      expect(result.status).toBe('pending')
      expect(result.createdAt).toBeInstanceOf(Date)
    })

    it('应该拒绝无效的金额', async () => {
      const invalidData = {
        projectId: 'test-project-id',
        amount: -100,
        supporterName: '测试用户'
      }

      await expect(createDonation(invalidData))
        .rejects.toThrow('金额必须大于0')
    })

    it('应该拒绝缺失的必需字段', async () => {
      const incompleteData = {
        amount: 100
        // 缺失 projectId 和 supporterName
      }

      await expect(createDonation(incompleteData))
        .rejects.toThrow()
    })
  })

  describe('updateDonationStatus', () => {
    let donationId: string

    beforeEach(async () => {
      const donation = await createDonation({
        projectId: 'test-project-id',
        amount: 100,
        supporterName: '测试用户'
      })
      donationId = donation.id
    })

    it('应该能够更新捐赠状态为已完成', async () => {
      const result = await updateDonationStatus(donationId, 'completed')

      expect(result.status).toBe('completed')
      expect(result.completedAt).toBeInstanceOf(Date)
    })

    it('应该拒绝无效的状态值', async () => {
      await expect(updateDonationStatus(donationId, 'invalid-status'))
        .rejects.toThrow('无效的状态值')
    })

    it('应该处理不存在的捐赠ID', async () => {
      await expect(updateDonationStatus('non-existent-id', 'completed'))
        .rejects.toThrow('捐赠记录不存在')
    })
  })

  describe('getDonationById', () => {
    let donationId: string

    beforeEach(async () => {
      const donation = await createDonation({
        projectId: 'test-project-id',
        amount: 100,
        supporterName: '测试用户'
      })
      donationId = donation.id
    })

    it('应该能够获取存在的捐赠记录', async () => {
      const result = await getDonationById(donationId)

      expect(result).toBeDefined()
      expect(result.id).toBe(donationId)
      expect(result.amount).toBe(100)
    })

    it('应该对不存在的ID返回null', async () => {
      const result = await getDonationById('non-existent-id')
      expect(result).toBeNull()
    })
  })
})
```

### 4. API函数测试示例

#### API工具函数测试
```typescript
// tests/lib/api.test.ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { fetchWithTimeout, handleApiError, createApiResponse } from '@/lib/api'

describe('API工具函数', () => {
  describe('fetchWithTimeout', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('应该在超时时间内返回响应', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      })
      global.fetch = mockFetch

      const promise = fetchWithTimeout('https://api.example.com', {}, 1000)

      // 立即解决fetch
      await Promise.resolve()

      const result = await promise
      expect(result.data).toBe('test')
    })

    it('应该在超时后抛出错误', async () => {
      const mockFetch = jest.fn(() => new Promise(() => {}))
      global.fetch = mockFetch

      const promise = fetchWithTimeout('https://api.example.com', {}, 1000)

      // 推进时间超过超时限制
      jest.advanceTimersByTime(1001)

      await expect(promise).rejects.toThrow('请求超时')
    })
  })

  describe('handleApiError', () => {
    it('应该处理网络错误', () => {
      const error = new Error('Network Error')
      const result = handleApiError(error)

      expect(result.success).toBe(false)
      expect(result.error.code).toBe('NETWORK_ERROR')
      expect(result.error.message).toBe('网络连接失败')
    })

    it('应该处理API错误响应', () => {
      const error = {
        response: {
          status: 400,
          data: { error: { message: 'Invalid input' } }
        }
      }
      const result = handleApiError(error)

      expect(result.success).toBe(false)
      expect(result.error.code).toBe('VALIDATION_ERROR')
      expect(result.error.message).toBe('Invalid input')
    })
  })

  describe('createApiResponse', () => {
    it('应该创建成功响应', () => {
      const result = createApiResponse({ data: 'test' }, '操作成功')

      expect(result.success).toBe(true)
      expect(result.data).toBe('test')
      expect(result.message).toBe('操作成功')
      expect(result.timestamp).toBeDefined()
    })

    it('应该创建错误响应', () => {
      const error = { code: 'VALIDATION_ERROR', message: '输入错误' }
      const result = createApiResponse(null, null, error)

      expect(result.success).toBe(false)
      expect(result.error).toEqual(error)
      expect(result.timestamp).toBeDefined()
    })
  })
})
```

### 5. 工具函数测试示例

#### 表单验证测试
```typescript
// tests/lib/validation.test.ts
import { describe, it, expect } from '@jest/globals'
import { validateDonationForm, validateEmail } from '@/lib/validation'

describe('表单验证函数', () => {
  describe('validateDonationForm', () => {
    it('应该验证有效的捐赠表单数据', () => {
      const validData = {
        amount: 100,
        supporterName: '张三',
        supporterEmail: 'zhangsan@example.com',
        message: '测试消息'
      }

      const result = validateDonationForm(validData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('应该检测无效的金额', () => {
      const invalidData = {
        amount: -100,
        supporterName: '张三'
      }

      const result = validateDonationForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.amount).toBe('金额必须大于0')
    })

    it('应该检测过长的姓名', () => {
      const invalidData = {
        amount: 100,
        supporterName: 'a'.repeat(51) // 超过50字符限制
      }

      const result = validateDonationForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.supporterName).toBe('姓名不能超过50个字符')
    })

    it('应该检测无效的邮箱格式', () => {
      const invalidData = {
        amount: 100,
        supporterName: '张三',
        supporterEmail: 'invalid-email'
      }

      const result = validateDonationForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.supporterEmail).toBe('邮箱格式不正确')
    })

    it('应该允许缺失的可选字段', () => {
      const data = {
        amount: 100,
        supporterName: '张三'
        // supporterEmail 和 message 是可选的
      }

      const result = validateDonationForm(data)
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateEmail', () => {
    it('应该验证有效邮箱', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    it('应该拒绝无效邮箱', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user@domain')).toBe(false)
    })

    it('应该处理边界情况', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail(null as any)).toBe(false)
      expect(validateEmail(undefined as any)).toBe(false)
    })
  })
})
```

## 🟢 集成测试策略

### 1. API端点集成测试

#### 捐赠API集成测试
```typescript
// tests/api/donations.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { createApp } from '@/app'
import { db } from '@/lib/db'
import { donations, donationProjects } from '@/drizzle/schema'

const app = createApp()

describe('捐赠API集成测试', () => {
  let projectId: string

  beforeEach(async () => {
    // 创建测试项目
    const [project] = await db.insert(donationProjects)
      .values({
        title: '测试项目',
        description: '测试描述',
        targetAmount: 100000
      })
      .returning()
    projectId = project.id

    // 清理捐赠数据
    await db.delete(donations)
  })

  afterEach(async () => {
    // 清理测试数据
    await db.delete(donations)
    await db.delete(donationProjects)
  })

  describe('POST /api/v1/donations', () => {
    it('应该创建新的捐赠记录', async () => {
      const donationData = {
        projectId,
        amount: 100,
        supporterName: '测试用户',
        supporterEmail: 'test@example.com',
        message: '测试消息'
      }

      const response = await app.request('/api/v1/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      })

      expect(response.status).toBe(201)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.id).toBeDefined()
      expect(data.data.amount).toBe(100)
      expect(data.data.status).toBe('pending')
    })

    it('应该验证必填字段', async () => {
      const invalidData = {
        amount: 100
        // 缺失 projectId 和 supporterName
      }

      const response = await app.request('/api/v1/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('应该拒绝无效的金额', async () => {
      const invalidData = {
        projectId,
        amount: -100,
        supporterName: '测试用户'
      }

      const response = await app.request('/api/v1/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/v1/donations/:id', () => {
    let donationId: string

    beforeEach(async () => {
      const [donation] = await db.insert(donations)
        .values({
          projectId,
          amount: 100,
          supporterName: '测试用户'
        })
        .returning()
      donationId = donation.id
    })

    it('应该返回存在的捐赠记录', async () => {
      const response = await app.request(`/api/v1/donations/${donationId}`)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(donationId)
      expect(data.data.amount).toBe(100)
    })

    it('应该返回404对于不存在的记录', async () => {
      const response = await app.request('/api/v1/donations/non-existent-id')

      expect(response.status).toBe(404)

      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('NOT_FOUND')
    })
  })
})
```

### 2. 数据库集成测试

#### 事务处理测试
```typescript
// tests/integration/database.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { db } from '@/lib/db'
import { donations, donationProjects, projectStats } from '@/drizzle/schema'
import { createDonationWithStats } from '@/lib/services/donation-service'

describe('数据库集成测试', () => {
  beforeEach(async () => {
    // 清理测试数据
    await db.delete(donations)
    await db.delete(projectStats)
    await db.delete(donationProjects)
  })

  afterEach(async () => {
    // 清理测试数据
    await db.delete(donations)
    await db.delete(projectStats)
    await db.delete(donationProjects)
  })

  describe('事务处理', () => {
    it('应该在事务中创建捐赠记录和更新统计', async () => {
      // 创建测试项目
      const [project] = await db.insert(donationProjects)
        .values({
          title: '测试项目',
          description: '测试描述',
          targetAmount: 100000
        })
        .returning()

      // 创建项目统计
      await db.insert(projectStats)
        .values({
          projectId: project.id,
          totalAmount: 0,
          totalDonors: 0
        })

      const donationData = {
        projectId: project.id,
        amount: 100,
        supporterName: '测试用户'
      }

      // 执行事务操作
      const result = await createDonationWithStats(donationData)

      // 验证捐赠记录已创建
      expect(result.donation.id).toBeDefined()
      expect(result.donation.amount).toBe(100)

      // 验证统计数据已更新
      const stats = await db.query.projectStats.findFirst({
        where: (projectStats, { eq }) => eq(projectStats.projectId, project.id)
      })

      expect(stats).toBeDefined()
      expect(stats?.totalAmount).toBe(100)
      expect(stats?.totalDonors).toBe(1)
    })

    it('应该在事务失败时回滚所有操作', async () => {
      // 创建测试项目
      const [project] = await db.insert(donationProjects)
        .values({
          title: '测试项目',
          description: '测试描述',
          targetAmount: 100000
        })
        .returning()

      // 创建项目统计
      await db.insert(projectStats)
        .values({
          projectId: project.id,
          totalAmount: 0,
          totalDonors: 0
        })

      // 尝试创建无效捐赠（会导致事务失败）
      const invalidDonationData = {
        projectId: project.id,
        amount: -100, // 无效金额
        supporterName: '测试用户'
      }

      await expect(createDonationWithStats(invalidDonationData))
        .rejects.toThrow()

      // 验证统计数据未被修改
      const stats = await db.query.projectStats.findFirst({
        where: (projectStats, { eq }) => eq(projectStats.projectId, project.id)
      })

      expect(stats).toBeDefined()
      expect(stats?.totalAmount).toBe(0)
      expect(stats?.totalDonors).toBe(0)
    })
  })

  describe('并发处理', () => {
    it('应该正确处理并发捐赠创建', async () => {
      // 创建测试项目
      const [project] = await db.insert(donationProjects)
        .values({
          title: '测试项目',
          description: '测试描述',
          targetAmount: 100000
        })
        .returning()

      // 创建项目统计
      await db.insert(projectStats)
        .values({
          projectId: project.id,
          totalAmount: 0,
          totalDonors: 0
        })

      // 并发创建多个捐赠
      const donationPromises = Array.from({ length: 10 }, (_, i) =>
        createDonationWithStats({
          projectId: project.id,
          amount: 100,
          supporterName: `测试用户${i}`
        })
      )

      const results = await Promise.all(donationPromises)

      // 验证所有捐赠都创建成功
      expect(results).toHaveLength(10)
      results.forEach(result => {
        expect(result.donation.id).toBeDefined()
        expect(result.donation.amount).toBe(100)
      })

      // 验证统计数据正确更新
      const stats = await db.query.projectStats.findFirst({
        where: (projectStats, { eq }) => eq(projectStats.projectId, project.id)
      })

      expect(stats).toBeDefined()
      expect(stats?.totalAmount).toBe(1000) // 10 * 100
      expect(stats?.totalDonors).toBe(10)
    })
  })
})
```

## 🎨 组件测试策略

### 1. React组件测试

#### 捐赠表单组件测试
```typescript
// tests/components/DonationForm.test.tsx
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-hot-toast'
import DonationForm from '@/components/donation/DonationForm'

// Mock API客户端
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    createDonation: jest.fn(),
    createCreemOrder: jest.fn()
  }
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

// Mock window.location
const mockLocation = { href: '' }
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

describe('DonationForm', () => {
  const mockProjectId = 'test-project-id'
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该渲染表单字段', () => {
    render(<DonationForm projectId={mockProjectId} />)

    expect(screen.getByLabelText(/捐赠金额/)).toBeInTheDocument()
    expect(screen.getByLabelText(/您的姓名/)).toBeInTheDocument()
    expect(screen.getByLabelText(/邮箱地址/)).toBeInTheDocument()
    expect(screen.getByLabelText(/留言/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /立即捐赠/ })).toBeInTheDocument()
  })

  it('应该验证必填字段', async () => {
    render(<DonationForm projectId={mockProjectId} />)

    const submitButton = screen.getByRole('button', { name: /立即捐赠/ })
    await user.click(submitButton)

    expect(screen.getByText(/请输入捐赠金额/)).toBeInTheDocument()
    expect(screen.getByText(/请输入您的姓名/)).toBeInTheDocument()
  })

  it('应该验证金额格式', async () => {
    render(<DonationForm projectId={mockProjectId} />)

    const amountInput = screen.getByLabelText(/捐赠金额/)
    await user.type(amountInput, '-100')
    await user.tab() // 触发blur事件

    expect(screen.getByText(/金额必须大于0/)).toBeInTheDocument()
  })

  it('应该验证邮箱格式', async () => {
    render(<DonationForm projectId={mockProjectId} />)

    const emailInput = screen.getByLabelText(/邮箱地址/)
    await user.type(emailInput, 'invalid-email')
    await user.tab() // 触发blur事件

    expect(screen.getByText(/邮箱格式不正确/)).toBeInTheDocument()
  })

  it('应该在表单有效时提交捐赠', async () => {
    const { apiClient } = require('@/lib/api-client')
    apiClient.createDonation.mockResolvedValue({
      success: true,
      data: { id: 'donation-id', amount: 100 }
    })
    apiClient.createCreemOrder.mockResolvedValue({
      success: true,
      data: {
        orderId: 'creem-order-id',
        checkoutUrl: 'https://checkout.creem.io/pay/test'
      }
    })

    render(<DonationForm projectId={mockProjectId} />)

    // 填写表单
    await user.type(screen.getByLabelText(/捐赠金额/), '100')
    await user.type(screen.getByLabelText(/您的姓名/), '测试用户')
    await user.type(screen.getByLabelText(/邮箱地址/), 'test@example.com')
    await user.type(screen.getByLabelText(/留言/), '测试留言')

    // 提交表单
    const submitButton = screen.getByRole('button', { name: /立即捐赠/ })
    await user.click(submitButton)

    // 验证API调用
    await waitFor(() => {
      expect(apiClient.createDonation).toHaveBeenCalledWith({
        projectId: mockProjectId,
        amount: 100,
        supporterName: '测试用户',
        supporterEmail: 'test@example.com',
        message: '测试留言'
      })
    })

    await waitFor(() => {
      expect(apiClient.createCreemOrder).toHaveBeenCalledWith({
        donationId: 'donation-id',
        amount: 100,
        supporterName: '测试用户',
        supporterEmail: 'test@example.com',
        returnUrl: expect.stringContaining('/payment/success'),
        cancelUrl: expect.stringContaining('/payment/cancel')
      })
    })

    // 验证跳转到支付页面
    expect(mockLocation.href).toBe('https://checkout.creem.io/pay/test')
  })

  it('应该处理API错误', async () => {
    const { apiClient } = require('@/lib/api-client')
    apiClient.createDonation.mockRejectedValue(new Error('网络错误'))

    render(<DonationForm projectId={mockProjectId} />)

    // 填写表单
    await user.type(screen.getByLabelText(/捐赠金额/), '100')
    await user.type(screen.getByLabelText(/您的姓名/), '测试用户')

    // 提交表单
    const submitButton = screen.getByRole('button', { name: /立即捐赠/ })
    await user.click(submitButton)

    // 验证错误提示
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('网络错误')
    })
  })

  it('应该在提交时显示加载状态', async () => {
    const { apiClient } = require('@/lib/api-client')
    apiClient.createDonation.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<DonationForm projectId={mockProjectId} />)

    // 填写表单
    await user.type(screen.getByLabelText(/捐赠金额/), '100')
    await user.type(screen.getByLabelText(/您的姓名/), '测试用户')

    // 提交表单
    const submitButton = screen.getByRole('button', { name: /立即捐赠/ })
    await user.click(submitButton)

    // 验证加载状态
    expect(screen.getByRole('button', { name: /处理中/ })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()

    // 等待处理完成
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /立即捐赠/ })).toBeInTheDocument()
    })
  })
})
```

### 2. 页面组件测试

#### 首页测试
```typescript
// tests/pages/HomePage.test.tsx
import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock API客户端
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    getProjects: jest.fn(),
    getStats: jest.fn()
  }
}))

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该渲染首页主要内容', async () => {
    const { apiClient } = require('@/lib/api-client')
    apiClient.getProjects.mockResolvedValue({
      success: true,
      data: {
        projects: [
          {
            id: 'project-1',
            title: '测试项目',
            description: '测试描述',
            targetAmount: 100000,
            currentAmount: 50000,
            status: 'active'
          }
        ]
      }
    })
    apiClient.getStats.mockResolvedValue({
      success: true,
      data: {
        totalAmount: 1000000,
        totalDonors: 5000,
        activeProjects: 3
      }
    })

    render(<HomePage />)

    // 验证主要标题
    expect(screen.getByText(/可可西里网红狼公益网站/)).toBeInTheDocument()
    expect(screen.getByText(/科学保护野生动物，维护生态平衡/)).toBeInTheDocument()

    // 验证统计数据（异步加载）
    await screen.findByText(/¥1,000,000/)
    await screen.findByText(/5,000/)
    await screen.findByText(/3/)

    // 验证项目列表
    await screen.findByText('测试项目')
    await screen.findByText('测试描述')
  })

  it('应该处理API错误', async () => {
    const { apiClient } = require('@/lib/api-client')
    apiClient.getProjects.mockRejectedValue(new Error('网络错误'))
    apiClient.getStats.mockRejectedValue(new Error('网络错误'))

    render(<HomePage />)

    // 验证错误状态
    await screen.findByText(/加载失败/)
  })
})
```

## 🌐 E2E测试策略

### 1. 完整捐赠流程测试

#### Playwright E2E测试示例
```typescript
// tests/e2e/donation-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('完整捐赠流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('用户应该能够完成完整捐赠流程', async ({ page }) => {
    // 1. 选择项目
    await page.click('[data-testid="project-card"]')

    // 2. 填写捐赠表单
    await page.fill('[data-testid="amount-input"]', '100')
    await page.fill('[data-testid="name-input"]', '测试用户')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="message-input"]', '测试留言')

    // 3. 提交捐赠
    await page.click('[data-testid="donate-button"]')

    // 4. 验证跳转到支付页面
    await expect(page).toHaveURL(/checkout/)
    await expect(page.locator('[data-testid="payment-form"]')).toBeVisible()

    // 5. 模拟支付成功（在测试环境中）
    await page.click('[data-testid="mock-payment-success"]')

    // 6. 验证跳转到成功页面
    await expect(page).toHaveURL(/payment\/success/)
    await expect(page.locator('[data-testid="success-message"]')).toContainText('捐赠成功')

    // 7. 验证显示捐赠详情
    await expect(page.locator('[data-testid="donation-amount"]')).toContainText('¥100')
    await expect(page.locator('[data-testid="donor-name"]')).toContainText('测试用户')
  })

  test('应该显示表单验证错误', async ({ page }) => {
    // 选择项目
    await page.click('[data-testid="project-card"]')

    // 提交空表单
    await page.click('[data-testid="donate-button"]')

    // 验证错误消息
    await expect(page.locator('[data-testid="amount-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible()
  })

  test('应该处理支付失败情况', async ({ page }) => {
    // 填写捐赠表单
    await page.click('[data-testid="project-card"]')
    await page.fill('[data-testid="amount-input"]', '100')
    await page.fill('[data-testid="name-input"]', '测试用户')
    await page.click('[data-testid="donate-button"]')

    // 模拟支付失败
    await page.click('[data-testid="mock-payment-failed"]')

    // 验证跳转到失败页面
    await expect(page).toHaveURL(/payment\/failed/)
    await expect(page.locator('[data-testid="error-message"]')).toContainText('支付失败')
  })
})
```

### 2. 响应式设计测试

```typescript
// tests/e2e/responsive.spec.ts
import { devices, test, expect } from '@playwright/test'

const deviceSizes = [
  { name: 'Desktop', device: devices['Desktop Chrome'] },
  { name: 'Tablet', device: devices['iPad Pro'] },
  { name: 'Mobile', device: devices['iPhone 13'] }
]

deviceSizes.forEach(({ name, device }) => {
  test.describe(`${name} 响应式测试`, () => {
    test.use({ ...device })

    test('网站应该在所有设备上正常显示', async ({ page }) => {
      await page.goto('/')

      // 验证主要元素可见
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-testid="project-grid"]')).toBeVisible()
      await expect(page.locator('nav')).toBeVisible()

      // 移动端特有测试
      if (device.isMobile) {
        await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()

        // 测试移动端菜单
        await page.click('[data-testid="mobile-menu-button"]')
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
      }
    })

    test('捐赠表单应该在小屏幕上可用', async ({ page }) => {
      await page.goto('/')
      await page.click('[data-testid="project-card"]')

      // 验证表单字段可见和可交互
      await expect(page.locator('[data-testid="amount-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="name-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="donate-button"]')).toBeVisible()

      // 测试表单提交
      await page.fill('[data-testid="amount-input"]', '100')
      await page.fill('[data-testid="name-input"]', '测试用户')
      await page.click('[data-testid="donate-button"]')

      // 验证能够进入支付流程
      await expect(page).toHaveURL(/checkout/)
    })
  })
})
```

## 📊 性能测试策略

### 1. 负载测试配置

```typescript
// tests/performance/load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // 2分钟内增加到100用户
    { duration: '5m', target: 100 }, // 保持100用户5分钟
    { duration: '2m', target: 200 }, // 2分钟内增加到200用户
    { duration: '5m', target: 200 }, // 保持200用户5分钟
    { duration: '2m', target: 0 },   // 2分钟内减少到0用户
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95%的请求在500ms内完成
    http_req_failed: ['rate<0.1'],     // 错误率小于10%
    errors: ['rate<0.1'],              // 自定义错误率小于10%
  },
}

export default function () {
  const response = http.get('https://your-domain.com/api/v1/projects')

  const result = check(response, {
    '状态码是200': (r) => r.status === 200,
    '响应时间小于500ms': (r) => r.timings.duration < 500,
    '返回数据格式正确': (r) => {
      try {
        JSON.parse(r.body)
        return true
      } catch (e) {
        return false
      }
    },
  })

  errorRate.add(!result)

  sleep(1)
}
```

### 2. 前端性能测试

```typescript
// tests/performance/web-vitals.js
const { chromium } = require('playwright')

async function measureWebVitals() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // 启用性能监控
  await page.coverage.startJSCoverage()
  await page.coverage.startCSSCoverage()

  // 监听 Core Web Vitals
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {}

      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        vitals.lcp = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          vitals.fid = entry.processingStart - entry.startTime
        })
      }).observe({ entryTypes: ['first-input'] })

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        vitals.cls = clsValue
      }).observe({ entryTypes: ['layout-shift'] })

      // 等待一段时间收集指标
      setTimeout(() => resolve(vitals), 5000)
    })
  })

  // 导航到页面
  const startTime = Date.now()
  await page.goto('https://your-domain.com')
  const loadTime = Date.now() - startTime

  // 停止覆盖率收集
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ])

  await browser.close()

  return {
    loadTime,
    vitals: metrics,
    coverage: {
      js: jsCoverage,
      css: cssCoverage,
    },
  }
}

// 性能基准
const performanceThresholds = {
  loadTime: 3000,        // 页面加载时间 < 3秒
  lcp: 2500,            // LCP < 2.5秒
  fid: 100,             // FID < 100ms
  cls: 0.1,             // CLS < 0.1
  jsCoverage: 80,       // JS使用率 > 80%
  cssCoverage: 90,      // CSS使用率 > 90%
}

async function runPerformanceTest() {
  const results = await measureWebVitals()

  console.log('性能测试结果:')
  console.log(`页面加载时间: ${results.loadTime}ms`)
  console.log(`LCP: ${results.vitals.lcp}ms`)
  console.log(`FID: ${results.vitals.fid}ms`)
  console.log(`CLS: ${results.vitals.cls}`)

  // 计算覆盖率
  const totalJSSize = results.coverage.js.reduce((sum, entry) => sum + entry.text.length, 0)
  const usedJSSize = results.coverage.js.reduce((sum, entry) =>
    sum + entry.ranges.reduce((rangeSum, range) => rangeSum + range.end - range.start, 0), 0)
  const jsUsageRate = (usedJSSize / totalJSSize * 100).toFixed(2)

  console.log(`JS使用率: ${jsUsageRate}%`)

  // 验证性能阈值
  const checks = [
    { name: '页面加载时间', value: results.loadTime, threshold: performanceThresholds.loadTime },
    { name: 'LCP', value: results.vitals.lcp, threshold: performanceThresholds.lcp },
    { name: 'FID', value: results.vitals.fid, threshold: performanceThresholds.fid },
    { name: 'CLS', value: results.vitals.cls, threshold: performanceThresholds.cls },
    { name: 'JS使用率', value: parseFloat(jsUsageRate), threshold: performanceThresholds.jsCoverage, isPercentage: true },
  ]

  let allPassed = true
  checks.forEach(check => {
    const passed = check.isPercentage ? check.value >= check.threshold : check.value <= check.threshold
    console.log(`${check.name}: ${passed ? '✅' : '❌'} ${check.value}${check.isPercentage ? '%' : 'ms'} (阈值: ${check.threshold}${check.isPercentage ? '%' : 'ms'})`)
    if (!passed) allPassed = false
  })

  if (allPassed) {
    console.log('🎉 所有性能测试通过!')
  } else {
    console.log('⚠️ 部分性能测试未通过，需要优化')
  }

  return allPassed
}

module.exports = { runPerformanceTest, performanceThresholds }
```

## 🔧 测试工具配置

### 1. Jest配置文件

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/src/**/*.test.ts'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
  verbose: true,
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-results', outputName: 'junit.xml' }],
    ['jest-html-reporters', { publicPath: 'test-results', filename: 'report.html' }]
  ]
}
```

### 2. 测试设置文件

```typescript
// tests/setup.ts
import { config } from 'dotenv'
import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals'

// 加载测试环境变量
config({ path: '.env.test' })

// 设置测试超时
jest.setTimeout(30000)

// Mock fetch API
global.fetch = jest.fn()

// Mock console方法减少噪音
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// 测试数据库设置
beforeAll(async () => {
  // 初始化测试数据库
  console.log('🗄️ 初始化测试数据库...')
})

afterAll(async () => {
  // 清理测试数据库
  console.log('🧹 清理测试数据库...')
})

beforeEach(async () => {
  // 清理Mock
  jest.clearAllMocks()
})

afterEach(async () => {
  // 每个测试后的清理
})
```

### 3. 测试脚本配置

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:performance": "node tests/performance/load-test.js",
    "test:web-vitals": "node tests/performance/web-vitals.js"
  }
}
```

## 📋 测试检查清单

### 开发阶段检查清单
- [ ] 新功能有对应的单元测试
- [ ] 测试覆盖率达到要求
- [ ] 所有测试都能通过
- [ ] 边界条件已测试
- [ ] 错误处理已测试

### 代码提交前检查清单
- [ ] 运行完整测试套件
- [ ] 检查测试覆盖率
- [ ] 确认没有测试回退
- [ ] 验证集成测试通过
- [ ] 检查性能指标

### 发布前检查清单
- [ ] 运行所有测试类型
- [ ] 执行E2E测试
- [ ] 进行性能测试
- [ ] 完成安全测试
- [ ] 验证生产环境测试

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队