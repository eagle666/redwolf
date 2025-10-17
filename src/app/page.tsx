'use client';

import { useState } from 'react';

export default function Home() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');

  const donationAmounts = [
    { label: '10元', value: '10' },
    { label: '50元', value: '50' },
    { label: '100元', value: '100' },
    { label: '200元', value: '200' },
    { label: '自定义', value: 'custom' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">狼</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">小灰救助项目</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="/xiaohui" className="text-gray-600 hover:text-gray-800 transition-colors">
                救助案例
              </a>
              <a href="/tracking" className="text-gray-600 hover:text-gray-800 transition-colors">
                资金追踪
              </a>
              <a href="/about" className="text-gray-600 hover:text-gray-800 transition-colors">
                关于我们
              </a>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
              >
                立即捐款
              </button>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="mb-12">
          <div className="mb-6">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              野生动物救助计划
            </span>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              为<span className="text-orange-500">野生动物</span>守护家园
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              在广袤的自然中，每天都有野生动物需要帮助。它们或受伤、或失去家园、或面临生存威胁...
              <span className="text-orange-600 font-semibold">我们相信，每个生命都值得被温柔对待。</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative">
            <img
              src="/wildlife-hero.jpg"
              alt="野生动物保护"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center" style={{display: 'none'}}>
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🐺</div>
                <p className="text-lg mb-2">野生动物保护</p>
                <p className="text-sm opacity-80">让每个生命都有家可归</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4 text-center mb-6">
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-600 mb-1">100+</p>
              <p className="text-sm text-gray-600">待救助动物</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600 mb-1">24/7</p>
              <p className="text-sm text-gray-600">紧急救援</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-600 mb-1">85%</p>
              <p className="text-sm text-gray-600">救助成功率</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/xiaohui"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              了解救助案例
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Rescue Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">
            我们的救助流程
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            每一个生命的救援都需要科学的流程和专业的团队。我们用专业和爱心，给动物第二次机会。
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-orange-50 rounded-lg p-6 inline-block text-left">
                    <h4 className="font-bold text-gray-800 mb-2">发现与评估</h4>
                    <p className="text-sm text-gray-600 mb-2">第一步</p>
                    <p className="text-gray-700">
                      接到救助热线或现场发现后，专业团队第一时间到达现场评估动物状况，
                      确定救助方案和安全措施。
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full border-4 border-white relative z-10"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white relative z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-green-50 rounded-lg p-6 inline-block">
                    <h4 className="font-bold text-gray-800 mb-2">紧急救治</h4>
                    <p className="text-sm text-gray-600 mb-2">第二步</p>
                    <p className="text-gray-700">
                      将动物转移到救助中心，进行专业的医疗检查和治疗。
                      与合作兽医密切配合，制定个性化康复计划。
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-blue-50 rounded-lg p-6 inline-block text-left">
                    <h4 className="font-bold text-gray-800 mb-2">康复护理</h4>
                    <p className="text-sm text-gray-600 mb-2">第三步</p>
                    <p className="text-gray-700">
                      提供专业的营养配餐和日常护理，定期监测健康状况。
                      根据恢复情况调整护理方案，确保动物身心康复。
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white relative z-10"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-4 border-white relative z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-purple-50 rounded-lg p-6 inline-block">
                    <h4 className="font-bold text-gray-800 mb-2">野外训练</h4>
                    <p className="text-sm text-gray-600 mb-2">第四步</p>
                    <p className="text-gray-700">
                      对于符合条件的动物，开展野外生存技能训练，
                      帮助它们重新适应自然环境，最终回归大自然。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Transparency Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                资金使用透明化
              </h3>
              <p className="text-gray-600">
                我们承诺每一分善款都用在实处，所有资金流向公开透明
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-gray-600">用于救助</p>
                <p className="text-sm text-gray-500">零管理费用</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">实时</div>
                <p className="text-gray-600">更新记录</p>
                <p className="text-sm text-gray-500">随时可查</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">第三方</div>
                <p className="text-gray-600">监督审计</p>
                <p className="text-sm text-gray-500">确保公正</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  主要用途
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🏥</span>
                    <div>
                      <p className="font-medium">医疗救治</p>
                      <p className="text-sm text-gray-600">兽医费用、药品、手术等</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🍖</span>
                    <div>
                      <p className="font-medium">营养食物</p>
                      <p className="text-sm text-gray-600">专业配方、新鲜食材等</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🏠</span>
                    <div>
                      <p className="font-medium">救助设施</p>
                      <p className="text-sm text-gray-600">场地、设备、环境维护</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  透明机制
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📊</span>
                    <div>
                      <p className="font-medium">实时公示</p>
                      <p className="text-sm text-gray-600">收入支出实时更新</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🧾</span>
                    <div>
                      <p className="font-medium">凭证公开</p>
                      <p className="text-sm text-gray-600">发票收据可查验</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🔍</span>
                    <div>
                      <p className="font-medium">第三方审计</p>
                      <p className="text-sm text-gray-600">专业机构定期审核</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                透明是最好的信任，我们接受全社会的监督
              </p>
              <a
                href="/tracking"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                查看资金追踪系统
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">❤️</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              每个生命都值得被守护
            </h3>
            <p className="text-xl text-white/90 mb-4 leading-relaxed">
              在这个世界上，还有很多等待帮助的野生动物<br/>
              它们需要食物、需要医疗、需要安全的家园<br/>
              <span className="font-bold text-yellow-300">您的善举，将成为它们活下去的希望</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
            <h4 className="text-white font-bold mb-4 text-center">您的善举将帮助：</h4>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                受伤野生动物得到及时医疗救助
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                失去家园的动物重新找到安身之处
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                幼崽动物获得专业的抚养和训练
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                更多动物重获回归自然的机会
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              立即捐款支持
            </button>
            <button
              className="border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              了解更多项目
            </button>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            我们的救助团队
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">专业兽医</h4>
              <p className="text-sm text-gray-600 mb-2">
                经验丰富的兽医师团队，提供专业医疗支持
              </p>
              <p className="text-xs text-gray-500">
                24小时待命，确保及时救治
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🤝</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">志愿者团队</h4>
              <p className="text-sm text-gray-600 mb-2">
                热心的志愿者们，负责日常护理和康复训练
              </p>
              <p className="text-xs text-gray-500">
                用爱心和耐心守护每个生命
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🏢</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">合作机构</h4>
              <p className="text-sm text-gray-600 mb-2">
                与多家动物保护组织和机构建立合作
              </p>
              <p className="text-xs text-gray-500">
                整合资源，提供更全面的救助
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <h4 className="font-bold text-gray-800 mb-4">我们的承诺</h4>
            <p className="text-gray-600 mb-4">
              我们致力于为每一个需要帮助的野生动物提供专业的救助。
              所有资金将100%用于动物救助，我们接受社会各界的监督。
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="font-semibold text-green-700 mb-1">💚 专业救助</p>
                <p className="text-gray-600">科学流程，专业团队</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-blue-700 mb-1">💙 透明公开</p>
                <p className="text-gray-600">资金流向，实时可查</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="font-semibold text-orange-700 mb-1">💛 爱心守护</p>
                <p className="text-gray-600">每个生命都珍贵</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 小灰救助项目 - 让每只野生动物都有家可归</p>
          <p className="text-gray-400 text-sm mb-2">
            本项目已获得阿勒泰地区林业和草原局备案批准
          </p>
          <p className="text-gray-400 text-sm">
            每一笔捐款都有记录，每一份善举都有回响
          </p>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">支持野生动物救助</h3>
                <p className="text-sm text-gray-600">您的善举将改变生命</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">❤️</span>
                <div>
                  <p className="font-bold text-gray-800">您的爱心将帮助</p>
                  <p className="text-sm text-gray-600">
                    为受伤动物提供医疗，为失去家园的动物提供庇护
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {donationAmounts.map((amount) => (
                <button
                  key={amount.value}
                  onClick={() => setSelectedAmount(amount.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAmount === amount.value
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {amount.label}
                </button>
              ))}
            </div>

            {selectedAmount === 'custom' && (
              <input
                type="number"
                placeholder="请输入金额"
                className="w-full p-3 border-2 border-gray-200 rounded-lg mb-6 focus:border-orange-500 focus:outline-none"
                min="1"
              />
            )}

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">扫码支付，支持野生动物保护</p>
              <div className="bg-white border-2 border-gray-200 w-48 h-48 mx-auto rounded-lg overflow-hidden mb-4 shadow-sm">
                <img
                  src="/qrcode-placeholder.svg"
                  alt="支付二维码"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">支持微信、支付宝扫码支付</p>
              <p className="text-lg font-bold text-orange-600">
                {selectedAmount !== 'custom' && selectedAmount ? `¥${selectedAmount}` : '请先选择金额'}
              </p>
              {selectedAmount && selectedAmount !== 'custom' && (
                <p className="text-xs text-gray-500 mt-2">
                  可以帮助更多动物获得救助机会
                </p>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800 mb-2">
                <span className="font-bold">💝 感谢您的善举</span>
              </p>
              <p className="text-xs text-gray-600">
                捐款后您将收到：感谢信 + 项目进展报告 + 救助故事更新
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
