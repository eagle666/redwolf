// 用户认证和授权系统
// 模块7: TDD开发 - 用户认证和授权系统

import { createHash, randomBytes, timingSafeEqual } from 'crypto'

export interface UserData {
  email: string
  password: string
  name: string
  phone?: string
  role?: 'user' | 'admin' | 'manager'
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordData {
  email: string
  token: string
  newPassword: string
  confirmPassword: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  isActive: boolean
  isEmailVerified: boolean
  emailVerifiedAt?: Date
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
  bio?: string
  avatar?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  language: 'zh' | 'en'
  timezone: string
  emailNotifications: boolean
  marketingEmails: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  tokenType: string
}

export interface AuthResult {
  success: boolean
  user?: UserProfile
  tokens?: AuthTokens
  error?: string
  lastLoginAt?: Date
  loginAttempts?: number
  requiresEmailVerification?: boolean
  isLocked?: boolean
  lockUntil?: Date
}

export interface RegisterResult extends AuthResult {
  verificationToken?: string
  verificationSentAt?: Date
}

export interface LoginResult extends AuthResult {
  sessionId?: string
}

export interface LogoutResult {
  success: boolean
  loggedOutAt: Date
  error?: string
}

export interface TokenRefreshResult {
  success: boolean
  tokens?: AuthTokens
  error?: string
}

export interface PasswordChangeResult {
  success: boolean
  changedAt: Date
  error?: string
}

export interface ResetPasswordResult {
  success: boolean
  resetAt: Date
  error?: string
}

export interface EmailVerificationResult {
  success: boolean
  verifiedAt: Date
  isActive?: boolean
  error?: string
}

export interface ProfileResult {
  success: boolean
  user?: UserProfile
  updatedAt?: Date
  error?: string
}

export interface Permission {
  name: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface SessionData {
  sessionId: string
  userId: string
  userAgent?: string
  ipAddress?: string
  loginTime: Date
  lastActivity: Date
  isActive: boolean
}

export interface AuthMiddlewareResult {
  success: boolean
  user?: UserProfile
  error?: string
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
  sessionId?: string
  type: 'access' | 'refresh'
  iat: number
  exp: number
}

// 内存存储（生产环境应使用数据库）
const users = new Map<string, UserProfile & { passwordHash: string }>()
const sessions = new Map<string, SessionData>()
const refreshTokens = new Map<string, { userId: string, expiresAt: Date }>()
const emailVerifications = new Map<string, { token: string, expiresAt: Date }>()
const passwordResets = new Map<string, { token: string, expiresAt: Date }>()
const loginAttempts = new Map<string, { count: number; lastAttempt: Date; lockedUntil?: Date }>()

/**
 * 注册新用户
 * @param data 用户数据
 * @returns {Promise<RegisterResult>} 注册结果
 */
export async function registerUser(data: UserData): Promise<RegisterResult> {
  try {
    // 验证用户数据
    validateUserData(data)

    // 检查邮箱是否已存在
    if (await isEmailExists(data.email)) {
      return {
        success: false,
        error: '邮箱地址已存在'
      }
    }

    // 验证密码强度
    if (!isPasswordStrong(data.password)) {
      return {
        success: false,
        error: '密码强度不足：密码必须包含大小写字母、数字，且长度至少8位'
      }
    }

    // 哈希密码
    const passwordHash = await hashPassword(data.password)

    // 创建用户
    const userId = generateUserId()
    const now = new Date()
    const verificationToken = generateVerificationToken()

    const user: UserProfile & { passwordHash: string } = {
      id: userId,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role || 'user',
      isActive: false, // 需要邮箱验证
      isEmailVerified: false,
      createdAt: now,
      updatedAt: now,
      passwordHash,
      preferences: {
        language: 'zh',
        timezone: 'Asia/Shanghai',
        emailNotifications: true,
        marketingEmails: false
      }
    }

    // 存储用户
    users.set(userId, user)

    // 存储邮箱验证令牌
    emailVerifications.set(user.email, {
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时过期
    })

    // TODO: 发送验证邮件
    console.log(`发送验证邮件到 ${data.email}，验证码: ${verificationToken}`)

    // 生成令牌
    const tokens = await generateAuthTokens(user)

    // 创建会话
    const sessionId = await createUserSession(userId, {
      userAgent: 'registration',
      ipAddress: '127.0.0.1'
    })

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferences: user.preferences
    }

    return {
      success: true,
      user: userProfile,
      tokens,
      verificationToken,
      verificationSentAt: new Date(),
      requiresEmailVerification: true
    }

  } catch (error: any) {
    console.error('用户注册失败:', error)
    return {
      success: false,
      error: error.message || '注册失败，请稍后重试'
    }
  }
}

/**
 * 用户登录
 * @param credentials 登录凭据
 * @returns {Promise<LoginResult>} 登录结果
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    // 验证登录数据
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: '邮箱和密码不能为空'
      }
    }

    // 检查登录尝试次数
    const attemptInfo = loginAttempts.get(credentials.email)
    if (attemptInfo && attemptInfo.lockedUntil && attemptInfo.lockedUntil > new Date()) {
      return {
        success: false,
        error: '账户已锁定，请稍后再试',
        isLocked: true,
        lockUntil: attemptInfo.lockedUntil
      }
    }

    // 查找用户
    const user = Array.from(users.values()).find(u => u.email === credentials.email)
    if (!user) {
      return {
        success: false,
        error: '用户不存在或密码错误'
      }
    }

    // 检查账户状态
    if (!user.isActive) {
      return {
        success: false,
        error: '账户已被禁用，请联系管理员',
        requiresEmailVerification: !user.isEmailVerified
      }
    }

    if (!user.isEmailVerified) {
      return {
        success: false,
        error: '邮箱尚未验证，请检查您的邮箱',
        requiresEmailVerification: true
      }
    }

    // 验证密码
    const isPasswordValid = await comparePassword(credentials.password, user.passwordHash)
    if (!isPasswordValid) {
      // 记录失败尝试
      await recordFailedLoginAttempt(credentials.email)

      return {
        success: false,
        error: '用户不存在或密码错误',
        loginAttempts: (attemptInfo?.count || 0) + 1
      }
    }

    // 清除登录尝试记录
    loginAttempts.delete(credentials.email)

    // 生成令牌
    const tokens = await generateAuthTokens(user)

    // 创建会话
    const sessionId = await createUserSession(user.id, {
      userAgent: 'login',
      ipAddress: '127.0.0.1'
    })

    // 更新最后登录时间
    user.lastLoginAt = new Date()
    user.updatedAt = new Date()

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return {
      success: true,
      user: userProfile,
      tokens,
      lastLoginAt: user.lastLoginAt,
      sessionId
    }

  } catch (error: any) {
    console.error('用户登录失败:', error)
    return {
      success: false,
      error: error.message || '登录失败，请稍后重试'
    }
  }
}

/**
 * 用户登出
 * @param refreshToken 刷新令牌
 * @returns {Promise<LogoutResult>} 登出结果
 */
export async function logoutUser(refreshToken: string): Promise<LogoutResult> {
  try {
    // 验证刷新令牌
    const tokenData = refreshTokens.get(refreshToken)
    if (!tokenData) {
      return {
        success: false,
        error: '无效的刷新令牌',
        loggedOutAt: new Date()
      }
    }

    // 删除刷新令牌
    refreshTokens.delete(refreshToken)

    // 删除用户会话
    const userSessions = Array.from(sessions.entries())
      .filter(([, session]) => session.userId === tokenData.userId)

    for (const [sessionId] of userSessions) {
      sessions.delete(sessionId)
    }

    return {
      success: true,
      loggedOutAt: new Date()
    }

  } catch (error: any) {
    console.error('用户登出失败:', error)
    return {
      success: false,
      error: error.message || '登出失败',
      loggedOutAt: new Date()
    }
  }
}

/**
 * 刷新访问令牌
 * @param refreshToken 刷新令牌
 * @returns {Promise<TokenRefreshResult>} 刷新结果
 */
export async function refreshToken(refreshToken: string): Promise<TokenRefreshResult> {
  try {
    // 验证刷新令牌
    const tokenData = refreshTokens.get(refreshToken)
    if (!tokenData || tokenData.expiresAt < new Date()) {
      return {
        success: false,
        error: '刷新令牌无效或已过期'
      }
    }

    // 查找用户
    const user = users.get(tokenData.userId)
    if (!user || !user.isActive) {
      return {
        success: false,
        error: '用户不存在或已被禁用'
      }
    }

    // 删除旧的刷新令牌
    refreshTokens.delete(refreshToken)

    // 生成新的令牌
    const tokens = await generateAuthTokens(user)

    return {
      success: true,
      tokens
    }

  } catch (error: any) {
    console.error('刷新令牌失败:', error)
    return {
      success: false,
      error: error.message || '刷新令牌失败'
    }
  }
}

/**
 * 修改密码
 * @param userId 用户ID
 * @param data 密码修改数据
 * @returns {Promise<PasswordChangeResult>} 修改结果
 */
export async function changePassword(userId: string, data: PasswordChangeData): Promise<PasswordChangeResult> {
  try {
    // 验证数据
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        error: '新密码确认不匹配',
        changedAt: new Date()
      }
    }

    if (!isPasswordStrong(data.newPassword)) {
      return {
        success: false,
        error: '新密码强度不足：密码必须包含大小写字母、数字，且长度至少8位',
        changedAt: new Date()
      }
    }

    // 查找用户
    const user = users.get(userId)
    if (!user) {
      return {
        success: false,
        error: '用户不存在',
        changedAt: new Date()
      }
    }

    // 验证当前密码
    const isCurrentPasswordValid = await comparePassword(data.currentPassword, user.passwordHash)
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        error: '当前密码错误',
        changedAt: new Date()
      }
    }

    // 更新密码
    user.passwordHash = await hashPassword(data.newPassword)
    user.updatedAt = new Date()

    // 删除所有刷新令牌，强制重新登录
    const tokensToDelete = Array.from(refreshTokens.entries())
      .filter(([, tokenData]) => tokenData.userId === userId)

    for (const [token] of tokensToDelete) {
      refreshTokens.delete(token)
    }

    return {
      success: true,
      changedAt: new Date()
    }

  } catch (error: any) {
    console.error('修改密码失败:', error)
    return {
      success: false,
      error: error.message || '修改密码失败',
      changedAt: new Date()
    }
  }
}

/**
 * 重置密码
 * @param data 重置密码数据
 * @returns {Promise<ResetPasswordResult>} 重置结果
 */
export async function resetPassword(data: ResetPasswordData): Promise<ResetPasswordResult> {
  try {
    // 验证数据
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        error: '新密码确认不匹配',
        resetAt: new Date()
      }
    }

    // 查找密码重置记录
    const resetRecord = passwordResets.get(data.email)
    if (!resetRecord || resetRecord.token !== data.token || resetRecord.expiresAt < new Date()) {
      return {
        success: false,
        error: '重置令牌无效或已过期',
        resetAt: new Date()
      }
    }

    // 查找用户
    const user = Array.from(users.values()).find(u => u.email === data.email)
    if (!user) {
      return {
        success: false,
        error: '用户不存在',
        resetAt: new Date()
      }
    }

    // 验证新密码强度
    if (!isPasswordStrong(data.newPassword)) {
      return {
        success: false,
        error: '新密码强度不足：密码必须包含大小写字母、数字，且长度至少8位',
        resetAt: new Date()
      }
    }

    // 更新密码
    user.passwordHash = await hashPassword(data.newPassword)
    user.updatedAt = new Date()

    // 删除重置记录
    passwordResets.delete(data.email)

    // 删除所有刷新令牌
    const tokensToDelete = Array.from(refreshTokens.entries())
      .filter(([, tokenData]) => tokenData.userId === user.id)

    for (const [token] of tokensToDelete) {
      refreshTokens.delete(token)
    }

    return {
      success: true,
      resetAt: new Date()
    }

  } catch (error: any) {
    console.error('重置密码失败:', error)
    return {
      success: false,
      error: error.message || '重置密码失败',
      resetAt: new Date()
    }
  }
}

/**
 * 验证邮箱
 * @param email 邮箱地址
 * @param token 验证令牌
 * @returns {Promise<EmailVerificationResult>} 验证结果
 */
export async function verifyEmail(email: string, token: string): Promise<EmailVerificationResult> {
  try {
    // 查找验证记录
    const verificationRecord = emailVerifications.get(email)
    if (!verificationRecord || verificationRecord.token !== token || verificationRecord.expiresAt < new Date()) {
      return {
        success: false,
        error: '验证令牌无效或已过期',
        verifiedAt: new Date()
      }
    }

    // 查找用户
    const user = Array.from(users.values()).find(u => u.email === email)
    if (!user) {
      return {
        success: false,
        error: '用户不存在',
        verifiedAt: new Date()
      }
    }

    // 激活用户
    user.isActive = true
    user.isEmailVerified = true
    user.emailVerifiedAt = new Date()
    user.updatedAt = new Date()

    // 删除验证记录
    emailVerifications.delete(email)

    return {
      success: true,
      verifiedAt: new Date(),
      isActive: true
    }

  } catch (error: any) {
    console.error('邮箱验证失败:', error)
    return {
      success: false,
      error: error.message || '邮箱验证失败',
      verifiedAt: new Date()
    }
  }
}

/**
 * 获取用户资料
 * @param userId 用户ID
 * @returns {Promise<ProfileResult>} 获取结果
 */
export async function getUserProfile(userId: string): Promise<ProfileResult> {
  try {
    const user = users.get(userId)
    if (!user) {
      return {
        success: false,
        error: '用户不存在'
      }
    }

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      bio: user.bio,
      avatar: user.avatar,
      preferences: user.preferences
    }

    return {
      success: true,
      user: userProfile
    }

  } catch (error: any) {
    console.error('获取用户资料失败:', error)
    return {
      success: false,
      error: error.message || '获取用户资料失败'
    }
  }
}

/**
 * 更新用户资料
 * @param userId 用户ID
 * @param data 更新数据
 * @returns {Promise<ProfileResult>} 更新结果
 */
export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<ProfileResult> {
  try {
    const user = users.get(userId)
    if (!user) {
      return {
        success: false,
        error: '用户不存在'
      }
    }

    // 不允许更新邮箱地址
    if (data.email && data.email !== user.email) {
      return {
        success: false,
        error: '不允许更新邮箱地址'
      }
    }

    // 更新用户资料
    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date()
    }

    users.set(userId, updatedUser)

    const userProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      isEmailVerified: updatedUser.isEmailVerified,
      emailVerifiedAt: updatedUser.emailVerifiedAt,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      preferences: updatedUser.preferences
    }

    return {
      success: true,
      user: userProfile,
      updatedAt: new Date()
    }

  } catch (error: any) {
    console.error('更新用户资料失败:', error)
    return {
      success: false,
      error: error.message || '更新用户资料失败'
    }
  }
}

/**
 * 检查用户权限
 * @param userId 用户ID
 * @param permission 权限名称
 * @returns {Promise<boolean>} 是否有权限
 */
export async function hasPermission(userId: string, permission: string): Promise<boolean> {
  try {
    const user = users.get(userId)
    if (!user || !user.isActive) {
      return false
    }

    // 简单的权限检查逻辑
    const rolePermissions: Record<string, string[]> = {
      admin: ['manage_users', 'manage_projects', 'manage_donations', 'view_reports', 'manage_settings'],
      manager: ['manage_projects', 'manage_donations', 'view_reports'],
      user: ['view_projects', 'make_donations', 'view_own_donations']
    }

    const permissions = rolePermissions[user.role] || []
    return permissions.includes(permission)

  } catch (error) {
    console.error('权限检查失败:', error)
    return false
  }
}

/**
 * 认证中间件
 * @param token 访问令牌
 * @returns {Promise<AuthMiddlewareResult>} 认证结果
 */
export async function requireAuth(token: string): Promise<AuthMiddlewareResult> {
  try {
    if (!token) {
      return {
        success: false,
        error: '缺少认证令牌'
      }
    }

    // 验证令牌
    const payload = verifyToken(token)
    if (!payload) {
      return {
        success: false,
        error: '认证失败'
      }
    }

    // 查找用户
    const user = users.get(payload.userId)
    if (!user || !user.isActive) {
      return {
        success: false,
        error: '用户不存在或已被禁用'
      }
    }

    // 检查会话
    if (payload.sessionId) {
      const session = sessions.get(payload.sessionId)
      if (!session || !session.isActive) {
        return {
          success: false,
          error: '会话已过期'
        }
      }

      // 更新会话活动时间
      session.lastActivity = new Date()
    }

    return {
      success: true,
      user
    }

  } catch (error: any) {
    console.error('认证中间件失败:', error)
    return {
      success: false,
      error: error.message || '认证失败'
    }
  }
}

/**
 * 生成JWT令牌
 * @param payload 令牌载荷
 * @param expiresIn 过期时间
 * @returns {string} JWT令牌
 */
export function generateToken(payload: Record<string, any>, expiresIn: string): string {
  // 简单的JWT生成实现（生产环境应使用专业库如jsonwebtoken）
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const exp = now + parseExpiration(expiresIn)

  const tokenPayload = {
    ...payload,
    iat: now,
    exp
  }

  // 简化的base64url编码
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))
  const signature = generateSignature(encodedHeader + '.' + encodedPayload)

  return encodedHeader + '.' + encodedPayload + '.' + signature
}

/**
 * 验证JWT令牌
 * @param token JWT令牌
 * @returns {TokenPayload | null} 令牌载荷
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [header, payload, signature] = parts

    // 验证签名
    const expectedSignature = generateSignature(header + '.' + payload)
    if (signature !== expectedSignature) {
      return null
    }

    // 解析载荷
    const decodedPayload = JSON.parse(base64UrlDecode(payload))

    // 检查过期时间
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return decodedPayload as TokenPayload

  } catch (error) {
    console.error('令牌验证失败:', error)
    return null
  }
}

/**
 * 哈希密码
 * @param password 明文密码
 * @returns {Promise<string>} 哈希后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex')

  return salt + ':' + hash
}

/**
 * 比较密码
 * @param password 明文密码
 * @param hashedPassword 哈希密码
 * @returns {Promise<boolean>} 是否匹配
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':')
  if (!salt || !hash) {
    return false
  }

  const computedHash = createHash('sha256')
    .update(password + salt)
    .digest('hex')

  return hash === computedHash
}

/**
 * 验证用户数据
 * @param data 用户数据
 * @throws {Error} 当数据无效时
 */
export function validateUserData(data: UserData): void {
  if (!data.email || !isValidEmail(data.email)) {
    throw new Error('邮箱格式不正确')
  }

  if (!data.password || data.password.length < 8) {
    throw new Error('密码长度至少8位')
  }

  if (!data.name || data.name.trim().length === 0) {
    throw new Error('姓名不能为空')
  }

  if (data.name.length > 50) {
    throw new Error('姓名不能超过50个字符')
  }

  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error('手机号码格式不正确')
  }
}

/**
 * 创建用户会话
 * @param userId 用户ID
 * @param sessionData 会话数据
 * @returns {Promise<string>} 会话ID
 */
export async function createUserSession(userId: string, sessionData: Partial<SessionData>): Promise<string> {
  const sessionId = generateSessionId()
  const now = new Date()

  const session: SessionData = {
    sessionId,
    userId,
    userAgent: sessionData.userAgent,
    ipAddress: sessionData.ipAddress,
    loginTime: now,
    lastActivity: now,
    isActive: true
  }

  sessions.set(sessionId, session)

  return sessionId
}

/**
 * 销毁用户会话
 * @param sessionId 会话ID
 * @returns {Promise<{ success: boolean; destroyedAt: Date }>} 销毁结果
 */
export async function destroyUserSession(sessionId: string): Promise<{ success: boolean; destroyedAt: Date }> {
  const session = sessions.get(sessionId)
  if (session) {
    session.isActive = false
    return {
      success: true,
      destroyedAt: new Date()
    }
  }

  return {
    success: false,
    destroyedAt: new Date()
  }
}

// 辅助函数

/**
 * 检查邮箱是否已存在
 * @param email 邮箱地址
 * @returns {Promise<boolean>} 是否存在
 */
async function isEmailExists(email: string): Promise<boolean> {
  return Array.from(users.values()).some(user => user.email === email)
}

/**
 * 检查密码强度
 * @param password 密码
 * @returns {boolean} 是否强密码
 */
function isPasswordStrong(password: string): boolean {
  // 至少8位，包含大小写字母和数字
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return password.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号码格式
 * @param phone 手机号码
 * @returns {boolean} 是否有效
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * 生成用户ID
 * @returns {string} 用户ID
 */
function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

/**
 * 生成验证令牌
 * @returns {string} 验证令牌
 */
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * 生成会话ID
 * @returns {string} 会话ID
 */
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

/**
 * 生成认证令牌
 * @param user 用户信息
 * @returns {Promise<AuthTokens>} 认证令牌
 */
async function generateAuthTokens(user: UserProfile & { passwordHash: string }): Promise<AuthTokens> {
  const now = new Date()
  const accessExpiresAt = new Date(now.getTime() + 15 * 60 * 1000) // 15分钟
  const refreshExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7天

  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access'
  }, '15m')

  const refreshToken = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh'
  }, '7d')

  // 存储刷新令牌
  refreshTokens.set(refreshToken, {
    userId: user.id,
    expiresAt: refreshExpiresAt
  })

  return {
    accessToken,
    refreshToken,
    expiresAt: accessExpiresAt,
    tokenType: 'Bearer'
  }
}

/**
 * 记录失败的登录尝试
 * @param email 邮箱地址
 */
async function recordFailedLoginAttempt(email: string): Promise<void> {
  const now = new Date()
  const attemptInfo = loginAttempts.get(email) || { count: 0, lastAttempt: now }

  attemptInfo.count++
  attemptInfo.lastAttempt = now

  // 如果失败次数过多，锁定账户
  if (attemptInfo.count >= 5) {
    attemptInfo.lockedUntil = new Date(now.getTime() + 30 * 60 * 1000) // 锁定30分钟
  }

  loginAttempts.set(email, attemptInfo)
}

/**
 * 解析过期时间字符串
 * @param expiresIn 过期时间字符串
 * @returns {number} 秒数
 */
function parseExpiration(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/)
  if (!match) return 3600 // 默认1小时

  const value = parseInt(match[1], 10)
  const unit = match[2]

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400
  }

  return value * (multipliers[unit] || 3600)
}

/**
 * Base64 URL 编码
 * @param str 字符串
 * @returns {string} 编码后的字符串
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Base64 URL 解码
 * @param str 字符串
 * @returns {string} 解码后的字符串
 */
function base64UrlDecode(str: string): string {
  str += new Array(5 - str.length % 4).join('=')
  return Buffer.from(str.replace(/\-/g, '+').replace(/_/g, '/'), 'base64').toString()
}

/**
 * 生成签名
 * @param data 数据
 * @returns {string} 签名
 */
function generateSignature(data: string): string {
  return createHash('sha256')
    .update(data + process.env.JWT_SECRET)
    .digest('hex')
    .substring(0, 32)
}

// 导出内存存储实例（用于测试和调试）
export const memoryStore = {
  users,
  sessions,
  refreshTokens,
  emailVerifications,
  passwordResets,
  loginAttempts
}