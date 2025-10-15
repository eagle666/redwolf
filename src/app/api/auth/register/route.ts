/**
 * 用户注册API接口
 */

import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/services/auth-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, password, name, phone } = body

    // 验证必需字段
    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少必需字段：email, password, name',
          details: {}
        }
      }, { status: 400 })
    }

    // 调用用户注册服务
    const result = await registerUser({
      email,
      password,
      name,
      phone
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          user: result.user,
          token: result.token
        },
        message: '注册成功'
      }, { status: 201 })
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: result.errorCode || 'REGISTRATION_FAILED',
          message: result.error || '注册失败',
          details: result.details || {}
        }
      }, { status: 400 })
    }

  } catch (error) {
    console.error('注册接口错误:', error)
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