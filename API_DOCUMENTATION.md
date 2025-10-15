# 可可西里网红狼公益网站 API 文档

## 📋 概述

本文档描述了可可西里网红狼公益网站的所有API接口，包括用户认证、项目管理、捐赠处理、文件上传等功能。所有API都遵循RESTful设计原则，使用JSON格式进行数据交换。

**基础信息:**
- **基础URL**: `http://localhost:3000/api`
- **API版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8
- **时区**: UTC+8 (北京时间)

## 🔐 认证方式

### JWT Token认证
大部分API需要JWT Token进行认证：

```http
Authorization: Bearer <your-jwt-token>
```

### 获取Token
通过登录接口获取Token：

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📚 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### HTTP状态码
- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 权限不足
- `404` - 资源不存在
- `429` - 请求频率限制
- `500` - 服务器内部错误

---

## 🔑 用户认证接口

### 1. 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户姓名",
  "phone": "13800138000"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "用户姓名",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

### 2. 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "用户姓名",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "message": "登录成功"
}
```

### 3. 用户登出
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### 4. 刷新Token
```http
POST /api/auth/refresh
Authorization: Bearer <token>
```

### 5. 获取当前用户信息
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 6. 忘记密码
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 7. 重置密码
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "newPassword": "newpassword123"
}
```

---

## 📁 捐赠项目管理接口

### 1. 获取项目列表
```http
GET /api/projects?page=1&limit=10&status=active&category=animal-protection
Authorization: Bearer <token> (可选)
```

**查询参数:**
- `page` (number): 页码，默认1
- `limit` (number): 每页数量，默认10
- `status` (string): 项目状态 (active, completed, cancelled)
- `category` (string): 项目分类
- `search` (string): 搜索关键词

**响应示例:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project_123",
        "title": "可可西里野生动物保护计划",
        "description": "保护可可西里地区的野生动物...",
        "targetAmount": 100000,
        "currentAmount": 75000,
        "donorCount": 1250,
        "status": "active",
        "category": "animal-protection",
        "imageUrl": "https://example.com/image.jpg",
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 2. 获取项目详情
```http
GET /api/projects/:id
Authorization: Bearer <token> (可选)
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "project_123",
      "title": "可可西里野生动物保护计划",
      "description": "详细的项目描述...",
      "content": "项目的详细内容...",
      "targetAmount": 100000,
      "currentAmount": 75000,
      "donorCount": 1250,
      "status": "active",
      "category": "animal-protection",
      "organizer": {
        "id": "org_123",
        "name": "可可西里保护协会",
        "description": "专注于野生动物保护的公益组织"
      },
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "updates": [
        {
          "id": "update_123",
          "title": "项目进展更新",
          "content": "本月我们成功救助了10只藏羚羊...",
          "createdAt": "2024-01-15T00:00:00.000Z"
        }
      ],
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 3. 创建项目 (管理员权限)
```http
POST /api/projects
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "新保护项目",
  "description": "项目描述",
  "content": "项目详细内容",
  "targetAmount": 50000,
  "category": "animal-protection",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "images": ["image1.jpg", "image2.jpg"]
}
```

### 4. 更新项目 (管理员权限)
```http
PUT /api/projects/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "更新后的项目标题",
  "description": "更新后的描述",
  "status": "active"
}
```

### 5. 删除项目 (管理员权限)
```http
DELETE /api/projects/:id
Authorization: Bearer <admin-token>
```

---

## 💰 捐赠记录接口

### 1. 创建捐赠
```http
POST /api/donations
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project_123",
  "amount": 100,
  "message": "支持野生动物保护！",
  "isAnonymous": false,
  "paymentMethod": "creem"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "donation": {
      "id": "donation_123",
      "projectId": "project_123",
      "userId": "user_123",
      "amount": 100,
      "message": "支持野生动物保护！",
      "isAnonymous": false,
      "status": "pending",
      "paymentMethod": "creem",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "paymentUrl": "https://payment.creem.io/pay/xyz123"
  },
  "message": "捐赠创建成功，请完成支付"
}
```

### 2. 获取捐赠记录
```http
GET /api/donations?projectId=project_123&userId=user_123&page=1&limit=10
Authorization: Bearer <token>
```

**查询参数:**
- `projectId` (string): 项目ID
- `userId` (string): 用户ID
- `status` (string): 捐赠状态
- `page` (number): 页码
- `limit` (number): 每页数量

### 3. 获取捐赠详情
```http
GET /api/donations/:id
Authorization: Bearer <token>
```

### 4. 获取我的捐赠记录
```http
GET /api/donations/my?page=1&limit=10
Authorization: Bearer <token>
```

### 5. Creem支付回调
```http
POST /api/webhooks/creem
Content-Type: application/json
X-Creem-Signature: <signature>

{
  "event": "payment.completed",
  "data": {
    "paymentId": "payment_123",
    "donationId": "donation_123",
    "status": "completed",
    "amount": 100,
    "paidAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📧 邮件通知接口

### 1. 发送邮件通知
```http
POST /api/notifications/send
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "捐赠成功通知",
  "template": "donation-receipt",
  "data": {
    "userName": "张三",
    "projectTitle": "可可西里野生动物保护",
    "amount": 100,
    "donationDate": "2024-01-01"
  }
}
```

### 2. 批量发送邮件
```http
POST /api/notifications/broadcast
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "recipients": ["user1@example.com", "user2@example.com"],
  "subject": "项目进展通知",
  "content": "项目有了新的进展...",
  "template": "project-update"
}
```

---

## 📁 文件管理接口

### 1. 上传文件
```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary-data>
category: "project-image"
description: "项目封面图片"
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_123",
      "originalName": "image.jpg",
      "fileName": "project_123_image.jpg",
      "mimeType": "image/jpeg",
      "size": 1024000,
      "category": "project-image",
      "url": "https://example.com/files/project_123_image.jpg",
      "thumbnailUrl": "https://example.com/thumbnails/project_123_image.jpg",
      "uploadedBy": "user_123",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "文件上传成功"
}
```

### 2. 获取文件信息
```http
GET /api/files/:id
Authorization: Bearer <token>
```

### 3. 获取文件列表
```http
GET /api/files?category=project-image&page=1&limit=10
Authorization: Bearer <token>
```

### 4. 删除文件
```http
DELETE /api/files/:id
Authorization: Bearer <token>
```

### 5. 获取文件下载链接
```http
GET /api/files/:id/download?expires=3600
Authorization: Bearer <token>
```

---

## 📊 数据分析接口

### 1. 获取捐赠统计
```http
GET /api/analytics/donations?timeRange=30d&groupBy=day
Authorization: Bearer <admin-token>
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "totalAmount": 50000,
    "totalCount": 500,
    "averageAmount": 100,
    "trends": [
      {
        "date": "2024-01-01",
        "amount": 1500,
        "count": 15
      }
    ],
    "topProjects": [
      {
        "projectId": "project_123",
        "title": "可可西里野生动物保护",
        "amount": 25000,
        "count": 250
      }
    ]
  }
}
```

### 2. 获取项目统计
```http
GET /api/analytics/projects?timeRange=30d
Authorization: Bearer <admin-token>
```

### 3. 获取用户统计
```http
GET /api/analytics/users?timeRange=30d
Authorization: Bearer <admin-token>
```

### 4. 生成报告
```http
POST /api/analytics/reports
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "type": "donation-summary",
  "timeRange": "30d",
  "format": "pdf",
  "includeCharts": true
}
```

---

## 🛠️ 系统管理接口

### 1. 系统健康检查
```http
GET /api/system/health
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "services": {
      "database": "healthy",
      "redis": "healthy",
      "storage": "healthy"
    },
    "metrics": {
      "uptime": 86400,
      "responseTime": 150,
      "memoryUsage": 65.2
    }
  }
}
```

### 2. 系统指标
```http
GET /api/system/metrics
Authorization: Bearer <admin-token>
```

### 3. 系统配置
```http
GET /api/system/config
Authorization: Bearer <admin-token>
```

### 4. 更新系统配置
```http
PUT /api/system/config
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "maintenanceMode": false,
  "maxFileSize": 10485760,
  "allowedFileTypes": ["jpg", "png", "pdf"]
}
```

---

## 🔍 搜索接口

### 1. 全局搜索
```http
GET /api/search?q=可可西里&type=projects&page=1&limit=10
Authorization: Bearer <token> (可选)
```

**查询参数:**
- `q` (string): 搜索关键词
- `type` (string): 搜索类型 (projects, users, donations)
- `page` (number): 页码
- `limit` (number): 每页数量

**响应示例:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "project",
        "id": "project_123",
        "title": "可可西里野生动物保护计划",
        "description": "保护可可西里地区的野生动物...",
        "relevance": 0.95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

## 📝 项目动态接口

### 1. 获取项目动态列表
```http
GET /api/projects/:id/updates?page=1&limit=10
Authorization: Bearer <token> (可选)
```

### 2. 创建项目动态 (管理员权限)
```http
POST /api/projects/:id/updates
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "项目进展更新",
  "content": "本月我们成功救助了10只藏羚羊...",
  "images": ["image1.jpg", "image2.jpg"]
}
```

### 3. 获取动态详情
```http
GET /api/projects/:id/updates/:updateId
Authorization: Bearer <token> (可选)
```

---

## 🏷️ 分类管理接口

### 1. 获取分类列表
```http
GET /api/categories
Authorization: Bearer <token> (可选)
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "动物保护",
        "slug": "animal-protection",
        "description": "野生动物保护相关项目",
        "projectCount": 15,
        "icon": "🐺"
      }
    ]
  }
}
```

### 2. 创建分类 (管理员权限)
```http
POST /api/categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "环境保护",
  "slug": "environmental-protection",
  "description": "环境保护相关项目",
  "icon": "🌿"
}
```

---

## 🔧 错误代码说明

| 错误代码 | 描述 |
|---------|------|
| `INVALID_EMAIL` | 邮箱格式无效 |
| `INVALID_PASSWORD` | 密码格式无效 |
| `USER_NOT_FOUND` | 用户不存在 |
| `INVALID_CREDENTIALS` | 用户名或密码错误 |
| `TOKEN_EXPIRED` | Token已过期 |
| `INSUFFICIENT_PERMISSIONS` | 权限不足 |
| `PROJECT_NOT_FOUND` | 项目不存在 |
| `DONATION_NOT_FOUND` | 捐赠记录不存在 |
| `FILE_NOT_FOUND` | 文件不存在 |
| `INVALID_FILE_TYPE` | 不支持的文件类型 |
| `FILE_TOO_LARGE` | 文件过大 |
| `PAYMENT_FAILED` | 支付失败 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 |
| `VALIDATION_ERROR` | 数据验证失败 |
| `INTERNAL_ERROR` | 服务器内部错误 |

---

## 🧪 Firefox测试指南

### 使用Firefox开发者工具进行API测试

1. **打开Firefox开发者工具**
   - 按F12或右键选择"检查元素"
   - 切换到"网络"标签页

2. **发送GET请求**
   - 在网络标签页中，右键选择"新建请求"
   - 输入URL：`http://localhost:3000/api/projects`
   - 添加请求头：`Authorization: Bearer <your-token>`
   - 点击"发送"

3. **发送POST请求**
   - 选择"POST"方法
   - 输入URL：`http://localhost:3000/api/auth/login`
   - 添加请求头：
     ```
     Content-Type: application/json
     ```
   - 在请求体中输入JSON数据：
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - 点击"发送"

4. **文件上传测试**
   - 选择"POST"方法
   - 输入URL：`http://localhost:3000/api/files/upload`
   - 添加请求头：`Authorization: Bearer <your-token>`
   - 在请求体中选择"multipart/form-data"
   - 添加文件字段和表单数据

### Firefox RESTClient插件推荐

1. **安装RESTClient**
   - 在Firefox附加组件中搜索"RESTClient"
   - 安装并重启Firefox

2. **配置请求**
   - 设置URL和方法
   - 添加请求头
   - 配置请求体
   - 发送请求并查看响应

### Postman替代方案

如果Firefox测试不够方便，也可以使用：
- **Postman** (Chrome应用，但也有Firefox版本)
- **Insomnia** (跨平台REST客户端)
- **curl命令行工具**

---

## 📞 技术支持

如果在API测试过程中遇到问题，请：

1. 检查服务器是否正在运行
2. 验证API端点URL是否正确
3. 确认请求头和认证信息
4. 查看网络面板中的错误信息
5. 检查请求数据格式是否正确

**服务器地址**: `http://localhost:3000`
**API基础路径**: `/api`
**当前时间**: 2024年1月

---

*此API文档将随着系统更新持续维护和更新。*