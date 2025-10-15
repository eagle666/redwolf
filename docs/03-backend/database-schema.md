# 数据库设计

## 🗄️ 数据库概述

本项目使用 PostgreSQL 作为主数据库，通过 Supabase 提供托管服务。数据库操作使用 Drizzle ORM 进行类型安全的数据库操作。数据库设计遵循第三范式，确保数据一致性和查询效率。

### 设计原则

🎯 **数据完整性**
- 使用外键约束确保关系完整性
- 设置适当的检查约束
- 定义明确的默认值

🚀 **查询性能**
- 为常用查询字段创建索引
- 使用适当的数据类型
- 优化表结构设计

🔒 **安全性**
- 实施行级安全策略 (RLS)
- 敏感数据加密存储
- 最小权限原则

📈 **可扩展性**
- 支持大量数据存储
- 灵活的元数据结构
- 易于添加新功能

## 📊 数据库表结构

### 1. 用户相关表

#### 1.1 用户扩展信息表 (user_profiles)

```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id)
);

-- 索引
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_is_public ON user_profiles(is_public);
```

**字段说明**:
- `user_id`: 关联到 Supabase Auth 用户表
- `display_name`: 显示名称
- `avatar_url`: 头像URL
- `social_links`: 社交媒体链接 (JSON对象)
- `preferences`: 用户偏好设置 (JSON对象)
- `is_public`: 是否公开个人信息

#### 1.2 用户角色表 (user_roles)

```sql
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'content_manager', 'moderator')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT user_roles_user_id_unique UNIQUE (user_id)
);

-- 索引
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_is_active ON user_roles(is_active);
```

**角色说明**:
- `user`: 普通用户
- `admin`: 系统管理员
- `content_manager`: 内容管理员
- `moderator`: 内容审核员

### 2. 捐赠相关表

#### 2.1 捐赠项目表 (donation_projects)

```sql
CREATE TABLE donation_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  detailed_content TEXT,
  target_amount DECIMAL(12,2),
  current_amount DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'CNY',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  featured_image TEXT,
  gallery JSONB DEFAULT '[]',
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  creator_id UUID REFERENCES auth.users(id),
  is_featured BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 索引
CREATE INDEX idx_donation_projects_status ON donation_projects(status);
CREATE INDEX idx_donation_projects_category ON donation_projects(category);
CREATE INDEX idx_donation_projects_is_featured ON donation_projects(is_featured);
CREATE INDEX idx_donation_projects_slug ON donation_projects(slug);
CREATE INDEX idx_donation_projects_created_at ON donation_projects(created_at);
```

#### 2.2 捐赠记录表 (donations)

```sql
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES donation_projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id TEXT UNIQUE,
  creem_checkout_id TEXT,
  creem_order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CNY',
  supporter_name TEXT NOT NULL,
  supporter_email TEXT,
  supporter_phone TEXT,
  message TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  is_anonymous BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  refunded_at TIMESTAMP WITH TIME ZONE
);

-- 索引
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_donations_amount ON donations(amount);
CREATE INDEX idx_donations_is_public ON donations(is_public);
```

#### 2.3 捐赠回报表 (donation_rewards)

```sql
CREATE TABLE donation_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES donation_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  min_amount DECIMAL(10,2) NOT NULL,
  max_quantity INTEGER,
  current_quantity INTEGER DEFAULT 0,
  is_unlimited BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  delivery_estimate TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_donation_rewards_project_id ON donation_rewards(project_id);
CREATE INDEX idx_donation_rewards_min_amount ON donation_rewards(min_amount);
```

#### 2.4 项目统计表 (project_stats)

```sql
CREATE TABLE project_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES donation_projects(id) ON DELETE CASCADE UNIQUE,
  total_amount DECIMAL(12,2) DEFAULT 0,
  total_donors INTEGER DEFAULT 0,
  current_month_amount DECIMAL(12,2) DEFAULT 0,
  current_month_donors INTEGER DEFAULT 0,
  last_donation_date TIMESTAMP WITH TIME ZONE,
  daily_stats JSONB DEFAULT '{}',
  monthly_stats JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_project_stats_project_id ON project_stats(project_id);
CREATE INDEX idx_project_stats_last_donation_date ON project_stats(last_donation_date);
```

### 3. 内容管理表

#### 3.1 教育内容表 (education_content)

```sql
CREATE TABLE education_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  gallery JSONB DEFAULT '[]',
  category TEXT NOT NULL CHECK (category IN ('story', 'education', 'news', 'science', 'guide')),
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  reading_time INTEGER, -- 预估阅读时间（分钟）
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_education_content_status ON education_content(status);
CREATE INDEX idx_education_content_category ON education_content(category);
CREATE INDEX idx_education_content_slug ON education_content(slug);
CREATE INDEX idx_education_content_author_id ON education_content(author_id);
CREATE INDEX idx_education_content_published_at ON education_content(published_at);
CREATE INDEX idx_education_content_view_count ON education_content(view_count);
```

#### 3.2 内容分类表 (content_categories)

```sql
CREATE TABLE content_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES content_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_content_categories_parent_id ON content_categories(parent_id);
CREATE INDEX idx_content_categories_slug ON content_categories(slug);
```

#### 3.3 媒体资源表 (media_assets)

```sql
CREATE TABLE media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt TEXT,
  caption TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  storage_path TEXT NOT NULL,
  storage_provider TEXT DEFAULT 'supabase',
  uploader_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_media_assets_category ON media_assets(category);
CREATE INDEX idx_media_assets_uploader_id ON media_assets(uploader_id);
CREATE INDEX idx_media_assets_is_public ON media_assets(is_public);
```

### 4. 互动功能表

#### 4.1 评论表 (comments)

```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  author_email TEXT,
  author_ip TEXT,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  parent_id UUID REFERENCES comments(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_comments_content ON comments(content_type, content_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

#### 4.2 点赞记录表 (likes)

```sql
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT likes_unique UNIQUE (user_id, content_type, content_id)
);

-- 索引
CREATE INDEX idx_likes_content ON likes(content_type, content_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
```

#### 4.3 收藏表 (bookmarks)

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  folder_name TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT bookmarks_unique UNIQUE (user_id, content_type, content_id)
);

-- 索引
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_content ON bookmarks(content_type, content_id);
```

### 5. 系统管理表

#### 5.1 系统配置表 (system_settings)

```sql
CREATE TABLE system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_type TEXT DEFAULT 'string' CHECK (value_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_is_public ON system_settings(is_public);
```

#### 5.2 操作日志表 (audit_logs)

```sql
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### 5.3 邮件队列表 (email_queue)

```sql
CREATE TABLE email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_name TEXT,
  template_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_scheduled_at ON email_queue(scheduled_at);
CREATE INDEX idx_email_queue_to_email ON email_queue(to_email);
```

## 🔧 数据库触发器和函数

### 1. 自动更新时间戳

```sql
-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建触发器
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_projects_updated_at
  BEFORE UPDATE ON donation_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_content_updated_at
  BEFORE UPDATE ON education_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. 项目统计自动更新

```sql
-- 更新项目统计函数
CREATE OR REPLACE FUNCTION update_project_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新总金额和捐赠者数量
  UPDATE project_stats
  SET
    total_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM donations
      WHERE project_id = NEW.project_id
      AND payment_status = 'completed'
    ),
    total_donors = (
      SELECT COUNT(DISTINCT user_id)
      FROM donations
      WHERE project_id = NEW.project_id
      AND payment_status = 'completed'
    ),
    current_month_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM donations
      WHERE project_id = NEW.project_id
      AND payment_status = 'completed'
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    ),
    last_donation_date = (
      SELECT MAX(created_at)
      FROM donations
      WHERE project_id = NEW.project_id
      AND payment_status = 'completed'
    ),
    updated_at = NOW()
  WHERE project_id = NEW.project_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_update_project_stats
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW
  WHEN (NEW.payment_status = 'completed')
  EXECUTE FUNCTION update_project_stats();
```

### 3. 内容浏览量统计

```sql
-- 更新内容浏览量函数
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE education_content
  SET view_count = view_count + 1
  WHERE id = NEW.content_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建浏览记录表
CREATE TABLE content_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES education_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建触发器
CREATE TRIGGER trigger_increment_view_count
  AFTER INSERT ON content_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_view_count();
```

## 🔒 行级安全策略 (RLS)

### 1. 用户数据访问控制

```sql
-- 启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 用户资料访问策略
CREATE POLICY "Users can view public profiles" ON user_profiles
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 捐赠记录访问策略
CREATE POLICY "Anyone can view public donations" ON donations
  FOR SELECT USING (is_public = true AND payment_status = 'completed');

CREATE POLICY "Users can view own donations" ON donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all donations" ON donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. 内容访问控制

```sql
-- 教育内容访问策略
CREATE POLICY "Anyone can view published content" ON education_content
  FOR SELECT USING (status = 'published');

CREATE POLICY "Content managers can edit content" ON education_content
  FOR ALL USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'content_manager')
    )
  );

-- 评论访问策略
CREATE POLICY "Anyone can view approved comments" ON comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);
```

## 📊 数据库优化

### 1. 索引优化

```sql
-- 复合索引
CREATE INDEX idx_donations_project_status_amount ON donations(project_id, payment_status, amount);
CREATE INDEX idx_education_content_category_status ON education_content(category, status);
CREATE INDEX idx_comments_content_status ON comments(content_type, content_id, status);

-- 部分索引
CREATE INDEX idx_active_projects ON donation_projects(id) WHERE status = 'active';
CREATE INDEX idx_published_content ON education_content(id) WHERE status = 'published';
CREATE INDEX idx_completed_donations ON donations(created_at) WHERE payment_status = 'completed';
```

### 2. 分区策略

```sql
-- 按时间分区审计日志表
CREATE TABLE audit_logs_partitioned (
  LIKE audit_logs INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- 创建月度分区
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE audit_logs_2024_02 PARTITION OF audit_logs_partitioned
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### 3. 性能监控

```sql
-- 查看慢查询
SELECT
  query,
  mean_time,
  calls,
  total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 查看表大小
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

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

## 🔄 数据迁移脚本

### 1. 使用 Drizzle 进行数据迁移

```typescript
// drizzle/seed.ts
import { db } from '@/lib/database'
import { users, donationProjects, userRoles, contentCategories } from './schema'
import { userRoleEnum } from './schema'

async function seed() {
  console.log('🌱 开始数据库种子数据初始化...')

  try {
    // 创建默认管理员用户（需要先创建用户）
    // const adminUser = await db.insert(users).values({
    //   email: 'admin@example.com',
    //   name: '管理员',
    //   role: 'admin'
    // }).returning();

    // 创建默认内容分类
    await db.insert(contentCategories).values([
      {
        name: '野生动物故事',
        slug: 'wildlife-stories',
        description: '可可西里野生动物的真实故事',
        icon: '🐺',
        color: '#3B82F6'
      },
      {
        name: '保护知识',
        slug: 'conservation-knowledge',
        description: '科学保护野生动物的知识',
        icon: '📚',
        color: '#10B981'
      },
      {
        name: '新闻动态',
        slug: 'news',
        description: '最新的保护工作动态',
        icon: '📰',
        color: '#F59E0B'
      },
      {
        name: '科学研究',
        slug: 'scientific-research',
        description: '野生动物相关的科学研究',
        icon: '🔬',
        color: '#8B5CF6'
      }
    ]);

    // 创建默认捐赠项目
    const [project1, project2, project3] = await db.insert(donationProjects).values([
      {
        title: '可可西里野生动物保护基金',
        slug: 'kekekeli-protection-fund',
        description: '支持可可西里地区野生动物的科学保护和救助工作',
        targetAmount: '1000000',
        category: 'protection',
        tags: ['可可西里', '野生动物', '保护基金']
      },
      {
        title: '野生动物教育宣传',
        slug: 'education-outreach',
        description: '制作和传播科学保护野生动物的教育内容',
        targetAmount: '500000',
        category: 'education',
        tags: ['教育', '宣传', '科普']
      },
      {
        title: '保护设备采购',
        slug: 'equipment-purchase',
        description: '为野外保护工作者提供必要的设备和工具',
        targetAmount: '300000',
        category: 'equipment',
        tags: ['设备', '工具', '野外保护']
      }
    ]).returning();

    console.log('✅ 数据库种子数据初始化完成！');
    console.log('📊 创建了 4 个内容分类');
    console.log('🎯 创建了 3 个捐赠项目');

  } catch (error) {
    console.error('❌ 数据库种子数据初始化失败:', error);
    process.exit(1);
  }
}

// 运行种子数据
seed();
```

### 2. 运行种子数据

```bash
# 运行种子数据脚本
npx tsx drizzle/seed.ts

# 或者使用 npm 脚本
npm run db:seed
```

### 3. 手动 SQL 初始化

如果需要手动执行 SQL，可以使用以下脚本：

```sql
-- 创建默认内容分类
INSERT INTO content_categories (name, slug, description, icon, color) VALUES
('野生动物故事', 'wildlife-stories', '可可西里野生动物的真实故事', '🐺', '#3B82F6'),
('保护知识', 'conservation-knowledge', '科学保护野生动物的知识', '📚', '#10B981'),
('新闻动态', 'news', '最新的保护工作动态', '📰', '#F59E0B'),
('科学研究', 'scientific-research', '野生动物相关的科学研究', '🔬', '#8B5CF6');

-- 创建默认捐赠项目
INSERT INTO donation_projects (title, slug, description, target_amount, status, category, tags) VALUES
('可可西里野生动物保护基金', 'kekekeli-protection-fund', '支持可可西里地区野生动物的科学保护和救助工作', 1000000, 'active', 'protection', ARRAY['可可西里', '野生动物', '保护基金']),
('野生动物教育宣传', 'education-outreach', '制作和传播科学保护野生动物的教育内容', 500000, 'active', 'education', ARRAY['教育', '宣传', '科普']),
('保护设备采购', 'equipment-purchase', '为野外保护工作者提供必要的设备和工具', 300000, 'active', 'equipment', ARRAY['设备', '工具', '野外保护']);
```

### 4. 数据备份策略

```sql
-- 创建备份函数
CREATE OR REPLACE FUNCTION create_backup()
RETURNS TEXT AS $$
DECLARE
  backup_name TEXT;
BEGIN
  backup_name := 'backup_' || to_char(NOW(), 'YYYY_MM_DD_HH24_MI_SS');

  -- 这里可以添加具体的备份逻辑
  -- 例如导出到 CSV 文件或创建数据库快照

  RETURN backup_name;
END;
$$ LANGUAGE plpgsql;
```

## 🚨 数据库监控

### 1. 性能指标监控

```sql
-- 创建性能监控视图
CREATE VIEW database_performance AS
SELECT
  (SELECT COUNT(*) FROM donations WHERE payment_status = 'completed') as total_donations,
  (SELECT COUNT(DISTINCT user_id) FROM donations WHERE payment_status = 'completed') as unique_donors,
  (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE payment_status = 'completed') as total_amount,
  (SELECT COUNT(*) FROM education_content WHERE status = 'published') as published_articles,
  (SELECT COUNT(*) FROM auth.users) as total_users,
  NOW() as last_updated;
```

### 2. 健康检查

```sql
-- 数据库健康检查函数
CREATE OR REPLACE FUNCTION health_check()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  result := json_build_object(
    'database', 'healthy',
    'connections', (SELECT count(*) FROM pg_stat_activity),
    'size', pg_size_pretty(pg_database_size(current_database())),
    'timestamp', NOW()
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## 📝 数据库文档生成

### 1. 自动生成文档

```sql
-- 生成表结构文档
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### 2. 关系图生成

```sql
-- 生成外键关系
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**数据库设计者**: 开发团队