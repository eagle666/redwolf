#!/usr/bin/env node

/**
 * 自定义测试运行器：验证数据分析和报表系统功能
 * 由于复杂的数据处理，使用Node.js直接运行功能验证
 */

console.log('🚀 开始验证数据分析和报表系统功能...\n')

// 动态导入模块
async function runTests() {
  try {
    // 导入要测试的模块
    const {
      generateDonationReport,
      generateProjectReport,
      generateUserReport,
      generateFinancialReport,
      generateCampaignReport,
      getDonationStatistics,
      analyzeDonationTrends,
      analyzeProjectPerformance,
      analyzeUserBehavior,
      analyzeRevenueStreams,
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
      analyticsMemoryStore
    } = await import('./dist/data-analytics.js')

    console.log('✅ 成功导入数据分析和报表系统模块')

    // 测试1: generateDonationReport - 捐赠报告生成
    console.log('\n📝 测试1: 捐赠报告生成')
    try {
      const options = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        format: 'json',
        includeCharts: true,
        granularity: 'monthly'
      }

      const report = await generateDonationReport('overview', options)

      if (report.success) {
        console.log('✅ 捐赠总览报告生成成功')
        console.log(`   报告ID: ${report.reportId}`)
        console.log(`   报告类型: ${report.type}`)
        console.log(`   报告标题: ${report.title}`)
        console.log(`   数据总数: ${report.data.totalDonations}`)
        console.log(`   总金额: ${report.data.totalAmount}`)
        console.log(`   平均捐赠: ${report.data.averageDonation.toFixed(2)}`)
        console.log(`   包含图表: ${report.charts ? report.charts.length : 0} 个`)
        console.log(`   生成时间: ${report.generatedAt}`)
      } else {
        console.log('❌ 捐赠报告生成失败')
        console.log('   错误信息:', report.error)
      }

      // 测试项目详情报告
      const projectReport = await generateDonationReport('project-details', {
        projectId: 'project-123',
        timeRange: options.timeRange,
        includeDonorDetails: true,
        includeTrends: true
      })

      if (projectReport.success) {
        console.log('✅ 项目详情报告生成成功')
        console.log(`   项目ID: ${projectReport.data.projectId}`)
        console.log(`   完成率: ${projectReport.data.completionRate.toFixed(2)}%`)
        console.log(`   捐赠者数量: ${projectReport.data.donorCount}`)
      }

      // 测试捐赠者分析报告
      const donorReport = await generateDonationReport('donor-analysis', {
        donorIds: ['donor-1', 'donor-2'],
        timeRange: options.timeRange,
        includeGivingHistory: true,
        includePredictions: true
      })

      if (donorReport.success) {
        console.log('✅ 捐赠者分析报告生成成功')
        console.log(`   分析捐赠者数量: ${donorReport.data.donors.length}`)
      }

    } catch (error) {
      console.log('❌ 捐赠报告生成测试异常:', error.message)
    }

    // 测试2: generateProjectReport - 项目报告生成
    console.log('\n📝 测试2: 项目报告生成')
    try {
      const performanceReport = await generateProjectReport('performance', {
        projectId: 'project-123',
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        metrics: ['donations', 'engagement', 'reach'],
        compareWithPrevious: true
      })

      if (performanceReport.success) {
        console.log('✅ 项目绩效报告生成成功')
        console.log(`   项目ID: ${performanceReport.data.projectId}`)
        console.log(`   完成率: ${performanceReport.data.completionRate.toFixed(2)}%`)
        console.log(`   捐赠者数量: ${performanceReport.data.donorCount}`)
        console.log(`   包含指标: ${performanceReport.data.metrics.join(', ')}`)
      }

      const impactReport = await generateProjectReport('impact', {
        projectId: 'project-123',
        includeBeneficiaryStories: true,
        includeImpactMetrics: true,
        includeTestimonials: true
      })

      if (impactReport.success) {
        console.log('✅ 项目影响力报告生成成功')
        console.log(`   受益人数量: ${impactReport.data.beneficiaryCount}`)
        console.log(`   包含故事: ${impactReport.data.stories ? impactReport.data.stories.length : 0} 个`)
      }

    } catch (error) {
      console.log('❌ 项目报告生成测试异常:', error.message)
    }

    // 测试3: generateFinancialReport - 财务报告生成
    console.log('\n📝 测试3: 财务报告生成')
    try {
      const revenueReport = await generateFinancialReport('revenue', {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        granularity: 'monthly',
        includeProjections: true,
        includeComparison: true
      })

      if (revenueReport.success) {
        console.log('✅ 收入报告生成成功')
        console.log(`   总收入: ${revenueReport.data.totalRevenue}`)
        console.log(`   月度数据: ${revenueReport.data.monthlyBreakdown ? revenueReport.data.monthlyBreakdown.length : 0} 个月`)
        console.log(`   包含预测: ${revenueReport.data.projections ? '是' : '否'}`)
      }

      const expenseReport = await generateFinancialReport('expenses', {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        categories: ['operations', 'marketing', 'platform'],
        includeVarianceAnalysis: true
      })

      if (expenseReport.success) {
        console.log('✅ 支出报告生成成功')
        console.log(`   总支出: ${expenseReport.data.totalExpenses}`)
        console.log(`   分类数量: ${expenseReport.data.categoryBreakdown ? Object.keys(expenseReport.data.categoryBreakdown).length : 0}`)
      }

    } catch (error) {
      console.log('❌ 财务报告生成测试异常:', error.message)
    }

    // 测试4: getDonationStatistics - 捐赠统计
    console.log('\n📝 测试4: 捐赠统计')
    try {
      const stats = await getDonationStatistics({
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        }
      })

      console.log('✅ 捐赠统计获取成功')
      console.log(`   总金额: ${stats.total}`)
      console.log(`   总数量: ${stats.count}`)
      console.log(`   平均值: ${stats.average.toFixed(2)}`)
      console.log(`   最小值: ${stats.min}`)
      console.log(`   最大值: ${stats.max}`)
      console.log(`   中位数: ${stats.median.toFixed(2)}`)
      console.log(`   标准差: ${stats.standardDeviation.toFixed(2)}`)

    } catch (error) {
      console.log('❌ 捐赠统计测试异常:', error.message)
    }

    // 测试5: analyzeDonationTrends - 捐赠趋势分析
    console.log('\n📝 测试5: 捐赠趋势分析')
    try {
      const analysis = await analyzeDonationTrends({
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        granularity: 'monthly',
        includeForecast: true,
        detectAnomalies: true
      })

      if (analysis.success) {
        console.log('✅ 捐赠趋势分析成功')
        console.log(`   趋势数据点: ${analysis.trends.length}`)
        console.log(`   预测数据点: ${analysis.forecast.length}`)
        console.log(`   增长率: ${analysis.growthRate.toFixed(2)}%`)
        console.log(`   异常点: ${analysis.anomalies ? analysis.anomalies.length : 0}`)
      } else {
        console.log('❌ 捐赠趋势分析失败')
        console.log('   错误信息:', analysis.error)
      }

    } catch (error) {
      console.log('❌ 捐赠趋势分析测试异常:', error.message)
    }

    // 测试6: analyzeProjectPerformance - 项目绩效分析
    console.log('\n📝 测试6: 项目绩效分析')
    try {
      const analysis = await analyzeProjectPerformance({
        projectIds: ['project-1', 'project-2'],
        includeProgressMetrics: true,
        includeRiskAssessment: true,
        comparisonMetrics: ['donations', 'engagement', 'progress'],
        benchmarkAgainst: 'average'
      })

      if (analysis.success) {
        console.log('✅ 项目绩效分析成功')
        console.log(`   分析项目数量: ${analysis.projects.length}`)
        analysis.projects.forEach((project, index) => {
          console.log(`   项目${index + 1}: ${project.projectName} - 完成率 ${project.completionRate.toFixed(2)}%`)
        })
      }

    } catch (error) {
      console.log('❌ 项目绩效分析测试异常:', error.message)
    }

    // 测试7: analyzeUserBehavior - 用户行为分析
    console.log('\n📝 测试7: 用户行为分析')
    try {
      const analysis = await analyzeUserBehavior({
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        segmentBy: 'donation-frequency',
        includeChurnPrediction: true,
        predictionModel: 'random-forest'
      })

      if (analysis.success) {
        console.log('✅ 用户行为分析成功')
        console.log(`   用户分段数量: ${analysis.segments ? Object.keys(analysis.segments).length : 0}`)
        console.log(`   参与度指标: ${analysis.engagementMetrics ? '已生成' : '未生成'}`)
        console.log(`   流失预测: ${analysis.churnPrediction ? '已生成' : '未生成'}`)
      }

    } catch (error) {
      console.log('❌ 用户行为分析测试异常:', error.message)
    }

    // 测试8: analyzeRevenueStreams - 收入流分析
    console.log('\n📝 测试8: 收入流分析')
    try {
      const analysis = await analyzeRevenueStreams({
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeProjections: true,
        identifyOpportunities: true,
        opportunityThreshold: 0.1
      })

      if (analysis.success) {
        console.log('✅ 收入流分析成功')
        console.log(`   收入流数量: ${analysis.streams ? analysis.streams.length : 0}`)
        console.log(`   多元化指数: ${analysis.diversificationIndex ? analysis.diversificationIndex.toFixed(2) : 0}`)
        console.log(`   增长机会: ${analysis.opportunities ? analysis.opportunities.length : 0}`)
      }

    } catch (error) {
      console.log('❌ 收入流分析测试异常:', error.message)
    }

    // 测试9: createCustomReport - 自定义报告
    console.log('\n📝 测试9: 自定义报告')
    try {
      const customOptions = {
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
        format: 'json'
      }

      const report = await createCustomReport(customOptions)

      if (report.success) {
        console.log('✅ 自定义报告创建成功')
        console.log(`   报告ID: ${report.reportId}`)
        console.log(`   报告名称: ${report.title}`)
        console.log(`   指标数量: ${report.data ? Object.keys(report.data).length : 0}`)
      } else {
        console.log('❌ 自定义报告创建失败')
        console.log('   错误信息:', report.error)
      }

    } catch (error) {
      console.log('❌ 自定义报告测试异常:', error.message)
    }

    // 测试10: exportReport - 报告导出
    console.log('\n📝 测试10: 报告导出')
    try {
      const mockReport = {
        type: 'donation',
        subtype: 'overview',
        title: '测试报告',
        data: { total: 1000, count: 50 },
        generatedAt: new Date()
      }

      const formats = ['json', 'pdf', 'excel', 'csv']

      for (const format of formats) {
        const result = await exportReport(mockReport, {
          format,
          includeCharts: format !== 'csv',
          filename: `test-report-${format}`
        })

        if (result.success) {
          console.log(`✅ ${format.toUpperCase()} 格式导出成功`)
          console.log(`   下载链接: ${result.downloadUrl}`)
          console.log(`   文件大小: ${result.size} bytes`)
        } else {
          console.log(`❌ ${format.toUpperCase()} 格式导出失败`)
        }
      }

    } catch (error) {
      console.log('❌ 报告导出测试异常:', error.message)
    }

    // 测试11: getRealTimeMetrics - 实时指标
    console.log('\n📝 测试11: 实时指标')
    try {
      const metrics = await getRealTimeMetrics(['donations', 'users', 'projects', 'performance'])

      console.log('✅ 实时指标获取成功')
      console.log(`   捐赠指标: 数量 ${metrics.donations.count}, 金额 ${metrics.donations.amount}, 速率 ${metrics.donations.rate}/分钟`)
      console.log(`   用户指标: 活跃 ${metrics.users.active}, 新增 ${metrics.users.new}, 在线 ${metrics.users.online}`)
      console.log(`   项目指标: 活跃 ${metrics.projects.active}, 筹款中 ${metrics.projects.funding}, 已完成 ${metrics.projects.completed}`)
      console.log(`   性能指标: 响应时间 ${metrics.performance.responseTime}ms, 吞吐量 ${metrics.performance.throughput}/分钟`)
      console.log(`   更新时间: ${metrics.updatedAt}`)

    } catch (error) {
      console.log('❌ 实时指标测试异常:', error.message)
    }

    // 测试12: createDashboard - 创建仪表板
    console.log('\n📝 测试12: 创建仪表板')
    try {
      const dashboardConfig = {
        name: '运营仪表板',
        description: '显示关键运营指标',
        layout: 'grid',
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
        refreshInterval: 300,
        isPublic: false
      }

      const result = await createDashboard(dashboardConfig)

      if (result.success) {
        console.log('✅ 仪表板创建成功')
        console.log(`   仪表板ID: ${result.dashboardId}`)
        console.log(`   仪表板名称: ${result.name}`)
        console.log(`   组件数量: ${result.widgets.length}`)
        console.log(`   创建时间: ${result.createdAt}`)

        // 保存仪表板ID用于后续测试
        global.testDashboardId = result.dashboardId
      } else {
        console.log('❌ 仪表板创建失败')
        console.log('   错误信息:', result.error)
      }

    } catch (error) {
      console.log('❌ 创建仪表板测试异常:', error.message)
    }

    // 测试13: getDashboardData - 获取仪表板数据
    console.log('\n📝 测试13: 获取仪表板数据')
    try {
      if (global.testDashboardId) {
        const data = await getDashboardData(global.testDashboardId, {
          timeRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31')
          }
        })

        if (data.success) {
          console.log('✅ 仪表板数据获取成功')
          console.log(`   仪表板ID: ${data.dashboardId}`)
          console.log(`   仪表板名称: ${data.name}`)
          console.log(`   组件数据: ${data.widgets.length} 个`)
          console.log(`   最后更新: ${data.lastUpdated}`)
        } else {
          console.log('❌ 仪表板数据获取失败')
          console.log('   错误信息:', data.error)
        }
      } else {
        console.log('❌ 仪表板数据获取跳过：没有测试仪表板')
      }

    } catch (error) {
      console.log('❌ 获取仪表板数据测试异常:', error.message)
    }

    // 测试14: compareTimePeriods - 时间段比较
    console.log('\n📝 测试14: 时间段比较')
    try {
      const comparison = await compareTimePeriods({
        currentPeriod: {
          start: new Date('2024-01-01'),
          end: new Date('2024-03-31')
        },
        comparisonPeriod: {
          start: new Date('2023-01-01'),
          end: new Date('2023-03-31')
        },
        metrics: ['donations', 'users', 'revenue'],
        calculateYoYGrowth: true
      })

      if (comparison.success) {
        console.log('✅ 时间段比较成功')
        console.log(`   当前期总额: ${comparison.currentPeriod.total}`)
        console.log(`   对比期总额: ${comparison.comparisonPeriod.total}`)
        console.log(`   变化金额: ${comparison.variances.donations.absolute}`)
        console.log(`   变化百分比: ${comparison.variances.donations.percentageChange.toFixed(2)}%`)
        console.log(`   同比增长: ${comparison.yearOverYearGrowth ? '已计算' : '未计算'}`)
      } else {
        console.log('❌ 时间段比较失败')
        console.log('   错误信息:', comparison.error)
      }

    } catch (error) {
      console.log('❌ 时间段比较测试异常:', error.message)
    }

    // 测试15: predictRevenue - 收入预测
    console.log('\n📝 测试15: 收入预测')
    try {
      const prediction = await predictRevenue({
        timeHorizon: 12,
        model: 'linear-regression',
        confidenceLevel: 0.95,
        includeSeasonality: true
      })

      if (prediction.success) {
        console.log('✅ 收入预测成功')
        console.log(`   预测模型: ${prediction.model}`)
        console.log(`   预测数据点: ${prediction.predictions.length}`)
        console.log(`   模型准确度: ${(prediction.modelAccuracy * 100).toFixed(2)}%`)
        console.log(`   置信水平: ${(prediction.confidenceLevel * 100).toFixed(2)}%`)

        // 显示前3个月的预测
        prediction.predictions.slice(0, 3).forEach((pred, index) => {
          console.log(`   预测${index + 1}: ${pred.period} - ${pred.predicted.toFixed(2)}`)
        })
      } else {
        console.log('❌ 收入预测失败')
        console.log('   错误信息:', prediction.error)
      }

    } catch (error) {
      console.log('❌ 收入预测测试异常:', error.message)
    }

    // 测试16: generateInsights - 洞察生成
    console.log('\n📝 测试16: 洞察生成')
    try {
      const insights = await generateInsights({
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        focusAreas: ['donations', 'user-engagement', 'project-performance'],
        includeRecommendations: true,
        insightLevel: 'strategic',
        detectAnomalies: true
      })

      if (insights.success) {
        console.log('✅ 洞察生成成功')
        console.log(`   洞察数量: ${insights.insights ? insights.insights.length : 0}`)
        console.log(`   建议数量: ${insights.recommendations ? insights.recommendations.length : 0}`)
        console.log(`   优先级: ${insights.priority}`)

        if (insights.insights && insights.insights.length > 0) {
          console.log('   示例洞察:')
          insights.insights.slice(0, 2).forEach((insight, index) => {
            console.log(`     ${index + 1}. ${insight}`)
          })
        }
      } else {
        console.log('❌ 洞察生成失败')
        console.log('   错误信息:', insights.error)
      }

    } catch (error) {
      console.log('❌ 洞察生成测试异常:', error.message)
    }

    // 测试17: getAlerts - 告警获取
    console.log('\n📝 测试17: 告警获取')
    try {
      const alerts = await getAlerts({
        status: 'active',
        severity: ['high', 'critical'],
        categories: ['performance', 'revenue', 'user-activity']
      })

      if (alerts.success) {
        console.log('✅ 告警获取成功')
        console.log(`   活跃告警数量: ${alerts.total}`)
        console.log(`   返回告警数量: ${alerts.alerts.length}`)

        if (alerts.alerts.length > 0) {
          console.log('   告警示例:')
          alerts.alerts.slice(0, 2).forEach((alert, index) => {
            console.log(`     ${index + 1}. [${alert.severity.toUpperCase()}] ${alert.message}`)
          })
        }
      } else {
        console.log('❌ 告警获取失败')
        console.log('   错误信息:', alerts.error)
      }

    } catch (error) {
      console.log('❌ 告警获取测试异常:', error.message)
    }

    console.log('\n🎉 数据分析和报表系统功能验证完成！')

    // 显示统计信息
    console.log('\n📊 系统统计:')
    console.log(`   生成报告数量: ${analyticsMemoryStore.reports.size}`)
    console.log(`   创建仪表板数量: ${analyticsMemoryStore.dashboards.size}`)
    console.log(`   活跃告警数量: ${analyticsMemoryStore.alerts.size}`)
    console.log(`   统计数据数量: ${analyticsMemoryStore.statistics.size}`)
    console.log(`   调度任务数量: ${analyticsMemoryStore.schedules.size}`)

  } catch (error) {
    console.error('❌ 模块导入失败:', error.message)
    console.error('   可能原因：模块路径错误或TypeScript编译问题')
    process.exit(1)
  }
}

// 运行测试
runTests().catch(console.error)