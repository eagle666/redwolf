/**
 * API列表组件
 * 显示所有可用的API端点
 */

'use client'

import { CONFIG } from '@/lib/config'
import type { ApiEndpoint } from '@/types/api'

interface ApiListProps {
  apis: ApiEndpoint[]
  selectedApi: ApiEndpoint | null
  authToken: string
  systemHealth: any
  onSelectApi: (api: ApiEndpoint) => void
  onAuthTokenChange: (token: string) => void
}

export function ApiList({
  apis,
  selectedApi,
  authToken,
  systemHealth,
  onSelectApi,
  onAuthTokenChange
}: ApiListProps) {
  // 按组分类API
  const groupedApis = apis.reduce((acc, api) => {
    if (!acc[api.group]) {
      acc[api.group] = []
    }
    acc[api.group].push(api)
    return acc
  }, {} as Record<string, ApiEndpoint[]>)

  // 获取系统状态指示器
  const getSystemStatusIndicator = () => {
    if (!systemHealth) {
      return <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
    }

    const status = systemHealth.status
    return (
      <span className={`w-2 h-2 rounded-full ${
        status === 'healthy' ? 'bg-green-500' :
        status === 'degraded' ? 'bg-yellow-500' :
        'bg-red-500'
      }`}></span>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">📡 API 接口列表</h2>
        <div className="flex items-center gap-2">
          {getSystemStatusIndicator()}
          <span className="text-sm text-gray-600">
            {systemHealth?.status || '未知'}
          </span>
        </div>
      </div>

      {/* 认证设置 */}
      <div className="mb-6 p-3 bg-yellow-50 rounded border border-yellow-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🔐 JWT Token (可选)
        </label>
        <input
          type="text"
          value={authToken}
          onChange={(e) => onAuthTokenChange(e.target.value)}
          placeholder="输入JWT token进行认证测试..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          某些API需要认证才能测试
        </p>
      </div>

      {/* API分组 */}
      <div className="space-y-4">
        {Object.entries(groupedApis).map(([group, groupApis]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              {group === '系统管理' && '⚙️'}
              {group === '项目管理' && '📁'}
              {group === '捐赠管理' && '💰'}
              {group}
              <span className="text-xs text-gray-400">
                ({groupApis.length})
              </span>
            </h3>
            <div className="space-y-2">
              {groupApis.map((api) => (
                <ApiListItem
                  key={`${api.method}-${api.path}`}
                  api={api}
                  isSelected={selectedApi?.path === api.path}
                  onClick={() => onSelectApi(api)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          共 {apis.length} 个接口 • {Object.keys(groupedApis).length} 个分组
        </div>
      </div>
    </div>
  )
}

interface ApiListItemProps {
  api: ApiEndpoint
  isSelected: boolean
  onClick: () => void
}

function ApiListItem({ api, isSelected, onClick }: ApiListItemProps) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PUT':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-blue-50 border-blue-300 shadow-sm'
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 text-xs font-bold rounded border ${getMethodColor(api.method)}`}>
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
        {api.authRequired && (
          <span className="text-xs text-orange-600 font-medium">
            🔒
          </span>
        )}
        {api.testable && (
          <span className="text-xs text-green-600 font-medium">
            ✅
          </span>
        )}
      </div>
    </div>
  )
}