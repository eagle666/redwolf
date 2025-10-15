// 模块2验证脚本 - 验证捐赠项目数据模型功能

// 设置环境变量
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.NODE_ENV = 'test'

import {
  createDonationProject,
  getDonationProjects,
  getDonationProjectById,
  updateDonationProject,
  deleteDonationProject,
  validateProjectId,
  validateAmount
} from './src/lib/models/donation-projects'

async function verifyModule2() {
  console.log('Verifying Module 2: Donation Project Data Model\n')

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

  async function asyncTest(description: string, testFn: () => Promise<void>) {
    totalTests++
    try {
      await testFn()
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
      toBeInstanceOf: (constructor: any) => {
        if (!(actual instanceof constructor)) {
          throw new Error(`Expected instance of ${constructor.name}, but got ${typeof actual}`)
        }
      },
      toBeNull: () => {
        if (actual !== null) {
          throw new Error(`Expected null, but got ${actual}`)
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

  console.log('Testing createDonationProject')
  await asyncTest('should create valid donation project', async () => {
    const projectData = {
      title: '测试项目',
      description: '这是一个测试项目描述',
      targetAmount: 100000,
      featuredImage: 'https://example.com/image.jpg'
    }

    const result = await createDonationProject(projectData)
    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.title).toBe(projectData.title)
    expect(result.description).toBe(projectData.description)
    expect(result.targetAmount).toBe(projectData.targetAmount)
    expect(result.status).toBe('active')
    expect(result.currentAmount).toBe(0)
    expect(result.createdAt).toBeInstanceOf(Date)
  })

  test('should reject project without title', () => {
    const invalidData = {
      description: '测试描述',
      targetAmount: 100000
    } as any

    expect(() => createDonationProject(invalidData)).toThrow('项目标题不能为空')
  })

  test('should reject project with negative target amount', () => {
    const invalidData = {
      title: '测试项目',
      description: '测试描述',
      targetAmount: -1000
    }

    expect(() => createDonationProject(invalidData)).toThrow('目标金额必须大于0')
  })

  console.log('\nTesting getDonationProjects')
  await asyncTest('should get project list with pagination', async () => {
    const options = {
      page: 1,
      limit: 10,
      status: 'active' as const
    }

    const result = await getDonationProjects(options)
    expect(Array.isArray(result.projects)).toBe(true)
    expect(result.pagination).toBeDefined()
    expect(result.pagination.page).toBe(1)
    expect(result.pagination.limit).toBe(10)
  })

  console.log('\nTesting getDonationProjectById')
  await asyncTest('should get project by ID', async () => {
    const projectId = '550e8400-e29b-41d4-a716-446655440000'
    const result = await getDonationProjectById(projectId)
    expect(result).toBeDefined()
    expect(result.id).toBe(projectId)
    expect(result.title).toBeDefined()
  })

  await asyncTest('should return null for non-existent project', async () => {
    const nonExistentId = 'non-existent-id'
    const result = await getDonationProjectById(nonExistentId)
    expect(result).toBeNull()
  })

  console.log('\nTesting updateDonationProject')
  await asyncTest('should update project information', async () => {
    const projectId = '550e8400-e29b-41d4-a716-446655440000'
    const updateData = {
      title: '更新后的标题',
      description: '更新后的描述'
    }

    const result = await updateDonationProject(projectId, updateData)
    expect(result.title).toBe(updateData.title)
    expect(result.description).toBe(updateData.description)
    expect(result.updatedAt).toBeInstanceOf(Date)
  })

  test('should reject invalid status', async () => {
    const projectId = '550e8400-e29b-41d4-a716-446655440000'
    const updateData = {
      status: 'invalid-status' as any
    }

    expect(() => updateDonationProject(projectId, updateData)).toThrow('无效的项目状态')
  })

  console.log('\nTesting deleteDonationProject')
  await asyncTest('should delete project without errors', async () => {
    const projectId = '550e8400-e29b-41d4-a716-446655440000'
    await deleteDonationProject(projectId)
    // 验证不会抛出错误
    expect(true).toBe(true)
  })

  console.log('\nTesting Data Validation')
  test('should validate project ID format', () => {
    const validIds = [
      '550e8400-e29b-41d4-a716-446655440000',
      '123e4567-e89b-12d3-a456-426614174000'
    ]

    validIds.forEach(id => {
      expect(() => validateProjectId(id)).not.toThrow()
    })
  })

  test('should reject invalid project ID format', () => {
    const invalidIds = [
      'invalid-id',
      '123',
      '',
      '550e8400-e29b-41d4-a716-44665544'
    ]

    invalidIds.forEach(id => {
      expect(() => validateProjectId(id)).toThrow('无效的项目ID格式')
    })
  })

  test('should validate amount format', () => {
    const validAmounts = [100, 100.50, 10000, 999999.99]

    validAmounts.forEach(amount => {
      expect(() => validateAmount(amount)).not.toThrow()
    })
  })

  test('should reject invalid amount format', () => {
    const invalidAmounts = [-100, 0, 'invalid' as any, Infinity, NaN]

    invalidAmounts.forEach(amount => {
      expect(() => validateAmount(amount)).toThrow()
    })
  })

  console.log(`\nTest Results: ${passedTests}/${totalTests} passed`)

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Module 2 is working correctly.')
    console.log('\n📋 Module 2 Summary:')
    console.log('- ✅ Create donation projects')
    console.log('- ✅ Get project lists with pagination')
    console.log('- ✅ Get project by ID')
    console.log('- ✅ Update project information')
    console.log('- ✅ Delete projects')
    console.log('- ✅ Data validation for IDs and amounts')
    console.log('- ✅ Error handling for invalid data')

    console.log('\n🚀 Ready to move to Module 3: Donation Record Data Model')
  } else {
    console.log('⚠️ Some tests failed')
    process.exit(1)
  }
}

verifyModule2().catch(console.error)