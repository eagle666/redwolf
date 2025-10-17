'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RescueCases() {
  const [activeTab, setActiveTab] = useState('types');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">狼</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">野生动物救助</h1>
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            ← 返回首页
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 to-green-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            野生动物救助案例
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            每一个救助案例都是生命的奇迹。这里展示我们救助工作的类型和流程，
            让您了解野生动物保护的真实过程。
          </p>
          <div className="mt-6 inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">💡 以下为救助类型展示，非具体案例</span>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: 'types', label: '救助类型', icon: '🏥' },
                  { id: 'process', label: '救助流程', icon: '📋' },
                  { id: 'recovery', label: '康复阶段', icon: '💪' },
                  { id: 'success', label: '成功要素', icon: '✨' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'types' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">常见救助类型</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: '🐺',
                        title: '受伤野生动物',
                        description: '因交通事故、陷阱、人为伤害等导致的外伤或内伤',
                        examples: ['骨折、创伤', '中毒', '烧伤', '内伤'],
                        urgency: 'high'
                      },
                      {
                        icon: '🐤',
                        title: '幼崽孤儿',
                        description: '失去父母或与群体分离的幼年动物',
                        examples: ['鸟类幼雏', '哺乳类幼崽', '失去母亲', '群体分离'],
                        urgency: 'high'
                      },
                      {
                        icon: '🦅',
                        title: '疾病动物',
                        description: '感染疾病、寄生虫感染或营养不良的野生动物',
                        examples: ['传染病', '寄生虫', '营养不良', '慢性疾病'],
                        urgency: 'medium'
                      },
                      {
                        icon: '🏠',
                        title: '栖息地丧失',
                        description: '因森林砍伐、城市扩张等失去栖息地的动物',
                        examples: ['森林砍伐', '城市扩张', '栖息地破坏', '食物短缺'],
                        urgency: 'medium'
                      }
                    ].map((type, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">{type.icon}</span>
                          <h3 className="font-bold text-lg text-gray-800">{type.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{type.description}</p>
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">常见情况：</p>
                          <div className="flex flex-wrap gap-2">
                            {type.examples.map((example, i) => (
                              <span key={i} className="bg-white px-2 py-1 rounded text-xs text-gray-600">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">紧急程度：</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            type.urgency === 'high'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {type.urgency === 'high' ? '紧急' : '一般'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">标准救助流程</h2>

                  <div className="space-y-8">
                    {[
                      {
                        step: 1,
                        title: '接收评估',
                        description: '接到求助信息或现场发现后，专业团队第一时间到达现场',
                        details: [
                          '评估动物状况和安全性',
                          '确定是否需要救助',
                          '制定安全转运方案',
                          '记录现场环境和情况'
                        ],
                        duration: '30分钟-2小时'
                      },
                      {
                        step: 2,
                        title: '安全转运',
                        description: '使用专业设备将动物安全转移到救助中心',
                        details: [
                          '使用合适的转运笼具',
                          '减少转运过程中的应激',
                          '提供基本的生命支持',
                          '确保人畜安全'
                        ],
                        duration: '1-4小时'
                      },
                      {
                        step: 3,
                        title: '医疗检查',
                        description: '进行全面体检和必要的医疗救治',
                        details: [
                          '兽医全面体检',
                          '血液检测和影像检查',
                          '伤口清理和处理',
                          '制定治疗方案'
                        ],
                        duration: '2-6小时'
                      },
                      {
                        step: 4,
                        title: '康复护理',
                        description: '根据病情进行个性化康复护理',
                        details: [
                          '专业营养配餐',
                          '药物治疗和伤口护理',
                          '行为观察和记录',
                          '逐步恢复训练'
                        ],
                        duration: '数周至数月'
                      },
                      {
                        step: 5,
                        title: '放归评估',
                        description: '评估动物是否具备回归野外条件',
                        details: [
                          '健康状态评估',
                          '生存技能测试',
                          '放归地点选择',
                          '放归后监测计划'
                        ],
                        duration: '1-2周'
                      }
                    ].map((process, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                            {process.step}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-800">{process.title}</h3>
                            <span className="text-sm text-gray-500">{process.duration}</span>
                          </div>
                          <p className="text-gray-600 mb-3">{process.description}</p>
                          <div className="grid md:grid-cols-2 gap-2">
                            {process.details.map((detail, i) => (
                              <div key={i} className="flex items-center text-sm text-gray-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {detail}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'recovery' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">康复阶段划分</h2>

                  <div className="space-y-6">
                    {[
                      {
                        phase: '急救期',
                        duration: '1-7天',
                        description: '稳定生命体征，处理紧急情况',
                        goals: ['止血止痛', '抗感染治疗', '体液补充', '体温维持'],
                        monitoring: ['生命体征', '伤口情况', '精神状态', '进食情况']
                      },
                      {
                        phase: '恢复期',
                        duration: '1-4周',
                        description: '伤口愈合，基本功能恢复',
                        goals: ['伤口愈合', '食欲恢复', '体重增加', '活动能力提升'],
                        monitoring: ['体重变化', '食欲记录', '伤口愈合情况', '行为观察']
                      },
                      {
                        phase: '康复期',
                        duration: '1-3个月',
                        description: '体能恢复，技能训练',
                        goals: ['体能训练', '生存技能', '社会化适应', '独立性培养'],
                        monitoring: ['体能测试', '技能掌握', '行为发展', '健康指标']
                      },
                      {
                        phase: '适应期',
                        duration: '2-4周',
                        description: '为回归野外做准备',
                        goals: ['野外适应', '独立觅食', '躲避天敌', '建立领地意识'],
                        monitoring: ['野外训练', '独立能力', '健康状况', '放归准备度']
                      }
                    ].map((phase, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg text-gray-800">{phase.phase}</h3>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {phase.duration}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{phase.description}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="font-semibold text-gray-700 mb-2">康复目标：</p>
                            <ul className="space-y-1">
                              {phase.goals.map((goal, i) => (
                                <li key={i} className="flex items-center text-sm text-gray-600">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  {goal}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 mb-2">监测指标：</p>
                            <ul className="space-y-1">
                              {phase.monitoring.map((item, i) => (
                                <li key={i} className="flex items-center text-sm text-gray-600">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'success' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">救助成功要素</h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-gray-800">专业要素</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">👨‍⚕️</span>
                          <div>
                            <p className="font-semibold">专业团队</p>
                            <p className="text-sm text-gray-600">经验丰富的兽医、护理员、训练师</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">🏥</span>
                          <div>
                            <p className="font-semibold">完善设施</p>
                            <p className="text-sm text-gray-600">专业的医疗设备和康复环境</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">📋</span>
                          <div>
                            <p className="font-semibold">科学流程</p>
                            <p className="text-sm text-gray-600">标准化的救助和康复程序</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4 text-gray-800">关键因素</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">⏰</span>
                          <div>
                            <p className="font-semibold">及时救助</p>
                            <p className="text-sm text-gray-600">黄金救助时间内的快速响应</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">❤️</span>
                          <div>
                            <p className="font-semibold">耐心护理</p>
                            <p className="text-sm text-gray-600">持续的观察和个性化护理</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">🎯</span>
                          <div>
                            <p className="font-semibold">明确目标</p>
                            <p className="text-sm text-gray-600">以回归野外为最终目标</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-green-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">成功案例特征</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📈</div>
                        <p className="font-semibold">健康恢复</p>
                        <p className="text-sm text-gray-600">完全康复，无后遗症</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="font-semibold">技能掌握</p>
                        <p className="text-sm text-gray-600">具备独立生存能力</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">🌲</div>
                        <p className="font-semibold">成功放归</p>
                        <p className="text-sm text-gray-600">顺利回归自然环境</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            支持野生动物救助事业
          </h3>
          <p className="text-xl text-white/90 mb-8">
            您的每一份善举，都在为无数等待帮助的野生动物创造生机
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">🏥</div>
              <h4 className="font-bold text-white mb-2">紧急医疗救助</h4>
              <p className="text-white/80 text-sm mb-3">为受伤动物提供及时救治</p>
              <p className="text-sm text-white/70">救命医疗费用</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">🏠</div>
              <h4 className="font-bold text-white mb-2">救助设施建设</h4>
              <p className="text-white/80 text-sm mb-3">改善救助条件和环境</p>
              <p className="text-sm text-white/70">设施维护升级</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">🍖</div>
              <h4 className="font-bold text-white mb-2">康复营养保障</h4>
              <p className="text-white/80 text-sm mb-3">专业的营养配餐和护理</p>
              <p className="text-sm text-white/70">食物和营养品</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <h4 className="text-white font-bold mb-4">您的善举将带来：</h4>
            <ul className="space-y-2 text-white/90 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                更多动物获得及时救助的机会
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                专业的医疗护理和康复服务
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                科学规范的救助流程和标准
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                帮助更多动物重获自由和尊严
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            立即支持救助工作
          </Link>
        </div>
      </section>
    </div>
  );
}