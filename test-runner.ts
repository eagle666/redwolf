// 简单的测试运行器，用于验证我们的代码
// 暂时绕过Jest的依赖问题

// 设置环境变量
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.NODE_ENV = 'test'

import {
  validateDatabaseEnv,
  getDatabaseConfig,
  createDatabaseConnection,
  checkDatabaseConnection,
  createDrizzleInstance
} from './src/lib/db.ts'

async function runTests() {
  console.log('🧪 开始运行数据库连接测试...')

  let passedTests = 0
  let totalTests = 0

  function test(description: string, testFn: () => void) {
    totalTests++
    try {
      testFn()
      console.log(`✅ ${description}`)
      passedTests++
    } catch (error: any) {
      console.log(`❌ ${description}`)
      console.log(`   Error: ${error.message}`)
    }
  }

  function expect(actual: any) {
    return {
      toBe: (expected: any) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, but got ${actual}`)
        }
      },
      toBeDefined: () => {
        if (actual === undefined) {
          throw new Error('Expected value to be defined')
        }
      },
      toThrow: (expectedMessage?: string) => {
        let threw = false
        try {
          actual()
        } catch (error: any) {
          threw = true
          if (expectedMessage && !error.message.includes(expectedMessage)) {
            throw new Error(`Expected error message to contain "${expectedMessage}", but got "${error.message}"`)
          }
        }
        if (!threw) {
          throw new Error('Expected function to throw')
        }
      },
      not: {
        toThrow: () => {
          try {
            actual()
          } catch (error: any) {
            throw new Error(`Expected function not to throw, but it threw: ${error.message}`)
          }
        }
      }
    }
  }

  console.log('\n📋 测试环境变量验证')
  test('应该验证必需的环境变量存在', () => {
    expect(() => validateDatabaseEnv()).not.toThrow()
  })

  test('应该在环境变量缺失时抛出错误', () => {
    const originalUrl = process.env.DATABASE_URL
    delete process.env.DATABASE_URL

    expect(() => validateDatabaseEnv()).toThrow('数据库环境变量配置不完整')

    process.env.DATABASE_URL = originalUrl
  })

  console.log('\n🔗 测试数据库连接')
  test('应该能够创建数据库连接实例', () => {
    const db = createDatabaseConnection()
    expect(db).toBeDefined()
    expect(typeof db.query).toBe('function')
    expect(typeof db.select).toBe('function')
  })

  console.log('\n⚙️ 测试数据库配置')
  test('应该具有正确的数据库连接池配置', () => {
    const config = getDatabaseConfig()
    expect(config.maxConnections).toBe(10)
    expect(config.minConnections).toBe(2)
    expect(config.url).toBeDefined()
  })

  test('应该具有正确的SSL配置', () => {
    process.env.NODE_ENV = 'production'
    const prodConfig = getDatabaseConfig()
    expect(prodConfig.ssl).toBe(true)

    process.env.NODE_ENV = 'development'
    const devConfig = getDatabaseConfig()
    expect(devConfig.ssl).toBe(false)
  })

  console.log('\n📦 测试Drizzle集成')
  test('应该能够创建Drizzle实例', () => {
    const db = createDrizzleInstance()
    expect(db).toBeDefined()
    expect(typeof db.select).toBe('function')
    expect(typeof db.insert).toBe('function')
  })

  console.log(`\n📊 测试结果: ${passedTests}/${totalTests} 通过`)

  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！')
    process.exit(0)
  } else {
    console.log('⚠️ 部分测试失败')
    process.exit(1)
  }
}

runTests().catch(console.error)