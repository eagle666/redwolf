/**
 * API详情组件
 * 显示选中API的详细信息和测试功能
 */

'use client'

import { useState } from 'react'
import { CONFIG } from '@/lib/config'
import type { ApiEndpoint, TestResult } from '@/types/api'

interface ApiDetailsProps {
  api: ApiEndpoint
  authToken: string
  testResult: TestResult | null
  onTest: (api: ApiEndpoint) => Promise<void>
  isTesting: boolean
}

export function ApiDetails({ api, authToken, testResult, onTest, isTesting }: ApiDetailsProps) {
  const [showRequestBody, setShowRequestBody] = useState(true)

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return CONFIG.THEME.METHOD_COLORS.GET
      case 'POST':
        return CONFIG.THEME.METHOD_COLORS.POST
      case 'PUT':
        return CONFIG.THEME.METHOD_COLORS.PUT
      case 'DELETE':
        return CONFIG.THEME.METHOD_COLORS.DELETE
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (success?: boolean) => {
    if (success === undefined) return ''
    return success ? CONFIG.THEME.STATUS_COLORS.SUCCESS : CONFIG.THEME.STATUS_COLORS.ERROR
  }

  return (
    <div className="space-y-6">
      {/* API基本信息 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-sm font-bold rounded ${getMethodColor(api.method)}`}>
            {api.method}
          </span>
          <h2 className="text-xl font-bold text-gray-900">{api.path}</h2>
          {api.authRequired && (
            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
              需要认证
            </span>
          )}
          {api.testable && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
              可测试
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">{api.summary}</h3>
        <p className="text-gray-600 mb-4">{api.description}</p>

        {/* 参数说明 */}
        {api.params && api.params.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              📋 参数说明
              <span className="text-xs text-gray-500">({api.params.length} 个参数)</span>
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {api.params.map((param, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                        {param.name}
                      </code>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {param.type}
                        </span>
                        {param.required && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                            必需
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{param.description}</p>
                      {param.default !== undefined && (
                        <p className="text-xs text-gray-500 mt-1">
                          默认值: <code>{param.default}</code>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 请求体示例 */}
        {api.exampleBody && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                📝 请求体示例
              </h4>
              <button
                onClick={() => setShowRequestBody(!showRequestBody)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showRequestBody ? '隐藏' : '显示'}
              </button>
            </div>
            {showRequestBody && (
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">
                  {JSON.stringify(api.exampleBody, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 测试按钮 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onTest(api)}
            disabled={isTesting}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isTesting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isTesting ? (
              <>
                <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                测试中...
              </>
            ) : (
              <>
                🧪 测试接口
              </>
            )}
          </button>

          {!api.testable && (
            <span className="text-sm text-gray-500">
              此接口暂不支持测试
            </span>
          )}

          {api.authRequired && !authToken && (
            <span className="text-sm text-orange-600">
              ⚠️ 需要先设置JWT Token
            </span>
          )}
        </div>
      </div>

      {/* 测试结果 */}
      {testResult && (
        <TestResultDisplay result={testResult} />
      )}
    </div>
  )
}

interface TestResultDisplayProps {
  result: TestResult
}

function TestResultDisplay({ result }: TestResultDisplayProps) {
  const getStatusIcon = (success?: boolean) => {
    if (success === undefined) return ''
    return success ? '✅' : '❌'
  }

  const getStatusText = (success?: boolean) => {
    if (success === undefined) return ''
    return success ? '请求成功' : '请求失败'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📊 测试结果
      </h3>

      {result.loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">正在测试...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 状态信息 */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <span className={`px-3 py-1 rounded font-bold ${getStatusColor(result.success)}`}>
              {result.status || 'ERROR'} {result.statusText || ''}
            </span>
            <span className={`font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {getStatusIcon(result.success)} {getStatusText(result.success)}
            </span>
          </div>

          {/* 响应数据 */}
          {result.data && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">响应数据:</h4>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* 错误信息 */}
          {result.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">错误信息:</h4>
              <p className="text-red-600">{result.error}</p>
            </div>
          )}

          {/* 响应头 */}
          {result.headers && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">响应头:</h4>
              <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}