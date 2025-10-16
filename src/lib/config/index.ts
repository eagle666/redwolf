/**
 * 应用配置管理
 * 统一管理所有配置项，避免硬编码
 */

// API配置
export const API_CONFIG = {
  // 从环境变量获取端口，默认3000
  PORT: process.env.PORT || 3000,
  // API基础URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3000}`,
  // API基础路径
  API_PREFIX: '/api',
  // 完整API基础URL
  getApiUrl() {
    return this.BASE_URL + this.API_PREFIX
  }
} as const

// 应用信息配置
export const APP_CONFIG = {
  NAME: '可可西里网红狼公益网站',
  DESCRIPTION: '支持互联网最火的小狼，保护可可西里的野生动物',
  VERSION: '1.0.0',
  AUTHOR: 'Red Wolf Team'
} as const

// 开发环境配置
export const DEV_CONFIG = {
  // 是否启用详细日志
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
  // API请求超时时间（毫秒）
  API_TIMEOUT: 10000,
  // 是否启用Mock数据
  ENABLE_MOCK_DATA: true,
  // 日志函数
  errorLog: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || '')
  },
  infoLog: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data || '')
  }
} as const

// 分页配置
export const PAGINATION_CONFIG = {
  // 默认页码
  DEFAULT_PAGE: 1,
  // 默认每页数量
  DEFAULT_LIMIT: 10,
  // 最大每页数量
  MAX_LIMIT: 100,
  // 最小每页数量
  MIN_LIMIT: 1
} as const

// 验证配置
export const VALIDATION_CONFIG = {
  // 字符串长度限制
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_MESSAGE_LENGTH: 500,
  // 金额限制
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999,
  // 分页限制
  MIN_PAGE: 1
} as const

// 主题配置
export const THEME_CONFIG = {
  // 颜色配置
  COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4'
  },
  // 状态颜色映射
  STATUS_COLORS: {
    SUCCESS: 'bg-green-100 text-green-800',
    ERROR: 'bg-red-100 text-red-800',
    WARNING: 'bg-yellow-100 text-yellow-800',
    INFO: 'bg-blue-100 text-blue-800'
  },
  // HTTP方法颜色映射
  METHOD_COLORS: {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-amber-100 text-amber-800',
    DELETE: 'bg-red-100 text-red-800'
  }
} as const

// 导出所有配置
export const CONFIG = {
  API: API_CONFIG,
  APP: APP_CONFIG,
  DEV: DEV_CONFIG,
  PAGINATION: PAGINATION_CONFIG,
  VALIDATION: VALIDATION_CONFIG,
  THEME: THEME_CONFIG
} as const

// 开发环境下的调试日志
export const debugLog = (message: string, data?: any) => {
  if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
    console.log(`[DEBUG] ${message}`, data || '')
  }
}

// 错误日志
export const errorLog = (message: string, error?: any) => {
  console.error(`[ERROR] ${message}`, error || '')
}

// 信息日志
export const infoLog = (message: string, data?: any) => {
  console.info(`[INFO] ${message}`, data || '')
}