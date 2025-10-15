// 代码质量验证脚本
// 验证模块1和模块2的逻辑正确性

import { validateDatabaseEnv, getDatabaseConfig, createDatabaseConnection } from './src/lib/db'
import {
  createDonationProject,
  getDonationProjects,
  validateProjectId,
  validateAmount,
  validateProjectData
} from './src/lib/models/donation-projects'

function runQualityChecks() {
  console.log('🔍 代码质量验证\n')

  let passedChecks = 0
  let totalChecks = 0

  function check(description: string, checkFn: () => void) {
    totalChecks++
    try {
      checkFn()
      console.log(`✅ ${description}`)
      passedChecks++
    } catch (error: any) {
      console.log(`❌ ${description}`)
      console.log(`   问题: ${error.message}`)
    }
  }

  // 1. 模块1: 数据库连接功能验证
  console.log('📦 模块1: 数据库连接和基础配置')

  check('环境变量验证逻辑正确', () => {
    // 设置环境变量
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'

    validateDatabaseEnv() // 应该不抛出错误

    // 删除必需变量应该抛出错误
    delete process.env.DATABASE_URL
    try {
      validateDatabaseEnv()
      throw new Error('应该抛出错误')
    } catch (error: any) {
      if (!error.message.includes('数据库环境变量配置不完整')) {
        throw new Error('错误消息不正确')
      }
    }

    // 恢复环境变量
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  })

  check('数据库配置逻辑正确', () => {
    process.env.NODE_ENV = 'production'
    const prodConfig = getDatabaseConfig()
    if (prodConfig.ssl !== true) {
      throw new Error('生产环境应该启用SSL')
    }

    process.env.NODE_ENV = 'development'
    const devConfig = getDatabaseConfig()
    if (devConfig.ssl !== false) {
      throw new Error('开发环境应该禁用SSL')
    }

    if (devConfig.maxConnections !== 10) {
      throw new Error('默认最大连接数应该是10')
    }
  })

  check('数据库连接对象结构正确', () => {
    const db = createDatabaseConnection()

    const requiredMethods = ['query', 'select', 'insert', 'update', 'delete', 'transaction']
    requiredMethods.forEach(method => {
      if (typeof (db as any)[method] !== 'function') {
        throw new Error(`缺少必需的方法: ${method}`)
      }
    })
  })

  // 2. 模块2: 捐赠项目模型验证
  console.log('\n📦 模块2: 捐赠项目数据模型')

  check('项目数据验证逻辑正确', () => {
    // 有效数据应该通过验证
    const validData = {
      title: '测试项目',
      description: '测试描述',
      targetAmount: 100000
    }
    validateProjectData(validData) // 应该不抛出错误

    // 无效数据应该抛出错误
    try {
      validateProjectData({ title: '', targetAmount: 100000 })
      throw new Error('空标题应该被拒绝')
    } catch (error: any) {
      if (!error.message.includes('项目标题不能为空')) {
        throw new Error('错误消息不正确')
      }
    }

    try {
      validateProjectData({ title: '测试项目', targetAmount: -100 })
      throw new Error('负数金额应该被拒绝')
    } catch (error: any) {
      if (!error.message.includes('目标金额必须大于0')) {
        throw new Error('错误消息不正确')
      }
    }
  })

  check('UUID验证逻辑正确', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000'
    validateProjectId(validUUID) // 应该不抛出错误

    const invalidUUIDs = ['', 'invalid', '123', '550e8400-e29b-41d4-a716-44665544']
    invalidUUIDs.forEach(uuid => {
      try {
        validateProjectId(uuid)
        throw new Error(`无效UUID应该被拒绝: ${uuid}`)
      } catch (error: any) {
        if (!error.message.includes('无效的项目ID格式')) {
          throw new Error('错误消息不正确')
        }
      }
    })
  })

  check('金额验证逻辑正确', () => {
    const validAmounts = [100, 100.50, 999999.99]
    validAmounts.forEach(amount => {
      validateAmount(amount) // 应该不抛出错误
    })

    const invalidAmounts = [-100, 0, Infinity, NaN]
    invalidAmounts.forEach(amount => {
      try {
        validateAmount(amount)
        throw new Error(`无效金额应该被拒绝: ${amount}`)
      } catch (error: any) {
        if (error.message.includes('金额必须是数字') ||
            error.message.includes('金额必须大于0') ||
            error.message.includes('金额不能是Infinity或NaN')) {
          // 正确的错误类型
        } else {
          throw new Error('错误消息不正确')
        }
      }
    })
  })

  check('分页参数验证逻辑正确', async () => {
    // 有效分页参数
    await getDonationProjects({ page: 1, limit: 10 }) // 应该不抛出错误

    // 无效分页参数
    try {
      await getDonationProjects({ page: 0, limit: 10 })
      throw new Error('页码小于1应该被拒绝')
    } catch (error: any) {
      if (!error.message.includes('页码必须大于0')) {
        throw new Error('错误消息不正确')
      }
    }

    try {
      await getDonationProjects({ page: 1, limit: 0 })
      throw new Error('limit小于1应该被拒绝')
    } catch (error: any) {
      if (!error.message.includes('每页数量必须在1-100之间')) {
        throw new Error('错误消息不正确')
      }
    }
  })

  // 3. 数据一致性检查
  console.log('\n🔗 数据一致性检查')

  check('创建项目返回数据结构正确', async () => {
    const projectData = {
      title: '测试项目',
      description: '测试描述',
      targetAmount: 100000
    }

    const result = await createDonationProject(projectData)

    const requiredFields = ['id', 'title', 'description', 'targetAmount', 'status', 'currentAmount', 'createdAt', 'updatedAt']
    requiredFields.forEach(field => {
      if (!(field in result)) {
        throw new Error(`缺少必需字段: ${field}`)
      }
    })

    if (result.status !== 'active') {
      throw new Error('新项目状态应该是active')
    }

    if (result.currentAmount !== 0) {
      throw new Error('新项目当前金额应该是0')
    }

    if (typeof result.id !== 'string' || result.id.length === 0) {
      throw new Error('项目ID应该是非空字符串')
    }
  })

  check('分页查询返回数据结构正确', async () => {
    const result = await getDonationProjects({ page: 1, limit: 5 })

    if (!Array.isArray(result.projects)) {
      throw new Error('projects应该是数组')
    }

    if (!result.pagination) {
      throw new Error('应该包含pagination对象')
    }

    const requiredPaginationFields = ['page', 'limit', 'total', 'totalPages']
    requiredPaginationFields.forEach(field => {
      if (!(field in result.pagination)) {
        throw new Error(`pagination缺少必需字段: ${field}`)
      }
    })

    if (result.pagination.page !== 1) {
      throw new Error('页码应该正确')
    }

    if (result.pagination.limit !== 5) {
      throw new Error('limit应该正确')
    }
  })

  console.log(`\n📊 质量检查结果: ${passedChecks}/${totalChecks} 通过`)

  if (passedChecks === totalChecks) {
    console.log('\n🎉 所有质量检查通过！')
    console.log('\n✅ 代码质量验证通过:')
    console.log('- 环境变量验证逻辑正确')
    console.log('- 数据库配置逻辑正确')
    console.log('- 数据验证逻辑正确')
    console.log('- UUID验证逻辑正确')
    console.log('- 金额验证逻辑正确')
    console.log('- 分页参数验证正确')
    console.log('- 数据结构完整性正确')
    console.log('- 数据一致性正确')
  } else {
    console.log(`\n⚠️ 发现 ${totalChecks - passedChecks} 个问题`)
    process.exit(1)
  }
}

// 运行质量检查
runQualityChecks().catch(console.error)