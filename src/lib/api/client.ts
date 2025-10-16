/**
 * API客户端
 * 提供统一的API请求方法
 */

import { CONFIG } from '@/lib/config'
import type {
  ApiResponse,
  HttpMethod,
  TestResult,
  ApiError,
  ApiErrorCode
} from '@/types/api'

// API请求配置
interface ApiRequestConfig {
  method: HttpMethod
  url: string
  headers?: Record<string, string>
  body?: string
  timeout?: number
}

// API客户端类
export class ApiClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor(baseUrl?: string, timeout?: number) {
    this.baseUrl = baseUrl || CONFIG.API.getApiUrl()
    this.defaultTimeout = timeout || CONFIG.DEV.API_TIMEOUT
  }

  /**
   * 创建请求配置
   */
  private createRequestConfig(config: Partial<ApiRequestConfig>): ApiRequestConfig {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: this.defaultTimeout,
      ...config
    }
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          data.error?.code || 'INTERNAL_ERROR',
          data.error?.message || `HTTP ${response.status}`,
          data.error?.details
        )
      }

      return data as ApiResponse<T>
    } catch (error) {
      if (ApiError.isApiError(error)) {
        throw error
      }

      throw new ApiError(
        'NETWORK_ERROR',
        '网络请求失败',
        { originalError: error }
      )
    }
  }

  /**
   * 通用请求方法
   */
  private async request<T>(config: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    const requestConfig = this.createRequestConfig(config)

    // 确保URL是完整的
    let url = requestConfig.url
    if (!url.startsWith('http')) {
      url = this.baseUrl + url
    }

    CONFIG.DEV.ENABLE_DEBUG_LOGS && console.log('API请求:', {
      method: requestConfig.method,
      url,
      headers: requestConfig.headers,
      body: requestConfig.body
    })

    try {
      const response = await fetch(url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.body
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      CONFIG.DEV.ENABLE_DEBUG_LOGS && console.error('API请求失败:', error)
      throw error
    }
  }

  /**
   * GET请求
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      url += `?${searchParams.toString()}`
    }

    return this.request<T>({ method: 'GET', url })
  }

  /**
   * POST请求
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url: endpoint,
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * PUT请求
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url: endpoint,
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * DELETE请求
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url: endpoint })
  }

  /**
   * PATCH请求
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url: endpoint,
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * 测试API端点（用于文档页面）
   */
  async testEndpoint(endpoint: string, method: HttpMethod, body?: any, authToken?: string): Promise<TestResult> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      let url = endpoint
      if (!url.startsWith('http')) {
        url = this.baseUrl + endpoint
      }

      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' && body ? JSON.stringify(body) : undefined
      })

      const data = await response.json()

      return {
        loading: false as const,
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
        headers: Object.fromEntries(response.headers.entries())
      }
    } catch (error) {
      return {
        loading: false as const,
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient()

// 创建带认证的API客户端
export function createAuthenticatedClient(token: string): ApiClient {
  return new ApiClient(undefined, undefined).withAuth(token)
}

// 扩展ApiClient类以支持链式调用
declare module './client' {
  interface ApiClient {
    withAuth(token: string): ApiClient
  }
}

ApiClient.prototype.withAuth = function(this: ApiClient, token: string): ApiClient {
  const client = new ApiClient(this.baseUrl, this.defaultTimeout)

  // 重写request方法以添加认证头
  const originalRequest = client.request.bind(client)
  client.request = async function<T>(config: Partial<ApiRequestConfig>) {
    const authConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      }
    }
    return originalRequest<T>(authConfig)
  }

  return client
}