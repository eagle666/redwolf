# 数据库配置指南

## 🗄️ 数据库概述

本项目使用 **Supabase** 作为数据库服务，它提供了基于 PostgreSQL 的托管数据库解决方案，包含实时功能、认证系统和存储服务。

### 选择 Supabase 的理由

🆓 **免费额度充足**
- 500MB 数据库存储
- 50MB 文件存储
- 2GB 带宽/月
- 50,000 月活跃用户

🎯 **开发效率高**
- 自动生成 TypeScript 类型
- 内置认证系统
- 实时数据同步
- 直观的管理界面

🔒 **安全可靠**
- 行级安全策略 (RLS)
- 自动备份
- SSL 加密
- GDPR 合规

🚀 **性能优秀**
- 全球基础设施
- 自动扩展
- 连接池管理
- 查询优化

## 🛠️ 配置步骤

### 第一步：创建 Supabase 项目

1. **访问 Supabase 官网**
   - 打开 [https://supabase.com](https://supabase.com)
   - 点击 "Start your project"

2. **注册账号**
   - 使用 GitHub 账号登录（推荐）
   - 或使用邮箱注册

3. **创建新项目**
   ```
   项目名称: redwolf-protection
   数据库密码: [生成强密码并保存]
   区域: Asia Northeast 1 (Tokyo) - 推荐选择亚洲区域
   ```

4. **等待项目创建**
   - 通常需要 1-2 分钟
   - 创建成功后会显示项目信息

### 第二步：获取连接信息

在项目设置中找到以下关键信息：

```
Project URL: https://your-project-id.supabase.co
Anon Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要提示**：
- 🔒 Service Role Key 具有管理员权限，仅在后端使用
- 🔓 Anon Public Key 用于客户端访问
- 📝 将这些信息保存到密码管理器

### 第三步：配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**安全注意事项**：
- ❌ 永远不要提交 `.env.local` 到 Git 仓库
- ✅ 将 `.env.local` 添加到 `.gitignore`
- 🔒 Service Role Key 仅在服务器端使用

### 第四步：安装依赖包

```bash
# 安装 Supabase 客户端库
npm install @supabase/supabase-js

# 安装 Next.js Auth Helpers
npm install @supabase/auth-helpers-nextjs @supabase/auth-helpers-react

# 安装 Prisma（如果需要）
npm install prisma @prisma/client
```

### 第五步：创建数据库表结构

#### 5.1 连接到数据库

方法一：使用 Supabase SQL 编辑器
1. 访问项目仪表板
2. 点击 "SQL Editor"
3. 创建新查询

方法二：使用本地客户端
1. 获取连接字符串
2. 使用 TablePlus、DBeaver 等工具连接

#### 5.2 创建核心表结构

```sql
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 用户角色表
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'content_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 捐赠项目表
CREATE TABLE donation_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12,2),
  current_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 捐赠记录表
CREATE TABLE donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES donation_projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CNY',
  supporter_name TEXT NOT NULL,
  supporter_email TEXT,
  message TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  creem_checkout_id TEXT,
  creem_order_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 教育内容表
CREATE TABLE education_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT NOT NULL CHECK (category IN ('story', 'education', 'news', 'science')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 项目统计表
CREATE TABLE project_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES donation_projects(id) UNIQUE,
  total_amount DECIMAL(12,2) DEFAULT 0,
  total_donors INTEGER DEFAULT 0,
  current_month_amount DECIMAL(12,2) DEFAULT 0,
  last_donation_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_education_content_status ON education_content(status);
CREATE INDEX idx_education_content_category ON education_content(category);
CREATE INDEX idx_education_content_slug ON education_content(slug);

-- 创建触发器函数用于自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建触发器
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_projects_updated_at BEFORE UPDATE ON donation_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_content_updated_at BEFORE UPDATE ON education_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_stats_updated_at BEFORE UPDATE ON project_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 第六步：设置行级安全策略 (RLS)

```sql
-- 启用所有表的 RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stats ENABLE ROW LEVEL SECURITY;

-- 用户角色表的 RLS 策略
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own role" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);

-- 捐赠记录表的 RLS 策略
CREATE POLICY "Anyone can view completed donations" ON donations
  FOR SELECT USING (payment_status = 'completed');

CREATE POLICY "Users can view their own donations" ON donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert donations" ON donations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 教育内容表的 RLS 策略
CREATE POLICY "Anyone can view published content" ON education_content
  FOR SELECT USING (status = 'published');

CREATE POLICY "Content managers can edit content" ON education_content
  FOR ALL USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'content_manager')
    )
  );

-- 项目统计表的 RLS 策略
CREATE POLICY "Anyone can view project stats" ON project_stats
  FOR SELECT USING (true);

CREATE POLICY "Admins can update project stats" ON project_stats
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

### 第七步：创建初始数据

```sql
-- 创建默认的捐赠项目
INSERT INTO donation_projects (title, description, target_amount) VALUES
('可可西里野生动物保护基金', '支持可可西里地区野生动物的科学保护和救助工作', 1000000),
('野生动物教育宣传', '制作和传播科学保护野生动物的教育内容', 500000),
('保护设备采购', '为野外保护工作者提供必要的设备和工具', 300000);

-- 创建项目统计记录
INSERT INTO project_stats (project_id)
SELECT id FROM donation_projects;

-- 创建管理员用户角色（需要在第一个用户注册后手动设置）
-- INSERT INTO user_roles (user_id, role)
-- VALUES ('user-uuid-here', 'admin');
```

## 🔧 Supabase 客户端配置

### 创建 Supabase 客户端

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient()

// 服务端客户端
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  return createServerComponentClient({
    cookies
  })
}
```

### 使用示例

```typescript
// 在组件中使用
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DonationList() {
  const [donations, setDonations] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchDonations = async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching donations:', error)
      } else {
        setDonations(data)
      }
    }

    fetchDonations()
  }, [])

  return (
    <div>
      {donations.map((donation) => (
        <div key={donation.id}>
          {donation.supporter_name}: ¥{donation.amount}
        </div>
      ))}
    </div>
  )
}
```

## 🔄 数据库迁移

### 使用 Prisma 进行迁移管理

如果选择使用 Prisma，可以创建 `prisma/schema.prisma`：

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String?
  role            UserRole  @default(USER)
  donations       Donation[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Donation {
  id              String    @id @default(cuid())
  amount          Decimal
  supporterName   String
  supporterEmail  String?
  message         String?
  status          DonationStatus @default(PENDING)
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum UserRole {
  USER
  ADMIN
  CONTENT_MANAGER
}

enum DonationStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

### 运行迁移

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送 schema 到数据库
npx prisma db push

# 创建迁移文件
npx prisma migrate dev --name init

# 应用迁移
npx prisma migrate deploy
```

## 🔍 数据库监控

### 监控指标
- 连接数
- 查询性能
- 存储使用量
- 错误率

### 优化建议
1. **定期分析查询**
   ```sql
   -- 查看慢查询
   SELECT query, mean_time, calls
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   ```

2. **监控表大小**
   ```sql
   -- 查看表大小
   SELECT
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

3. **检查索引使用情况**
   ```sql
   -- 查看索引使用情况
   SELECT
     schemaname,
     tablename,
     indexname,
     idx_scan,
     idx_tup_read,
     idx_tup_fetch
   FROM pg_stat_user_indexes
   ORDER BY idx_scan DESC;
   ```

## 🔒 安全最佳实践

### 1. 行级安全策略 (RLS)
- ✅ 为所有敏感表启用 RLS
- ✅ 创建适当的访问策略
- ✅ 定期审查权限设置

### 2. API 密钥管理
- 🔒 使用环境变量存储密钥
- 🔓 客户端使用 Anon Key
- 🔑 服务端使用 Service Role Key

### 3. 数据验证
- ✅ 在数据库层面添加约束
- ✅ 应用层进行输入验证
- 🔒 防止 SQL 注入攻击

### 4. 备份策略
- 📦 自动每日备份
- 🔄 定期测试恢复
- 📊 监控备份状态

## 🚨 故障排除

### 常见问题

1. **连接超时**
   ```
   解决方案：检查网络连接，增加连接池大小
   ```

2. **权限错误**
   ```
   解决方案：检查 RLS 策略，确保用户有适当权限
   ```

3. **查询性能慢**
   ```
   解决方案：添加索引，优化查询，使用 EXPLAIN ANALYZE
   ```

4. **存储空间不足**
   ```
   解决方案：清理旧数据，升级套餐，优化存储
   ```

### 调试工具

1. **Supabase 控制台**
   - 实时监控
   - 日志查看
   - 性能分析

2. **SQL 查询分析**
   ```sql
   -- 分析查询计划
   EXPLAIN ANALYZE SELECT * FROM donations WHERE status = 'completed';
   ```

3. **连接测试**
   ```bash
   # 测试数据库连接
   psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
   ```

## 📚 更多资源

- [Supabase 官方文档](https://supabase.com/docs)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [Prisma 文档](https://www.prisma.io/docs/)
- [Next.js 数据库最佳实践](https://nextjs.org/docs/building-your-application/data-fetching)

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队