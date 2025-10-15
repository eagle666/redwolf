import { config } from 'dotenv'

// 加载测试环境变量
config({ path: '.env.test' })

// 设置测试超时
jest.setTimeout(30000)

// Mock console方法减少测试噪音
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// 测试数据库设置
beforeAll(async () => {
  console.log('🗄️ 初始化测试数据库...')
})

afterAll(async () => {
  console.log('🧹 清理测试数据库...')
})

beforeEach(async () => {
  // 清理Mock
  jest.clearAllMocks()
})

afterEach(async () => {
  // 每个测试后的清理
})