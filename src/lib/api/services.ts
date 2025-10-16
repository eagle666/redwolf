/**
 * API服务层
 * 封装具体的API调用
 */

import { apiClient } from './client'
import type {
  ApiResponse,
  Project,
  ProjectQueryParams,
  PaginatedResponse,
  SystemHealth,
  Category
} from '@/types/api'

// 项目服务
export class ProjectService {
  /**
   * 获取项目列表
   */
  static async getProjects(params?: ProjectQueryParams): Promise<ApiResponse<PaginatedResponse<Project>>> {
    return apiClient.get<PaginatedResponse<Project>>('/projects', params)
  }

  /**
   * 获取单个项目
   */
  static async getProject(id: string): Promise<ApiResponse<Project>> {
    return apiClient.get<Project>(`/projects/${id}`)
  }

  /**
   * 创建项目
   */
  static async createProject(data: {
    title: string
    description?: string
    targetAmount: number
    category: string
  }): Promise<ApiResponse<Project>> {
    return apiClient.post<Project>('/projects', data)
  }

  /**
   * 更新项目
   */
  static async updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    return apiClient.put<Project>(`/projects/${id}`, data)
  }

  /**
   * 删除项目
   */
  static async deleteProject(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/projects/${id}`)
  }
}

// 捐赠服务
export class DonationService {
  /**
   * 获取捐赠记录
   */
  static async getDonations(params?: {
    projectId?: string
    userId?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    return apiClient.get<PaginatedResponse<any>>('/donations', params)
  }

  /**
   * 创建捐赠
   */
  static async createDonation(data: {
    projectId: string
    amount: number
    message?: string
    isAnonymous?: boolean
    paymentMethod?: string
  }): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/donations', data)
  }
}

// 系统服务
export class SystemService {
  /**
   * 获取系统健康状态
   */
  static async getHealth(): Promise<ApiResponse<SystemHealth>> {
    return apiClient.get<SystemHealth>('/system/health')
  }

  /**
   * 获取API统计信息
   */
  static async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/swagger/stats')
  }
}

// 分类服务
export class CategoryService {
  /**
   * 获取分类列表
   */
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>('/categories')
  }

  /**
   * 创建分类
   */
  static async createCategory(data: {
    name: string
    slug: string
    description?: string
    icon?: string
    color?: string
  }): Promise<ApiResponse<Category>> {
    return apiClient.post<Category>('/categories', data)
  }
}

// 认证服务
export class AuthService {
  /**
   * 用户注册
   */
  static async register(data: {
    email: string
    password: string
    name: string
    phone?: string
  }): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/auth/register', data)
  }

  /**
   * 用户登录
   */
  static async login(data: {
    email: string
    password: string
  }): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/auth/login', data)
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/logout')
  }

  /**
   * 刷新Token
   */
  static async refreshToken(): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/auth/refresh')
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<ApiResponse<any>> {
    return apiClient.get<any>('/auth/me')
  }
}

// API文档服务（用于Swagger页面）
export class DocumentationService {
  /**
   * 获取所有API端点
   */
  static getApiEndpoints() {
    return [
      // 系统管理
      {
        method: 'GET' as const,
        path: '/api/system/health',
        summary: '系统健康检查',
        description: '检查系统各组件的健康状态',
        group: '系统管理',
        testable: true,
        authRequired: false,
        params: []
      },
      {
        method: 'GET' as const,
        path: '/api/swagger/stats',
        summary: 'API统计信息',
        description: '获取API路由的统计数据',
        group: '系统管理',
        testable: true,
        authRequired: false,
        params: []
      },

      // 项目管理
      {
        method: 'GET' as const,
        path: '/api/projects',
        summary: '获取项目列表',
        description: '获取所有捐赠项目的列表，支持分页和筛选',
        group: '项目管理',
        testable: true,
        authRequired: false,
        params: [
          {
            name: 'page',
            type: 'number' as const,
            default: 1,
            description: '页码'
          },
          {
            name: 'limit',
            type: 'number' as const,
            default: 10,
            description: '每页数量'
          },
          {
            name: 'status',
            type: 'string' as const,
            description: '项目状态筛选'
          },
          {
            name: 'category',
            type: 'string' as const,
            description: '项目分类筛选'
          }
        ]
      },
      {
        method: 'POST' as const,
        path: '/api/projects',
        summary: '创建项目',
        description: '创建新的捐赠项目',
        group: '项目管理',
        testable: true,
        authRequired: true,
        params: [
          {
            name: 'title',
            type: 'string' as const,
            required: true,
            description: '项目标题'
          },
          {
            name: 'description',
            type: 'string' as const,
            required: true,
            description: '项目描述'
          },
          {
            name: 'targetAmount',
            type: 'number' as const,
            required: true,
            description: '目标金额'
          },
          {
            name: 'category',
            type: 'string' as const,
            required: true,
            description: '项目分类'
          }
        ],
        exampleBody: {
          title: "测试项目",
          description: "这是一个测试项目",
          targetAmount: 10000,
          category: "animal-protection"
        }
      },

      // 捐赠管理
      {
        method: 'GET' as const,
        path: '/api/donations',
        summary: '获取捐赠记录',
        description: '获取捐赠记录列表',
        group: '捐赠管理',
        testable: true,
        authRequired: false,
        params: [
          {
            name: 'projectId',
            type: 'string' as const,
            description: '项目ID'
          },
          {
            name: 'page',
            type: 'number' as const,
            default: 1,
            description: '页码'
          },
          {
            name: 'limit',
            type: 'number' as const,
            default: 10,
            description: '每页数量'
          }
        ]
      },
      {
        method: 'POST' as const,
        path: '/api/donations',
        summary: '创建捐赠',
        description: '创建新的捐赠记录',
        group: '捐赠管理',
        testable: true,
        authRequired: true,
        params: [
          {
            name: 'projectId',
            type: 'string' as const,
            required: true,
            description: '项目ID'
          },
          {
            name: 'amount',
            type: 'number' as const,
            required: true,
            description: '捐赠金额'
          },
          {
            name: 'message',
            type: 'string' as const,
            description: '捐赠留言'
          }
        ],
        exampleBody: {
          projectId: "test-project-id",
          amount: 100,
          message: "支持野生动物保护！"
        }
      }
    ]
  }
}