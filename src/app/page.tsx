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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-4">
      {/* Main Content */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Logo */}
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">🐺</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          帮助受伤的它们回家
        </h1>

        {/* Heart Touching Story */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            昨天在路边发现了一只受伤的小鸟，翅膀骨折，眼神无助。
            这样的故事每天都在发生...<span className="text-orange-600 font-semibold">您的一个小举动，就是它们的全世界。</span>
          </p>
        </div>

        {/* What Your Donation Does */}
        <div className="space-y-3 mb-6 text-left">
          <div className="flex items-center bg-green-50 rounded-lg p-3">
            <span className="text-xl mr-3">🏥</span>
            <div>
              <p className="text-sm font-semibold">医疗救治</p>
              <p className="text-xs text-gray-600">20元 = 一次兽医诊疗</p>
            </div>
          </div>
          <div className="flex items-center bg-blue-50 rounded-lg p-3">
            <span className="text-xl mr-3">🍖</span>
            <div>
              <p className="text-sm font-semibold">营养食物</p>
              <p className="text-xs text-gray-600">50元 = 一个月的食物</p>
            </div>
          </div>
          <div className="flex items-center bg-purple-50 rounded-lg p-3">
            <span className="text-xl mr-3">🏠</span>
            <div>
              <p className="text-sm font-semibold">安全庇护</p>
              <p className="text-xs text-gray-600">100元 = 一个月的住所</p>
            </div>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="flex justify-around mb-6 py-3 border-y border-gray-200">
          <div>
            <p className="text-xl font-bold text-orange-600">100+</p>
            <p className="text-xs text-gray-600">等待帮助</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">85%</p>
            <p className="text-xs text-gray-600">康复率</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full transition-colors text-lg"
        >
          立即捐款
        </button>

        {/* Trust Info */}
        <div className="mt-6 space-y-2">
          <p className="text-xs text-gray-600">
            💝 已有1,234位爱心人士参与
          </p>
          <p className="text-xs text-gray-500">
            100%用于救助 • 资金透明可查
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">选择捐款金额</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Impact Preview */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                您的善举将直接帮助那些受伤的小生命重新站立、飞翔...
              </p>
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
              <p className="text-gray-600 mb-4">扫码支付</p>
              <div className="bg-gray-100 w-40 h-40 mx-auto rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">支持微信、支付宝</p>
              <p className="text-lg font-bold text-orange-600">
                {selectedAmount !== 'custom' && selectedAmount ? `¥${selectedAmount}` : '请选择金额'}
              </p>
              {selectedAmount && selectedAmount !== 'custom' && (
                <p className="text-xs text-gray-500 mt-2">
                  可以帮助 {Math.floor(parseInt(selectedAmount) / 20)} 只小动物
                </p>
              )}
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-green-800 font-bold mb-1">
                💝 您的爱心正在改变生命
              </p>
              <p className="text-xs text-gray-600">
                100%用于救助 • 我们会用照片和文字记录每一份善款的去向
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
