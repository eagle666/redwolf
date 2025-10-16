/**
 * 系统健康检查API接口
 * 提供系统状态监控和健康检查功能
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkSystemHealth } from '@/lib/services/system-integration'

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     summary: 系统健康检查
 *     tags: [System]
 *     description: 检查系统各组件的健康状态，包括数据库、缓存、外部服务等
 *     parameters:
 *       - name: components
 *         in: query
 *         description: 指定要检查的组件
 *         required: false
 *         schema:
 *           type: string
 *           example: "database,redis,creem-api,storage"
 *       - name: timeout
 *         in: query
 *         description: 检查超时时间（毫秒）
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5000
 *       - name: includeMetrics
 *         in: query
 *         description: 是否包含系统指标
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: 系统健康检查结果
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
 *                     status:
 *                       type: string
 *                       enum: [healthy, degraded, unhealthy]
 *                       example: "healthy"
 *                       description: 系统整体状态
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: 检查时间戳
 *                     services:
 *                       type: object
 *                       description: 各组件状态
 *                       properties:
 *                         database:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                               enum: [healthy, unhealthy]
 *                               example: "healthy"
 *                             responseTime:
 *                               type: integer
 *                               example: 150
 *                               description: 响应时间（毫秒）
 *                             timestamp:
 *                               type: string
 *                               format: date-time
 *                               description: 检查时间
 *                     metrics:
 *                       type: object
 *                       properties:
 *                         cpu:
 *                           type: object
 *                           properties:
 *                             usage:
 *                               type: number
 *                               example: 45.2
 *                               description: CPU使用率（%）
 *                         memory:
 *                           type: object
 *                           properties:
 *                             usage:
 *                               type: number
 *                               example: 67.8
 *                               description: 内存使用率（%）
 *                         disk:
 *                           type: object
 *                           properties:
 *                             usage:
 *                               type: number
 *                               example: 32.1
 *                               description: 磁盘使用率（%）
 *                     responseTime:
 *                       type: integer
 *                       example: 1200
 *                       description: 总响应时间（毫秒）
 *       503:
 *         description: 系统不健康
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "HEALTH_CHECK_FAILED"
 *                     message:
 *                       type: string
 *                       example: "系统健康检查失败"
 *                     details:
 *                       type: object
 *                       description: 详细错误信息
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    // 调用系统健康检查服务
    const result = await checkSystemHealth({
      components: ['database', 'redis', 'creem-api', 'storage'],
      includeMetrics: true,
      thresholds: {
        cpu: 80,
        memory: 85,
        disk: 90
      }
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          status: result.status,
          timestamp: result.timestamp,
          services: result.components,
          metrics: result.metrics,
          responseTime: result.responseTime
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: '系统健康检查失败',
          details: {
            status: result.status,
            components: result.components
          }
        }
      }, { status: 503 })
    }

  } catch (error) {
    console.error('系统健康检查接口错误:', error)
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