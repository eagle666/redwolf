/**
 * API文档页面
 * 重构后的版本，使用组件化架构和自定义Hook
 */

'use client'

import { useApiDocumentation } from '@/hooks/useApiDocumentation'
import { ApiList } from '@/components/api-docs/ApiList'
import { ApiDetails } from '@/components/api-docs/ApiDetails'
import { CONFIG } from '@/lib/config'

export default function APIDocumentation() {
  const {
    apis,
    loading,
    error,
    selectedApi,
    testResult,
    authToken,
    systemHealth,
    selectApi,
    testApi,
    setAuthToken,
    clearTestResult,
    refreshSystemHealth,
    groupedApis,
    isTesting
  } = useApiDocumentation()

  // 加载状态
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

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
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
                🐺 {CONFIG.APP.NAME}
                <span className="text-xl font-normal bg-white/20 px-3 py-1 rounded-full">
                  API 文档
                </span>
              </h1>
              <p className="text-blue-100">完整的前后端接口文档，支持在线测试</p>
            </div>

            {/* 系统状态 */}
            <div className="text-right">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-sm text-blue-100 mb-1">系统状态</div>
                <div className="flex items-center gap-2 justify-end">
                  {systemHealth ? (
                    <>
                      <span className={`text-lg font-bold ${
                        systemHealth.status === 'healthy' ? 'text-green-300' :
                        systemHealth.status === 'degraded' ? 'text-yellow-300' :
                        'text-red-300'
                      }`}>
                        {systemHealth.status === 'healthy' ? '健康' :
                         systemHealth.status === 'degraded' ? '降级' : '异常'}
                      </span>
                      <button
                        onClick={refreshSystemHealth}
                        className="text-xs text-blue-200 hover:text-white transition-colors"
                      >
                        刷新
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-300">检查中...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 快速导航 */}
      <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              {Object.entries(groupedApis).map(([group, groupApis]) => (
                <button
                  key={group}
                  onClick={() => {
                    if (groupApis.length > 0) {
                      selectApi(groupApis[0])
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {group === '系统管理' && '⚙️'}
                  {group === '项目管理' && '📁'}
                  {group === '捐赠管理' && '💰'}
                  {group}
                  <span className="text-gray-400 ml-1">({groupApis.length})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                共 {apis.length} 个接口
              </div>
              {authToken && (
                <button
                  onClick={() => setAuthToken('')}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  清除Token
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：API列表 */}
          <div className="lg:col-span-1">
            <ApiList
              apis={apis}
              selectedApi={selectedApi}
              authToken={authToken}
              systemHealth={systemHealth}
              onSelectApi={selectApi}
              onAuthTokenChange={setAuthToken}
            />
          </div>

          {/* 右侧：API详情 */}
          <div className="lg:col-span-2">
            {selectedApi ? (
              <ApiDetails
                api={selectedApi}
                authToken={authToken}
                testResult={testResult}
                onTest={testApi}
                isTesting={isTesting}
              />
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
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>需要认证的接口请先在上方输入JWT Token</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>点击"测试接口"按钮可以直接测试API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>支持查看完整的请求和响应数据</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>所有API都基于本地服务器运行 ({CONFIG.API.BASE_URL})</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}