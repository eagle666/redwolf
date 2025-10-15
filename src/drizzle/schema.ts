// Drizzle ORM Schema定义
// 模块1: 数据库模式定义

// TODO: 实现真正的Drizzle schema
// 目前提供基本的mock对象用于测试

export const donations = {
  id: 'uuid',
  projectId: 'uuid',
  amount: 'decimal',
  supporterName: 'text',
  supporterEmail: 'text',
  message: 'text',
  status: 'text',
  createdAt: 'timestamp',
  completedAt: 'timestamp'
}

export const donationProjects = {
  id: 'uuid',
  title: 'text',
  description: 'text',
  targetAmount: 'decimal',
  currentAmount: 'decimal',
  status: 'text',
  featuredImage: 'text',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
}

export const projectStats = {
  id: 'uuid',
  projectId: 'uuid',
  totalAmount: 'decimal',
  totalDonors: 'integer',
  currentMonthAmount: 'decimal',
  lastDonationDate: 'timestamp',
  updatedAt: 'timestamp'
}

export const userRoles = {
  id: 'uuid',
  userId: 'uuid',
  role: 'text',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
}

export const educationContent = {
  id: 'uuid',
  title: 'text',
  slug: 'text',
  content: 'text',
  excerpt: 'text',
  featuredImage: 'text',
  category: 'text',
  status: 'text',
  authorId: 'uuid',
  viewCount: 'integer',
  tags: 'array',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  publishedAt: 'timestamp'
}