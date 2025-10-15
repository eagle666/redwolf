# TDD开发方法论文档

## 🎯 开发方法论概述

本文档记录了可可西里网红狼公益网站的TDD（测试驱动开发）开发方法，确保开发过程系统化、可追溯，避免遗忘开发计划。

### 核心开发原则

🔴 **测试优先**: 先写测试，再写代码
🟢 **小步快跑**: 每次只开发一个功能模块
🔵 **持续重构**: 保持代码简洁和可维护性
⚡ **快速反馈**: 立即测试，立即验证

## 📋 开发策略：后端优先，前端集成

### 第一阶段：后端API开发
1. **API接口设计** → **测试用例编写** → **功能实现** → **测试验证**
2. **数据库操作** → **事务测试** → **数据验证** → **性能测试**
3. **支付集成** → **Webhook测试** → **错误处理** → **安全测试**

### 第二阶段：前端UI开发
1. **组件设计** → **单元测试** → **集成测试** → **用户测试**
2. **API集成** → **Mock测试** → **真实API测试** → **错误处理测试**
3. **用户流程** → **端到端测试** → **性能优化** → **用户体验优化**

## 🔧 TDD开发流程

### Red-Green-Refactor 循环

```typescript
// 1. RED: 先写失败的测试
test('应该能够创建捐赠记录', async () => {
  const donationData = {
    amount: 100,
    supporterName: '测试用户',
    supporterEmail: 'test@example.com'
  }

  const result = await createDonation(donationData)

  expect(result.success).toBe(true)
  expect(result.data.id).toBeDefined()
})

// 2. GREEN: 写最简单的代码让测试通过
export async function createDonation(data: DonationData) {
  const id = generateId()
  return { success: true, data: { id, ...data } }
}

// 3. REFACTOR: 重构代码，保持测试通过
export async function createDonation(data: DonationData) {
  const validatedData = DonationSchema.parse(data)
  const result = await db.insert(donations).values(validatedData).returning()

  return {
    success: true,
    data: result[0]
  }
}
```

## 📊 后端开发任务清单（10个核心模块）

### 模块1: 数据库连接和基础配置
**测试优先级**: 🔴 高
**预计时间**: 1-2小时

#### 测试用例
```typescript
// __tests__/db/connection.test.ts
describe('数据库连接测试', () => {
  test('应该能够连接到数据库', async () => {
    const db = createDatabaseConnection()
    expect(db).toBeDefined()
  })

  test('应该能够执行基础查询', async () => {
    const result = await db.select().from(donationProjects).limit(1)
    expect(Array.isArray(result)).toBe(true)
  })
})
```

#### 实现检查点
- [ ] Supabase客户端配置
- [ ] Drizzle ORM集成
- [ ] 环境变量验证
- [ ] 连接池配置
- [ ] 错误处理机制

### 模块2: 捐赠项目数据模型
**测试优先级**: 🔴 高
**预计时间**: 2-3小时

#### 测试用例
```typescript
// __tests__/models/projects.test.ts
describe('捐赠项目模型测试', () => {
  test('应该能够创建捐赠项目', async () => {
    const projectData = {
      title: '测试项目',
      description: '测试描述',
      targetAmount: 100000
    }

    const project = await createDonationProject(projectData)
    expect(project.id).toBeDefined()
    expect(project.title).toBe(projectData.title)
  })

  test('应该能够查询项目列表', async () => {
    const projects = await getDonationProjects()
    expect(projects.length).toBeGreaterThan(0)
  })
})
```

#### 实现检查点
- [ ] Drizzle Schema定义
- [ ] 数据库迁移文件
- [ ] CRUD操作函数
- [ ] 数据验证规则
- [ ] 错误处理

### 模块3: 捐赠记录数据模型
**测试优先级**: 🔴 高
**预计时间**: 2-3小时

#### 测试用例
```typescript
// __tests__/models/donations.test.ts
describe('捐赠记录模型测试', () => {
  test('应该能够创建捐赠记录', async () => {
    const donationData = {
      projectId: 'test-project-id',
      amount: 100,
      supporterName: '测试用户',
      supporterEmail: 'test@example.com'
    }

    const donation = await createDonationRecord(donationData)
    expect(donation.id).toBeDefined()
    expect(donation.status).toBe('pending')
  })

  test('应该能够更新捐赠状态', async () => {
    const donation = await updateDonationStatus('test-id', 'completed')
    expect(donation.status).toBe('completed')
    expect(donation.completedAt).toBeDefined()
  })
})
```

#### 实现检查点
- [ ] 捐赠记录Schema
- [ ] 状态管理逻辑
- [ ] 事务处理
- [ ] 数据关联
- [ ] 统计计算

### 模块4: Creem支付API集成
**测试优先级**: 🔴 高
**预计时间**: 3-4小时

#### 测试用例
```typescript
// __tests__/api/creem.test.ts
describe('Creem支付API测试', () => {
  test('应该能够创建支付订单', async () => {
    const orderData = {
      amount: 100,
      supporterName: '测试用户',
      supporterEmail: 'test@example.com'
    }

    const result = await createCreemOrder(orderData)
    expect(result.checkoutUrl).toBeDefined()
    expect(result.orderId).toBeDefined()
  })

  test('应该能够处理支付失败', async () => {
    const invalidData = { amount: -100 }
    await expect(createCreemOrder(invalidData)).rejects.toThrow()
  })
})
```

#### 实现检查点
- [ ] Creem API客户端
- [ ] 订单创建逻辑
- [ ] 错误处理
- [ ] 签名验证
- [ ] 超时处理

### 模块5: Webhook处理系统
**测试优先级**: 🔴 高
**预计时间**: 2-3小时

#### 测试用例
```typescript
// __tests__/api/webhook.test.ts
describe('Webhook处理测试', () => {
  test('应该能够验证webhook签名', async () => {
    const payload = { status: 'completed', orderId: 'test-id' }
    const signature = generateWebhookSignature(payload)

    const isValid = await verifyWebhookSignature(payload, signature)
    expect(isValid).toBe(true)
  })

  test('应该能够处理支付成功webhook', async () => {
    const webhookData = {
      order_id: 'test-order-id',
      status: 'paid',
      amount: 100
    }

    const result = await handleCreemWebhook(webhookData)
    expect(result.success).toBe(true)
  })
})
```

#### 实现检查点
- [ ] Webhook接收端点
- [ ] 签名验证机制
- [ ] 事件分发逻辑
- [ ] 错误日志记录
- [ ] 幂等性处理

### 模块6: 邮件通知系统
**测试优先级**: 🟡 中
**预计时间**: 2小时

#### 测试用例
```typescript
// __tests__/services/email.test.ts
describe('邮件通知测试', () => {
  test('应该能够发送捐赠成功邮件', async () => {
    const emailData = {
      to: 'test@example.com',
      supporterName: '测试用户',
      amount: 100,
      projectName: '测试项目'
    }

    const result = await sendDonationSuccessEmail(emailData)
    expect(result.success).toBe(true)
  })
})
```

#### 实现检查点
- [ ] Resend API集成
- [ ] 邮件模板系统
- [ ] 队列处理机制
- [ ] 发送状态跟踪
- [ ] 失败重试逻辑

### 模块7: 统计数据服务
**测试优先级**: 🟡 中
**预计时间**: 1-2小时

#### 测试用例
```typescript
// __tests__/services/stats.test.ts
describe('统计数据测试', () => {
  test('应该能够计算项目总捐赠额', async () => {
    const stats = await calculateProjectStats('test-project-id')
    expect(stats.totalAmount).toBeGreaterThanOrEqual(0)
    expect(stats.totalDonors).toBeGreaterThanOrEqual(0)
  })
})
```

#### 实现检查点
- [ ] 统计计算逻辑
- [ ] 缓存机制
- [ ] 实时更新
- [ ] 数据聚合
- [ ] 性能优化

### 模块8: API输入验证
**测试优先级**: 🔴 高
**预计时间**: 1-2小时

#### 测试用例
```typescript
// __tests__/validation/schemas.test.ts
describe('输入验证测试', () => {
  test('应该验证捐赠数据格式', () => {
    const validData = {
      amount: 100,
      supporterName: '测试用户',
      supporterEmail: 'test@example.com'
    }

    expect(() => DonationSchema.parse(validData)).not.toThrow()

    const invalidData = { amount: -100 }
    expect(() => DonationSchema.parse(invalidData)).toThrow()
  })
})
```

#### 实现检查点
- [ ] Zod Schema定义
- [ ] 错误消息本地化
- [ ] 自定义验证规则
- [ ] 类型安全
- [ ] 文档生成

### 模块9: API路由端点
**测试优先级**: 🔴 高
**预计时间**: 2-3小时

#### 测试用例
```typescript
// __tests__/routes/donations.test.ts
describe('捐赠API路由测试', () => {
  test('POST /api/donations 应该创建捐赠记录', async () => {
    const response = await app.request('/api/donations', {
      method: 'POST',
      body: JSON.stringify({
        amount: 100,
        supporterName: '测试用户'
      })
    })

    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.success).toBe(true)
  })
})
```

#### 实现检查点
- [ ] RESTful API设计
- [ ] 请求/响应格式
- [ ] 错误处理统一化
- [ ] 限流机制
- [ ] API文档

### 模块10: 错误处理和日志系统
**测试优先级**: 🟡 中
**预计时间**: 1-2小时

#### 测试用例
```typescript
// __tests__/errors/handling.test.ts
describe('错误处理测试', () => {
  test('应该正确处理数据库错误', async () => {
    const invalidData = { projectId: 'invalid-id' }

    await expect(createDonationRecord(invalidData))
      .rejects.toThrow(DatabaseError)
  })
})
```

#### 实现检查点
- [ ] 统一错误处理
- [ ] 日志记录系统
- [ ] 错误分类
- [ ] 用户友好提示
- [ ] 监控集成

## 🎨 前端开发任务清单

### 阶段1: 基础UI组件
- [ ] 捐赠表单组件
- [ ] 项目展示组件
- [ ] 支付状态组件
- [ ] 错误提示组件

### 阶段2: 页面集成
- [ ] 首页开发
- [ ] 捐赠页面开发
- [ ] 关于页面开发
- [ ] 支付结果页面

### 阶段3: API集成
- [ ] 捐赠API集成
- [ ] 支付API集成
- [ ] 实时状态更新
- [ ] 错误处理

## 🧪 测试策略

### 单元测试
- 每个函数都有对应的测试用例
- 覆盖率目标：80%+
- 使用Jest + Testing Library

### 集成测试
- API端点测试
- 数据库操作测试
- 第三方服务集成测试

### 端到端测试
- 用户完整捐赠流程
- 支付成功/失败场景
- 跨浏览器兼容性

## 📝 开发记录模板

### 每日开发记录
```markdown
## 日期: 2024-01-XX
### 今日任务
- [x] 完成模块X的测试用例编写
- [x] 实现模块X的核心功能
- [ ] 修复测试失败问题

### 遇到的问题
1. 问题描述
2. 解决方案
3. 学到的经验

### 明日计划
- [ ] 完成模块Y的测试用例
- [ ] 开始模块Y的开发
```

### 模块完成记录
```markdown
## 模块完成: [模块名称]
### 完成时间: 2024-01-XX
### 测试覆盖率: XX%
### 已实现功能:
- [x] 功能1
- [x] 功能2
### 待优化项目:
- [ ] 优化项1
- [ ] 优化项2
```

## 🔍 质量检查清单

### 代码质量
- [ ] 所有测试通过
- [ ] 代码覆盖率达标
- [ ] TypeScript类型检查通过
- [ ] ESLint检查通过
- [ ] 代码已格式化

### 功能质量
- [ ] 核心功能正常工作
- [ ] 错误处理完善
- [ ] 性能满足要求
- [ ] 安全性检查通过

### 文档质量
- [ ] API文档已更新
- [ ] 代码注释充分
- [ ] 变更记录已添加
- [ ] 使用示例已提供

## 🚀 部署检查清单

### 预部署检查
- [ ] 所有测试通过
- [ ] 环境变量已配置
- [ ] 数据库迁移已完成
- [ ] 第三方服务已配置
- [ ] 性能测试通过

### 部署后验证
- [ ] 网站正常访问
- [ ] API功能正常
- [ ] 支付功能正常
- [ ] 监控系统正常
- [ ] 备份策略已启用

## 📋 进度跟踪

### 开发进度表
| 模块 | 状态 | 完成日期 | 测试覆盖率 | 备注 |
|------|------|----------|------------|------|
| 数据库连接 | ✅ | 2024-01-XX | 95% | 已完成 |
| 捐赠项目模型 | 🔄 | 进行中 | 80% | 开发中 |
| 捐赠记录模型 | ⏳ | 待开始 | 0% | - |
| ... | ... | ... | ... | ... |

### 里程碑目标
- [ ] **MVP版本** (2周): 基础捐赠功能
- [ ] **Beta版本** (4周): 完整功能集
- [ ] **正式版本** (6周): 性能优化和用户体验完善

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队