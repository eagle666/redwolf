import Link from "next/link";

export default function AboutPage() {
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
            <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
              支持我们
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            关于网红狼
          </h1>

          {/* Wolf Image */}
          <div className="mb-12 text-center">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-8xl">🐺</span>
            </div>
          </div>

          {/* Story */}
          <div className="space-y-8 text-gray-300">
            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">🌲 我们的起源</h2>
              <p className="text-lg leading-relaxed">
                网红狼诞生于2020年的春天，从一个简单的表情包开始，逐渐成长为互联网上最受欢迎的狼形象。
                我们的主人公是一只充满好奇心和冒险精神的小狼，他用独特的视角观察着这个有趣的世界。
              </p>
            </section>

            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">🚀 成长历程</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">2020年 - 初露锋芒</h3>
                    <p>第一个网红狼表情包在社交媒体上发布，获得了意想不到的喜爱。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">2021年 - 快速成长</h3>
                    <p>开始制作短视频内容，粉丝数量突破10万，成为真正的网红。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">2022年 - 全面发展</h3>
                    <p>推出周边产品，开始公益项目，粉丝数量达到100万。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">2024年 - 新的征程</h3>
                    <p>现在，我们希望能够通过这个平台，让更多人了解网红狼的故事，一起支持我们继续创作。</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">💡 我们的使命</h2>
              <p className="text-lg leading-relaxed mb-4">
                网红狼不仅仅是一个形象，我们希望通过内容传播快乐和正能量。
                每一个视频、每一个表情包，都承载着我们对生活的热爱和对美好事物的追求。
              </p>
              <p className="text-lg leading-relaxed">
                我们相信，即使是小小的一只狼，也能为这个世界带来大大的改变。
                你的每一份支持，都是我们继续创作的动力！
              </p>
            </section>

            <section className="bg-gray-800 bg-opacity-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">🎯 未来规划</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">📹 内容创作</h3>
                  <p>制作更多高质量的短视频内容，包括日常vlog、科普动画等。</p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">🎮 游戏开发</h3>
                  <p>开发以网红狼为主题的手机游戏，让粉丝能够与网红狼互动。</p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">📚 图书出版</h3>
                  <p>出版网红狼的漫画书和故事书，传播正能量。</p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">🤝 公益项目</h3>
                  <p>参与动物保护相关的公益活动，为野生动物保护贡献力量。</p>
                </div>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/support"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🎁 支持网红狼的梦想
            </Link>
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