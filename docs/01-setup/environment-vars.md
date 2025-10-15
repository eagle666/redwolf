# 环境变量配置指南

## 🔐 环境变量概述

环境变量是配置应用程序的关键参数，包含敏感信息、API 密钥、数据库连接等。正确的环境变量管理是应用安全和部署的基础。

### 配置原则

🔒 **安全第一**
- 永远不要将敏感信息提交到代码仓库
- 使用 `.gitignore` 排除环境变量文件
- 定期轮换密钥和令牌

🎯 **环境分离**
- 开发环境 (Development)
- 测试环境 (Staging)
- 生产环境 (Production)

📦 **版本管理**
- 使用 `.env.example` 作为模板
- 团队成员复制并自定义
- 保持配置同步

## 📁 环境变量文件结构

### 文件类型说明

```
.env.example          # 环境变量模板（提交到 Git）
.env.local           # 本地环境变量（不提交到 Git）
.env.development     # 开发环境（可选）
.env.production      # 生产环境（部署时设置）
```

### Git 配置

确保 `.gitignore` 包含以下配置：

```gitignore
# 环境变量
.env
.env.local
.env.development
.env.production

# 其他敏感文件
*.pem
*.key
credentials.json
```

## 🛠️ 环境变量详解

### 1. 应用基础配置

```env
# 应用配置
NEXT_PUBLIC_APP_NAME=可可西里野生动物保护
NEXT_PUBLIC_APP_DESCRIPTION=科学保护野生动物，维护生态平衡
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_VERSION=1.0.0

# 环境标识
NODE_ENV=development
NEXT_PUBLIC_NODE_ENV=development
```

### 2. Supabase 数据库配置

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 数据库连接（如果使用外部客户端）
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 3. Creem 支付配置

```env
# Creem 支付配置
CREEM_API_KEY=creem_your_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
CREEM_PRODUCT_ID=prod_your_product_id_here

# 支付配置
NEXT_PUBLIC_CREEM_ENABLED=true
CURRENCY=CNY
MIN_DONATION_AMOUNT=1
MAX_DONATION_AMOUNT=100000
```

### 4. 邮件服务配置

```env
# Resend 邮件服务
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@your-domain.com
RESEND_FROM_NAME=可可西里保护团队

# 邮件模板配置
EMAIL_TEMPLATE_SUCCESS=donation-success
EMAIL_TEMPLATE_FAILED=donation-failed
EMAIL_TEMPLATE_RECEIPT=donation-receipt
```

### 5. 认证和安全配置

```env
# 认证配置
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-here

# JWT 配置
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# 加密密钥
ENCRYPTION_KEY=your-encryption-key-here
```

### 6. 监控和分析配置

```env
# Sentry 错误监控
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-sentry-auth-token-here

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

### 7. 存储和 CDN 配置

```env
# 文件存储
NEXT_PUBLIC_STORAGE_URL=https://your-project.supabase.co/storage/v1
SUPABASE_STORAGE_BUCKET=uploads

# CDN 配置
NEXT_PUBLIC_CDN_URL=https://your-cdn-domain.com
```

### 8. 社交登录配置

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# WeChat OAuth（可选）
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
```

### 9. 第三方服务配置

```env
# 短信服务（可选）
SMS_PROVIDER=aliyun
SMS_ACCESS_KEY=your-sms-access-key
SMS_SECRET_KEY=your-sms-secret-key

# 地图服务（可选）
NEXT_PUBLIC_MAP_API_KEY=your-map-api-key

# 翻译服务（可选）
TRANSLATION_API_KEY=your-translation-api-key
```

## 📋 环境变量模板

### 完整的 `.env.example`

```env
# =============================================================================
# 可可西里野生动物保护网站 - 环境变量配置模板
# =============================================================================

# 应用基础配置
NEXT_PUBLIC_APP_NAME=可可西里野生动物保护
NEXT_PUBLIC_APP_DESCRIPTION=科学保护野生动物，维护生态平衡
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0

# 环境标识
NODE_ENV=development
NEXT_PUBLIC_NODE_ENV=development

# 数据库配置 (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# 支付配置 (Creem)
CREEM_API_KEY=creem_your_api_key_here
CREEM_WEBHOOK_SECRET=your-webhook-secret-here
CREEM_PRODUCT_ID=prod_your_product_id_here
NEXT_PUBLIC_CREEM_ENABLED=true

# 邮件服务 (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@your-domain.com
RESEND_FROM_NAME=可可西里保护团队

# 认证配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# 错误监控 (Sentry)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here

# 分析工具 (Google Analytics)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 社交登录 (可选)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 开发工具
NEXT_PUBLIC_DEBUG=false
```

## 🚀 不同环境的配置

### 开发环境 (.env.local)

```env
# 开发环境配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# 开发数据库
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key

# 开发支付（测试模式）
CREEM_API_KEY=creem_test_api_key
CREEM_WEBHOOK_SECRET=test-webhook-secret
NEXT_PUBLIC_CREEM_ENABLED=false

# 开发工具
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_SENTRY_DSN=
```

### 生产环境 (部署时设置)

```env
# 生产环境配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com

# 生产数据库
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key

# 生产支付
CREEM_API_KEY=creem_prod_api_key
CREEM_WEBHOOK_SECRET=prod-webhook-secret
NEXT_PUBLIC_CREEM_ENABLED=true

# 生产监控
NEXT_PUBLIC_SENTRY_DSN=https://prod-sentry-dsn
NEXT_PUBLIC_DEBUG=false
```

## 🔧 环境变量管理

### 1. 初始化脚本

```bash
#!/bin/bash
# scripts/setup-env.sh

echo "🔧 设置环境变量..."

# 检查是否存在 .env.local
if [ ! -f .env.local ]; then
    echo "📝 创建 .env.local 文件..."
    cp .env.example .env.local
    echo "✅ 请编辑 .env.local 文件，填入正确的配置"
else
    echo "✅ .env.local 文件已存在"
fi

# 检查必需的环境变量
required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "CREEM_API_KEY"
    "RESEND_API_KEY"
)

for var in "${required_vars[@]}"; do
    if ! grep -q "$var=.*[^$]" .env.local; then
        echo "⚠️  请设置 $var 变量"
    fi
done

echo "🎉 环境变量设置完成！"
```

### 2. 验证脚本

```typescript
// scripts/validate-env.ts
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env.local' })

// 必需的环境变量
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'CREEM_API_KEY',
  'RESEND_API_KEY'
]

// 可选的环境变量
const optionalEnvVars = [
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_SENTRY_DSN',
  'GOOGLE_CLIENT_ID'
]

function validateEnv() {
  const missing = []
  const present = []

  // 检查必需变量
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      present.push(envVar)
    } else {
      missing.push(envVar)
    }
  }

  // 检查可选变量
  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      present.push(envVar)
    }
  }

  console.log('✅ 已配置的环境变量:')
  present.forEach(var_ => console.log(`  - ${var_}`))

  if (missing.length > 0) {
    console.log('\n❌ 缺失的环境变量:')
    missing.forEach(var_ => console.log(`  - ${var_}`))
    process.exit(1)
  }

  console.log('\n🎉 所有必需的环境变量都已配置！')
}

validateEnv()
```

### 3. 类型定义

```typescript
// types/env.d.ts
interface ProcessEnv {
  // 应用配置
  readonly NEXT_PUBLIC_APP_NAME: string
  readonly NEXT_PUBLIC_APP_URL: string
  readonly NEXT_PUBLIC_APP_VERSION: string
  readonly NODE_ENV: 'development' | 'production' | 'test'

  // 数据库配置
  readonly NEXT_PUBLIC_SUPABASE_URL: string
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  readonly SUPABASE_SERVICE_ROLE_KEY: string

  // 支付配置
  readonly CREEM_API_KEY: string
  readonly CREEM_WEBHOOK_SECRET: string
  readonly CREEM_PRODUCT_ID: string

  // 邮件配置
  readonly RESEND_API_KEY: string
  readonly RESEND_FROM_EMAIL: string

  // 监控配置
  readonly NEXT_PUBLIC_SENTRY_DSN?: string
  readonly NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {}
  }
}
```

## 🔍 环境变量使用示例

### 在客户端组件中使用

```typescript
// components/ConfigProvider.tsx
'use client'
import { createContext, useContext } from 'react'

const ConfigContext = createContext({
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANONKey!,
  isCreemEnabled: process.env.NEXT_PUBLIC_CREEM_ENABLED === 'true'
})

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const config = {
    appName: process.env.NEXT_PUBLIC_APP_NAME!,
    appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    isCreemEnabled: process.env.NEXT_PUBLIC_CREEM_ENABLED === 'true'
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}
```

### 在服务端组件中使用

```typescript
// app/layout.tsx
import { headers } from 'next/headers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const host = headersList.get('host')

  // 根据环境判断是否启用某些功能
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <html lang="zh-CN">
      <head>
        {isProduction && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <script dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `
            }} />
          </>
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### 在 API 路由中使用

```typescript
// api/creem/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // 验证环境变量
  if (!process.env.CREEM_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const signature = request.headers.get('creem-signature')
  const body = await request.text()

  // 验证签名
  const isValid = verifyWebhookSignature(body, signature, process.env.CREEM_WEBHOOK_SECRET)

  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    )
  }

  // 处理 webhook
  // ...

  return NextResponse.json({ success: true })
}
```

## 🔒 安全最佳实践

### 1. 密钥管理

```typescript
// lib/security.ts
export function validateApiKey(key: string, service: string): boolean {
  const keyPatterns = {
    creem: /^creem_[a-zA-Z0-9]+$/,
    supabase: /^eyJ[a-zA-Z0-9+/=]+\.[a-zA-Z0-9+/=]+\.[a-zA-Z0-9+/=]+$/,
    resend: /^re_[a-zA-Z0-9]+$/
  }

  const pattern = keyPatterns[service as keyof typeof keyPatterns]
  return pattern ? pattern.test(key) : false
}

export function maskSensitiveInfo(value: string): string {
  if (!value || value.length < 8) return '***'
  return value.slice(0, 4) + '***' + value.slice(-4)
}
```

### 2. 环境检查

```typescript
// lib/env-check.ts
export function checkRequiredEnvVars() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'CREEM_API_KEY',
    'RESEND_API_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}
```

### 3. 配置验证中间件

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { checkRequiredEnvVars } from '@/lib/env-check'

export async function middleware(request: NextRequest) {
  // 在生产环境检查必需的环境变量
  if (process.env.NODE_ENV === 'production') {
    try {
      checkRequiredEnvVars()
    } catch (error) {
      console.error('Environment check failed:', error)
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
  }

  return NextResponse.next()
}
```

## 🚨 故障排除

### 常见问题

1. **环境变量未生效**
   ```bash
   # 重启开发服务器
   npm run dev

   # 清除 Next.js 缓存
   rm -rf .next
   npm run dev
   ```

2. **TypeScript 类型错误**
   ```typescript
   // 确保类型定义正确
   declare global {
     namespace NodeJS {
       interface ProcessEnv {
         NEXT_PUBLIC_APP_NAME: string
         // ... 其他变量
       }
     }
   }
   ```

3. **部署时环境变量缺失**
   - 检查部署平台的环境变量设置
   - 确保敏感变量不包含在代码中
   - 验证变量名称拼写正确

### 调试工具

```typescript
// lib/debug-env.ts
export function debugEnvVars() {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('=== Environment Variables Debug ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('CREEM_API_KEY:', maskSensitiveInfo(process.env.CREEM_API_KEY))
    console.log('====================================')
  }
}
```

## 📚 相关资源

- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase 环境配置指南](https://supabase.com/docs/guides/functions/env-variables)
- [Vercel 环境变量管理](https://vercel.com/docs/concepts/projects/environment-variables)
- [12-Factor App 配置管理](https://12factor.net/config)

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队