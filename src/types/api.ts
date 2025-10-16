/**
 * API相关的TypeScript类型定义
 * 提供类型安全和代码提示
 */

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API响应基础类型
export interface BaseApiResponse {
  success: boolean
  timestamp: string
}

// 成功响应类型
export interface SuccessApiResponse<T = any> extends BaseApiResponse {
  success: true
  data: T
  message?: string
}

// 错误响应类型
export interface ErrorApiResponse extends BaseApiResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
}

// 通用API响应类型
export type ApiResponse<T = any> = SuccessApiResponse<T> | ErrorApiResponse

// API参数类型
export interface ApiParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required?: boolean
  description: string
  default?: any
  example?: any
}

// API端点类型
export interface ApiEndpoint {
  method: HttpMethod
  path: string
  summary: string
  description: string
  group: string
  testable: boolean
  authRequired: boolean
  params?: ApiParameter[]
  exampleBody?: Record<string, any>
}

// 测试结果状态
export interface TestResultLoading {
  loading: true
}

export interface TestResultSuccess {
  loading: false
  success: true
  status: number
  statusText: string
  data: any
  headers: Record<string, string>
}

export interface TestResultError {
  loading: false
  success: false
  status?: number
  statusText?: string
  error: string
}

export type TestResult = TestResultLoading | TestResultSuccess | TestResultError

// 用户类型
export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: 'user' | 'admin'
  emailVerified: boolean
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

// 项目类型
export interface Project {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  targetAmount: number
  currentAmount: number
  donorCount: number
  status: 'active' | 'completed' | 'cancelled' | 'paused'
  featured: boolean
  categoryId?: string
  organizerName?: string
  organizerDescription?: string
  featuredImage?: string
  images?: string[]
  location?: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

// 捐赠类型
export interface Donation {
  id: string
  projectId: string
  userId?: string
  supporterName?: string
  supporterEmail?: string
  amount: number
  message?: string
  isAnonymous: boolean
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod?: string
  paymentId?: string
  paymentGateway?: string
  transactionId?: string
  createdAt: string
}

// 分类类型
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}

// 文件类型
export interface File {
  id: string
  originalName: string
  fileName: string
  filePath: string
  fileUrl: string
  fileSize: number
  mimeType?: string
  category: 'project-image' | 'user-avatar' | 'document' | 'general'
  uploadedBy?: string
  isPublic: boolean
  createdAt: string
}

// 项目更新类型
export interface ProjectUpdate {
  id: string
  projectId: string
  title: string
  content?: string
  images?: string[]
  isPublic: boolean
  createdBy?: string
  createdAt: string
}

// 分页类型
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

// 系统健康检查类型
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  services: Record<string, {
    status: 'healthy' | 'unhealthy'
    responseTime: number
    timestamp: string
  }>
  metrics?: {
    cpu?: { usage: number }
    memory?: { usage: number }
    disk?: { usage: number }
    uptime?: number
  }
  responseTime?: number
  timestamp: string
}

// 创建项目请求类型
export interface CreateProjectRequest {
  title: string
  description?: string
  content?: string
  targetAmount: number
  category: string
  startDate?: string
  endDate?: string
  images?: string[]
}

// 创建捐赠请求类型
export interface CreateDonationRequest {
  projectId: string
  amount: number
  message?: string
  isAnonymous?: boolean
  paymentMethod?: string
}

// 查询参数类型
export interface ProjectQueryParams {
  page?: number
  limit?: number
  status?: string
  category?: string
  search?: string
  featured?: boolean
}

export interface DonationQueryParams {
  projectId?: string
  userId?: string
  status?: string
  page?: number
  limit?: number
}

// API错误代码类型
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'PAYMENT_FAILED'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'

// API错误类
export class ApiError extends Error {
  public readonly code: ApiErrorCode
  public readonly details?: Record<string, any>

  constructor(code: ApiErrorCode, message: string, details?: Record<string, any>) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details
    }
  }
}