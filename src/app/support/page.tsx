"use client";

import { useState } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const presetAmounts = [
    { amount: "10", label: "10元", emoji: "☕" },
    { amount: "20", label: "20元", emoji: "🍕" },
    { amount: "50", label: "50元", emoji: "🎁" },
    { amount: "100", label: "100元", emoji: "💝" },
    { amount: "200", label: "200元", emoji: "🌟" },
    { amount: "500", label: "500元", emoji: "👑" }
  ];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount("");
  };

  const handlePayment = async () => {
    const amount = selectedAmount || customAmount;
    if (!amount || parseFloat(amount) <= 0) {
      alert("请选择或输入支持金额");
      return;
    }

    setIsLoading(true);

    // 模拟支付过程
    setTimeout(() => {
      setIsLoading(false);
      setShowThankYou(true);
    }, 2000);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl">✅</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            感谢您的支持！
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            您的每一份支持都是网红狼继续创作的动力。我们会努力创作更多优质内容！
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🏠 返回首页
            </Link>
            <div className="text-gray-400">
              <p>🐺 网红狼团队</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🐺</span>
            </div>
            <h1 className="text-white text-xl font-bold">网红狼</h1>
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              首页
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              关于网红狼
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            支持网红狼
          </h1>
          <p className="text-xl text-gray-300 mb-12 text-center">
            您的每一份支持都是我们继续创作的动力
          </p>

          {/* Wolf Avatar */}
          <div className="mb-12 text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl">🐺</span>
            </div>
          </div>

          {/* Support Options */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">选择支持金额</h2>

            {/* Preset Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {presetAmounts.map((item) => (
                <button
                  key={item.amount}
                  onClick={() => handleAmountSelect(item.amount)}
                  className={`p-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    selectedAmount === item.amount
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div>{item.label}</div>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <label className="block text-white font-bold mb-4">
                或输入自定义金额
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="输入金额（元）"
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <span className="text-gray-300 font-bold">元</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4">支付方式</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">💚</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">微信支付</div>
                    <div className="text-gray-400 text-sm">安全快捷</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">💙</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">支付宝</div>
                    <div className="text-gray-400 text-sm">便捷支付</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={isLoading || (!selectedAmount && !customAmount)}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all transform ${
                isLoading || (!selectedAmount && !customAmount)
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              ) : (
                `🎁 支持 ${selectedAmount || customAmount} 元`
              )}
            </button>
          </div>

          {/* What Your Support Enables */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">您的支持将帮助我们：</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">📹</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">制作更多视频</h3>
                  <p className="text-gray-300">创作更高质量的短视频内容</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">🎨</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">改善制作设备</h3>
                  <p className="text-gray-300">升级拍摄和剪辑设备</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">🎮</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">开发新项目</h3>
                  <p className="text-gray-300">开发网红狼游戏和互动内容</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">🤝</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">参与公益活动</h3>
                  <p className="text-gray-300">支持野生动物保护项目</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700">
        <div className="text-center text-gray-400">
          <p>© 2024 网红狼. All rights reserved.</p>
          <p className="mt-2">用爱发电，为梦想加油！</p>
        </div>
      </footer>
    </div>
  );
}