/**
 * 捐赠管理API接口
 * 提供捐赠记录的创建、查询功能
 */

import { NextRequest, NextResponse } from 'next/server'
import { createDonationRecord, getDonationsByProject } from '@/lib/models/donations'

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: 创建捐赠记录
 *     tags: [Donations]
 *     description: 创建新的捐赠记录，生成支付链接
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - amount
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *                 description: 项目ID
 *                 example: "project_123"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: 捐赠金额（元）
 *                 example: 100
 *                 minimum: 0.01
 *               message:
 *                 type: string
 *                 description: 捐赠留言
 *                 example: "支持野生动物保护！"
 *                 maxLength: 500
 *               isAnonymous:
 *                 type: boolean
 *                 description: 是否匿名捐赠
 *                 example: false
 *               paymentMethod:
 *                 type: string
 *                 description: 支付方式
 *                 example: "creem"
 *                 enum: [creem, alipay, wechat, bank]
 *     responses:
 *       201:
 *         description: 捐赠记录创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     donation:
 *                       $ref: '#/components/schemas/Donation'
 *                     paymentUrl:
 *                       type: string
 *                       format: uri
 *                       example: "https://payment.creem.io/pay/donation_123"
 *                       description: 支付链接
 *                 message:
 *                   type: string
 *                   example: "捐赠创建成功，请完成支付"
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权访问
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: 获取捐赠记录列表
 *     tags: [Donations]
 *     description: 获取捐赠记录列表，支持按项目、用户、状态等条件筛选
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: query
 *         description: 项目ID筛选
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "project_123"
 *       - name: userId
 *         in: query
 *         description: 用户ID筛选
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "user_123"
 *       - name: status
 *         in: query
 *         description: 捐赠状态筛选
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed]
 *           example: "completed"
 *       - name: page
 *         in: query
 *         description: 页码
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: 每页数量
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: 成功返回捐赠记录列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     donations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Donation'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: 未授权访问
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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