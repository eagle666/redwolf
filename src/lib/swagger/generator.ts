/**
 * API文档生成器
 * 自动扫描API路由并生成文档
 */

import fs from 'fs'
import path from 'path'
import { generateSwaggerSpec } from './config'

// API路由文件路径
const API_DIR = path.join(process.cwd(), 'src/app/api')

// 扫描API路由文件
export function scanAPIRoutes() {
  const routes: string[] = []

  function scanDirectory(dir: string, basePath = '') {
    try {
      const files = fs.readdirSync(dir)

      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          scanDirectory(filePath, path.join(basePath, file))
        } else if (file === 'route.ts') {
          // 将文件路径转换为API路径
          const apiPath = basePath.replace(/\\/g, '/')
          if (apiPath) {
            routes.push(`/${apiPath}`)
          } else {
            routes.push('/') // 根路径
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ 无法扫描目录 ${dir}:`, error)
    }
  }

  scanDirectory(API_DIR)
  return routes
}

// 生成API文档
export function generateAPIDocumentation() {
  try {
    console.log('🚀 开始生成API文档...')

    // 扫描所有API路由
    const routes = scanAPIRoutes()
    console.log(`📁 发现 ${routes.length} 个API路由:`, routes)

    // 生成Swagger规范
    const swaggerSpec = generateSwaggerSpec()

    // 添加路由信息到规范
    if (!swaggerSpec.paths) {
      swaggerSpec.paths = {}
    }

    // 为每个发现的路由添加基本信息
    routes.forEach(route => {
      if (!swaggerSpec.paths[route]) {
        swaggerSpec.paths[route] = {}
      }
    })

    console.log('✅ API文档生成完成')
    return swaggerSpec
  } catch (error) {
    console.error('❌ API文档生成失败:', error)
    throw error
  }
}

// 保存API文档到文件
export function saveAPIDocumentation(format: 'json' | 'yaml' = 'json') {
  try {
    const docsDir = path.join(process.cwd(), 'public', 'api-docs')

    // 确保目录存在
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true })
    }

    const spec = generateAPIDocumentation()

    if (format === 'json') {
      const jsonPath = path.join(docsDir, 'openapi.json')
      fs.writeFileSync(jsonPath, JSON.stringify(spec, null, 2))
      console.log(`💾 JSON文档已保存到: ${jsonPath}`)
    } else {
      const yaml = require('yamljs')
      const yamlPath = path.join(docsDir, 'openapi.yaml')
      fs.writeFileSync(yamlPath, yaml.stringify(spec))
      console.log(`💾 YAML文档已保存到: ${yamlPath}`)
    }

    return true
  } catch (error) {
    console.error('❌ 保存API文档失败:', error)
    return false
  }
}

// 获取API统计信息
export function getAPIStatistics() {
  try {
    const routes = scanAPIRoutes()
    const spec = generateAPIDocumentation()

    const stats = {
      totalRoutes: routes.length,
      totalEndpoints: Object.keys(spec.paths || {}).length,
      tags: Object.keys(spec.tags || {}).length,
      schemas: Object.keys(spec.components?.schemas || {}).length,
      routes: routes
    }

    console.log('📊 API统计信息:', stats)
    return stats
  } catch (error) {
    console.error('❌ 获取API统计失败:', error)
    return null
  }
}