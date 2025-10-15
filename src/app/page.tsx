import Link from "next/link";

export default function Home() {
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
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              关于网红狼
            </Link>
            <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
              支持我们
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Wolf Icon/Avatar */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl">🐺</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            网红狼
          </h1>

          <h2 className="text-2xl md:text-3xl text-blue-400 mb-8">
            互联网最火的小狼
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            从森林深处走向网络世界的网红狼，用独特魅力征服了无数网友的心。
            现在让我们一起为网红狼的梦想助力！
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🎁 支持网红狼
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              📖 了解更多
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-3xl font-bold text-white mb-1">100万+</div>
              <div className="text-gray-400">粉丝关注</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-3xl font-bold text-white mb-1">500万+</div>
              <div className="text-gray-400">获得点赞</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-3xl font-bold text-white mb-1">1000+</div>
              <div className="text-gray-400">精彩视频</div>
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
