# Claude AI助手指南

## 🤖 项目概述

这是可可西里网红狼公益网站项目，一个基于Next.js 14的公益筹款平台，专注于科学保护和科学爱护野生动物，特别关注网红狼的故事和保护工作。

### 项目核心信息
- **项目名称**: 可可西里网红狼公益网站
- **项目类型**: 公益筹款 + 教育平台
- **核心价值观**: 科学保护、科学爱护（不支持不反对投喂行为）
- **目标用户**: 关注野生动物保护的公众、捐赠者、保护工作者

## 🎯 Claude的工作职责

### 主要职责
1. **代码开发**: 按照技术规范开发新功能
2. **技术支持**: 解答技术问题和提供解决方案
3. **架构优化**: 提出系统改进建议
4. **文档维护**: 保持技术文档的准确性和完整性
5. **代码审查**: 确保代码质量和安全性

### 工作原则
- 🎯 **目标导向**: 始终围绕项目目标工作
- 🔒 **安全第一**: 严格遵循安全最佳实践
- 📚 **文档优先**: 重要决策和配置都要有文档记录
- 🧪 **测试思维**: 考虑功能的可测试性和边界情况
- 🚀 **性能意识**: 关注代码性能和用户体验

## 🛠️ 技术栈详解

### 前端技术
- **Next.js 14**: 使用App Router，支持SSR和静态生成
- **TypeScript**: 严格类型检查，提高代码质量
- **Tailwind CSS**: 原子化CSS，快速开发响应式界面
- **React Hook Form**: 高性能表单处理
- **Framer Motion**: 动画和交互效果

### 后端技术
- **Next.js API Routes**: 服务端API开发
- **Supabase**: 数据库 + 认证 + 实时功能
- **Drizzle ORM**: 类型安全的数据库操作
- **Creem**: 支付处理和Webhook

### 开发工具
- **ESLint + Prettier**: 代码格式化和规范
- **TypeScript**: 类型检查和开发体验

## 📁 项目关键文件位置

```
src/
├── app/                    # Next.js页面 (App Router)
│   ├── page.tsx           # 首页
│   ├── donate/            # 捐赠页面
│   ├── about/             # 关于页面
│   └── admin/             # 管理后台
├── components/            # React组件
│   ├── ui/               # 基础UI组件
│   ├── donation/         # 捐赠相关组件
│   └── layout/           # 布局组件
├── api/                  # API路由
│   ├── creem/           # Creem支付API
│   ├── donations/       # 捐赠数据API
│   └── admin/           # 管理API
├── lib/                  # 工具函数库
├── types/                # TypeScript类型定义
└── hooks/                # React Hooks

drizzle/
├── schema.ts             # 数据库模式定义
└── migrations/           # 数据库迁移文件

docs/                     # 项目文档
└── CLAUDE.md            # 本文档
```

## 🔧 常用开发命令

```bash
# 开发相关
npm run dev              # 启动开发服务器 (localhost:3000)
npm run build           # 构建生产版本
npm run start           # 启动生产服务器
npm run lint            # 代码检查
npm run lint:fix        # 自动修复代码问题

# 数据库相关
npx drizzle-kit studio  # 数据库可视化管理
npx drizzle-kit generate # 生成迁移文件
npx drizzle-kit migrate # 运行数据库迁移
# 部署相关
npm run build           # 构建项目
```

## 🎨 开发规范

### 代码风格
- **TypeScript优先**: 所有新代码必须使用TypeScript
- **组件命名**: 使用PascalCase (如 `DonationForm.tsx`)
- **函数命名**: 使用camelCase (如 `handleSubmitPayment`)
- **常量命名**: 使用UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- **文件命名**: 使用kebab-case (如 `donation-form.tsx`)

### 组件开发规范
```typescript
// ✅ 正确的组件结构
interface DonationFormProps {
  amount: number
  onSuccess: () => void
}

export default function DonationForm({ amount, onSuccess }: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // 处理逻辑
      onSuccess()
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 组件内容 */}
    </form>
  )
}
```

### API路由规范
```typescript
// ✅ 正确的API路由结构
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const RequestSchema = z.object({
  amount: z.number().min(1),
  email: z.string().email()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = RequestSchema.parse(body)

    // 处理逻辑

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
```

## 🔒 安全注意事项

### 永远不要做的事情
1. ❌ 提交API密钥到代码仓库
2. ❌ 在客户端暴露敏感信息
3. ❌ 直接使用用户输入进行数据库查询
4. ❌ 忽略输入验证和清理
5. ❌ 在生产环境输出敏感日志

### 必须做的事情
1. ✅ 使用环境变量管理敏感信息
2. ✅ 验证所有用户输入
3. ✅ 使用HTTPS进行数据传输
4. ✅ 实施适当的错误处理
5. ✅ 定期更新依赖包

### 关键安全检查点
- **API密钥**: 确保所有API密钥都在 `.env.local` 中
- **输入验证**: 使用Zod或类似库验证API输入
- **CORS配置**: 正确配置跨域访问策略
- **认证检查**: 确保敏感API有适当的认证
- **SQL注入**: 使用Drizzle ORM避免SQL注入

## 🚨 常见问题处理

### 开发环境问题
```bash
# 端口被占用
lsof -ti:3000 | xargs kill -9

# 依赖安装失败
rm -rf node_modules package-lock.json
npm install

# Drizzle问题
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 构建问题
```bash
# TypeScript错误
npm run build -- --no-lint

# 内存不足
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 调试技巧
```typescript
// 使用console.log进行调试
console.log('Debug info:', { data, error })

// 使用debugger断点
debugger

// 使用React DevTools
// 安装浏览器扩展进行组件调试
```

## 📊 性能优化指南

### 前端优化
- 使用 `next/dynamic` 进行代码分割
- 优化图片使用 `next/image`
- 实施适当的缓存策略
- 使用 React.memo 避免不必要的重渲染

### 后端优化
- 使用适当的缓存机制
- 优化数据库查询
- 实施API限流
- 监控API响应时间

## 🔄 数据库操作最佳实践

### Drizzle使用规范
```typescript
// ✅ 使用事务处理复杂操作
await db.transaction(async (tx) => {
  await tx.insert(donations).values(data)
  await tx.update(projectStats).set(updateData)
})

// ✅ 使用select优化查询
const user = await db.query.users.findFirst({
  where: eq(users.id, id),
  columns: { name: true, email: true }
})

// ✅ 处理数据库错误
try {
  const result = await db.insert(donations).values(data)
} catch (error) {
  if (error instanceof DrizzleError) {
    // 处理特定的Drizzle错误
  }
}
```

## 📧 联系和支持

如果遇到无法解决的问题：
1. 查看项目文档 (`docs/` 目录)
2. 检查GitHub Issues
3. 联系项目维护者

## 📝 开发记录

在重要变更时，请更新本文档：
- 新增技术栈或工具
- 修改开发规范
- 更新安全注意事项
- 添加新的最佳实践

---

**文档版本**: 1.0.0
**最后更新**: 2024年1月
**维护者**: Claude AI助手