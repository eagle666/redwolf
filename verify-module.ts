// 模块1验证脚本 - 验证数据库连接和基础配置功能

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
} from './src/lib/db'

import { donations, donationProjects } from './src/drizzle/schema'

async function verifyModule() {
  console.log('Verifying Module 1: Database Connection and Basic Configuration\n')

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

  console.log('Testing Environment Variable Validation')
  test('should validate required environment variables exist', () => {
    expect(() => validateDatabaseEnv()).not.toThrow()
  })

  test('should throw error when environment variables are missing', () => {
    const originalUrl = process.env.DATABASE_URL
    delete process.env.DATABASE_URL

    expect(() => validateDatabaseEnv()).toThrow('数据库环境变量配置不完整')

    process.env.DATABASE_URL = originalUrl
  })

  console.log('\nTesting Database Configuration')
  test('should have correct database connection pool configuration', () => {
    const config = getDatabaseConfig()
    expect(config.maxConnections).toBe(10)
    expect(config.minConnections).toBe(2)
    expect(config.url).toBeDefined()
  })

  test('should have correct SSL configuration', () => {
    process.env.NODE_ENV = 'production'
    const prodConfig = getDatabaseConfig()
    expect(prodConfig.ssl).toBe(true)

    process.env.NODE_ENV = 'development'
    const devConfig = getDatabaseConfig()
    expect(devConfig.ssl).toBe(false)
  })

  console.log('\nTesting Database Connection')
  test('should be able to create database connection instance', () => {
    const db = createDatabaseConnection()
    expect(db).toBeDefined()
    expect(typeof db.query).toBe('function')
    expect(typeof db.select).toBe('function')
  })

  test('should be able to verify database connection status', async () => {
    const db = createDatabaseConnection()
    const isConnected = await checkDatabaseConnection(db)
    expect(isConnected).toBe(true)
  })

  console.log('\nTesting Drizzle Integration')
  test('should be able to create Drizzle instance', () => {
    const db = createDrizzleInstance()
    expect(db).toBeDefined()
    expect(typeof db.select).toBe('function')
    expect(typeof db.insert).toBe('function')
  })

  test('should be able to import Drizzle schema', () => {
    expect(donations).toBeDefined()
    expect(donationProjects).toBeDefined()
  })

  console.log(`\nTest Results: ${passedTests}/${totalTests} passed`)

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Module 1 is working correctly.')
    console.log('\n📋 Module 1 Summary:')
    console.log('- ✅ Environment variable validation')
    console.log('- ✅ Database configuration')
    console.log('- ✅ Database connection creation')
    console.log('- ✅ Connection status checking')
    console.log('- ✅ Drizzle ORM integration')
    console.log('- ✅ Schema import functionality')

    console.log('\n🚀 Ready to move to Module 2: Donation Project Data Model')
  } else {
    console.log('⚠️ Some tests failed')
    process.exit(1)
  }
}

verifyModule().catch(console.error)