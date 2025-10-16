/**
 * 简洁实用的API文档页面
 */

'use client'

import { useEffect, useState } from 'react'

export default function APIDocumentation() {
  const [apis, setApis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApi, setSelectedApi] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [authToken, setAuthToken] = useState('')

  useEffect(() => {
    loadAPIs()
  }, [])

  const loadAPIs = async () => {
    try {
      // 加载API统计信息
      const statsResponse = await fetch('/api/swagger/stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        console.log('API统计:', stats.data)
      }

      // 手动定义API列表（基于我们实际实现的API）
      const apiList = [
        {
          method: 'GET',
          path: '/api/system/health',
          summary: '系统健康检查',
          description: '检查系统各组件的健康状态',
          group: '系统管理',
          testable: true,
          params: [],
          authRequired: false
        },
        {
          method: 'GET',
          path: '/api/projects',
          summary: '获取项目列表',
          description: '获取所有捐赠项目的列表，支持分页和筛选',
          group: '项目管理',
          testable: true,
          params: [
            { name: 'page', type: 'number', default: '1', description: '页码' },
            { name: 'limit', type: 'number', default: '10', description: '每页数量' },
            { name: 'status', type: 'string', description: '项目状态筛选' }
          ],
          authRequired: false
        },
        {
          method: 'POST',
          path: '/api/projects',
          summary: '创建项目',
          description: '创建新的捐赠项目',
          group: '项目管理',
          testable: true,
          params: [
            { name: 'title', type: 'string', required: true, description: '项目标题' },
            { name: 'description', type: 'string', required: true, description: '项目描述' },
            { name: 'targetAmount', type: 'number', required: true, description: '目标金额' },
            { name: 'category', type: 'string', required: true, description: '项目分类' }
          ],
          authRequired: true,
          exampleBody: {
            title: "测试项目",
            description: "这是一个测试项目",
            targetAmount: 10000,
            category: "animal-protection"
          }
        },
        {
          method: 'GET',
          path: '/api/donations',
          summary: '获取捐赠记录',
          description: '获取捐赠记录列表',
          group: '捐赠管理',
          testable: true,
          params: [
            { name: 'projectId', type: 'string', description: '项目ID' },
            { name: 'page', type: 'number', default: '1', description: '页码' },
            { name: 'limit', type: 'number', default: '10', description: '每页数量' }
          ],
          authRequired: false
        },
        {
          method: 'POST',
          path: '/api/donations',
          summary: '创建捐赠',
          description: '创建新的捐赠记录',
          group: '捐赠管理',
          testable: true,
          params: [
            { name: 'projectId', type: 'string', required: true, description: '项目ID' },
            { name: 'amount', type: 'number', required: true, description: '捐赠金额' },
            { name: 'message', type: 'string', description: '捐赠留言' }
          ],
          authRequired: true,
          exampleBody: {
            projectId: "test-project-id",
            amount: 100,
            message: "支持野生动物保护！"
          }
        }
      ]

      setApis(apiList)
      setSelectedApi(apiList[0])
    } catch (error) {
      console.error('加载API失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const testAPI = async (api: any) => {
    try {
      setTestResult({ loading: true })

      let url = `http://localhost:3001${api.path}`
      const options: RequestInit = {
        method: api.method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      // 添加认证头
      if (api.authRequired && authToken) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authToken}`
        }
      }

      // 添加查询参数
      if (api.params && api.method === 'GET') {
        const params = new URLSearchParams()
        api.params.forEach((param: any) => {
          if (param.default) {
            params.append(param.name, param.default)
          }
        })
        url += `?${params.toString()}`
      }

      // 添加请求体
      if (api.exampleBody && api.method !== 'GET') {
        options.body = JSON.stringify(api.exampleBody)
      }

      console.log('发送请求:', { url, options })

      const response = await fetch(url, options)
      const data = await response.json()

      setTestResult({
        loading: false,
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      })

    } catch (error) {
      setTestResult({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载API文档...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🐺 可可西里网红狼公益网站</h1>
          <p className="text-blue-100">API 接口文档 - 支持在线测试</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* API列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">📡 API 接口列表</h2>

              {/* 认证设置 */}
              <div className="mb-6 p-3 bg-yellow-50 rounded border border-yellow-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔐 JWT Token (可选)
                </label>
                <input
                  type="text"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="输入JWT token..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* API分组 */}
              {['系统管理', '项目管理', '捐赠管理'].map(group => (
                <div key={group} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">{group}</h3>
                  {apis
                    .filter(api => api.group === group)
                    .map((api, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedApi(api)}
                        className={`p-3 mb-2 rounded cursor-pointer transition-colors ${
                          selectedApi?.path === api.path
                            ? 'bg-blue-100 border-blue-500 border'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            api.method === 'GET' ? 'bg-green-100 text-green-800' :
                            api.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {api.method}
                          </span>
                          <span className="font-mono text-sm">{api.path}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{api.summary}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* API详情和测试 */}
          <div className="lg:col-span-2">
            {selectedApi && (
              <div className="space-y-6">

                {/* API信息 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 text-sm font-bold rounded ${
                      selectedApi.method === 'GET' ? 'bg-green-100 text-green-800' :
                      selectedApi.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApi.method}
                    </span>
                    <h2 className="text-xl font-bold">{selectedApi.path}</h2>
                  </div>

                  <h3 className="font-semibold mb-2">{selectedApi.summary}</h3>
                  <p className="text-gray-600 mb-4">{selectedApi.description}</p>

                  {/* 参数说明 */}
                  {selectedApi.params && selectedApi.params.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">📋 参数说明:</h4>
                      <div className="bg-gray-50 rounded p-3">
                        {selectedApi.params.map((param: any, index: number) => (
                          <div key={index} className="mb-2">
                            <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                              {param.name}
                            </code>
                            <span className="ml-2 text-sm text-gray-600">
                              ({param.type})
                              {param.required && <span className="text-red-600 font-bold"> *</span>}
                              - {param.description}
                              {param.default && <span className="text-gray-500"> 默认: {param.default}</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 请求体示例 */}
                  {selectedApi.exampleBody && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">📝 请求体示例:</h4>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
                        {JSON.stringify(selectedApi.exampleBody, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* 测试按钮 */}
                  <button
                    onClick={() => testAPI(selectedApi)}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    🧪 测试接口
                  </button>
                </div>

                {/* 测试结果 */}
                {testResult && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">📊 测试结果</h3>

                    {testResult.loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">正在测试...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* 状态信息 */}
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded font-bold ${
                            testResult.success
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {testResult.status} {testResult.statusText}
                          </span>
                          {testResult.success && (
                            <span className="text-green-600">✅ 请求成功</span>
                          )}
                          {!testResult.success && (
                            <span className="text-red-600">❌ 请求失败</span>
                          )}
                        </div>

                        {/* 响应数据 */}
                        {testResult.data && (
                          <div>
                            <h4 className="font-semibold mb-2">响应数据:</h4>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm max-h-96 overflow-y-auto">
                              {JSON.stringify(testResult.data, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* 错误信息 */}
                        {testResult.error && (
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <h4 className="font-semibold text-red-800 mb-1">错误信息:</h4>
                            <p className="text-red-600">{testResult.error}</p>
                          </div>
                        )}

                        {/* 响应头 */}
                        {testResult.headers && (
                          <div>
                            <h4 className="font-semibold mb-2">响应头:</h4>
                            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                              {JSON.stringify(testResult.headers, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">📖 使用说明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 点击左侧API列表查看接口详情</li>
            <li>• 绿色GET请求为查询接口，蓝色POST请求为创建接口</li>
            <li>• 如果接口需要认证，请先在上方输入JWT Token</li>
            <li>• 点击"测试接口"按钮可以直接测试API</li>
            <li>• 所有API都基于当前运行的本地服务器 (http://localhost:3001)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}