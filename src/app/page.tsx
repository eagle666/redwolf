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
                小灰的故事
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
              真实救助故事
            </span>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              遇见<span className="text-orange-500">"小灰"</span>的那天
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              2023年11月的一个寒冷清晨，我们在新疆阿尔泰山脚下发现了这只3个月大的狼崽。
              它独自在雪地里瑟瑟发抖，妈妈可能被盗猎者杀害...<span className="text-orange-600 font-semibold">那一刻，我们知道必须做点什么。</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative">
            <img
              src="/wolf-rescue-hero.jpg"
              alt="救助现场"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center" style={{display: 'none'}}>
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🐺</div>
                <p className="text-lg mb-2">救助现场照片</p>
                <p className="text-sm opacity-80">2023年11月15日 阿尔泰山</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4 text-center mb-6">
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-600 mb-1">8个月</p>
              <p className="text-sm text-gray-600">小灰的救助历程</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600 mb-1">15kg</p>
              <p className="text-sm text-gray-600">从5kg到健康体重</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-600 mb-1">即将回归</p>
              <p className="text-sm text-gray-600">野外放养计划中</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/xiaohui"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              查看小灰的完整救助故事
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Story Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">
            小灰的救助日记
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            这8个月来，我们一起见证了一个小生命的奇迹。每一天都不容易，但每一步都值得。
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-orange-50 rounded-lg p-6 inline-block text-left">
                    <h4 className="font-bold text-gray-800 mb-2">初次相遇</h4>
                    <p className="text-sm text-gray-600 mb-2">2023年11月15日</p>
                    <p className="text-gray-700">
                      在阿尔泰山脚下发现小灰，当时只有5kg，严重营养不良，右前腿有伤口。
                      那一刻零下18度，再晚半小时可能就...
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
                    <h4 className="font-bold text-gray-800 mb-2">第一次治疗</h4>
                    <p className="text-sm text-gray-600 mb-2">2023年11月16日</p>
                    <p className="text-gray-700">
                      联系到当地的王兽医，连夜为小灰处理伤口。打了抗生素，开始慢慢恢复。
                      花费：￥800（兽医费+药品）
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-blue-50 rounded-lg p-6 inline-block text-left">
                    <h4 className="font-bold text-gray-800 mb-2">第一次进食</h4>
                    <p className="text-sm text-gray-600 mb-2">2023年11月18日</p>
                    <p className="text-gray-700">
                      小灰终于开始主动进食了！我们特地买了新鲜的羊肉丝，
                      看着它小心翼翼地吃着，我们都哭了。
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
                    <h4 className="font-bold text-gray-800 mb-2">开始康复训练</h4>
                    <p className="text-sm text-gray-600 mb-2">2024年1月</p>
                    <p className="text-gray-700">
                      体重达到10kg，开始在保护区内进行适应性训练。
                      学习捕猎技巧，为将来回归野外做准备。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Funding Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                小灰的救助资金明细
              </h3>
              <p className="text-gray-600">
                每一分钱都用在了小灰身上，我们承诺100%透明
              </p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>已筹集: ¥18,650</span>
                <span>目标: ¥25,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full" style={{width: '74.6%'}}></div>
              </div>
              <p className="text-center text-gray-600 mt-2">74.6% 已完成</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  已支出明细
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">兽医治疗费（王兽医诊所）</span>
                    <span className="font-medium">¥3,200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">药品费（抗生素+营养剂）</span>
                    <span className="font-medium">¥1,850</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">食物采购（新鲜羊肉+特殊饲料）</span>
                    <span className="font-medium">¥4,600</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">保护区场地费</span>
                    <span className="font-medium">¥2,000</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t">
                    <span>已支出总计</span>
                    <span className="text-orange-600">¥11,650</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  后续计划支出
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">野外放养训练</span>
                    <span className="font-medium">¥3,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GPS追踪设备</span>
                    <span className="font-medium">¥2,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">后续3个月食物储备</span>
                    <span className="font-medium">¥4,350</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">应急医疗基金</span>
                    <span className="font-medium">¥3,500</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t">
                    <span>计划支出总计</span>
                    <span className="text-blue-600">¥13,350</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">1,247位</span> 爱心人士已参与救助
              </p>
              <p className="text-xs text-gray-500 mb-3">
                所有收支凭证均可查看，我们接受任何形式的监督
              </p>
              <a
                href="/tracking"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                查看详细资金追踪
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Appeal Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">🐺</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              帮小灰回家的路，还差最后一步
            </h3>
            <p className="text-xl text-white/90 mb-4 leading-relaxed">
              8个月前，我们在雪地里救起了濒死的小灰<br/>
              现在，它已经长成了健康的大灰狼<br/>
              <span className="font-bold text-yellow-300">但我们还需要您的帮助，让它回到真正的家</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
            <h4 className="text-white font-bold mb-4 text-center">您的捐款将用于：</h4>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                GPS追踪设备（确保放养后能监测小灰的安全状况）
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                专业野外训练（教会小灰独立捕猎的技能）
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                3个月的食物储备（放养过渡期的安全保障）
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></span>
                应急医疗基金（防止放养后出现意外情况）
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              帮小灰回家 ¥50 起
            </button>
            <button
              className="border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              查看详细救助报告
            </button>
          </div>
        </div>
      </section>

      {/* Team & Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            谁在帮助小灰
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">张明</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">项目负责人</h4>
              <p className="text-sm text-gray-600 mb-2">
                10年野生动物保护经验，原新疆野生动物保护协会成员
              </p>
              <p className="text-xs text-gray-500">
                "救小灰那天，零下18度，我知道不能放弃它"
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">李晓燕</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">志愿者负责人</h4>
              <p className="text-sm text-gray-600 mb-2">
                动物医学专业，负责小灰日常护理和康复训练
              </p>
              <p className="text-xs text-gray-500">
                "小灰现在很健康，每天都在为回家做准备"
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">王兽医</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">合作兽医</h4>
              <p className="text-sm text-gray-600 mb-2">
                阿勒泰地区宠物医院主治医师，20年临床经验
              </p>
              <p className="text-xs text-gray-500">
                "小灰的恢复情况超出了我的预期，是个奇迹"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <h4 className="font-bold text-gray-800 mb-4">我们的承诺</h4>
            <p className="text-gray-600 mb-4">
              所有资金100%用于小灰的救助，我们接受任何形式的监督和考察。
              您可以随时来保护区看望小灰，亲眼见证它的成长。
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                📞 联系电话：186-xxxx-xxxx
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                📍 地址：新疆阿勒泰地区野生动物保护区
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                📧 邮箱：help@xiaohui.org
              </span>
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
                <h3 className="text-2xl font-bold text-gray-800 mb-1">帮小灰回家</h3>
                <p className="text-sm text-gray-600">您的善举将改变一个生命</p>
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
                <span className="text-2xl mr-3">🐺</span>
                <div>
                  <p className="font-bold text-gray-800">小灰的最新动态</p>
                  <p className="text-sm text-gray-600">
                    今天小灰学会了捕猎技巧，体重达到15kg！
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
              <p className="text-gray-600 mb-4">扫码支付，帮助小灰回家</p>
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
                  可以买 {Math.floor(parseInt(selectedAmount) / 8)}斤羊肉 或
                  {Math.floor(parseInt(selectedAmount) / 50)}次训练课程
                </p>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800 mb-2">
                <span className="font-bold">💝 感谢您的善举</span>
              </p>
              <p className="text-xs text-gray-600">
                捐款后您将收到：感谢信 + 小灰最新照片 + 定期进展更新
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
