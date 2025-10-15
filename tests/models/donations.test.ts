import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import {
  createDonationRecord,
  updateDonationStatus,
  getDonationById,
  getDonationsByProject,
  getDonationStatistics,
  validateDonationId,
  isValidEmail
} from '@/lib/models/donations'

// 设置测试环境变量
beforeEach(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.NODE_ENV = 'test'
})

describe('捐赠记录模型测试', () => {
  describe('createDonationRecord', () => {
    it('应该能够创建有效的捐赠记录', async () => {
      const donationData = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        amount: 100,
        supporterName: '张三',
        supporterEmail: 'zhangsan@example.com',
        message: '希望保护工作顺利'
      }

      const result = await createDonationRecord(donationData)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.projectId).toBe(donationData.projectId)
      expect(result.amount).toBe(donationData.amount)
      expect(result.supporterName).toBe(donationData.supporterName)
      expect(result.supporterEmail).toBe(donationData.supporterEmail)
      expect(result.message).toBe(donationData.message)
      expect(result.status).toBe('pending')
      expect(result.currency).toBe('CNY')
      expect(result.createdAt).toBeInstanceOf(Date)
    })

    it('应该拒绝缺少必需字段的捐赠记录', async () => {
      const invalidData = {
        amount: 100,
        supporterEmail: 'test@example.com'
        // 缺少 projectId 和 supporterName
      } as any

      await expect(createDonationRecord(invalidData))
        .rejects.toThrow('项目ID不能为空')
    })

    it('应该拒绝无效的金额', async () => {
      const invalidData = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        amount: -100,
        supporterName: '张三'
      }

      await expect(createDonationRecord(invalidData))
        .rejects.toThrow('捐赠金额必须大于0')
    })

    it('应该拒绝过长的支持者姓名', async () => {
      const invalidData = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        amount: 100,
        supporterName: 'a'.repeat(101) // 超过100字符限制
      }

      await expect(createDonationRecord(invalidData))
        .rejects.toThrow('支持者姓名不能超过100个字符')
    })

    it('应该拒绝无效的邮箱格式', async () => {
      const invalidData = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        amount: 100,
        supporterName: '张三',
        supporterEmail: 'invalid-email'
      }

      await expect(createDonationRecord(invalidData))
        .rejects.toThrow('邮箱格式不正确')
    })

    it('应该拒绝过长的留言', async () => {
      const invalidData = {
        projectId: '550e8400-e29b-41d4-a716-446655440000',
        amount: 100,
        supporterName: '张三',
        message: 'a'.repeat(501) // 超过500字符限制
      }

      await expect(createDonationRecord(invalidData))
        .rejects.toThrow('留言不能超过500个字符')
    })
  })

  describe('updateDonationStatus', () => {
    let donationId: string

    beforeEach(async () => {
      donationId = '550e8400-e29b-41d4-a716-446655440001' // 有效的UUID
    })

    it('应该能够更新捐赠状态为已完成', async () => {
      const result = await updateDonationStatus(donationId, 'completed')
      expect(result.status).toBe('completed')
      expect(result.completedAt).toBeInstanceOf(Date)
    })

    it('应该能够更新捐赠状态为失败', async () => {
      const result = await updateDonationStatus(donationId, 'failed')
      expect(result.status).toBe('failed')
    })

    it('应该拒绝无效的状态值', async () => {
      await expect(updateDonationStatus(donationId, 'invalid-status'))
        .rejects.toThrow('无效的捐赠状态')
    })
  })

  describe('getDonationById', () => {
    let donationId: string

    beforeEach(async () => {
      donationId = '550e8400-e29b-41d4-a716-446655440001' // 有效的UUID
    })

    it('应该能够通过ID获取捐赠记录', async () => {
      const result = await getDonationById(donationId)
      expect(result).toBeDefined()
      expect(result.id).toBe(donationId)
      expect(result.amount).toBeDefined()
      expect(result.supporterName).toBeDefined()
    })

    it('对于不存在的捐赠记录应该返回null', async () => {
      const nonExistentId = 'non-existent-donation-id'
      const result = await getDonationById(nonExistentId)
      expect(result).toBeNull()
    })
  })

  describe('getDonationsByProject', () => {
    let projectId: string

    beforeEach(async () => {
      projectId = '550e8400-e29b-41d4-a716-446655440000'
    })

    it('应该能够获取项目的捐赠记录列表', async () => {
      const options = {
        page: 1,
        limit: 10,
        status: 'completed' as const
      }

      const result = await getDonationsByProject(projectId, options)
      expect(Array.isArray(result.donations)).toBe(true)
      expect(result.pagination).toBeDefined()
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(10)
    })

    it('应该支持按状态筛选捐赠记录', async () => {
      const options = {
        status: 'pending' as const
      }

      const result = await getDonationsByProject(projectId, options)
      result.donations.forEach(donation => {
        expect(donation.status).toBe('pending')
      })
    })

    it('应该支持按金额范围筛选', async () => {
      const options = {
        minAmount: 100,
        maxAmount: 1000
      }

      const result = await getDonationsByProject(projectId, options)
      result.donations.forEach(donation => {
        expect(donation.amount).toBeGreaterThanOrEqual(100)
        expect(donation.amount).toBeLessThanOrEqual(1000)
      })
    })
  })

  describe('getDonationStatistics', () => {
    let projectId: string

    beforeEach(async () => {
      projectId = '550e8400-e29b-41d4-a716-446655440000'
    })

    it('应该能够计算项目的捐赠统计', async () => {
      const stats = await getDonationStatistics(projectId)
      expect(stats).toBeDefined()
      expect(stats.totalAmount).toBeGreaterThanOrEqual(0)
      expect(stats.totalDonors).toBeGreaterThanOrEqual(0)
      expect(stats.averageAmount).toBeGreaterThanOrEqual(0)
      expect(stats.completedCount).toBeGreaterThanOrEqual(0)
    })

    it('应该能够计算指定时间段的统计', async () => {
      const dateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      }

      const stats = await getDonationStatistics(projectId, dateRange)
      expect(stats.totalAmount).toBeGreaterThanOrEqual(0)
      expect(stats.totalDonors).toBeGreaterThanOrEqual(0)
    })
  })

  describe('数据验证', () => {
    it('应该验证捐赠记录ID格式', () => {
      const validIds = [
        '550e8400-e29b-41d4-a716-446655440001',
        '123e4567-e89b-12d3-a456-426614174001'
      ]

      validIds.forEach(id => {
        expect(() => validateDonationId(id)).not.toThrow()
      })
    })

    it('应该拒绝无效的捐赠记录ID格式', () => {
      const invalidIds = [
        'invalid-donation-id',
        '123',
        '',
        '550e8400-e29b-41d4-a716-44665544'
      ]

      invalidIds.forEach(id => {
        expect(() => validateDonationId(id)).toThrow('无效的捐赠记录ID格式')
      })
    })

    it('应该验证邮箱格式', () => {
      const validEmails = [
        'test@example.com',
        'user.name+tag@domain.co.uk',
        'user123@test-domain.org'
      ]

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('应该拒绝无效的邮箱格式', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com'
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })
  })
})