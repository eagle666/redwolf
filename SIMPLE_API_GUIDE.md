# 📡 简化版API接口文档

## 🎯 当前可用的API

### ✅ 1. 系统健康检查
```bash
GET http://localhost:3001/api/system/health
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": {"status": "healthy"},
      "redis": {"status": "healthy"}
    },
    "metrics": {
      "cpu": {"usage": 45.2},
      "memory": {"usage": 67.8}
    }
  }
}
```

### ✅ 2. 获取项目列表
```bash
GET http://localhost:3001/api/projects?page=1&limit=10
```

**查询参数：**
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `status`: 项目状态筛选
- `category`: 项目分类筛选

**响应示例：**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project_123",
        "title": "测试项目 1",
        "description": "这是第 1 个测试项目的描述",
        "targetAmount": 100000,
        "currentAmount": 50000,
        "status": "active",
        "featuredImage": "https://example.com/image1.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### ❌ 3. 创建项目（暂时不可用）
```bash
POST http://localhost:3001/api/projects
Content-Type: application/json

{
  "title": "新项目",
  "description": "项目描述",
  "targetAmount": 10000,
  "category": "animal-protection"
}
```

### ❌ 4. 创建捐赠（暂时不可用）
```bash
POST http://localhost:3001/api/donations
Content-Type: application/json

{
  "projectId": "project_123",
  "amount": 100,
  "message": "支持野生动物保护！"
}
```

## 🧪 测试方法

### 使用curl命令测试
```bash
# 测试健康检查
curl http://localhost:3001/api/system/health

# 测试项目列表
curl "http://localhost:3001/api/projects?page=1&limit=3"

# 测试带筛选的项目列表
curl "http://localhost:3001/api/projects?status=active&limit=5"
```

### 使用浏览器测试
直接在浏览器中访问：
- http://localhost:3001/api/system/health
- http://localhost:3001/api/projects

### 使用API文档页面
访问：http://localhost:3001/api-docs
- 左侧选择API
- 点击"测试接口"按钮

## 🔍 问题说明

**当前状况：**
- ✅ 系统健康检查正常
- ✅ 项目列表API正常
- ❌ 创建类API（POST）有错误
- ❌ 部分API需要连接真实数据库

**解决建议：**
1. 先测试能正常工作的GET接口
2. 等数据库部署完成后再测试POST接口
3. 使用模拟数据进行前端开发

## 📱 前端调用示例

### JavaScript获取项目列表
```javascript
async function getProjects() {
  try {
    const response = await fetch('http://localhost:3001/api/projects?page=1&limit=10');
    const result = await response.json();

    if (result.success) {
      console.log('项目列表:', result.data.projects);
      console.log('分页信息:', result.data.pagination);
      return result.data;
    }
  } catch (error) {
    console.error('获取项目失败:', error);
  }
}

// 使用
getProjects();
```

### 检查系统健康
```javascript
async function checkHealth() {
  try {
    const response = await fetch('http://localhost:3001/api/system/health');
    const result = await response.json();

    if (result.success) {
      console.log('系统状态:', result.data.status);
      console.log('各项服务:', result.data.services);
    }
  } catch (error) {
    console.error('健康检查失败:', error);
  }
}

// 使用
checkHealth();
```

## 🎯 开发建议

1. **先使用可用的API** - 健康检查和项目列表
2. **使用模拟数据** - 前端开发和调试
3. **逐步完善** - 先基础功能，后复杂功能
4. **错误处理** - 做好网络请求的容错处理

这样您就可以先进行前端开发了，等数据库部署完成后再完善其他API！