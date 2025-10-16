/**
 * Swagger API规范接口
 * 返回完整的OpenAPI规范文档
 */

import { NextResponse } from 'next/server'
import { generateAPIDocumentation } from '@/lib/swagger/generator'

export async function GET() {
  try {
    // 生成API文档规范
    const spec = generateAPIDocumentation()

    // 返回JSON格式的OpenAPI规范
    return NextResponse.json(spec, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('生成Swagger规范失败:', error)

    return NextResponse.json({
      success: false,
      error: {
        code: 'SPEC_GENERATION_FAILED',
        message: '无法生成API文档规范',
        details: error instanceof Error ? { message: error.message } : {}
      }
    }, { status: 500 })
  }
}