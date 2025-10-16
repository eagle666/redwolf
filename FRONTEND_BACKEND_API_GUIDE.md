# 📡 前后端接口沟通详细指南

## 🎯 目录
1. [前后端通信基础](#前后端通信基础)
2. [HTTP协议详解](#http协议详解)
3. [数据格式规范](#数据格式规范)
4. [认证机制](#认证机制)
5. [具体API接口](#具体api接口)
6. [前端调用示例](#前端调用示例)
7. [错误处理最佳实践](#错误处理最佳实践)

---

## 🔍 前后端通信基础

### 什么是前后端通信？

前后端通信是指**前端（浏览器）**和**后端服务器**之间的数据交换过程。在Web应用中：

```
用户操作 → 前端界面 → 发送API请求 → 后端处理 → 返回数据 → 前端更新界面
```

### 通信的核心要素

1. **协议**：HTTP/HTTPS协议
2. **格式**：JSON数据格式
3. **方法**：GET、POST、PUT、DELETE等HTTP方法
4. **地址**：API端点URL
5. **认证**：JWT Token或其他认证方式

---

## 🌐 HTTP协议详解

### HTTP请求的结构

每个HTTP请求包含以下部分：

```
POST /api/projects HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Length: 123

{
  "title": "新项目",
  "description": "项目描述"
}
```

### HTTP状态码含义

| 状态码 | 含义 | 说明 |
|--------|------|------|
| `200` | OK | 请求成功 |
| `201` | Created | 资源创建成功 |
| `400` | Bad Request | 请求参数错误 |
| `401` | Unauthorized | 未授权访问 |
| `403` | Forbidden | 权限不足 |
| `404` | Not Found | 资源不存在 |
| `500` | Internal Server Error | 服务器内部错误 |

### HTTP方法的语义

| 方法 | 用途 | 示例 | 幂等性 |
|------|------|------|---------|
| `GET` | 获取数据 | `GET /api/projects` | ✅ 是 |
| `POST` | 创建数据 | `POST /api/projects` | ❌ 否 |
| `PUT` | 完整更新 | `PUT /api/projects/1` | ✅ 是 |
| `PATCH` | 部分更新 | `PATCH /api/projects/1` | ❌ 否 |
| `DELETE` | 删除数据 | `DELETE /api/projects/1` | ✅ 是 |

---

## 📦 数据格式规范

### 统一的响应格式

所有API响应都遵循统一格式：

```json
{
  "success": true,
  "data": {
    // 实际数据内容
  },
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project_123",
        "title": "可可西里野生动物保护",
        "targetAmount": 100000,
        "currentAmount": 75000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "message": "获取项目列表成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数无效",
    "details": {
      "field": "title",
      "reason": "标题不能为空"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 分页数据格式

```json
{
  "success": true,
  "data": {
    "items": [...], // 数据列表
    "pagination": {
      "page": 1,        // 当前页码
      "limit": 10,      // 每页数量
      "total": 100,     // 总记录数
      "totalPages": 10  // 总页数
    }
  }
}
```

---

## 🔐 认证机制

### JWT Token认证流程

1. **用户登录**获取Token
2. **前端保存**Token到localStorage
3. **每次请求**在请求头中携带Token
4. **后端验证**Token的有效性

### 认证请求头格式

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Token的获取和使用

```javascript
// 1. 登录获取Token
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 2. 保存Token
localStorage.setItem('jwt-token', token);

// 3. 在后续请求中使用Token
const response = await fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 📋 具体API接口

### 1. 用户认证接口

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三",
  "phone": "13800138000"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "张三",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. 项目管理接口

#### 获取项目列表
```http
GET /api/projects?page=1&limit=10&status=active&category=animal-protection
```

**查询参数：**
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `status`: 项目状态筛选
- `category`: 项目分类筛选
- `search`: 搜索关键词

#### 创建项目（需要认证）
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "可可西里野生动物保护计划",
  "description": "保护可可西里地区的野生动物栖息地",
  "targetAmount": 100000,
  "category": "animal-protection",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

#### 获取单个项目
```http
GET /api/projects/:id
```

#### 更新项目（需要认证）
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "更新后的项目标题",
  "description": "更新后的描述",
  "status": "active"
}
```

### 3. 捐赠管理接口

#### 创建捐赠记录（需要认证）
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

**响应示例：**
```json
{
  "success": true,
  "data": {
    "donation": {
      "id": "donation_123",
      "projectId": "project_123",
      "amount": 100,
      "status": "pending"
    },
    "paymentUrl": "https://payment.creem.io/pay/donation_123"
  },
  "message": "捐赠创建成功，请完成支付"
}
```

#### 获取捐赠记录
```http
GET /api/donations?projectId=project_123&page=1&limit=10
Authorization: Bearer <token>
```

### 4. 系统管理接口

#### 系统健康检查
```http
GET /api/system/health
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": { "status": "healthy", "responseTime": 150 },
      "redis": { "status": "healthy", "responseTime": 100 }
    },
    "metrics": {
      "cpu": { "usage": 45.2 },
      "memory": { "usage": 67.8 }
    }
  }
}
```

---

## 💻 前端调用示例

### 1. 基础Fetch API调用

```javascript
// 获取项目列表
async function getProjects(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `/api/projects?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('获取项目列表失败:', error);
    throw error;
  }
}

// 使用示例
getProjects(1, 10)
  .then(data => {
    console.log('项目列表:', data.projects);
    console.log('分页信息:', data.pagination);
  })
  .catch(error => {
    alert('获取项目列表失败: ' + error.message);
  });
```

### 2. 带认证的API调用

```javascript
// 创建API请求工具函数
class API {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
    this.token = localStorage.getItem('jwt-token');
  }

  // 设置认证Token
  setToken(token) {
    this.token = token;
    localStorage.setItem('jwt-token', token);
  }

  // 获取请求头
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || '请求失败');
      }

      return result;
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  // GET请求
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST请求
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT请求
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE请求
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// 使用示例
const api = new API();

// 获取项目列表
const projects = await api.get('/projects', { page: 1, limit: 10 });

// 创建项目
const newProject = await api.post('/projects', {
  title: '新项目',
  description: '项目描述',
  targetAmount: 50000,
  category: 'animal-protection'
});

// 更新项目
const updatedProject = await api.put('/projects/project_123', {
  title: '更新后的标题'
});
```

### 3. React组件中的API调用

```jsx
import React, { useState, useEffect } from 'react';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/projects?page=1&limit=10');
      const result = await response.json();

      if (result.success) {
        setProjects(result.data.projects);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const token = localStorage.getItem('jwt-token');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      const result = await response.json();

      if (result.success) {
        setProjects([result.data.project, ...projects]);
        return result.data.project;
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      alert('创建项目失败: ' + error.message);
      throw error;
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <h2>项目列表</h2>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p>目标金额: ¥{project.targetAmount}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ⚠️ 错误处理最佳实践

### 1. 统一错误处理

```javascript
class APIError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

async function handleAPIResponse(response) {
  const result = await response.json();

  if (!response.ok) {
    throw new APIError(
      result.error?.message || '请求失败',
      result.error?.code,
      result.error?.details
    );
  }

  return result;
}
```

### 2. 网络错误处理

```javascript
async function safeAPICall(apiCall, retryCount = 3) {
  for (let i = 0; i < retryCount; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.name === 'TypeError' && i < retryCount - 1) {
        // 网络错误，重试
        console.log(`网络错误，正在重试 (${i + 1}/${retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}
```

### 3. 用户友好的错误提示

```javascript
function getErrorMessage(error) {
  const errorMessages = {
    'VALIDATION_ERROR': '输入数据有误，请检查后重试',
    'UNAUTHORIZED': '请先登录',
    'FORBIDDEN': '您没有权限执行此操作',
    'NOT_FOUND': '请求的资源不存在',
    'INTERNAL_ERROR': '服务器错误，请稍后重试',
    'NETWORK_ERROR': '网络连接失败，请检查网络'
  };

  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  return error.message || '操作失败，请重试';
}

// 使用示例
try {
  const result = await api.post('/projects', projectData);
  showSuccessMessage('项目创建成功');
} catch (error) {
  showErrorMessage(getErrorMessage(error));
}
```

---

## 📝 开发调试技巧

### 1. 使用浏览器开发者工具

```javascript
// 在浏览器控制台中调试API
fetch('/api/projects')
  .then(response => response.json())
  .then(data => console.log('API响应:', data))
  .catch(error => console.error('API错误:', error));
```

### 2. API测试工具

- **浏览器Network面板**：查看所有网络请求
- **Postman**：专业的API测试工具
- **curl命令**：命令行测试工具

```bash
# curl测试示例
curl -X GET "http://localhost:3001/api/projects?page=1&limit=5" \
  -H "Content-Type: application/json"

curl -X POST "http://localhost:3001/api/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"测试项目","description":"描述","targetAmount":10000}'
```

---

## 🎯 总结

前后端沟通的核心要点：

1. **使用HTTP协议**进行通信
2. **JSON格式**作为数据交换标准
3. **RESTful API**设计规范
4. **统一响应格式**便于处理
5. **JWT Token**进行身份认证
6. **完善的错误处理**机制
7. **网络异常**的容错处理

掌握了这些知识点，您就可以顺利地进行前后端协作开发了！