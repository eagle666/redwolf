/**
 * API统计信息接口
 * 返回API路由的统计数据
 */

import { NextResponse } from 'next/server'
import { getAPIStatistics } from '@/lib/swagger/generator'

/**
 * @swagger
 * /api/swagger/stats:
 *   get:
 *     summary: 获取API统计信息
 *     tags: [System]
 *     description: 获取所有API路由的统计数据，包括路由数量、接口总数等
 *     responses:
 *       200:
 *         description: 成功返回统计信息
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
 *                     totalRoutes:
 *                       type: integer
 *                       example: 8
 *                       description: API路由总数
 *                     totalEndpoints:
 *                       type: integer
 *                       example: 12
 *                       description: API接口总数
 *                     tags:
 *                       type: integer
 *                       example: 6
 *                       description: 标签数量
 *                     schemas:
 *                       type: integer
 *                       example: 8
 *                       description: 数据模型数量
 *                     routes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["/", "/auth/register", "/auth/login", "/projects"]
 *                       description: 路由列表
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: 响应时间戳
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET() {
  try {
    // 获取API统计信息
    const stats = getAPIStatistics()

    if (!stats) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'STATS_GENERATION_FAILED',
          message: '无法生成API统计信息',
          details: {}
        }
      }, { status: 500 })
    }

    // 返回统计信息
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('获取API统计失败:', error)

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
        details: error instanceof Error ? { message: error.message } : {}
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}