/**
 * 捐赠管理API接口
 */

import { NextRequest, NextResponse } from 'next/server'
import { createDonationRecord, getDonationsByProject } from '@/lib/models/donations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      projectId,
      amount,
      message,
      isAnonymous,
      paymentMethod
    } = body

    // 验证必需字段
    if (!projectId || !amount) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少必需字段：projectId, amount',
          details: {}
        }
      }, { status: 400 })
    }

    // 调用创建捐赠服务
    const donation = await createDonationRecord({
      projectId,
      amount,
      supporterName: '匿名用户',
      supporterEmail: null,
      message,
      paymentMethod
    })

    return NextResponse.json({
      success: true,
      data: {
        donation,
        paymentUrl: `https://payment.creem.io/pay/${donation.id}`
      },
      message: '捐赠创建成功，请完成支付'
    }, { status: 201 })

  } catch (error) {
    console.error('创建捐赠接口错误:', error)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 解析查询参数
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const projectId = searchParams.get('projectId') || undefined
    const userId = searchParams.get('userId') || undefined
    const status = searchParams.get('status') || undefined

    // 调用获取捐赠列表服务
    if (projectId) {
      const result = await getDonationsByProject(projectId, {
        page,
        limit,
        status
      })

      return NextResponse.json({
        success: true,
        data: {
          donations: result.donations,
          pagination: result.pagination
        }
      })
    } else {
      // 如果没有projectId，返回空列表
      return NextResponse.json({
        success: true,
        data: {
          donations: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        }
      })
    }

  } catch (error) {
    console.error('获取捐赠列表接口错误:', error)
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