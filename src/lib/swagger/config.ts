/**
 * Swagger API文档配置
 * 用于生成完整的API文档界面
 */

import swaggerJsdoc from 'swagger-jsdoc'
import yaml from 'yamljs'

// Swagger配置选项
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '可可西里网红狼公益网站 API',
      version: '1.0.0',
      description: `
        可可西里网红狼公益网站的后端API接口文档

        ## 功能特性
        - 🔐 用户认证和授权
        - 📁 捐赠项目管理
        - 💰 捐赠记录处理
        - 📧 邮件通知服务
        - 📊 数据分析和报告
        - 📁 文件上传管理
        - 🔍 全文搜索功能

        ## 认证方式
        大部分API需要JWT Token认证：
        1. 先调用 \`POST /api/auth/login\` 获取token
        2. 在请求头中添加：\`Authorization: Bearer <your-token>\`
        3. 调用需要认证的API

        ## 错误处理
        所有API都返回标准化的错误格式：
        - \`success\`: 请求是否成功
        - \`error.code\`: 错误代码
        - \`error.message\`: 错误描述
        - \`error.details\`: 详细信息

        ## 测试建议
        1. 先测试系统健康检查：\`GET /api/system/health\`
        2. 注册测试用户：\`POST /api/auth/register\`
        3. 登录获取token：\`POST /api/auth/login\`
        4. 使用token测试其他API
      `,
      contact: {
        name: '可可西里网红狼公益网站',
        email: 'support@redwolf.org',
        url: 'https://redwolf.org'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '开发环境服务器'
      },
      {
        url: 'https://redwolf.org',
        description: '生产环境服务器'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT认证token，在登录API中获取'
        }
      },
      schemas: {
        // 通用响应格式
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
              description: '请求是否成功'
            },
            data: {
              type: 'object',
              description: '返回的数据'
            },
            message: {
              type: 'string',
              example: '操作成功',
              description: '操作结果描述'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: '响应时间戳'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
              description: '请求是否成功'
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                  description: '错误代码'
                },
                message: {
                  type: 'string',
                  example: '请求参数无效',
                  description: '错误描述'
                },
                details: {
                  type: 'object',
                  description: '错误详细信息'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: '响应时间戳'
            }
          }
        },
        // 用户相关
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'user_123',
              description: '用户ID'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
              description: '用户邮箱'
            },
            name: {
              type: 'string',
              example: '张三',
              description: '用户姓名'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
              description: '用户角色'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            }
          }
        },
        // 捐赠项目相关
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'project_123',
              description: '项目ID'
            },
            title: {
              type: 'string',
              example: '可可西里野生动物保护计划',
              description: '项目标题'
            },
            description: {
              type: 'string',
              example: '保护可可西里地区的野生动物...',
              description: '项目描述'
            },
            targetAmount: {
              type: 'number',
              format: 'float',
              example: 100000,
              description: '目标金额（元）'
            },
            currentAmount: {
              type: 'number',
              format: 'float',
              example: 75000,
              description: '当前已筹金额（元）'
            },
            donorCount: {
              type: 'integer',
              example: 1250,
              description: '捐赠人数'
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'cancelled'],
              example: 'active',
              description: '项目状态'
            },
            category: {
              type: 'string',
              example: 'animal-protection',
              description: '项目分类'
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/image.jpg',
              description: '项目图片'
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-01',
              description: '开始日期'
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-12-31',
              description: '结束日期'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            }
          }
        },
        // 捐赠记录相关
        Donation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'donation_123',
              description: '捐赠记录ID'
            },
            projectId: {
              type: 'string',
              format: 'uuid',
              example: 'project_123',
              description: '项目ID'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              example: 'user_123',
              description: '用户ID'
            },
            amount: {
              type: 'number',
              format: 'float',
              example: 100,
              description: '捐赠金额（元）'
            },
            message: {
              type: 'string',
              example: '支持野生动物保护！',
              description: '捐赠留言'
            },
            isAnonymous: {
              type: 'boolean',
              example: false,
              description: '是否匿名捐赠'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
              example: 'completed',
              description: '捐赠状态'
            },
            paymentMethod: {
              type: 'string',
              example: 'creem',
              description: '支付方式'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            }
          }
        },
        // 分页信息
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
              description: '当前页码'
            },
            limit: {
              type: 'integer',
              example: 10,
              description: '每页数量'
            },
            total: {
              type: 'integer',
              example: 25,
              description: '总记录数'
            },
            totalPages: {
              type: 'integer',
              example: 3,
              description: '总页数'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: '用户认证相关接口'
      },
      {
        name: 'Projects',
        description: '捐赠项目管理接口'
      },
      {
        name: 'Donations',
        description: '捐赠记录接口'
      },
      {
        name: 'System',
        description: '系统管理接口'
      },
      {
        name: 'Files',
        description: '文件管理接口'
      },
      {
        name: 'Notifications',
        description: '通知服务接口'
      }
    ]
  },
  apis: [
    './src/app/api/**/*.ts',  // 扫描所有API路由文件
    './src/lib/**/*.ts'       // 扫描库文件
  ],
}

// 生成Swagger规范
export function generateSwaggerSpec() {
  try {
    const specs = swaggerJsdoc(options)
    console.log('✅ Swagger规范生成成功')
    return specs
  } catch (error) {
    console.error('❌ Swagger规范生成失败:', error)
    throw error
  }
}

// 生成YAML格式的规范
export function generateSwaggerYAML() {
  try {
    const specs = generateSwaggerSpec()
    const yamlSpec = yaml.stringify(specs)
    console.log('✅ Swagger YAML规范生成成功')
    return yamlSpec
  } catch (error) {
    console.error('❌ Swagger YAML规范生成失败:', error)
    throw error
  }
}

// 导出配置
export { options as swaggerOptions }