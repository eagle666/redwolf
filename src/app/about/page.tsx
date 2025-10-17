'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('team');

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
      <section className="bg-gradient-to-br from-blue-100 to-green-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            关于我们的故事
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们不是专业的慈善机构，只是一群被小灰感动的普通人。
            这8个月来，我们见证了生命的奇迹，也感受到了人性的温暖。
          </p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: 'team', label: '团队介绍', icon: '👥' },
                  { id: 'story', label: '项目起源', icon: '📖' },
                  { id: 'certificates', label: '权威认证', icon: '🏆' },
                  { id: 'media', label: '媒体报道', icon: '📰' },
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
              {activeTab === 'team' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">核心团队</h2>

                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-600">张明</span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">张明</h3>
                      <p className="text-orange-600 font-medium mb-3">项目负责人</p>
                      <p className="text-gray-600 mb-4">
                        10年野生动物保护经验，原新疆野生动物保护协会成员。
                        2018-2023年参与过27只野生动物救助工作。
                      </p>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold mb-1">格言：</p>
                        <p>"救小灰那天，零下18度，我知道不能放弃它。"</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-600">李晓燕</span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">李晓燕</h3>
                      <p className="text-orange-600 font-medium mb-3">志愿者负责人</p>
                      <p className="text-gray-600 mb-4">
                        动物医学专业毕业，拥有国家认证的动物护理资格证书。
                        负责小灰日常护理和康复训练工作。
                      </p>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold mb-1">工作日常：</p>
                        <p>"每天5点起床准备小灰的食物，看着它健康成长很欣慰。"</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-600">王兽医</span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">王建国</h3>
                      <p className="text-orange-600 font-medium mb-3">合作兽医</p>
                      <p className="text-gray-600 mb-4">
                        阿勒泰地区宠物医院主治医师，20年临床经验。
                        专门从事野生动物治疗，成功救助过50+只野生动物。
                      </p>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold mb-1">专业评价：</p>
                        <p>"小灰的恢复情况超出了我的预期，是个奇迹。"</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">我们的志愿者团队</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">常驻志愿者（8人）</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 陈医生 - 负责健康监测</li>
                          <li>• 刘师傅 - 负责设施维护</li>
                          <li>• 小王 - 负责视频记录</li>
                          <li>• 李阿姨 - 负责食物准备</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">临时志愿者（20+人）</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 大学生假期实践团队</li>
                          <li>• 周边社区热心居民</li>
                          <li>• 动物保护爱好者</li>
                          <li>• 专业摄影师志愿者</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'story' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">项目起源故事</h2>

                  <div className="space-y-8">
                    <div className="bg-orange-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-3">一个寒冷的清晨</h3>
                      <p className="text-gray-700 mb-4">
                        2023年11月15日，阿勒泰地区迎来了入冬以来最冷的一天，气温降到零下18度。
                        我和张明像往常一样进行野生动物巡护工作，突然在雪地里发现了一个小小的身影。
                      </p>
                      <p className="text-gray-700 mb-4">
                        那是一只狼崽，看起来只有3个月大，独自在雪地里瑟瑟发抖。
                        它的毛被冻得结了冰，右前腿有一道很深的伤口。我们把它抱起来的时候，
                        它几乎没有反抗，只是用虚弱的眼神看着我们。
                      </p>
                      <p className="text-gray-700">
                        那一刻，我们知道不能眼睁睁看着这个小生命消失在冰天雪地里。
                        我们给它取名"小灰"，因为它灰色的毛发在阳光下显得格外温柔。
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-3">艰难的开始</h3>
                      <p className="text-gray-700 mb-4">
                        救助小灰只是第一步，真正的挑战是如何让它恢复健康。
                        最初的一周，小灰拒绝进食，只是蜷缩在角落里。
                        我们联系了王兽医，他说情况很危险，需要立即治疗。
                      </p>
                      <p className="text-gray-700 mb-4">
                        王兽医连夜赶来为小灰处理伤口，打了抗生素。
                        但是小灰依然不肯吃东西，我们都急坏了。李晓燕每天守在小灰身边，
                        轻声和它说话，希望能给它一些安慰。
                      </p>
                      <p className="text-gray-700">
                        转折点出现在第5天。晓燕带来了新鲜的羊肉丝，小心翼翼地放在小灰面前。
                        也许是饿坏了，也许是感受到了我们的善意，小灰犹豫了很久，终于开始小口小口地吃起来。
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-3">社区的支持</h3>
                      <p className="text-gray-700 mb-4">
                        小灰的故事很快在当地传开了。越来越多的人加入到救助行列中来：
                        肉店的老板听说后，坚持用成本价卖给我们最新鲜的羊肉；
                        社区的大妈们主动来帮忙照顾小灰；
                        当地的学校组织孩子们来看小灰，上了一堂生动的自然保护课。
                      </p>
                      <p className="text-gray-700 mb-4">
                        有一天，一位白发苍苍的老人来到我们这里，他说他在山里生活了一辈子，
                        从来没见过这样的救助。他捐出了自己一个月的退休金，说：
                        "你们做的不是救助一只狼，而是在守护我们共同的家园。"
                      </p>
                      <p className="text-gray-700">
                        就这样，一个小小的救助行动，变成了整个社区的共同事业。
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-3">现在的我们</h3>
                      <p className="text-gray-700 mb-4">
                        8个月过去了，当初只有几个人的小团队，现在发展成了一个有30多名志愿者的大家庭。
                        我们有了专门的救助场所，有了更专业的设备，也有了更完善的救助流程。
                      </p>
                      <p className="text-gray-700 mb-4">
                        最重要的是，我们见证了一个生命的奇迹。小灰从当初那个5kg的小不点，
                        长成了现在15kg的健康大狼。它学会了基本的生存技能，开始展现出狼的本性。
                      </p>
                      <p className="text-gray-700">
                        我们知道，小灰终将回到属于它的大自然。但我们相信，这段经历会永远改变我们每个人。
                        我们也希望通过这个故事，让更多人了解野生动物保护的重要性。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'certificates' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">权威认证与监督</h2>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center">
                        <span className="text-2xl mr-3">🏛️</span>
                        政府认证
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold">阿勒泰地区林业和草原局</h4>
                          <p className="text-sm text-gray-600">备案批准文号：阿林草字〔2023〕127号</p>
                          <p className="text-sm text-gray-500">野生动物临时救助许可</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold">新疆野生动物保护协会</h4>
                          <p className="text-sm text-gray-600">团体会员证书编号：XJWA2023-045</p>
                          <p className="text-sm text-gray-500">年度考核优秀</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center">
                        <span className="text-2xl mr-3">🔍</span>
                        第三方监督
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-orange-500 pl-4">
                          <h4 className="font-semibold">立信会计师事务所</h4>
                          <p className="text-sm text-gray-600">年度财务审计报告</p>
                          <p className="text-sm text-gray-500">审计意见：无保留意见</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold">新疆大学动物科学院</h4>
                          <p className="text-sm text-gray-600">技术指导单位</p>
                          <p className="text-sm text-gray-500">提供专业评估和支持</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 mb-8">
                    <h3 className="font-bold text-lg mb-4">重要文件展示</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-2xl">📄</span>
                        </div>
                        <h4 className="font-semibold mb-2">救助许可证</h4>
                        <p className="text-sm text-gray-600 mb-3">林业部门颁发</p>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                          查看原件
                        </button>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-2xl">📋</span>
                        </div>
                        <h4 className="font-semibold mb-2">审计报告</h4>
                        <p className="text-sm text-gray-600 mb-3">2024年度</p>
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                          查看报告
                        </button>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-2xl">🏆</span>
                        </div>
                        <h4 className="font-semibold mb-2">表彰证书</h4>
                        <p className="text-sm text-gray-600 mb-3">自治区颁发</p>
                        <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                          查看证书
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">监督机制</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">内部监督</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 每月理事会财务审核</li>
                          <li>• 志愿者代表参与决策</li>
                          <li>• 定期内部审计</li>
                          <li>• 开放的财务制度</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">外部监督</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 政府部门定期检查</li>
                          <li>• 第三方机构年度审计</li>
                          <li>• 捐款人质询通道</li>
                          <li>• 公众举报监督机制</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">媒体报道</h2>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">《新疆日报》- 冰天雪地中的生命奇迹</h3>
                          <p className="text-gray-600 text-sm mb-2">2024年3月15日 | 记者：王建军</p>
                          <p className="text-gray-700">
                            在阿勒泰地区的一个野生动物救助站，一只名叫"小灰"的狼崽正在茁壮成长。
                            8个月前，它被发现时奄奄一息，如今已经准备好回归大自然...
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            主流媒体
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                          阅读全文
                        </button>
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400">
                          查看原文
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">央视新闻直播间 - 雪域狼情</h3>
                          <p className="text-gray-600 text-sm mb-2">2024年2月28日 | 记者：李思雨</p>
                          <p className="text-gray-700">
                            在新疆阿勒泰，一群普通的当地人用爱心和坚持，
                            成功救助了一只濒死的狼崽。这个故事温暖了整个冬天...
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            电视报道
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">
                          观看视频
                        </button>
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400">
                          查看文字稿
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">《中国青年报》- 零下18度的生命救援</h3>
                          <p className="text-gray-600 text-sm mb-2">2024年1月10日 | 记者：张晓宇</p>
                          <p className="text-gray-700">
                            "那一刻我知道，不能眼睁睁看着这个生命消失。"张明回忆起救助小灰的那天，
                            依然激动不已。这个关于爱与生命的故事，正在感动着越来越多的人...
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            深度报道
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">
                          阅读全文
                        </button>
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400">
                          分享文章
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-yellow-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">网络传播数据</h3>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600 mb-1">500万+</p>
                        <p className="text-sm text-gray-600">话题阅读量</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600 mb-1">10万+</p>
                        <p className="text-sm text-gray-600">视频播放量</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600 mb-1">3万+</p>
                        <p className="text-sm text-gray-600">转发分享</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600 mb-1">2000+</p>
                        <p className="text-sm text-gray-600">网友留言</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            加入我们的行列
          </h3>
          <p className="text-xl text-white/90 mb-8">
            每个人都可以为野生动物保护贡献自己的力量
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">💝</div>
              <h4 className="font-bold text-white mb-2">爱心捐款</h4>
              <p className="text-white/80 text-sm">支持救助工作持续进行</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-bold text-white mb-2">志愿服务</h4>
              <p className="text-white/80 text-sm">参与实地救助活动</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-3xl mb-2">📢</div>
              <h4 className="font-bold text-white mb-2">宣传推广</h4>
              <p className="text-white/80 text-sm">传播保护理念</p>
            </div>
          </div>

          <Link
            href="/"
            className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            立即参与救助
          </Link>
        </div>
      </section>
    </div>
  );
}