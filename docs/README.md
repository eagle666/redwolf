# 可可西里野生动物保护网站 - 项目文档

## 🐺 项目简介

这是可可西里野生动物保护网站的完整技术文档，用于支持科学保护和科学爱护野生动物的公益平台。

## 📚 文档导航

### 📋 项目概览 ([`00-project-overview`](./00-project-overview/))
- [`项目简介`](./00-project-overview/project-brief.md) - 项目背景、目标和核心价值观
- [`技术栈说明`](./00-project-overview/tech-stack.md) - 完整技术栈选型和理由
- [`系统架构`](./00-project-overview/architecture.md) - 系统整体架构和设计理念

### 🛠️ 环境配置 ([`01-setup`](./01-setup/))
- [`本地开发环境`](./01-setup/local-development.md) - 开发环境搭建指南
- [`数据库配置`](./01-setup/database-setup.md) - Supabase数据库完整配置
- [`Creem支付配置`](./01-setup/creem-payment.md) - Creem支付系统集成指南
- [`环境变量`](./01-setup/environment-vars.md) - 所有环境变量说明

### 🎨 前端开发 ([`02-frontend`](./02-frontend/))
- [`组件开发指南`](./02-frontend/components-guide.md) - React组件开发规范和最佳实践
- [`页面结构说明`](./02-frontend/pages-structure.md) - Next.js App Router页面结构
- [`样式系统`](./02-frontend/styling-system.md) - Tailwind CSS设计系统
- [`状态管理`](./02-frontend/state-management.md) - 前端状态管理方案

### 🔧 后端开发 ([`03-backend`](./03-backend/))
- [`API路由设计`](./03-backend/api-routes.md) - Next.js API Routes完整设计
- [`数据库设计`](./03-backend/database-schema.md) - 数据库表结构和关系设计
- [`Webhook处理`](./03-backend/webhook-handling.md) - Creem Webhook完整处理流程
- [`认证系统`](./03-backend/authentication.md) - 用户认证和权限管理

### ⚡ 功能模块 ([`04-features`](./04-features/))
- [`捐赠系统`](./04-features/donation-system.md) - 完整捐赠功能实现
- [`用户管理`](./04-features/user-management.md) - 用户注册、登录和个人中心
- [`内容管理`](./04-features/content-cms.md) - 内容管理系统功能
- [`数据分析`](./04-features/analytics.md) - 数据统计和分析功能

### 🚀 部署运维 ([`05-deployment`](./05-deployment/))
- [`Vercel部署`](./05-deployment/vercel-deployment.md) - 生产环境部署指南
- [`监控配置`](./05-deployment/monitoring.md) - 应用监控和告警设置
- [`备份策略`](./05-deployment/backup-strategy.md) - 数据备份和恢复策略

### 🔧 维护指南 ([`06-maintenance`](./06-maintenance/))
- [`日常任务`](./06-maintenance/daily-tasks.md) - 日常维护任务清单
- [`故障排除`](./06-maintenance/troubleshooting.md) - 常见问题和解决方案
- [`安全检查清单`](./06-maintenance/security-checklist.md) - 安全检查和最佳实践

### 📚 参考资料 ([`07-reference`](./07-reference/))
- [`API参考`](./07-reference/api-reference.md) - 完整API接口文档
- [`数据库参考`](./07-reference/database-reference.md) - 数据库表结构和字段说明
- [`外部链接`](./07-reference/external-links.md) - 相关资源和工具链接

## 🤖 Claude AI助手

查看 [`CLAUDE.md`](./CLAUDE.md) 了解如何与Claude AI助手协作开发本项目。

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Git
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 开始步骤
1. **克隆项目并安装依赖**
   ```bash
   git clone <repository-url>
   cd redwolf
   npm install
   ```

2. **配置环境变量**
   - 复制 `.env.example` 到 `.env.local`
   - 参考 [`环境变量`](./01-setup/environment-vars.md) 配置所有必需的环境变量

3. **设置数据库**
   - 参考 [`数据库配置`](./01-setup/database-setup.md) 设置Supabase项目
   - 运行数据库迁移

4. **配置支付系统**
   - 参考 [`Creem支付配置`](./01-setup/creem-payment.md) 设置Creem账户

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   - 前端应用: http://localhost:3000
   - API文档: http://localhost:3000/api-docs

## 📖 文档使用指南

### 🎯 按角色阅读文档

**👨‍💻 开发者**
1. 阅读项目概览了解整体架构
2. 按照环境配置指南搭建开发环境
3. 根据负责模块阅读对应的开发文档

**🚀 运维人员**
1. 重点阅读部署运维章节
2. 熟悉监控和备份策略
3. 掌握故障排除方法

**📊 项目经理**
1. 阅读项目概览了解目标和进度
2. 查看功能模块了解实现范围
3. 关注部署和运维要求

**🔒 安全人员**
1. 重点阅读安全检查清单
2. 了解认证和权限系统
3. 审查环境变量和API安全

### 📝 文档贡献

如果你发现文档有误或需要补充，请：
1. 在GitHub上提交Issue
2. 直接提交Pull Request
3. 联系项目维护者

## 🔗 相关链接

- **GitHub仓库**: [项目地址]
- **在线演示**: [演示地址]
- **Bug反馈**: [Issues页面]
- **功能建议**: [Discussions页面]

## 📄 许可证

本项目采用 [MIT许可证](../LICENSE)。

---

**最后更新**: 2024年1月
**文档版本**: 1.0.0
**维护者**: 项目团队