/**
 * 项目管理API接口
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDonationProjects, createDonationProject } from '@/lib/models/donation-projects'

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
    const result = await getDonationProjects({
      page,
      limit,
      status,
      featured: undefined
    })

    return NextResponse.json({
      success: true,
      data: {
        projects: result.projects,
        pagination: result.pagination
      }
    })

  } catch (error) {
    console.error('项目列表接口错误:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
        details: error instanceof Error ? { message: error.message } : {}
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
    const project = await createDonationProject({
      title,
      description,
      targetAmount
    })

    return NextResponse.json({
      success: true,
      data: {
        project
      },
      message: '项目创建成功'
    }, { status: 201 })

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