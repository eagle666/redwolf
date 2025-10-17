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
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">狼</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">红狼保护基金</h1>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            立即捐款
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            保护<span className="text-orange-500">网红狼</span>和野生动物
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            为可爱的野生动物提供食物、医疗和保护。您的每一份善举都将帮助它们在自然中更好地生存。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">🐺</div>
              <h3 className="text-2xl font-bold mb-2">网红狼"红红"</h3>
              <p className="text-lg">需要您的帮助</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            我们如何帮助野生动物
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="text-4xl mb-4">🍖</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">提供食物</h4>
              <p className="text-gray-600">
                为野生狼群和其他野生动物提供充足的食物来源，确保它们在严寒季节也能获得营养。
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="text-4xl mb-4">🏥</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">医疗救助</h4>
              <p className="text-gray-600">
                与专业兽医合作，为受伤或生病的野生动物提供及时的治疗和康复服务。
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="text-4xl mb-4">🌲</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">栖息地保护</h4>
              <p className="text-gray-600">
                维护和改善野生动物的自然栖息地，为它们创造安全舒适的生存环境。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              本月筹款进度
            </h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>已筹集: ¥12,450</span>
                <span>目标: ¥20,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full" style={{width: '62.25%'}}></div>
              </div>
              <p className="text-center text-gray-600 mt-2">62.25% 已完成</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-orange-500">1,245</p>
                <p className="text-gray-600">捐款人次</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-500">89</p>
                <p className="text-gray-600">受益动物</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-500">3</p>
                <p className="text-gray-600">保护区域</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            立即行动，为野生动物献出爱心
          </h3>
          <p className="text-xl text-white/90 mb-8">
            您的每一份善举都将直接帮助到这些可爱的野生动物
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            立即捐款支持
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 红狼保护基金 - 为野生动物筹款</p>
          <p className="text-gray-400 text-sm">
            本项目为非盈利性质，所有善款将用于野生动物保护
          </p>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">选择捐款金额</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
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
              <p className="text-gray-600 mb-4">请扫描下方二维码完成支付</p>
              <div className="bg-white border-2 border-gray-200 w-48 h-48 mx-auto rounded-lg overflow-hidden mb-4">
                <img
                  src="/qrcode-placeholder.svg"
                  alt="支付二维码"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">支持微信、支付宝扫码支付</p>
              <p className="text-sm text-gray-500">
                {selectedAmount !== 'custom' && selectedAmount ? `支付金额: ¥${selectedAmount}` : '请先选择金额'}
              </p>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>捐款完成后，请保留支付凭证</p>
              <p>如有疑问，请联系客服</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
