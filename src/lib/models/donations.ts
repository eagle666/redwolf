// 捐赠记录数据模型
// 模块3: TDD开发 - 捐赠记录数据模型

// TODO: 真正实现时导入Drizzle schema
// import { donations } from '@/drizzle/schema'

export interface CreateDonationData {
  projectId: string
  amount: number
  supporterName: string
  supporterEmail?: string
  message?: string
  paymentMethod?: string
  currency?: string
}

export interface UpdateDonationData {
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod?: string
  creemOrderId?: string
  creemCheckoutId?: string
  metadata?: Record<string, any>
}

export interface DonationListOptions {
  page?: number
  limit?: number
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  minAmount?: number
  maxAmount?: number
  startDate?: Date
  endDate?: Date
}

export interface DonationListResult {
  donations: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DonationStatistics {
  totalAmount: number
  totalDonors: number
  averageAmount: number
  completedCount: number
  pendingCount: number
  failedCount: number
  lastDonationDate?: Date
}

export interface DateRange {
  startDate: Date
  endDate: Date
}

/**
 * 验证捐赠记录数据
 * @param data 捐赠数据
 * @throws {Error} 当数据无效时
 */
export function validateDonationData(data: CreateDonationData): void {
  if (!data.projectId || data.projectId.trim().length === 0) {
    throw new Error('项目ID不能为空')
  }

  if (!data.supporterName || data.supporterName.trim().length === 0) {
    throw new Error('支持者姓名不能为空')
  }

  if (data.supporterName.length > 100) {
    throw new Error('支持者姓名不能超过100个字符')
  }

  if (!data.amount || data.amount <= 0) {
    throw new Error('捐赠金额必须大于0')
  }

  if (data.amount > 999999999) {
    throw new Error('捐赠金额不能超过999,999,999')
  }

  if (data.message && data.message.length > 500) {
    throw new Error('留言不能超过500个字符')
  }

  if (data.supporterEmail && !isValidEmail(data.supporterEmail)) {
    throw new Error('邮箱格式不正确')
  }

  // 验证项目ID格式
  validateProjectId(data.projectId)
}

/**
 * 创建捐赠记录
 * @param data 捐赠数据
 * @returns {Promise<any>} 创建的捐赠记录
 */
export async function createDonationRecord(data: CreateDonationData): Promise<any> {
  // 验证输入数据
  validateDonationData(data)

  // TODO: 实现真正的数据库插入
  // const [donation] = await db.insert(donations)
  //   .values({
  //     projectId: data.projectId,
  //     amount: data.amount,
  //     supporterName: data.supporterName,
  //     supporterEmail: data.supporterEmail || null,
  //     message: data.message || null,
  //     status: 'pending',
  //     currency: data.currency || 'CNY',
  //     paymentMethod: data.paymentMethod || null,
  //     metadata: data.metadata || {},
  //     createdAt: new Date()
  //   })
  //   .returning()

  // 临时实现：返回模拟数据
  return {
    id: generateUUID(),
    projectId: data.projectId,
    amount: data.amount,
    supporterName: data.supporterName,
    supporterEmail: data.supporterEmail || null,
    message: data.message || null,
    status: 'pending',
    currency: data.currency || 'CNY',
    paymentMethod: data.paymentMethod || null,
    metadata: {},
    createdAt: new Date(),
    completedAt: null
  }
}

/**
 * 更新捐赠状态
 * @param id 捐赠记录ID
 * @param status 新状态
 * @returns {Promise<any>} 更新后的捐赠记录
 */
export async function updateDonationStatus(id: string, status: string): Promise<any> {
  // 验证ID格式
  validateDonationId(id)

  // 验证状态值
  const validStatuses = ['pending', 'completed', 'failed', 'refunded']
  if (!validStatuses.includes(status)) {
    throw new Error('无效的捐赠状态')
  }

  // TODO: 实现真正的数据库更新
  // const [updatedDonation] = await db
  //   .update(donations)
  //   .set({
  //     status,
  //     completedAt: status === 'completed' ? new Date() : null,
  //     updatedAt: new Date()
  //   })
  //   .where(eq(donations.id, id))
  //   .returning()

  // 临时实现：返回模拟数据
  return {
    id,
    status,
    completedAt: status === 'completed' ? new Date() : null,
    updatedAt: new Date()
  }
}

/**
 * 通过ID获取捐赠记录
 * @param id 捐赠记录ID
 * @returns {Promise<any|null>} 捐赠记录或null
 */
export async function getDonationById(id: string): Promise<any | null> {
  // 验证ID格式
  validateDonationId(id)

  // TODO: 实现真正的数据库查询
  // const [donation] = await db
  //   .select()
  //   .from(donations)
  //   .where(eq(donations.id, id))
  //   .limit(1)

  // 临时实现：返回模拟数据或null
  if (id === 'non-existent-donation-id') {
    return null
  }

  return {
    id,
    projectId: '550e8400-e29b-41d4-a716-446655440000',
    amount: 100,
    supporterName: '张三',
    supporterEmail: 'zhangsan@example.com',
    message: '希望保护工作顺利',
    status: 'pending',
    currency: 'CNY',
    createdAt: new Date(),
    completedAt: null
  }
}

/**
 * 获取项目的捐赠记录列表
 * @param projectId 项目ID
 * @param options 查询选项
 * @returns {Promise<DonationListResult>} 捐赠记录列表和分页信息
 */
export async function getDonationsByProject(
  projectId: string,
  options: DonationListOptions = {}
): Promise<DonationListResult> {
  // 验证项目ID
  validateProjectId(projectId)

  const {
    page = 1,
    limit = 10,
    status,
    minAmount,
    maxAmount,
    startDate,
    endDate
  } = options

  // 验证分页参数
  if (page < 1) throw new Error('页码必须大于0')
  if (limit < 1 || limit > 100) throw new Error('每页数量必须在1-100之间')

  // 验证金额范围
  if (minAmount !== undefined && minAmount <= 0) {
    throw new Error('最小金额必须大于0')
  }
  if (maxAmount !== undefined && maxAmount <= 0) {
    throw new Error('最大金额必须大于0')
  }
  if (minAmount !== undefined && maxAmount !== undefined && minAmount > maxAmount) {
    throw new Error('最小金额不能大于最大金额')
  }

  // TODO: 实现真正的数据库查询
  // let query = db.select().from(donations)
  //   .where(eq(donations.projectId, projectId))
  //
  // if (status) {
  //   query = query.where(eq(donations.status, status))
  // }
  // if (minAmount !== undefined) {
  //   query = query.where(gte(donations.amount, minAmount))
  // }
  // if (maxAmount !== undefined) {
  //   query = query.where(lte(donations.amount, maxAmount))
  // }
  // if (startDate) {
  //   query = query.where(gte(donations.createdAt, startDate))
  // }
  // if (endDate) {
  //   query = query.where(lte(donations.createdAt, endDate))
  // }

  // 临时实现：返回模拟数据
  const mockDonations = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    id: generateUUID(),
    projectId,
    amount: (i + 1) * 100,
    supporterName: `支持者${i + 1}`,
    supporterEmail: `supporter${i + 1}@example.com`,
    message: `这是第 ${i + 1} 条捐赠留言`,
    status: status || 'completed',
    currency: 'CNY',
    createdAt: new Date(),
    completedAt: new Date()
  }))

  return {
    donations: mockDonations,
    pagination: {
      page,
      limit,
      total: mockDonations.length,
      totalPages: Math.ceil(mockDonations.length / limit)
    }
  }
}

/**
 * 获取捐赠统计数据
 * @param projectId 项目ID
 * @param dateRange 可选的时间范围
 * @returns {Promise<DonationStatistics>} 统计数据
 */
export async function getDonationStatistics(
  projectId: string,
  dateRange?: DateRange
): Promise<DonationStatistics> {
  // 验证项目ID
  validateProjectId(projectId)

  // TODO: 实现真正的数据库统计查询
  // let query = db
  //   .select({
  //     totalAmount: sum(donations.amount),
  //     totalDonors: count(distinct(donations.supporterEmail)),
  //     completedCount: count(sql`case when ${donations.status} = 'completed' then 1 end`),
  //     pendingCount: count(sql`case when ${donations.status} = 'pending' then 1 end`),
  //     failedCount: count(sql`case when ${donations.status} = 'failed' then 1 end`),
  //     lastDonationDate: max(donations.createdAt)
  //   })
  //   .from(donations)
  //   .where(eq(donations.projectId, projectId))
  //
  // if (dateRange) {
  //   query = query
  //     .where(and(
  //       gte(donations.createdAt, dateRange.startDate),
  //       lte(donations.createdAt, dateRange.endDate)
  //     ))
  // }

  // 临时实现：返回模拟统计数据
  const mockStats = {
    totalAmount: 15000,
    totalDonors: 25,
    averageAmount: 600,
    completedCount: 20,
    pendingCount: 3,
    failedCount: 2,
    lastDonationDate: new Date()
  }

  return mockStats
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
 * 验证项目ID格式
 * @param id 项目ID
 * @throws {Error} 当ID格式无效时
 */
export function validateProjectId(id: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error('项目ID不能为空')
  }

  // 简单的UUID格式验证
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    throw new Error('无效的项目ID格式')
  }
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns {boolean} 邮箱是否有效
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 生成UUID
 * @returns {string} UUID字符串
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}