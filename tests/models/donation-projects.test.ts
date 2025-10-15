import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import {
  createDonationProject,
  getDonationProjects,
  getDonationProjectById,
  updateDonationProject,
  deleteDonationProject,
  validateProjectId,
  validateAmount
} from '@/lib/models/donation-projects'

// 设置测试环境变量
beforeEach(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.NODE_ENV = 'test'
})

describe('捐赠项目模型测试', () => {
  describe('createDonationProject', () => {
    it('应该能够创建有效的捐赠项目', async () => {
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

    it('应该拒绝缺少标题的项目', async () => {
      const invalidData = {
        description: '测试描述',
        targetAmount: 100000
      }

      await expect(createDonationProject(invalidData))
        .rejects.toThrow('项目标题不能为空')
    })

    it('应该拒绝负数的目标金额', async () => {
      const invalidData = {
        title: '测试项目',
        description: '测试描述',
        targetAmount: -1000
      }

      await expect(createDonationProject(invalidData))
        .rejects.toThrow('目标金额必须大于0')
    })

    it('应该拒绝过长的标题', async () => {
      const invalidData = {
        title: 'a'.repeat(201), // 超过200字符限制
        description: '测试描述',
        targetAmount: 100000
      }

      await expect(createDonationProject(invalidData))
        .rejects.toThrow('项目标题不能超过200个字符')
    })
  })

  describe('getDonationProjects', () => {
    it('应该能够获取项目列表', async () => {
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

    it('应该支持按状态筛选项目', async () => {
      const options = {
        status: 'completed' as const
      }

      const result = await getDonationProjects(options)
      result.projects.forEach(project => {
        expect(project.status).toBe('completed')
      })
    })

    it('应该支持分页功能', async () => {
      const options = {
        page: 2,
        limit: 5
      }

      const result = await getDonationProjects(options)
      expect(result.pagination.page).toBe(2)
      expect(result.pagination.limit).toBe(5)
      expect(result.pagination.totalPages).toBeGreaterThan(0)
    })
  })

  describe('getDonationProjectById', () => {
    let projectId: string

    beforeEach(async () => {
      projectId = '550e8400-e29b-41d4-a716-446655440000' // 有效的UUID
    })

    it('应该能够通过ID获取项目', async () => {
      const result = await getDonationProjectById(projectId)

      expect(result).toBeDefined()
      expect(result.id).toBe(projectId)
      expect(result.title).toBeDefined()
      expect(result.description).toBeDefined()
    })

    it('对于不存在的项目应该返回null', async () => {
      const nonExistentId = 'non-existent-id'

      const result = await getDonationProjectById(nonExistentId)
      expect(result).toBeNull()
    })
  })

  describe('updateDonationProject', () => {
    let projectId: string

    beforeEach(async () => {
      projectId = '550e8400-e29b-41d4-a716-446655440000' // 有效的UUID
    })

    it('应该能够更新项目信息', async () => {
      const updateData = {
        title: '更新后的标题',
        description: '更新后的描述'
      }

      const result = await updateDonationProject(projectId, updateData)

      expect(result.title).toBe(updateData.title)
      expect(result.description).toBe(updateData.description)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('应该能够更新项目状态', async () => {
      const updateData = {
        status: 'completed' as const
      }

      const result = await updateDonationProject(projectId, updateData)
      expect(result.status).toBe('completed')
    })

    it('应该拒绝无效的状态值', async () => {
      const updateData = {
        status: 'invalid-status' as any
      }

      await expect(updateDonationProject(projectId, updateData))
        .rejects.toThrow('无效的项目状态')
    })
  })

  describe('deleteDonationProject', () => {
    let projectId: string

    beforeEach(async () => {
      projectId = '550e8400-e29b-41d4-a716-446655440000' // 有效的UUID
    })

    it('应该能够删除项目', async () => {
      await deleteDonationProject(projectId)

      // 验证删除操作不会抛出错误
      expect(true).toBe(true)
    })

    it('删除不存在的项目应该不抛出错误', async () => {
      const nonExistentId = 'non-existent-id'

      await expect(deleteDonationProject(nonExistentId))
        .resolves.not.toThrow()
    })
  })

  describe('数据验证', () => {
    it('应该验证项目ID格式', () => {
      const validIds = [
        '550e8400-e29b-41d4-a716-446655440000',
        '123e4567-e89b-12d3-a456-426614174000'
      ]

      validIds.forEach(id => {
        expect(() => validateProjectId(id)).not.toThrow()
      })
    })

    it('应该拒绝无效的项目ID格式', () => {
      const invalidIds = [
        'invalid-id',
        '123',
        '',
        '550e8400-e29b-41d4-a716-44665544' // 不完整的UUID
      ]

      invalidIds.forEach(id => {
        expect(() => validateProjectId(id)).toThrow('无效的项目ID格式')
      })
    })

    it('应该验证金额格式', () => {
      const validAmounts = [100, 100.50, 10000, 999999.99]

      validAmounts.forEach(amount => {
        expect(() => validateAmount(amount)).not.toThrow()
      })
    })

    it('应该拒绝无效的金额格式', () => {
      const invalidAmounts = [-100, 0, 'invalid' as any, Infinity, NaN]

      invalidAmounts.forEach(amount => {
        expect(() => validateAmount(amount)).toThrow()
      })
    })
  })
})