// 数据分析和报表系统测试
// 模块9: TDD开发 - 数据分析和报表系统

import {
  generateDonationReport,
  generateProjectReport,
  generateUserReport,
  generateFinancialReport,
  generateCampaignReport,
  getDonationStatistics,
  getProjectStatistics,
  getUserStatistics,
  getFinancialStatistics,
  getCampaignStatistics,
  analyzeDonationTrends,
  analyzeProjectPerformance,
  analyzeUserBehavior,
  analyzeRevenueStreams,
  analyzeCampaignEffectiveness,
  createCustomReport,
  exportReport,
  scheduleReport,
  getRealTimeMetrics,
  getDashboardData,
  compareTimePeriods,
  predictRevenue,
  generateInsights,
  getAlerts,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  shareReport,
  AnalyticsReport,
  ReportType,
  TimeRange,
  StatisticsData,
  TrendAnalysis,
  DashboardConfig,
  AlertConfig,
  PredictionModel,
  CustomReportOptions,
  ExportOptions
} from '../../src/lib/services/data-analytics'

describe('数据分析和报表系统', () => {
  beforeEach(() => {
    // 清理测试环境
    jest.clearAllMocks()
  })

  describe('generateDonationReport - 捐赠报告生成', () => {
    it('应该成功生成捐赠总览报告', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        format: 'json' as const,
        includeCharts: true,
        granularity: 'monthly' as const
      }

      const report = await generateDonationReport('overview', options)

      expect(report.success).toBe(true)
      expect(report.type).toBe('donation')
      expect(report.subtype).toBe('overview')
      expect(report.title).toContain('捐赠总览报告')
      expect(report.data).toBeDefined()
      expect(report.charts).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(report.generatedAt).toBeDefined()
      expect(report.period).toEqual(options.timeRange)
    })

    it('应该生成项目捐赠详情报告', async () => {
      const options = {
        projectId: 'project-123',
        timeRange: {
          start: new Date('2024-06-01'),
          end: new Date('2024-06-30')
        },
        includeDonorDetails: true,
        includeTrends: true
      }

      const report = await generateDonationReport('project-details', options)

      expect(report.success).toBe(true)
      expect(report.data.projectId).toBe('project-123')
      expect(report.data.donorCount).toBeGreaterThan(0)
      expect(report.data.totalAmount).toBeGreaterThan(0)
      expect(report.data.averageDonation).toBeGreaterThan(0)
      expect(report.data.trends).toBeDefined()
      expect(report.data.topDonors).toBeDefined()
    })

    it('应该生成捐赠者分析报告', async () => {
      const options = {
        donorIds: ['donor-1', 'donor-2'],
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeGivingHistory: true,
        includePredictions: true
      }

      const report = await generateDonationReport('donor-analysis', options)

      expect(report.success).toBe(true)
      expect(report.data.donors).toHaveLength(2)
      expect(report.data.donors[0].givingHistory).toBeDefined()
      expect(report.data.donors[0].lifetimeValue).toBeGreaterThan(0)
      expect(report.data.donors[0].prediction).toBeDefined()
    })

    it('应该支持不同报告格式', async () => {
      const formats = ['json', 'pdf', 'excel', 'csv'] as const

      for (const format of formats) {
        const options = {
          format,
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31')
          }
        }

        const report = await generateDonationReport('overview', options)

        expect(report.success).toBe(true)
        expect(report.format).toBe(format)
      }
    })

    it('应该处理无效的时间范围', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-12-31'),
          end: new Date('2024-01-01') // 结束时间早于开始时间
        }
      }

      const report = await generateDonationReport('overview', options)

      expect(report.success).toBe(false)
      expect(report.error).toContain('无效的时间范围')
    })
  })

  describe('generateProjectReport - 项目报告生成', () => {
    it('应该生成项目绩效报告', async () => {
      const options = {
        projectId: 'project-123',
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        metrics: ['donations', 'engagement', 'reach'],
        compareWithPrevious: true
      }

      const report = await generateProjectReport('performance', options)

      expect(report.success).toBe(true)
      expect(report.type).toBe('project')
      expect(report.subtype).toBe('performance')
      expect(report.data.projectId).toBe('project-123')
      expect(report.data.metrics).toBeDefined()
      expect(report.data.comparison).toBeDefined()
      expect(report.data.achievements).toBeDefined()
    })

    it('应该生成项目进度报告', async () => {
      const options = {
        projectId: 'project-123',
        includeMilestones: true,
        includeRisks: true,
        includeRecommendations: true
      }

      const report = await generateProjectReport('progress', options)

      expect(report.success).toBe(true)
      expect(report.data.progressPercentage).toBeGreaterThan(0)
      expect(report.data.milestones).toBeDefined()
      expect(report.data.risks).toBeDefined()
      expect(report.data.recommendations).toBeDefined()
    })

    it('应该生成项目影响力报告', async () => {
      const options = {
        projectId: 'project-123',
        includeBeneficiaryStories: true,
        includeImpactMetrics: true,
        includeTestimonials: true
      }

      const report = await generateProjectReport('impact', options)

      expect(report.success).toBe(true)
      expect(report.data.impactMetrics).toBeDefined()
      expect(report.data.beneficiaryCount).toBeGreaterThan(0)
      expect(report.data.stories).toBeDefined()
      expect(report.data.testimonials).toBeDefined()
    })
  })

  describe('generateUserReport - 用户报告生成', () => {
    it('应该生成用户活动报告', async () => {
      const options = {
        userId: 'user-123',
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeDonations: true,
        includeEngagement: true,
        includePreferences: true
      }

      const report = await generateUserReport('activity', options)

      expect(report.success).toBe(true)
      expect(report.data.userId).toBe('user-123')
      expect(report.data.totalDonations).toBeGreaterThan(0)
      expect(report.data.engagementScore).toBeGreaterThan(0)
      expect(report.data.preferences).toBeDefined()
    })

    it('应该生成用户价值分析报告', async () => {
      const options = {
        userId: 'user-123',
        includeLifetimeValue: true,
        includeChurnRisk: true,
        includeRecommendations: true
      }

      const report = await generateUserReport('value-analysis', options)

      expect(report.success).toBe(true)
      expect(report.data.lifetimeValue).toBeGreaterThan(0)
      expect(report.data.churnRisk).toBeDefined()
      expect(report.data.segment).toBeDefined()
      expect(report.data.recommendations).toBeDefined()
    })
  })

  describe('generateFinancialReport - 财务报告生成', () => {
    it('应该生成收入报告', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        granularity: 'monthly' as const,
        includeProjections: true,
        includeComparison: true
      }

      const report = await generateFinancialReport('revenue', options)

      expect(report.success).toBe(true)
      expect(report.data.totalRevenue).toBeGreaterThan(0)
      expect(report.data.monthlyBreakdown).toBeDefined()
      expect(report.data.projections).toBeDefined()
      expect(report.data.yearlyComparison).toBeDefined()
    })

    it('应该生成支出报告', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        categories: ['operations', 'marketing', 'platform'],
        includeVarianceAnalysis: true
      }

      const report = await generateFinancialReport('expenses', options)

      expect(report.success).toBe(true)
      expect(report.data.totalExpenses).toBeGreaterThan(0)
      expect(report.data.categoryBreakdown).toBeDefined()
      expect(report.data.varianceAnalysis).toBeDefined()
    })

    it('应该生成现金流报告', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeForecast: true,
        includeWorkingCapital: true
      }

      const report = await generateFinancialReport('cash-flow', options)

      expect(report.success).toBe(true)
      expect(report.data.openingBalance).toBeDefined()
      expect(report.data.cashInflows).toBeDefined()
      expect(report.data.cashOutflows).toBeDefined()
      expect(report.data.closingBalance).toBeDefined()
      expect(report.data.forecast).toBeDefined()
    })
  })

  describe('generateCampaignReport - 活动报告生成', () => {
    it('应该生成活动绩效报告', async () => {
      const options = {
        campaignId: 'campaign-123',
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeROI: true,
        includeAttribution: true
      }

      const report = await generateCampaignReport('performance', options)

      expect(report.success).toBe(true)
      expect(report.data.campaignId).toBe('campaign-123')
      expect(report.data.totalConversions).toBeGreaterThan(0)
      expect(report.data.costPerAcquisition).toBeGreaterThan(0)
      expect(report.data.returnOnInvestment).toBeDefined()
      expect(report.data.attributionData).toBeDefined()
    })

    it('应该生成A/B测试报告', async () => {
      const options = {
        campaignId: 'campaign-123',
        testId: 'test-456',
        includeStatisticalSignificance: true,
        includeRecommendations: true
      }

      const report = await generateCampaignReport('ab-test', options)

      expect(report.success).toBe(true)
      expect(report.data.testGroups).toBeDefined()
      expect(report.data.winner).toBeDefined()
      expect(report.data.confidenceLevel).toBeGreaterThan(0)
      expect(report.data.recommendations).toBeDefined()
    })
  })

  describe('getDonationStatistics - 捐赠统计', () => {
    it('应该返回捐赠基础统计', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        }
      }

      const stats = await getDonationStatistics(options)

      expect(stats.totalDonations).toBeGreaterThan(0)
      expect(stats.totalAmount).toBeGreaterThan(0)
      expect(stats.averageDonation).toBeGreaterThan(0)
      expect(stats.uniqueDonors).toBeGreaterThan(0)
      expect(stats.repeatDonors).toBeGreaterThan(0)
      expect(stats.timeRange).toEqual(options.timeRange)
    })

    it('应该支持分组统计', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        groupBy: 'project' as const
      }

      const stats = await getDonationStatistics(options)

      expect(stats.groupedBy).toBe('project')
      expect(stats.groups).toBeDefined()
      expect(stats.groups.length).toBeGreaterThan(0)
      expect(stats.groups[0].groupKey).toBeDefined()
      expect(stats.groups[0].donations).toBeGreaterThan(0)
    })
  })

  describe('analyzeDonationTrends - 捐赠趋势分析', () => {
    it('应该分析月度捐赠趋势', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        granularity: 'monthly' as const,
        includeForecast: true
      }

      const analysis = await analyzeDonationTrends(options)

      expect.analysis.success.toBe(true)
      expect(analysis.data.trends).toBeDefined()
      expect(analysis.data.trends.length).toBe(12) // 12个月
      expect(analysis.data.forecast).toBeDefined()
      expect(analysis.data.seasonality).toBeDefined()
      expect(analysis.data.growthRate).toBeDefined()
    })

    it('应该检测异常捐赠模式', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        detectAnomalies: true,
        anomalyThreshold: 2 // 2个标准差
      }

      const analysis = await analyzeDonationTrends(options)

      expect(analysis.data.anomalies).toBeDefined()
      expect(analysis.data.anomalies.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('analyzeProjectPerformance - 项目绩效分析', () => {
    it('应该分析项目完成度', async () => {
      const options = {
        projectIds: ['project-1', 'project-2'],
        includeProgressMetrics: true,
        includeRiskAssessment: true
      }

      const analysis = await analyzeProjectPerformance(options)

      expect(analysis.success).toBe(true)
      expect(analysis.data.projects).toHaveLength(2)
      expect(analysis.data.projects[0].completionRate).toBeGreaterThan(0)
      expect(analysis.data.projects[0].riskLevel).toBeDefined()
      expect(analysis.data.projects[0].recommendations).toBeDefined()
    })

    it('应该比较项目绩效', async () => {
      const options = {
        projectIds: ['project-1', 'project-2'],
        comparisonMetrics: ['donations', 'engagement', 'progress'],
        benchmarkAgainst: 'average' as const
      }

      const analysis = await analyzeProjectPerformance(options)

      expect(analysis.data.comparison).toBeDefined()
      expect(analysis.data.rankings).toBeDefined()
      expect(analysis.data.outliers).toBeDefined()
    })
  })

  describe('analyzeUserBehavior - 用户行为分析', () => {
    it('应该分析用户参与度', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        segmentBy: 'donation-frequency' as const
      }

      const analysis = await analyzeUserBehavior(options)

      expect(analysis.success).toBe(true)
      expect(analysis.data.segments).toBeDefined()
      expect(analysis.data.engagementMetrics).toBeDefined()
      expect(analysis.data.retentionRates).toBeDefined()
    })

    it('应该预测用户流失风险', async () => {
      const options = {
        includeChurnPrediction: true,
        predictionModel: 'random-forest' as const
      }

      const analysis = await analyzeUserBehavior(options)

      expect(analysis.data.churnPrediction).toBeDefined()
      expect(analysis.data.riskSegments).toBeDefined()
      expect(analysis.data.interventionRecommendations).toBeDefined()
    })
  })

  describe('analyzeRevenueStreams - 收入流分析', () => {
    it('应该分析多元化收入来源', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeProjections: true
      }

      const analysis = await analyzeRevenueStreams(options)

      expect(analysis.success).toBe(true)
      expect(analysis.data.streams).toBeDefined()
      expect(analysis.data.diversificationIndex).toBeGreaterThan(0)
      expect(analysis.data.projections).toBeDefined()
      expect(analysis.data.risks).toBeDefined()
    })

    it('应该识别收入增长机会', async () => {
      const options = {
        identifyOpportunities: true,
        opportunityThreshold: 0.1 // 10%增长潜力
      }

      const analysis = await analyzeRevenueStreams(options)

      expect(analysis.data.opportunities).toBeDefined()
      expect(analysis.data.marketPotential).toBeDefined()
      expect(analysis.data.recommendations).toBeDefined()
    })
  })

  describe('createCustomReport - 自定义报告', () => {
    it('应该创建自定义报告', async () => {
      const options: CustomReportOptions = {
        name: '月度综合报告',
        description: '包含捐赠、项目、用户数据的综合报告',
        metrics: [
          {
            type: 'donation',
            aggregation: 'sum',
            filters: { status: 'completed' }
          },
          {
            type: 'project',
            aggregation: 'count',
            filters: { status: 'active' }
          }
        ],
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        format: 'json',
        schedule: {
          frequency: 'monthly',
          recipients: ['admin@example.com']
        }
      }

      const report = await createCustomReport(options)

      expect(report.success).toBe(true)
      expect(report.reportId).toBeDefined()
      expect(report.name).toBe(options.name)
      expect(report.data).toBeDefined()
      expect(report.metrics).toHaveLength(2)
    })

    it('应该验证自定义报告配置', async () => {
      const invalidOptions = {
        name: '',
        metrics: [] // 空指标列表
      }

      const report = await createCustomReport(invalidOptions)

      expect(report.success).toBe(false)
      expect(report.error).toContain('报告配置无效')
    })
  })

  describe('exportReport - 报告导出', () => {
    it('应该导出为JSON格式', async () => {
      const mockReport = {
        type: 'donation',
        subtype: 'overview',
        data: { total: 1000 },
        generatedAt: new Date()
      }

      const options: ExportOptions = {
        format: 'json',
        includeCharts: false,
        filename: 'donation-report'
      }

      const result = await exportReport(mockReport, options)

      expect(result.success).toBe(true)
      expect(result.downloadUrl).toBeDefined()
      expect(result.filename).toContain('donation-report')
      expect(result.format).toBe('json')
    })

    it('应该导出为PDF格式', async () => {
      const mockReport = {
        type: 'donation',
        subtype: 'overview',
        data: { total: 1000 },
        charts: [],
        generatedAt: new Date()
      }

      const options: ExportOptions = {
        format: 'pdf',
        includeCharts: true,
        template: 'professional'
      }

      const result = await exportReport(mockReport, options)

      expect(result.success).toBe(true)
      expect(result.downloadUrl).toBeDefined()
      expect(result.format).toBe('pdf')
    })

    it('应该导出为Excel格式', async () => {
      const mockReport = {
        type: 'financial',
        subtype: 'revenue',
        data: {
          monthlyData: [
            { month: 'Jan', amount: 1000 },
            { month: 'Feb', amount: 1200 }
          ]
        },
        generatedAt: new Date()
      }

      const options: ExportOptions = {
        format: 'excel',
        includeCharts: false,
        worksheetName: 'Revenue Data'
      }

      const result = await exportReport(mockReport, options)

      expect(result.success).toBe(true)
      expect(result.downloadUrl).toBeDefined()
      expect(result.format).toBe('excel')
    })
  })

  describe('scheduleReport - 报告调度', () => {
    it('应该创建定期报告调度', async () => {
      const options = {
        reportId: 'report-123',
        schedule: {
          frequency: 'weekly' as const,
          dayOfWeek: 1, // 周一
          time: '09:00',
          timezone: 'Asia/Shanghai',
          recipients: ['admin@example.com', 'manager@example.com']
        },
        enabled: true
      }

      const result = await scheduleReport(options)

      expect(result.success).toBe(true)
      expect(result.scheduleId).toBeDefined()
      expect(result.nextRunTime).toBeDefined()
      expect(result.isActive).toBe(true)
    })

    it('应该验证调度配置', async () => {
      const invalidOptions = {
        reportId: 'nonexistent',
        schedule: {
          frequency: 'invalid' as const
        }
      }

      const result = await scheduleReport(invalidOptions)

      expect(result.success).toBe(false)
      expect(result.error).toContain('调度配置无效')
    })
  })

  describe('getRealTimeMetrics - 实时指标', () => {
    it('应该获取实时捐赠指标', async () => {
      const metrics = await getRealTimeMetrics(['donations', 'users', 'projects'])

      expect(metrics.donations).toBeDefined()
      expect(metrics.donations.count).toBeGreaterThan(0)
      expect(metrics.donations.amount).toBeGreaterThan(0)
      expect(metrics.donations.rate).toBeGreaterThan(0)

      expect(metrics.users).toBeDefined()
      expect(metrics.users.active).toBeGreaterThan(0)
      expect(metrics.users.new).toBeGreaterThan(0)

      expect(metrics.projects).toBeDefined()
      expect(metrics.projects.active).toBeGreaterThan(0)
      expect(metrics.projects.funding).toBeGreaterThan(0)

      expect(metrics.updatedAt).toBeDefined()
    })

    it('应该包含性能指标', async () => {
      const metrics = await getRealTimeMetrics(['performance'])

      expect(metrics.performance).toBeDefined()
      expect(metrics.performance.responseTime).toBeGreaterThan(0)
      expect(metrics.performance.throughput).toBeGreaterThan(0)
      expect(metrics.performance.errorRate).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getDashboardData - 仪表板数据', () => {
    it('应该获取仪表板配置数据', async () => {
      const dashboardId = 'dashboard-123'
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        refreshCache: false
      }

      const data = await getDashboardData(dashboardId, options)

      expect(data.success).toBe(true)
      expect(data.dashboardId).toBe(dashboardId)
      expect(data.widgets).toBeDefined()
      expect(data.widgets.length).toBeGreaterThan(0)
      expect(data.widgets[0].type).toBeDefined()
      expect(data.widgets[0].data).toBeDefined()
    })

    it('应该处理不存在的仪表板', async () => {
      const data = await getDashboardData('nonexistent')

      expect(data.success).toBe(false)
      expect(data.error).toContain('仪表板不存在')
    })
  })

  describe('compareTimePeriods - 时间段比较', () => {
    it('应该比较两个时间段', async () => {
      const options = {
        currentPeriod: {
          start: new Date('2024-01-01'),
          end: new Date('2024-03-31')
        },
        comparisonPeriod: {
          start: new Date('2023-01-01'),
          end: new Date('2023-03-31')
        },
        metrics: ['donations', 'users', 'revenue']
      }

      const comparison = await compareTimePeriods(options)

      expect(comparison.success).toBe(true)
      expect(comparison.currentPeriod).toBeDefined()
      expect(comparison.comparisonPeriod).toBeDefined()
      expect(comparison.variances).toBeDefined()
      expect(comparison.variances.donations).toBeDefined()
      expect(comparison.variances.donations.percentageChange).toBeDefined()
      expect(comparison.insights).toBeDefined()
    })

    it('应该计算同比增长率', async () => {
      const options = {
        currentPeriod: {
          start: new Date('2024-Q1'),
          end: new Date('2024-Q1')
        },
        comparisonPeriod: {
          start: new Date('2023-Q1'),
          end: new Date('2023-Q1')
        },
        calculateYoYGrowth: true
      }

      const comparison = await compareTimePeriods(options)

      expect(comparison.yearOverYearGrowth).toBeDefined()
      expect(comparison.yearOverYearGrowth.donations).toBeDefined()
      expect(comparison.seasonalAdjustment).toBeDefined()
    })
  })

  describe('predictRevenue - 收入预测', () => {
    it('应该预测未来收入', async () => {
      const options = {
        timeHorizon: 12, // 12个月
        model: 'linear-regression' as const,
        confidenceLevel: 0.95,
        includeSeasonality: true
      }

      const prediction = await predictRevenue(options)

      expect(prediction.success).toBe(true)
      expect(prediction.predictions).toBeDefined()
      expect(prediction.predictions.length).toBe(12)
      expect(prediction.predictions[0].date).toBeDefined()
      expect(prediction.predictions[0].predicted).toBeGreaterThan(0)
      expect(prediction.predictions[0].confidenceInterval).toBeDefined()
      expect(prediction.modelAccuracy).toBeDefined()
      expect(prediction.factors).toBeDefined()
    })

    it('应该支持多种预测模型', async () => {
      const models = ['linear-regression', 'arima', 'neural-network'] as const

      for (const model of models) {
        const options = { model, timeHorizon: 6 }
        const prediction = await predictRevenue(options)

        expect(prediction.success).toBe(true)
        expect(prediction.model).toBe(model)
      }
    })
  })

  describe('generateInsights - 洞察生成', () => {
    it('应该生成业务洞察', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        focusAreas: ['donations', 'user-engagement', 'project-performance'],
        includeRecommendations: true,
        insightLevel: 'strategic' as const
      }

      const insights = await generateInsights(options)

      expect(insights.success).toBe(true)
      expect(insights.insights).toBeDefined()
      expect(insights.insights.length).toBeGreaterThan(0)
      expect(insights.insights[0].category).toBeDefined()
      expect(insights.insights[0].title).toBeDefined()
      expect(insights.insights[0].description).toBeDefined()
      expect(insights.insights[0].impact).toBeDefined()
      expect(insights.recommendations).toBeDefined()
    })

    it('应该识别异常模式', async () => {
      const options = {
        detectAnomalies: true,
        anomalyThreshold: 2,
        includeRootCause: true
      }

      const insights = await generateInsights(options)

      expect(insights.anomalies).toBeDefined()
      expect(insights.rootCauseAnalysis).toBeDefined()
    })
  })

  describe('getAlerts - 告警获取', () => {
    it('应该获取活跃告警', async () => {
      const options = {
        status: 'active' as const,
        severity: ['high', 'critical'] as const[],
        categories: ['performance', 'revenue', 'user-activity']
      }

      const alerts = await getAlerts(options)

      expect(alerts.success).toBe(true)
      expect(alerts.alerts).toBeDefined()
      expect(alerts.alerts.length).toBeGreaterThanOrEqual(0)
      expect(alerts.total).toBeGreaterThanOrEqual(0)
    })

    it('应该包含告警详情', async () => {
      const alerts = await getAlerts()

      expect(alerts.alerts?.[0]).toMatchObject({
        id: expect.any(String),
        type: expect.any(String),
        severity: expect.any(String),
        message: expect.any(String),
        createdAt: expect.any(Date),
        status: expect.any(String)
      })
    })
  })

  describe('createDashboard - 创建仪表板', () => {
    it('应该创建新仪表板', async () => {
      const config: DashboardConfig = {
        name: '运营仪表板',
        description: '显示关键运营指标',
        layout: 'grid' as const,
        widgets: [
          {
            id: 'widget-1',
            type: 'metric',
            title: '总捐赠额',
            dataSource: 'donations',
            position: { x: 0, y: 0, width: 4, height: 2 }
          },
          {
            id: 'widget-2',
            type: 'chart',
            title: '捐赠趋势',
            dataSource: 'donation-trends',
            position: { x: 4, y: 0, width: 8, height: 4 }
          }
        ],
        refreshInterval: 300, // 5分钟
        isPublic: false
      }

      const result = await createDashboard(config)

      expect(result.success).toBe(true)
      expect(result.dashboardId).toBeDefined()
      expect(result.name).toBe(config.name)
      expect(result.widgets).toHaveLength(2)
    })

    it('应该验证仪表板配置', async () => {
      const invalidConfig = {
        name: '',
        widgets: []
      }

      const result = await createDashboard(invalidConfig)

      expect(result.success).toBe(false)
      expect(result.error).toContain('仪表板配置无效')
    })
  })

  describe('updateDashboard - 更新仪表板', () => {
    it('应该更新现有仪表板', async () => {
      const dashboardId = 'dashboard-123'
      const updates = {
        name: '更新后的仪表板',
        widgets: [
          {
            id: 'widget-1',
            type: 'metric',
            title: '新的指标',
            dataSource: 'users',
            position: { x: 0, y: 0, width: 6, height: 2 }
          }
        ]
      }

      const result = await updateDashboard(dashboardId, updates)

      expect(result.success).toBe(true)
      expect(result.updatedAt).toBeDefined()
    })

    it('应该拒绝更新不存在的仪表板', async () => {
      const result = await updateDashboard('nonexistent', { name: 'test' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('仪表板不存在')
    })
  })

  describe('deleteDashboard - 删除仪表板', () => {
    it('应该删除仪表板', async () => {
      const dashboardId = 'dashboard-123'
      const result = await deleteDashboard(dashboardId)

      expect(result.success).toBe(true)
      expect(result.deletedAt).toBeDefined()
    })

    it('应该拒绝删除不存在的仪表板', async () => {
      const result = await deleteDashboard('nonexistent')

      expect(result.success).toBe(false)
      expect(result.error).toContain('仪表板不存在')
    })
  })

  describe('shareReport - 分享报告', () => {
    it('应该生成报告分享链接', async () => {
      const reportId = 'report-123'
      const options = {
        expiresIn: 7 * 24 * 60 * 60, // 7天
        allowDownload: true,
        password: 'secure123',
        recipients: ['user@example.com']
      }

      const result = await shareReport(reportId, options)

      expect(result.success).toBe(true)
      expect(result.shareUrl).toBeDefined()
      expect(result.shareId).toBeDefined()
      expect(result.expiresAt).toBeDefined()
      expect(result.passwordProtected).toBe(true)
    })

    it('应该支持公开分享', async () => {
      const options = {
        isPublic: true,
        allowEmbed: true,
        customDomain: 'reports.example.com'
      }

      const result = await shareReport('report-123', options)

      expect(result.success).toBe(true)
      expect(result.isPublic).toBe(true)
      expect(result.embedCode).toBeDefined()
    })
  })

  describe('性能测试', () => {
    it('应该在合理时间内生成报告', async () => {
      const startTime = Date.now()

      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeCharts: true
      }

      await generateDonationReport('overview', options)

      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(5000) // 5秒内完成
    })

    it('应该支持并发报告生成', async () => {
      const startTime = Date.now()

      const promises = Array.from({ length: 5 }, () =>
        generateDonationReport('overview', {
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31')
          }
        })
      )

      const results = await Promise.all(promises)

      const duration = Date.now() - startTime

      expect(results.every(r => r.success)).toBe(true)
      expect(duration).toBeLessThan(10000) // 10秒内完成5个报告
    })
  })

  describe('错误处理测试', () => {
    it('应该处理数据源连接错误', async () => {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        }
      }

      // 模拟数据源错误
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Database connection failed'))

      const report = await generateDonationReport('overview', options)

      expect(report.success).toBe(false)
      expect(report.error).toContain('数据源连接失败')
    })

    it('应该处理内存不足错误', async () => {
      const options = {
        timeRange: {
          start: new Date('2020-01-01'),
          end: new Date('2024-12-31') // 5年数据量
        },
        includeCharts: true,
        granularity: 'daily' // 每日数据
      }

      const report = await generateDonationReport('overview', options)

      expect(report.success).toBe(false)
      expect(report.error).toContain('内存不足') || expect(report.error).toContain('数据量过大')
    })
  })
})