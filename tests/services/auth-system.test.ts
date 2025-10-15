import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  changePassword,
  resetPassword,
  verifyEmail,
  getUserProfile,
  updateUserProfile,
  hasPermission,
  requireAuth,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  validateUserData,
  createUserSession,
  destroyUserSession,
  AuthResult,
  UserProfile,
  UserData,
  LoginCredentials,
  PasswordChangeData,
  ResetPasswordData,
  Permission
} from '@/lib/services/auth-system'

// 设置测试环境变量
beforeEach(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing'
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret'
  process.env.SESSION_SECRET = 'test-session-secret'
})

describe('用户认证和授权系统测试', () => {
  describe('registerUser', () => {
    it('应该能够注册新用户', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'securePassword123',
        name: '张三',
        phone: '13800138000'
      }

      const result = await registerUser(userData)

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.id).toBeDefined()
      expect(result.user.email).toBe(userData.email)
      expect(result.user.name).toBe(userData.name)
      expect(result.user.isActive).toBe(false) // 需要邮箱验证
      expect(result.tokens).toBeDefined()
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
    })

    it('应该拒绝重复的邮箱地址', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'securePassword123',
        name: '李四'
      }

      // 先注册一个用户
      await registerUser(userData)

      // 尝试用相同邮箱再次注册
      const result = await registerUser(userData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('邮箱地址已存在')
    })

    it('应该验证密码强度', async () => {
      const invalidPasswords = [
        '123', // 太短
        'password', // 太简单
        '12345678', // 纯数字
        'abcdefgh', // 纯字母
        'Pass123', // 长度不足
        'password123' // 常见密码
      ]

      for (const password of invalidPasswords) {
        const userData = {
          email: `test${password}@example.com`,
          password: password,
          name: '测试用户'
        }

        const result = await registerUser(userData)
        expect(result.success).toBe(false)
        expect(result.error).toContain('密码强度不足')
      }
    })

    it('应该验证邮箱格式', async () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@.domain.com'
      ]

      for (const email of invalidEmails) {
        const userData = {
          email: email,
          password: 'SecurePass123!',
          name: '测试用户'
        }

        const result = await registerUser(userData)
        expect(result.success).toBe(false)
        expect(result.error).toContain('邮箱格式不正确')
      }
    })

    it('应该验证手机号码格式', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: '测试用户',
        phone: 'invalid-phone'
      }

      const result = await registerUser(userData)
      expect(result.success).toBe(false)
      expect(result.error).toContain('手机号码格式不正确')
    })
  })

  describe('loginUser', () => {
    it('应该能够登录有效用户', async () => {
      // 先注册用户
      const userData = {
        email: 'login@example.com',
        password: 'SecurePass123!',
        name: '登录测试用户'
      }
      await registerUser(userData)

      // 尝试登录
      const credentials = {
        email: userData.email,
        password: userData.password
      }

      const result = await loginUser(credentials)

      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.tokens).toBeDefined()
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
      expect(result.lastLoginAt).toBeInstanceOf(Date)
    })

    it('应该拒绝错误的密码', async () => {
      // 先注册用户
      const userData = {
        email: 'wrongpass@example.com',
        password: 'CorrectPass123!',
        name: '测试用户'
      }
      await registerUser(userData)

      // 使用错误密码登录
      const credentials = {
        email: userData.email,
        password: 'WrongPass123!'
      }

      const result = await loginUser(credentials)

      expect(result.success).toBe(false)
      expect(result.error).toContain('密码错误')
    })

    it('应该拒绝不存在的用户', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'SomePass123!'
      }

      const result = await loginUser(credentials)

      expect(result.success).toBe(false)
      expect(result.error).toContain('用户不存在')
    })

    it('应该拒绝未验证邮箱的用户', async () => {
      // 注册用户但不要验证邮箱
      const userData = {
        email: 'unverified@example.com',
        password: 'SecurePass123!',
        name: '未验证用户'
      }
      await registerUser(userData)

      const credentials = {
        email: userData.email,
        password: userData.password
      }

      const result = await loginUser(credentials)

      expect(result.success).toBe(false)
      expect(result.error).toContain('邮箱尚未验证')
    })

    it('应该记录登录尝试', async () => {
      const userData = {
        email: 'loginattempts@example.com',
        password: 'SecurePass123!',
        name: '登录尝试测试'
      }
      await registerUser(userData)

      // 多次错误登录尝试
      for (let i = 0; i < 3; i++) {
        await loginUser({
          email: userData.email,
          password: 'WrongPassword'
        })
      }

      // 正确登录
      const result = await loginUser({
        email: userData.email,
        password: userData.password
      })

      expect(result.success).toBe(true)
      expect(result.loginAttempts).toBe(3)
    })
  })

  describe('logoutUser', () => {
    it('应该能够登出用户', async () => {
      // 先注册并登录用户
      const userData = {
        email: 'logout@example.com',
        password: 'SecurePass123!',
        name: '登出测试用户'
      }
      const registerResult = await registerUser(userData)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      // 登出用户
      const result = await logoutUser(loginResult.tokens.refreshToken)

      expect(result.success).toBe(true)
      expect(result.loggedOutAt).toBeInstanceOf(Date)
    })

    it('应该拒绝无效的刷新令牌', async () => {
      const result = await logoutUser('invalid-refresh-token')

      expect(result.success).toBe(false)
      expect(result.error).toContain('无效的刷新令牌')
    })
  })

  describe('refreshToken', () => {
    it('应该能够刷新访问令牌', async () => {
      // 先注册并登录用户
      const userData = {
        email: 'refresh@example.com',
        password: 'SecurePass123!',
        name: '刷新令牌测试'
      }
      await registerUser(userData)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      // 刷新令牌
      const result = await refreshToken(loginResult.tokens.refreshToken)

      expect(result.success).toBe(true)
      expect(result.tokens).toBeDefined()
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
      expect(result.tokens.accessToken).not.toBe(loginResult.tokens.accessToken)
    })

    it('应该拒绝过期的刷新令牌', async () => {
      const result = await refreshToken('expired-refresh-token')

      expect(result.success).toBe(false)
      expect(result.error).toContain('刷新令牌已过期')
    })
  })

  describe('changePassword', () => {
    it('应该能够修改密码', async () => {
      // 先注册并登录用户
      const userData = {
        email: 'changepass@example.com',
        password: 'OldPass123!',
        name: '密码修改测试'
      }
      await registerUser(userData)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      // 修改密码
      const passwordData = {
        currentPassword: userData.password,
        newPassword: 'NewPass456!',
        confirmPassword: 'NewPass456!'
      }

      const result = await changePassword(loginResult.user.id, passwordData)

      expect(result.success).toBe(true)
      expect(result.changedAt).toBeInstanceOf(Date)

      // 使用新密码登录
      const newLoginResult = await loginUser({
        email: userData.email,
        password: passwordData.newPassword
      })
      expect(newLoginResult.success).toBe(true)

      // 使用旧密码登录应该失败
      const oldLoginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })
      expect(oldLoginResult.success).toBe(false)
    })

    it('应该验证当前密码', async () => {
      const userData = {
        email: 'wrongcurrent@example.com',
        password: 'CorrectPass123!',
        name: '当前密码验证测试'
      }
      await registerUser(userData)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      const passwordData = {
        currentPassword: 'WrongPass123!',
        newPassword: 'NewPass456!',
        confirmPassword: 'NewPass456!'
      }

      const result = await changePassword(loginResult.user.id, passwordData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('当前密码错误')
    })

    it('应该验证新密码确认', async () => {
      const userData = {
        email: 'mismatch@example.com',
        password: 'CorrectPass123!',
        name: '密码确认测试'
      }
      await registerUser(userData)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      const passwordData = {
        currentPassword: userData.password,
        newPassword: 'NewPass456!',
        confirmPassword: 'DifferentPass789!'
      }

      const result = await changePassword(loginResult.user.id, passwordData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('新密码确认不匹配')
    })
  })

  describe('resetPassword', () => {
    it('应该能够重置密码', async () => {
      // 先注册用户
      const userData = {
        email: 'reset@example.com',
        password: 'OldPass123!',
        name: '密码重置测试'
      }
      await registerUser(userData)

      // 请求密码重置
      const resetData = {
        email: userData.email,
        token: 'valid-reset-token',
        newPassword: 'NewResetPass789!',
        confirmPassword: 'NewResetPass789!'
      }

      const result = await resetPassword(resetData)

      expect(result.success).toBe(true)
      expect(result.resetAt).toBeInstanceOf(Date)

      // 使用新密码登录
      const loginResult = await loginUser({
        email: userData.email,
        password: resetData.newPassword
      })
      expect(loginResult.success).toBe(true)
    })

    it('应该验证重置令牌', async () => {
      const resetData = {
        email: 'test@example.com',
        token: 'invalid-reset-token',
        newPassword: 'NewPass123!',
        confirmPassword: 'NewPass123!'
      }

      const result = await resetPassword(resetData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('重置令牌无效')
    })
  })

  describe('verifyEmail', () => {
    it('应该能够验证邮箱', async () => {
      // 先注册用户
      const userData = {
        email: 'verify@example.com',
        password: 'SecurePass123!',
        name: '邮箱验证测试'
      }
      const registerResult = await registerUser(userData)

      // 验证邮箱
      const result = await verifyEmail(registerResult.user.email, 'valid-verification-token')

      expect(result.success).toBe(true)
      expect(result.verifiedAt).toBeInstanceOf(Date)
      expect(result.isActive).toBe(true)

      // 现在应该能够登录
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })
      expect(loginResult.success).toBe(true)
    })

    it('应该拒绝无效的验证令牌', async () => {
      const result = await verifyEmail('test@example.com', 'invalid-verification-token')

      expect(result.success).toBe(false)
      expect(result.error).toContain('验证令牌无效')
    })
  })

  describe('getUserProfile', () => {
    it('应该能够获取用户资料', async () => {
      // 先注册用户
      const userData = {
        email: 'profile@example.com',
        password: 'SecurePass123!',
        name: '张三',
        phone: '13800138000'
      }
      const registerResult = await registerUser(userData)

      // 获取用户资料
      const result = await getUserProfile(registerResult.user.id)

      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.email).toBe(userData.email)
      expect(result.user.name).toBe(userData.name)
      expect(result.user.phone).toBe(userData.phone)
      expect(result.user).not.toHaveProperty('password') // 不返回密码
    })

    it('应该拒绝不存在的用户ID', async () => {
      const result = await getUserProfile('non-existent-user-id')

      expect(result.success).toBe(false)
      expect(result.error).toContain('用户不存在')
    })
  })

  describe('updateUserProfile', () => {
    it('应该能够更新用户资料', async () => {
      // 先注册用户
      const userData = {
        email: 'update@example.com',
        password: 'SecurePass123!',
        name: '原始名称'
      }
      const registerResult = await registerUser(userData)

      // 更新用户资料
      const updateData = {
        name: '新名称',
        phone: '13900139000',
        bio: '这是我的个人简介',
        avatar: 'https://example.com/avatar.jpg'
      }

      const result = await updateUserProfile(registerResult.user.id, updateData)

      expect(result.success).toBe(true)
      expect(result.updatedAt).toBeInstanceOf(Date)

      // 验证更新后的资料
      const profileResult = await getUserProfile(registerResult.user.id)
      expect(profileResult.user.name).toBe(updateData.name)
      expect(profileResult.user.phone).toBe(updateData.phone)
      expect(profileResult.user.bio).toBe(updateData.bio)
    })

    it('应该拒绝更新邮箱地址', async () => {
      const userData = {
        email: 'noemail@example.com',
        password: 'SecurePass123!',
        name: '测试用户'
      }
      const registerResult = await registerUser(userData)

      const updateData = {
        email: 'newemail@example.com' // 不允许更新邮箱
      }

      const result = await updateUserProfile(registerResult.user.id, updateData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('不允许更新邮箱地址')
    })
  })

  describe('hasPermission', () => {
    it('应该检查用户权限', async () => {
      // 注册管理员用户
      const adminData = {
        email: 'admin@example.com',
        password: 'AdminPass123!',
        name: '管理员',
        role: 'admin'
      }
      const adminResult = await registerUser(adminData)

      // 注册普通用户
      const userData = {
        email: 'user@example.com',
        password: 'UserPass123!',
        name: '普通用户',
        role: 'user'
      }
      const userResult = await registerUser(userData)

      // 检查管理员权限
      const adminPermission = await hasPermission(adminResult.user.id, 'manage_users')
      expect(adminPermission).toBe(true)

      // 检查普通用户权限
      const userPermission = await hasPermission(userResult.user.id, 'manage_users')
      expect(userPermission).toBe(false)

      // 检查普通用户的基本权限
      const basicPermission = await hasPermission(userResult.user.id, 'view_projects')
      expect(basicPermission).toBe(true)
    })
  })

  describe('requireAuth', () => {
    it('应该验证认证中间件', async () => {
      // 先注册并登录用户
      const userData = {
        email: 'middleware@example.com',
        password: 'SecurePass123!',
        name: '中间件测试'
      }
      await registerUser(userData)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      // 使用有效令牌
      const validResult = await requireAuth(loginResult.tokens.accessToken)
      expect(validResult.success).toBe(true)
      expect(validResult.user).toBeDefined()

      // 使用无效令牌
      const invalidResult = await requireAuth('invalid-token')
      expect(invalidResult.success).toBe(false)
      expect(invalidResult.error).toContain('认证失败')
    })
  })

  describe('Token管理', () => {
    it('应该生成有效的JWT令牌', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      }

      const accessToken = generateToken(payload, '15m')
      const refreshToken = generateToken(payload, '7d')

      expect(accessToken).toBeDefined()
      expect(refreshToken).toBeDefined()
      expect(typeof accessToken).toBe('string')
      expect(typeof refreshToken).toBe('string')
    })

    it('应该验证JWT令牌', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      }

      const token = generateToken(payload, '15m')
      const verified = verifyToken(token)

      expect(verified).toBeDefined()
      expect(verified.userId).toBe(payload.userId)
      expect(verified.email).toBe(payload.email)
      expect(verified.role).toBe(payload.role)
    })

    it('应该拒绝过期的令牌', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com'
      }

      // 生成已过期的令牌
      const expiredToken = generateToken(payload, '0s')

      setTimeout(() => {
        const verified = verifyToken(expiredToken)
        expect(verified).toBeNull()
      }, 100)
    })
  })

  describe('密码处理', () => {
    it('应该正确哈希密码', async () => {
      const password = 'TestPassword123!'
      const hashedPassword = await hashPassword(password)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(50)
    })

    it('应该正确比较密码', async () => {
      const password = 'TestPassword123!'
      const hashedPassword = await hashPassword(password)

      const isValid = await comparePassword(password, hashedPassword)
      expect(isValid).toBe(true)

      const isInvalid = await comparePassword('WrongPassword', hashedPassword)
      expect(isInvalid).toBe(false)
    })
  })

  describe('会话管理', () => {
    it('应该创建用户会话', async () => {
      const userId = 'test-user-id'
      const sessionData = {
        userAgent: 'Mozilla/5.0...',
        ipAddress: '192.168.1.1',
        loginTime: new Date()
      }

      const result = await createUserSession(userId, sessionData)

      expect(result.success).toBe(true)
      expect(result.sessionId).toBeDefined()
      expect(result.createdAt).toBeInstanceOf(Date)
    })

    it('应该销毁用户会话', async () => {
      const userId = 'test-user-id'

      // 先创建会话
      const createResult = await createUserSession(userId, {
        userAgent: 'Test Agent',
        ipAddress: '127.0.0.1'
      })

      // 销毁会话
      const result = await destroyUserSession(createResult.sessionId)

      expect(result.success).toBe(true)
      expect(result.destroyedAt).toBeInstanceOf(Date)
    })
  })

  describe('数据验证', () => {
    it('应该验证用户数据', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: '测试用户'
      }

      expect(() => validateUserData(validData)).not.toThrow()
    })

    it('应该拒绝无效的用户数据', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123', // 太短
        name: '' // 空名称
      }

      expect(() => validateUserData(invalidData))
        .toThrow()
    })
  })

  describe('错误处理', () => {
    it('应该处理数据库连接错误', async () => {
      // 模拟数据库连接错误
      process.env.DATABASE_URL = 'invalid-database-url'

      const userData = {
        email: 'dberror@example.com',
        password: 'SecurePass123!',
        name: '数据库错误测试'
      }

      const result = await registerUser(userData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('数据库连接失败')

      // 恢复环境变量
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
    })

    it('应该处理JWT令牌生成错误', () => {
      // 使用无效的密钥
      const originalSecret = process.env.JWT_SECRET
      process.env.JWT_SECRET = ''

      const payload = { userId: 'test' }

      expect(() => generateToken(payload, '15m'))
        .toThrow()

      // 恢复密钥
      process.env.JWT_SECRET = originalSecret
    })

    it('应该处理并发注册', async () => {
      const userData = {
        email: 'concurrent@example.com',
        password: 'SecurePass123!',
        name: '并发测试'
      }

      // 并发注册相同用户
      const promises = Array.from({ length: 5 }, () => registerUser(userData))
      const results = await Promise.all(promises)

      // 只有一个应该成功
      const successCount = results.filter(r => r.success).length
      expect(successCount).toBe(1)
    })
  })

  describe('性能测试', () => {
    it('应该在合理时间内完成登录', async () => {
      // 先注册用户
      const userData = {
        email: 'performance@example.com',
        password: 'SecurePass123!',
        name: '性能测试'
      }
      await registerUser(userData)

      const credentials = {
        email: userData.email,
        password: userData.password
      }

      const startTime = Date.now()
      const result = await loginUser(credentials)
      const processingTime = Date.now() - startTime

      expect(result.success).toBe(true)
      expect(processingTime).toBeLessThan(1000) // 应该在1秒内完成
    })

    it('应该支持高并发认证', async () => {
      // 先注册用户
      const userData = {
        email: 'concurrent-auth@example.com',
        password: 'SecurePass123!',
        name: '并发认证测试'
      }
      await registerUser(userData)

      const credentials = {
        email: userData.email,
        password: userData.password
      }

      // 并发登录
      const promises = Array.from({ length: 20 }, () => loginUser(credentials))
      const results = await Promise.all(promises)

      const successCount = results.filter(r => r.success).length
      expect(successCount).toBeGreaterThan(15) // 至少75%成功
    })
  })
})