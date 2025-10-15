/**
 * 系统健康检查API接口
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkSystemHealth } from '@/lib/services/system-integration'

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