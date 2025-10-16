/**
 * API文档相关的React Hooks
 * 管理API文档页面的状态和逻辑
 */

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api/client'
import { DocumentationService } from '@/lib/api/services'
import { CONFIG } from '@/lib/config'
import type {
  ApiEndpoint,
  TestResult,
  SystemHealth
} from '@/types/api'

// API文档状态
export interface ApiDocumentationState {
  apis: ApiEndpoint[]
  loading: boolean
  error: string | null
  selectedApi: ApiEndpoint | null
  testResult: TestResult | null
  authToken: string
  systemHealth: SystemHealth | null
}

// API文档操作的返回值
export interface UseApiDocumentationReturn {
  // 状态
  apis: ApiEndpoint[]
  loading: boolean
  error: string | null
  selectedApi: ApiEndpoint | null
  testResult: TestResult | null
  authToken: string
  systemHealth: SystemHealth | null

  // 操作
  selectApi: (api: ApiEndpoint) => void
  testApi: (api: ApiEndpoint) => Promise<void>
  setAuthToken: (token: string) => void
  clearTestResult: () => void
  refreshSystemHealth: () => Promise<void>

  // 计算属性
  groupedApis: Record<string, ApiEndpoint[]>
  isTesting: boolean
}

/**
 * API文档主Hook
 */
export function useApiDocumentation(): UseApiDocumentationReturn {
  // 基础状态
  const [apis, setApis] = useState<ApiEndpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [authToken, setAuthToken] = useState('')
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)

  // 计算属性
  const groupedApis = apis.reduce((acc, api) => {
    if (!acc[api.group]) {
      acc[api.group] = []
    }
    acc[api.group].push(api)
    return acc
  }, {} as Record<string, ApiEndpoint[]>)

  const isTesting = testResult?.loading ?? false

  // 加载API列表
  const loadApis = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取API端点列表 - 使用try-catch包装
      let apiEndpoints = []
      try {
        apiEndpoints = DocumentationService.getApiEndpoints()
      } catch (serviceErr) {
        console.error('DocumentationService错误:', serviceErr)
        // 使用备用数据
        apiEndpoints = [
          {
            method: 'GET' as const,
            path: '/api/system/health',
            summary: '系统健康检查',
            description: '检查系统各组件的健康状态',
            group: '系统管理',
            testable: true,
            authRequired: false,
            params: []
          }
        ]
      }

      setApis(apiEndpoints)

      // 设置默认选中的API
      if (apiEndpoints.length > 0 && !selectedApi) {
        setSelectedApi(apiEndpoints[0])
      }

      // 从localStorage恢复认证token
      try {
        const savedToken = localStorage.getItem('jwt-token')
        if (savedToken) {
          setAuthToken(savedToken)
        }
      } catch (storageErr) {
        console.warn('无法访问localStorage:', storageErr)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载API列表失败'
      setError(errorMessage)
      console.error('加载API列表失败:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedApi])

  // 刷新系统健康状态
  const refreshSystemHealth = useCallback(async () => {
    try {
      const response = await apiClient.get<SystemHealth>('/system/health')
      if (response.success) {
        setSystemHealth(response.data)
      }
    } catch (err) {
      CONFIG.DEV.errorLog('获取系统健康状态失败', err)
    }
  }, [])

  // 选择API
  const selectApi = useCallback((api: ApiEndpoint) => {
    setSelectedApi(api)
    setTestResult(null) // 清除之前的测试结果
  }, [])

  // 测试API
  const testApi = useCallback(async (api: ApiEndpoint) => {
    try {
      setTestResult({ loading: true })

      // 构建查询参数
      let queryParams = {}
      if (api.method === 'GET' && api.params) {
        api.params.forEach(param => {
          if (param.default !== undefined) {
            queryParams[param.name] = param.default
          }
        })
      }

      // 发送测试请求
      const result = await apiClient.testEndpoint(
        api.path,
        api.method,
        api.exampleBody,
        authToken || undefined
      )

      setTestResult(result)

      // 记录测试结果
      if (result.success) {
        CONFIG.DEV.infoLog('API测试成功', {
          endpoint: api.path,
          method: api.method,
          status: result.status
        })
      } else {
        CONFIG.DEV.errorLog('API测试失败', {
          endpoint: api.path,
          method: api.method,
          error: result.error
        })
      }

    } catch (err) {
      const errorResult: TestResult = {
        loading: false,
        success: false,
        error: err instanceof Error ? err.message : '测试请求失败'
      }
      setTestResult(errorResult)
      CONFIG.DEV.errorLog('API测试异常', err)
    }
  }, [authToken])

  // 设置认证Token
  const handleSetAuthToken = useCallback((token: string) => {
    setAuthToken(token)
    if (token) {
      localStorage.setItem('jwt-token', token)
    } else {
      localStorage.removeItem('jwt-token')
    }
  }, [])

  // 清除测试结果
  const clearTestResult = useCallback(() => {
    setTestResult(null)
  }, [])

  // 初始化加载
  useEffect(() => {
    loadApis()
    refreshSystemHealth()
  }, [loadApis, refreshSystemHealth])

  return {
    // 状态
    apis,
    loading,
    error,
    selectedApi,
    testResult,
    authToken,
    systemHealth,

    // 操作
    selectApi,
    testApi,
    setAuthToken: handleSetAuthToken,
    clearTestResult,
    refreshSystemHealth,

    // 计算属性
    groupedApis,
    isTesting
  }
}

/**
 * 获取单个API测试结果的Hook
 */
export function useApiTest(endpoint: string, method: string) {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testEndpoint = useCallback(async (body?: any, authToken?: string) => {
    try {
      setLoading(true)
      const testResult = await apiClient.testEndpoint(endpoint, method as any, body, authToken)
      setResult(testResult)
      return testResult
    } catch (error) {
      const errorResult: TestResult = {
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : '测试失败'
      }
      setResult(errorResult)
      return errorResult
    } finally {
      setLoading(false)
    }
  }, [endpoint, method])

  const clearResult = useCallback(() => {
    setResult(null)
  }, [])

  return {
    result,
    loading,
    testEndpoint,
    clearResult
  }
}