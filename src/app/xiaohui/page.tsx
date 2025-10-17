'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function XiaoHuiProfile() {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">狼</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">小灰救助项目</h1>
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <img
                    src="/xiaohui-current.jpg"
                    alt="小灰现在的样子"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center" style={{display: 'none'}}>
                    <div className="text-white text-center">
                      <div className="text-8xl mb-4">🐺</div>
                      <p className="text-lg">小灰现在的样子</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-8">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">小灰</h1>
                  <p className="text-lg text-gray-600 mb-4">阿尔泰山的小狼王</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      雄性
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      11个月大
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      15kg
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      健康良好
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎂</span>
                    <div>
                      <p className="font-semibold">救助时间</p>
                      <p className="text-sm text-gray-600">2023年11月15日</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <p className="font-semibold">发现地点</p>
                      <p className="text-sm text-gray-600">新疆阿尔泰山脚下</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏥</span>
                    <div>
                      <p className="font-semibold">健康状况</p>
                      <p className="text-sm text-gray-600">完全康复，准备野外放养</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⏰</span>
                    <div>
                      <p className="font-semibold">预计放养时间</p>
                      <p className="text-sm text-gray-600">2024年8月（还有2个月）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                  { id: 'story', label: '救助故事', icon: '📖' },
                  { id: 'progress', label: '康复进展', icon: '📈' },
                  { id: 'medical', label: '医疗记录', icon: '🏥' },
                  { id: 'photos', label: '成长相册', icon: '📷' },
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
              {activeTab === 'story' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">小灰的救助故事</h2>

                  <div className="bg-orange-50 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3">初次相遇</h3>
                    <p className="text-gray-700 mb-4">
                      2023年11月15日，一个寒冷的清晨。新疆阿尔泰山的气温降到了零下18度。
                      我们在进行常规野生动物巡护时，在雪地里发现了一个小小的身影。
                    </p>
                    <p className="text-gray-700 mb-4">
                      那是一只约3个月大的狼崽，独自在雪地里瑟瑟发抖。它的毛被冻得结了冰，
                      右前腿有一道很深的伤口，看起来已经好几天没有进食了。我们给它取名"小灰"，
                      因为它灰色的毛发在阳光下显得格外温柔。
                    </p>
                    <p className="text-gray-700">
                      当时的情况很危急，如果我们晚发现半小时，小灰可能就已经...
                      现在回想起来，那一刻真的是命运的安排。
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3">艰难的康复之路</h3>
                    <p className="text-gray-700 mb-4">
                      救助小灰只是第一步，真正的挑战是如何让它恢复健康。最初的一周，
                      小灰拒绝进食，只是蜷缩在角落里。我们知道野生动物对人类有戒心，
                      但看着它日渐虚弱，心如刀割。
                    </p>
                    <p className="text-gray-700 mb-4">
                      转折点出现在第5天。李晓燕（我们的志愿者负责人）带来了新鲜的羊肉丝，
                      小心翼翼地放在小灰面前。也许是饿坏了，也许是感受到了我们的善意，
                      小灰犹豫了很久，终于开始小口小口地吃起来。
                    </p>
                    <p className="text-gray-700">
                      那一刻，我们所有人都哭了。我们知道，这个小生命有了希望。
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3">成长的奇迹</h3>
                    <p className="text-gray-700 mb-4">
                      8个月过去了，小灰从当初那个5kg的小不点，长成了现在15kg的健康大狼。
                      它学会了基本的捕猎技巧，开始展现出狼的本性，但对我们依然保持着一份特殊的亲近。
                    </p>
                    <p className="text-gray-700">
                      现在的小灰，已经准备好回到真正的家——阿尔泰山的广袤天地。但我们知道，
                      分别的时刻即将到来，既期待又舍不得...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'progress' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">康复进展记录</h2>

                  <div className="space-y-6">
                    {[
                      {
                        date: '2024年6月',
                        title: '野外生存训练',
                        description: '开始在保护区的训练场进行捕猎技巧训练，学习追踪小型动物',
                        status: 'excellent',
                        weight: '15kg'
                      },
                      {
                        date: '2024年4月',
                        title: '社交行为恢复',
                        description: '开始展现出狼的领地意识和社交行为，与其他救助动物有了初步接触',
                        status: 'good',
                        weight: '12kg'
                      },
                      {
                        date: '2024年2月',
                        title: '体能恢复期',
                        description: '伤口完全愈合，开始在较大范围内活动，体能明显提升',
                        status: 'good',
                        weight: '9kg'
                      },
                      {
                        date: '2023年12月',
                        title: '初期康复',
                        description: '开始正常进食，伤口感染得到控制，体重缓慢增加',
                        status: 'fair',
                        weight: '6kg'
                      },
                      {
                        date: '2023年11月',
                        title: '紧急救助',
                        description: '发现时严重营养不良，右前腿受伤，体温过低',
                        status: 'critical',
                        weight: '5kg'
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full ${
                            item.status === 'excellent' ? 'bg-green-500' :
                            item.status === 'good' ? 'bg-blue-500' :
                            item.status === 'fair' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                            <span className="text-sm text-gray-500">{item.date}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-500">体重: {item.weight}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'excellent' ? 'bg-green-100 text-green-700' :
                              item.status === 'good' ? 'bg-blue-100 text-blue-700' :
                              item.status === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status === 'excellent' ? '优秀' :
                               item.status === 'good' ? '良好' :
                               item.status === 'fair' ? '一般' : '危急'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'medical' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">医疗记录</h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            日期
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            项目
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            兽医
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            结果
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            费用
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-05-15
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            常规体检 + 疫苗接种
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            王兽医
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            健康
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥350
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-03-20
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            驱虫治疗
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            王兽医
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            成功
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥180
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2023-11-16
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            伤口处理 + 抗生素治疗
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            王兽医
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                            感染控制中
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥800
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3">医疗档案说明</h3>
                    <p className="text-gray-700 mb-4">
                      小灰的所有医疗记录都有详细档案，包括诊断书、处方单、费用明细等。
                      我们承诺所有医疗信息真实可查，接受任何形式的监督。
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold mb-2">可提供的医疗证明：</p>
                        <ul className="space-y-1 text-gray-600">
                          <li>• 兽医诊断书原件</li>
                          <li>• 治疗过程照片记录</li>
                          <li>• 药品采购发票</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">健康监测指标：</p>
                        <ul className="space-y-1 text-gray-600">
                          <li>• 体重：每周测量记录</li>
                          <li>• 体温：每日监测</li>
                          <li>• 活动量：运动轨迹分析</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">成长相册</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        date: '2024年6月',
                        title: '训练中的小灰',
                        description: '正在学习捕猎技巧，眼神变得更加锐利'
                      },
                      {
                        date: '2024年4月',
                        title: '健康成长',
                        description: '体重达到12kg，毛发变得有光泽'
                      },
                      {
                        date: '2024年2月',
                        title: '康复期',
                        description: '伤口愈合，开始活泼起来'
                      },
                      {
                        date: '2023年12月',
                        title: '适应期',
                        description: '开始接受人类的照顾，慢慢敞开心扉'
                      },
                      {
                        date: '2023年11月',
                        title: '救助初期',
                        description: '刚被发现时虚弱的样子，让人心疼'
                      },
                      {
                        date: '2023年11月',
                        title: '第一次治疗',
                        description: '王兽医为小灰处理伤口的珍贵瞬间'
                      }
                    ].map((photo, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative">
                          <img
                            src={`/xiaohui-${index + 1}.jpg`}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center" style={{display: 'none'}}>
                            <div className="text-white text-center">
                              <div className="text-4xl mb-2">🐺</div>
                              <p className="text-sm">{photo.title}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-1">{photo.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{photo.date}</p>
                          <p className="text-xs text-gray-500">{photo.description}</p>
                        </div>
                      </div>
                    ))}
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
            继续支持小灰回家
          </h3>
          <p className="text-xl text-white/90 mb-8">
            距离小灰回到大自然还有2个月，还需要您的帮助
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">📡</div>
              <h4 className="font-bold text-white mb-2">GPS追踪设备</h4>
              <p className="text-white/80 text-sm mb-3">确保放养后能监测小灰的安全</p>
              <p className="text-xl font-bold text-yellow-300">¥2,500</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-white mb-2">野外训练</h4>
              <p className="text-white/80 text-sm mb-3">教会小灰独立生存的技能</p>
              <p className="text-xl font-bold text-yellow-300">¥3,000</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">🍖</div>
              <h4 className="font-bold text-white mb-2">食物储备</h4>
              <p className="text-white/80 text-sm mb-3">过渡期的安全保障</p>
              <p className="text-xl font-bold text-yellow-300">¥4,350</p>
            </div>
          </div>

          <Link
            href="/"
            className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            立即捐款支持
          </Link>
        </div>
      </section>
    </div>
  );
}