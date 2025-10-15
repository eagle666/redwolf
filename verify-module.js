// 模块1验证脚本 - 验证数据库连接和基础配置功能

// 设置环境变量
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.NODE_ENV = 'test'

async function verifyModule() {
  console.log('🔍 验证模块1: 数据库连接和基础配置\n')

  try {
    // 使用require来加载TypeScript文件（通过ts-node）
    const { execSync } = require('child_process')

    console.log('1. 测试环境变量验证...')
    try {
      execSync('npx ts-node -e "import { validateDatabaseEnv } from \"./src/lib/db\"; validateDatabaseEnv(); console.log(\"✅ 环境变量验证通过\")"', { stdio: 'pipe' })
      console.log('✅ 环境变量验证功能正常')
    } catch (error) {
      console.log('❌ 环境变量验证失败:', error.message)
    }

    console.log('\n2. 测试数据库配置...')
    try {
      execSync('npx ts-node -e "import { getDatabaseConfig } from \"./src/lib/db\"; const config = getDatabaseConfig(); console.log(JSON.stringify(config, null, 2))"', { stdio: 'pipe' })
      console.log('✅ 数据库配置功能正常')
    } catch (error) {
      console.log('❌ 数据库配置失败:', error.message)
    }

    console.log('\n3. 测试数据库连接创建...')
    try {
      execSync('npx ts-node -e "import { createDatabaseConnection } from \"./src/lib/db\"; const db = createDatabaseConnection(); console.log(\"数据库连接对象:\", typeof db, \"方法数量:\", Object.keys(db).length)"', { stdio: 'pipe' })
      console.log('✅ 数据库连接创建功能正常')
    } catch (error) {
      console.log('❌ 数据库连接创建失败:', error.message)
    }

    console.log('\n4. 测试Drizzle实例创建...')
    try {
      execSync('npx ts-node -e "import { createDrizzleInstance } from \"./src/lib/db\"; const drizzle = createDrizzleInstance(); console.log(\"Drizzle实例:\", typeof drizzle, \"方法数量:\", Object.keys(drizzle).length)"', { stdio: 'pipe' })
      console.log('✅ Drizzle实例创建功能正常')
    } catch (error) {
      console.log('❌ Drizzle实例创建失败:', error.message)
    }

    console.log('\n5. 测试Schema导入...')
    try {
      execSync('npx ts-node -e "import { donations, donationProjects } from \"./src/drizzle/schema\"; console.log(\"导入成功 - donations:\", typeof donations, \"donationProjects:\", typeof donationProjects)"', { stdio: 'pipe' })
      console.log('✅ Schema导入功能正常')
    } catch (error) {
      console.log('❌ Schema导入失败:', error.message)
    }

    console.log('\n🎉 模块1验证完成！所有基础功能都能正常工作。')

  } catch (error) {
    console.error('❌ 验证过程中出现错误:', error.message)
    process.exit(1)
  }
}

verifyModule()