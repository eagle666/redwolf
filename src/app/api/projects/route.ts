/**
 * 项目管理API接口
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProjects, createProject } from '@/lib/models/donation-projects'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 解析查询参数
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined

    // 调用项目列表服务
    const result = await getProjects({
      page,
      limit,
      status,
      category,
      search
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          projects: result.projects,
          pagination: result.pagination
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: result.errorCode || 'QUERY_FAILED',
          message: result.error || '查询失败',
          details: result.details || {}
        }
      }, { status: 400 })
    }

  } catch (error) {
    console.error('项目列表接口错误:', error)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      description,
      content,
      targetAmount,
      category,
      startDate,
      endDate,
      images
    } = body

    // 验证必需字段
    if (!title || !description || !targetAmount || !category) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少必需字段：title, description, targetAmount, category',
          details: {}
        }
      }, { status: 400 })
    }

    // 调用创建项目服务
    const result = await createProject({
      title,
      description,
      content,
      targetAmount,
      category,
      startDate,
      endDate,
      images
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          project: result.project
        },
        message: '项目创建成功'
      }, { status: 201 })
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: result.errorCode || 'CREATION_FAILED',
          message: result.error || '项目创建失败',
          details: result.details || {}
        }
      }, { status: 400 })
    }

  } catch (error) {
    console.error('创建项目接口错误:', error)
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