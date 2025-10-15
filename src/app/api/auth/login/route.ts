/**
 * 用户登录API接口
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/services/auth-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, password } = body

    // 验证必需字段
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少必需字段：email, password',
          details: {}
        }
      }, { status: 400 })
    }

    // 调用用户认证服务
    const result = await authenticateUser({
      email,
      password
    })

    if (result.success) {
      // 设置HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
          expiresIn: result.expiresIn
        },
        message: '登录成功'
      })

      // 设置cookie
      response.cookies.set('auth-token', result.token || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: result.expiresIn || 86400,
        path: '/'
      })

      return response
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: result.errorCode || 'INVALID_CREDENTIALS',
          message: result.error || '用户名或密码错误',
          details: result.details || {}
        }
      }, { status: 401 })
    }

  } catch (error) {
    console.error('登录接口错误:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
        details: {}
      }
    }, { status: 500 })
  }
}