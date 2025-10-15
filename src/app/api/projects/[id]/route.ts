/**
 * 单个项目API接口
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDonationProjectById, updateDonationProject, deleteDonationProject } from '@/lib/models/donation-projects'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少项目ID',
          details: {}
        }
      }, { status: 400 })
    }

    // 调用获取项目详情服务
    const project = await getDonationProjectById(id)

    if (project) {
      return NextResponse.json({
        success: true,
        data: {
          project
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: '项目不存在',
          details: {}
        }
      }, { status: 404 })
    }

  } catch (error) {
    console.error('获取项目详情接口错误:', error)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少项目ID',
          details: {}
        }
      }, { status: 400 })
    }

    // 调用更新项目服务
    const project = await updateDonationProject(id, body)

    return NextResponse.json({
      success: true,
      data: {
        project
      },
      message: '项目更新成功'
    })

  } catch (error) {
    console.error('更新项目接口错误:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少项目ID',
          details: {}
        }
      }, { status: 400 })
    }

    // 调用删除项目服务
    await deleteDonationProject(id)

    return NextResponse.json({
      success: true,
      message: '项目删除成功'
    })

  } catch (error) {
    console.error('删除项目接口错误:', error)
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