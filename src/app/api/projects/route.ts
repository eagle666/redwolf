/**
 * 捐赠项目管理API接口
 * 提供项目的创建、查询、列表等功能
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDonationProjects, createDonationProject } from '@/lib/models/donation-projects'

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: 获取捐赠项目列表
 *     tags: [Projects]
 *     description: 获取所有捐赠项目的列表，支持分页和筛选
 *     parameters:
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
 *       - name: status
 *         in: query
 *         description: 项目状态筛选
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, completed, paused]
 *       - name: category
 *         in: query
 *         description: 项目分类筛选
 *         required: false
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: 搜索关键词
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功返回项目列表
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
 *                     projects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
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

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: 创建新的捐赠项目
 *     tags: [Projects]
 *     description: 创建一个新的捐赠项目，需要管理员权限
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - targetAmount
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: 项目标题
 *                 example: "可可西里野生动物保护计划"
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 description: 项目描述
 *                 example: "保护可可西里地区的野生动物栖息地"
 *                 maxLength: 2000
 *               content:
 *                 type: string
 *                 description: 项目详细内容
 *                 example: "详细的保护计划内容..."
 *               targetAmount:
 *                 type: number
 *                 format: float
 *                 description: 目标金额（元）
 *                 example: 100000
 *                 minimum: 0.01
 *                 maximum: 999999999
 *               category:
 *                 type: string
 *                 description: 项目分类
 *                 example: "animal-protection"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: 开始日期
 *                 example: "2024-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: 结束日期
 *                 example: "2024-12-31"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 项目图片列表
 *                 example: ["image1.jpg", "image2.jpg"]
 *     responses:
 *       201:
 *         description: 项目创建成功
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *                 message:
 *                   type: string
 *                   example: "项目创建成功"
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