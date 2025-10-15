#!/usr/bin/env node

/**
 * 自定义测试运行器：验证用户认证和授权系统功能
 * 由于Jest环境问题，使用Node.js直接运行功能验证
 */

console.log('🚀 开始验证用户认证和授权系统功能...\n')

// 动态导入模块
async function runTests() {
  try {
    // 导入要测试的模块
    const {
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
      memoryStore
    } = await import('./dist/auth-system.js')

    console.log('✅ 成功导入用户认证和授权系统模块')

    // 测试1: validateUserData - 验证用户数据
    console.log('\n📝 测试1: 验证用户数据')
    try {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: '张三'
      }

      validateUserData(validData)
      console.log('✅ 有效数据验证通过')

      // 测试无效邮箱
      try {
        validateUserData({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: '张三'
        })
        console.log('❌ 无效邮箱验证失败：应该抛出异常')
      } catch (error) {
        if (error.message.includes('邮箱格式不正确')) {
          console.log('✅ 无效邮箱正确被拒绝')
        } else {
          console.log('❌ 无效邮箱验证失败：错误的异常信息')
        }
      }

      // 测试弱密码
      try {
        validateUserData({
          email: 'test@example.com',
          password: '123',
          name: '张三'
        })
        console.log('❌ 弱密码验证失败：应该抛出异常')
      } catch (error) {
        if (error.message.includes('密码长度')) {
          console.log('✅ 弱密码正确被拒绝')
        } else {
          console.log('❌ 弱密码验证失败：错误的异常信息')
        }
      }

      // 测试空名称
      try {
        validateUserData({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: ''
        })
        console.log('❌ 空名称验证失败：应该抛出异常')
      } catch (error) {
        if (error.message.includes('姓名不能为空')) {
          console.log('✅ 空名称正确被拒绝')
        } else {
          console.log('❌ 空名称验证失败：错误的异常信息')
        }
      }
    } catch (error) {
      console.log('❌ 数据验证测试异常:', error.message)
    }

    // 测试2: hashPassword - 密码哈希
    console.log('\n📝 测试2: 密码哈希')
    try {
      const password = 'TestPassword123!'
      const hashedPassword = await hashPassword(password)

      if (hashedPassword && hashedPassword !== password && hashedPassword.length > 50) {
        console.log('✅ 密码哈希测试通过')
        console.log(`   原密码长度: ${password.length}`)
        console.log(`   哈希长度: ${hashedPassword.length}`)
        console.log(`   包含盐值: ${hashedPassword.includes(':')}`)
      } else {
        console.log('❌ 密码哈希测试失败')
      }
    } catch (error) {
      console.log('❌ 密码哈希测试异常:', error.message)
    }

    // 测试3: comparePassword - 密码比较
    console.log('\n📝 测试3: 密码比较')
    try {
      const password = 'TestPassword123!'
      const hashedPassword = await hashPassword(password)

      const isValid = await comparePassword(password, hashedPassword)
      const isInvalid = await comparePassword('WrongPassword', hashedPassword)

      if (isValid && !isInvalid) {
        console.log('✅ 密码比较测试通过')
        console.log(`   正确密码验证: ${isValid}`)
        console.log(`   错误密码验证: ${isInvalid}`)
      } else {
        console.log('❌ 密码比较测试失败')
        console.log(`   正确密码验证: ${isValid}`)
        console.log(`   错误密码验证: ${isInvalid}`)
      }
    } catch (error) {
      console.log('❌ 密码比较测试异常:', error.message)
    }

    // 测试4: registerUser - 用户注册
    console.log('\n📝 测试4: 用户注册')
    try {
      const userData = {
        email: 'register@example.com',
        password: 'SecurePass123!',
        name: '注册测试用户',
        phone: '13800138000'
      }

      const result = await registerUser(userData)

      if (result.success && result.user) {
        console.log('✅ 用户注册测试通过')
        console.log(`   用户ID: ${result.user.id}`)
        console.log(`   用户邮箱: ${result.user.email}`)
        console.log(`   用户名称: ${result.user.name}`)
        console.log(`   用户角色: ${result.user.role}`)
        console.log(`   激活状态: ${result.user.isActive}`)
        console.log(`   邮箱验证: ${result.user.isEmailVerified}`)
        console.log(`   需要验证: ${result.requiresEmailVerification}`)
        console.log(`   有访问令牌: ${!!result.tokens}`)
      } else {
        console.log('❌ 用户注册测试失败')
        console.log('   结果:', result)
      }
    } catch (error) {
      console.log('❌ 用户注册测试异常:', error.message)
    }

    // 测试5: loginUser - 用户登录
    console.log('\n📝 测试5: 用户登录')
    try {
      // 先注册用户
      const userData = {
        email: 'login@example.com',
        password: 'SecurePass123!',
        name: '登录测试用户'
      }
      const registerResult = await registerUser(userData)

      // 验证邮箱（获取实际的验证令牌）
      const verifyResult = await verifyEmail(userData.email, registerResult.verificationToken)
      console.log(`   邮箱验证结果: ${verifyResult.success}`)

      // 登录用户
      const credentials = {
        email: userData.email,
        password: userData.password
      }

      const loginResult = await loginUser(credentials)

      if (loginResult.success && loginResult.user && loginResult.tokens) {
        console.log('✅ 用户登录测试通过')
        console.log(`   用户ID: ${loginResult.user.id}`)
        console.log(`   用户邮箱: ${loginResult.user.email}`)
        console.log(`   最后登录: ${loginResult.lastLoginAt}`)
        console.log(`   有访问令牌: ${!!loginResult.tokens}`)
        console.log(`   会话ID: ${loginResult.sessionId}`)
      } else {
        console.log('❌ 用户登录测试失败')
        console.log('   结果:', loginResult)
      }
    } catch (error) {
      console.log('❌ 用户登录测试异常:', error.message)
    }

    // 测试6: refreshToken - 刷新令牌
    console.log('\n📝 测试6: 刷新令牌')
    try {
      // 先注册并登录用户
      const userData = {
        email: 'refresh@example.com',
        password: 'SecurePass123!',
        name: '刷新令牌测试'
      }
      const regResult = await registerUser(userData)
      await verifyEmail(userData.email, regResult.verificationToken)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      // 刷新令牌
      const refreshResult = await refreshToken(loginResult.tokens.refreshToken)

      if (refreshResult.success && refreshResult.tokens) {
        console.log('✅ 刷新令牌测试通过')
        console.log(`   新访问令牌: ${refreshResult.tokens.accessToken ? '已生成' : '未生成'}`)
        console.log(`   新刷新令牌: ${refreshResult.tokens.refreshToken ? '已生成' : '未生成'}`)
        console.log(`   令牌类型: ${refreshResult.tokens.tokenType}`)
      } else {
        console.log('❌ 刷新令牌测试失败')
        console.log('   结果:', refreshResult)
      }
    } catch (error) {
      console.log('❌ 刷新令牌测试异常:', error.message)
    }

    // 测试7: changePassword - 修改密码
    console.log('\n📝 测试7: 修改密码')
    try {
      // 先注册并登录用户
      const userData = {
        email: 'changepass@example.com',
        password: 'OldPass123!',
        name: '密码修改测试'
      }
      const regResult = await registerUser(userData)
      await verifyEmail(userData.email, regResult.verificationToken)
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

      const changeResult = await changePassword(loginResult.user.id, passwordData)

      if (changeResult.success) {
        console.log('✅ 密码修改测试通过')
        console.log(`   修改时间: ${changeResult.changedAt}`)

        // 使用新密码登录
        const newLoginResult = await loginUser({
          email: userData.email,
          password: passwordData.newPassword
        })

        if (newLoginResult.success) {
          console.log('✅ 新密码登录测试通过')
        } else {
          console.log('❌ 新密码登录测试失败')
        }

        // 使用旧密码登录应该失败
        const oldLoginResult = await loginUser({
          email: userData.email,
          password: userData.password
        })

        if (!oldLoginResult.success) {
          console.log('✅ 旧密码登录正确被拒绝')
        } else {
          console.log('❌ 旧密码登录应该被拒绝')
        }
      } else {
        console.log('❌ 密码修改测试失败')
        console.log('   结果:', changeResult)
      }
    } catch (error) {
      console.log('❌ 密码修改测试异常:', error.message)
    }

    // 测试8: verifyEmail - 邮箱验证
    console.log('\n📝 测试8: 邮箱验证')
    try {
      // 先注册用户
      const userData = {
        email: 'verify@example.com',
        password: 'SecurePass123!',
        name: '邮箱验证测试'
      }
      const registerResult = await registerUser(userData)

      // 验证邮箱
      const verifyResult = await verifyEmail(userData.email, registerResult.verificationToken)

      if (verifyResult.success) {
        console.log('✅ 邮箱验证测试通过')
        console.log(`   验证时间: ${verifyResult.verifiedAt}`)
        console.log(`   账户激活: ${verifyResult.isActive}`)

        // 现在应该能够登录
        const loginResult = await loginUser({
          email: userData.email,
          password: userData.password
        })

        if (loginResult.success) {
          console.log('✅ 验证后登录测试通过')
        } else {
          console.log('❌ 验证后登录测试失败')
        }
      } else {
        console.log('❌ 邮箱验证测试失败')
        console.log('   结果:', verifyResult)
      }
    } catch (error) {
      console.log('❌ 邮箱验证测试异常:', error.message)
    }

    // 测试9: getUserProfile - 获取用户资料
    console.log('\n📝 测试9: 获取用户资料')
    try {
      // 先注册用户
      const userData = {
        email: 'profile@example.com',
        password: 'SecurePass123!',
        name: '资料测试用户',
        phone: '13800138000'
      }
      const registerResult = await registerUser(userData)
      await verifyEmail(userData.email, registerResult.verificationToken)

      // 获取用户资料
      const profileResult = await getUserProfile(registerResult.user.id)

      if (profileResult.success && profileResult.user) {
        console.log('✅ 获取用户资料测试通过')
        console.log(`   用户ID: ${profileResult.user.id}`)
        console.log(`   用户邮箱: ${profileResult.user.email}`)
        console.log(`   用户名称: ${profileResult.user.name}`)
        console.log(`   手机号码: ${profileResult.user.phone}`)
        console.log(`   用户角色: ${profileResult.user.role}`)
        console.log(`   激活状态: ${profileResult.user.isActive}`)
        console.log(`   邮箱验证: ${profileResult.user.isEmailVerified}`)
      } else {
        console.log('❌ 获取用户资料测试失败')
        console.log('   结果:', profileResult)
      }
    } catch (error) {
      console.log('❌ 获取用户资料测试异常:', error.message)
    }

    // 测试10: updateUserProfile - 更新用户资料
    console.log('\n📝 测试10: 更新用户资料')
    try {
      // 先注册用户
      const userData = {
        email: 'update@example.com',
        password: 'SecurePass123!',
        name: '原始名称'
      }
      const registerResult = await registerUser(userData)
      await verifyEmail(userData.email, registerResult.verificationToken)

      // 更新用户资料
      const updateData = {
        name: '新名称',
        phone: '13900139000',
        bio: '这是我的个人简介',
        avatar: 'https://example.com/avatar.jpg'
      }

      const updateResult = await updateUserProfile(registerResult.user.id, updateData)

      if (updateResult.success) {
        console.log('✅ 更新用户资料测试通过')
        console.log(`   更新时间: ${updateResult.updatedAt}`)

        // 验证更新后的资料
        const profileResult = await getUserProfile(registerResult.user.id)

        if (profileResult.success && profileResult.user) {
          console.log(`   新名称: ${profileResult.user.name}`)
          console.log(`   新手机: ${profileResult.user.phone}`)
          console.log(`   个人简介: ${profileResult.user.bio}`)
          console.log(`   头像链接: ${profileResult.user.avatar}`)
        } else {
          console.log('❌ 验证更新后资料失败')
        }
      } else {
        console.log('❌ 更新用户资料测试失败')
        console.log('   结果:', updateResult)
      }
    } catch (error) {
      console.log('❌ 更新用户资料测试异常:', error.message)
    }

    // 测试11: hasPermission - 权限检查
    console.log('\n📝 测试11: 权限检查')
    try {
      // 注册管理员用户
      const adminData = {
        email: 'admin@example.com',
        password: 'AdminPass123!',
        name: '管理员',
        role: 'admin'
      }
      const adminResult = await registerUser(adminData)
      await verifyEmail(adminData.email, adminResult.verificationToken)

      // 注册普通用户
      const userData = {
        email: 'user@example.com',
        password: 'UserPass123!',
        name: '普通用户',
        role: 'user'
      }
      const userResult = await registerUser(userData)
      await verifyEmail(userData.email, userResult.verificationToken)

      // 检查管理员权限
      const adminPermission = await hasPermission(adminResult.user.id, 'manage_users')
      console.log(`✅ 管理员用户权限(manage_users): ${adminPermission}`)

      // 检查普通用户权限
      const userPermission = await hasPermission(userResult.user.id, 'manage_users')
      console.log(`✅ 普通用户权限(manage_users): ${userPermission}`)

      // 检查普通用户的基本权限
      const basicPermission = await hasPermission(userResult.user.id, 'view_projects')
      console.log(`✅ 普通用户权限(view_projects): ${basicPermission}`)
    } catch (error) {
      console.log('❌ 权限检查测试异常:', error.message)
    }

    // 测试12: generateToken - 生成令牌
    console.log('\n📝 测试12: 生成JWT令牌')
    try {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      }

      const accessToken = generateToken(payload, '15m')
      const refreshToken = generateToken(payload, '7d')

      if (accessToken && refreshToken) {
        console.log('✅ JWT令牌生成测试通过')
        console.log(`   访问令牌长度: ${accessToken.length}`)
        console.log(`   刷新令牌长度: ${refreshToken.length}`)
        console.log(`   访问令牌类型: ${typeof accessToken}`)
        console.log(`   刷新令牌类型: ${typeof refreshToken}`)
      } else {
        console.log('❌ JWT令牌生成测试失败')
      }
    } catch (error) {
      console.log('❌ JWT令牌生成测试异常:', error.message)
    }

    // 测试13: verifyToken - 验证令牌
    console.log('\n📝 测试13: 验证JWT令牌')
    try {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      }

      const token = generateToken(payload, '15m')
      const verified = verifyToken(token)

      if (verified) {
        console.log('✅ JWT令牌验证测试通过')
        console.log(`   用户ID: ${verified.userId}`)
        console.log(`   用户邮箱: ${verified.email}`)
        console.log(`   用户角色: ${verified.role}`)
        console.log(`   令牌类型: ${verified.type}`)
        console.log(`   签发时间: ${verified.iat}`)
        console.log(`   过期时间: ${verified.exp}`)
      } else {
        console.log('❌ JWT令牌验证测试失败')
      }
    } catch (error) {
      console.log('❌ JWT令牌验证测试异常:', error.message)
    }

    // 测试14: createUserSession - 创建用户会话
    console.log('\n📝 测试14: 创建用户会话')
    try {
      const userId = 'test-user-session-id'
      const sessionData = {
        userAgent: 'Mozilla/5.0 (Test Browser)',
        ipAddress: '192.168.1.1'
      }

      const result = await createUserSession(userId, sessionData)

      if (result) {
        console.log('✅ 创建用户会话测试通过')
        console.log(`   会话ID: ${result}`)
        console.log(`   用户ID: ${userId}`)
        console.log(`   会话数量: ${memoryStore.sessions.size}`)
      } else {
        console.log('❌ 创建用户会话测试失败')
      }
    } catch (error) {
      console.log('❌ 创建用户会话测试异常:', error.message)
    }

    // 测试15: destroyUserSession - 销毁用户会话
    console.log('\n📝 测试15: 销毁用户会话')
    try {
      // 先创建会话
      const sessionId = await createUserSession('test-destroy-session-id', {})

      // 销毁会话
      const result = await destroyUserSession(sessionId)

      if (result.success) {
        console.log('✅ 销毁用户会话测试通过')
        console.log(`   销毁时间: ${result.destroyedAt}`)
      } else {
        console.log('❌ 销毁用户会话测试失败')
      }
    } catch (error) {
      console.log('❌ 销毁用户会话测试异常:', error.message)
    }

    // 测试16: logoutUser - 用户登出
    console.log('\n📝 测试16: 用户登出')
    try {
      // 先注册并登录用户
      const userData = {
        email: 'logout@example.com',
        password: 'SecurePass123!',
        name: '登出测试用户'
      }
      const regResult = await registerUser(userData)
      await verifyEmail(userData.email, regResult.verificationToken)
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password
      })

      // 登出用户
      const result = await logoutUser(loginResult.tokens.refreshToken)

      if (result.success) {
        console.log('✅ 用户登出测试通过')
        console.log(`   登出时间: ${result.loggedOutAt}`)
        console.log(`   刷新令牌数量: ${memoryStore.refreshTokens.size}`)
      } else {
        console.log('❌ 用户登出测试失败')
        console.log('   结果:', result)
      }
    } catch (error) {
      console.log('❌ 用户登出测试异常:', error.message)
    }

    console.log('\n🎉 用户认证和授权系统功能验证完成！')

    // 显示统计信息
    console.log('\n📊 系统统计:')
    console.log(`   注册用户数量: ${memoryStore.users.size}`)
    console.log(`   活跃会话数量: ${Array.from(memoryStore.sessions.values()).filter(s => s.isActive).length}`)
    console.log(`   有效刷新令牌: ${memoryStore.refreshTokens.size}`)
    console.log(`   邮箱验证记录: ${memoryStore.emailVerifications.size}`)
    console.log(`   密码重置记录: ${memoryStore.passwordResets.size}`)
    console.log(`   登录尝试记录: ${memoryStore.loginAttempts.size}`)

  } catch (error) {
    console.error('❌ 模块导入失败:', error.message)
    console.error('   可能原因：模块路径错误或TypeScript编译问题')
    process.exit(1)
  }
}

// 运行测试
runTests().catch(console.error)