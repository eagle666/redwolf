# 开发环境配置指南

## 🛠️ 环境要求

### 必需软件
- **Node.js**: 18.17.0+ (推荐使用 LTS 版本)
- **npm**: 9.0.0+ 或 **yarn**: 1.22.0+
- **Git**: 2.30.0+
- **VS Code**: 最新版本 (推荐)

### 推荐工具
- **Postman**: API 测试工具
- **DBeaver**: 数据库管理工具
- **Chrome DevTools**: 浏览器开发工具

## 📦 项目初始化步骤

### 1. 克隆项目仓库
```bash
git clone <repository-url>
cd redwolf
```

### 2. 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境变量配置
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
nano .env.local
# 或使用 VS Code 编辑
code .env.local
```

### 4. 数据库设置
```bash
# 生成数据库迁移文件
npx drizzle-kit generate

# 运行数据库迁移
npx drizzle-kit migrate

# 启动数据库可视化工具
npx drizzle-kit studio
```

## 🔧 开发工具配置

### VS Code 扩展推荐
创建 `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "drizzle-team.drizzle",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-thunder-client"
  ]
}
```

### VS Code 工作区设置
创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 调试配置
创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "autoAttachChildProcesses": true,
      "restart": true,
      "runtimeArgs": ["--inspect"],
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 🧪 测试环境配置

### Jest 配置
项目已包含 `jest.config.js`，主要配置：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/src/**/__tests__/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### 测试设置文件
创建 `tests/setup.ts`:

```typescript
import { config } from 'dotenv'
import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals'

// 加载测试环境变量
config({ path: '.env.test' })

// 测试数据库设置
beforeAll(async () => {
  // 初始化测试数据库
})

afterAll(async () => {
  // 清理测试数据库
})

beforeEach(async () => {
  // 每个测试前的准备
})

afterEach(async () => {
  // 每个测试后的清理
})
```

## 📊 开发命令速查

### 基础开发命令
```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 自动修复代码
npm run lint:fix

# 类型检查
npm run type-check
```

### 测试命令
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch

# 运行特定测试文件
npm test -- tests/donations.test.ts
```

### 数据库命令
```bash
# 生成迁移文件
npx drizzle-kit generate

# 应用迁移
npx drizzle-kit migrate

# 推送 schema 到数据库
npx drizzle-kit push

# 打开数据库可视化工具
npx drizzle-kit studio

# 检查数据库状态
npx drizzle-kit check
```

## 🔍 调试技巧

### 1. 使用 VS Code 调试器
- 在代码中设置断点
- 使用 `debugger` 语句
- 配置 launch.json 进行调试

### 2. 使用浏览器 DevTools
- Network 面板查看 API 请求
- Console 面板查看日志
- Application 面板查看本地存储

### 3. API 测试
```typescript
// 使用 Thunder Client (VS Code 扩展)
// 或使用 Postman 测试 API 端点
```

### 4. 数据库调试
```typescript
// 使用 Drizzle Studio 可视化数据库
// 或使用 DBeaver 连接数据库
```

## 🚨 常见问题解决

### 1. 端口占用问题
```bash
# 查找占用 3000 端口的进程
lsof -ti:3000

# 终止进程
kill -9 $(lsof -ti:3000)
```

### 2. 依赖安装问题
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 3. TypeScript 错误
```bash
# 重新生成类型
npm run type-check

# 清理 Next.js 缓存
rm -rf .next
npm run dev
```

### 4. 数据库连接问题
```bash
# 检查环境变量
echo $DATABASE_URL

# 测试数据库连接
npx drizzle-kit check
```

## 📈 性能优化建议

### 开发环境优化
1. **使用 SSD** 存储项目文件
2. **增加内存** 到 8GB+
3. **关闭不必要的** 浏览器扩展
4. **使用最新版本的** Node.js

### 代码优化
1. **启用 TypeScript 严格模式**
2. **使用 ESLint 和 Prettier**
3. **定期更新依赖包**
4. **使用代码分割和懒加载**

## 🔐 安全配置

### 环境变量安全
```bash
# 确保 .env.local 在 .gitignore 中
echo ".env.local" >> .gitignore

# 使用强密码和随机密钥
openssl rand -base64 32
```

### API 安全
- 验证所有输入数据
- 使用 HTTPS
- 实施适当的错误处理
- 定期更新依赖包

## 📱 移动端开发

### 响应式测试
1. 使用 Chrome DevTools 设备模拟器
2. 测试不同屏幕尺寸
3. 验证触摸交互

### 移动端调试
```bash
# 使用 Chrome 远程调试
chrome://inspect/#devices
```

## 🔄 持续集成

### GitHub Actions 示例
创建 `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build
```

## 📚 学习资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team)

### 推荐教程
- Next.js 官方教程
- TypeScript 最佳实践
- 测试驱动开发指南

---

**文档版本**: 1.0.0
**创建时间**: 2024年1月
**最后更新**: 2024年1月
**维护者**: 开发团队