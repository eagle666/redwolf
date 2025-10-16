'use client'

import { useState, useEffect } from 'react'

// 临时简化版本，解决加载问题
export default function APIDocumentationSimple() {
  const [loading, setLoading] = useState(true)
  const [apis] = useState([
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
        }
      ]
    }
  ])
  const [selectedApi, setSelectedApi] = useState(apis[0])

  useEffect(() => {
    // 模拟加载完成
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">正在加载API文档...</h2>
          <p className="text-gray-500">请稍候，正在获取接口信息...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                🐺 可可西里网红狼公益网站
                <span className="text-xl font-normal bg-white/20 px-3 py-1 rounded-full">
                  API 文档
                </span>
              </h1>
              <p className="text-blue-100">完整的前后端接口文档，支持在线测试</p>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：API列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">📡 API 接口列表</h2>
              <div className="space-y-2">
                {apis.map((api, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedApi(api)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      selectedApi === api
                        ? 'bg-blue-50 border-blue-300 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded border ${
                        api.method === 'GET'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {api.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-medium text-gray-900 truncate">
                          {api.path}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {api.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：API详情 */}
          <div className="lg:col-span-2">
            {selectedApi ? (
              <div className="space-y-6">
                {/* API基本信息 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 text-sm font-bold rounded ${
                      selectedApi.method === 'GET'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedApi.method}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">{selectedApi.path}</h2>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedApi.summary}</h3>
                  <p className="text-gray-600 mb-4">{selectedApi.description}</p>

                  {/* 参数说明 */}
                  {selectedApi.params && selectedApi.params.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        📋 参数说明
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {selectedApi.params.map((param, index) => (
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
                                  {param.default !== undefined && (
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                                      默认: {param.default}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{param.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 测试按钮 */}
                  <div className="flex items-center gap-4">
                    <button
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                    >
                      🧪 测试接口
                    </button>
                    <span className="text-sm text-gray-500">
                      端口: 3001
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl text-gray-300 mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  选择一个API查看详情
                </h3>
                <p className="text-gray-500">
                  点击左侧列表中的任意接口查看详细信息和测试功能
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 底部：使用说明 */}
      <footer className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            📖 使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>点击左侧API列表查看接口详情和参数说明</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>绿色GET请求为查询接口，蓝色POST请求为创建接口</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>点击"测试接口"按钮可以直接测试API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>所有API都基于本地服务器运行 (http://localhost:3001)</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}