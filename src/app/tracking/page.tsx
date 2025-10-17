'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FundTracking() {
  const [activeTab, setActiveTab] = useState('overview');

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
      <section className="bg-gradient-to-br from-blue-100 to-green-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              资金追踪系统
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我们承诺100%透明，每一分钱的去向都有详细记录。
              您有权知道自己的善举如何改变生命。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">¥18,650</div>
              <p className="text-gray-600">已筹集善款</p>
              <p className="text-sm text-gray-500">来自1,247位爱心人士</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">¥11,650</div>
              <p className="text-gray-600">已支出</p>
              <p className="text-sm text-gray-500">全部用于小灰救助</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">¥7,000</div>
              <p className="text-gray-600">剩余资金</p>
              <p className="text-sm text-gray-500">用于后续放养计划</p>
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
                  { id: 'overview', label: '资金概览', icon: '📊' },
                  { id: 'expenses', label: '支出明细', icon: '💰' },
                  { id: 'donations', label: '捐款记录', icon: '❤️' },
                  { id: 'receipts', label: '凭证展示', icon: '🧾' },
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
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">资金使用概览</h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        收入来源
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">微信扫码捐款</span>
                          <span className="font-bold">¥9,825</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">支付宝扫码捐款</span>
                          <span className="font-bold">¥6,525</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">银行转账</span>
                          <span className="font-bold">¥2,300</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">总收入</span>
                            <span className="font-bold text-green-600 text-lg">¥18,650</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        支出分类
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">兽医治疗费</span>
                          <span className="font-bold">¥3,200</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">药品费</span>
                          <span className="font-bold">¥1,850</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">食物采购</span>
                          <span className="font-bold">¥4,600</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">保护区场地费</span>
                          <span className="font-bold">¥2,000</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">总支出</span>
                            <span className="font-bold text-orange-600 text-lg">¥11,650</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3">资金使用承诺</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">透明原则</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 所有收支明细实时更新</li>
                          <li>• 接受任何形式的第三方审计</li>
                          <li>• 定期公布财务报告</li>
                          <li>• 捐款人可要求查看原始凭证</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">监督机制</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• 阿勒泰地区林业部门监督</li>
                          <li>• 第三方会计师事务所审计</li>
                          <li>• 捐款人代表参与监督</li>
                          <li>• 公众随时查询和质询</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'expenses' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">详细支出记录</h2>

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
                            明细
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            供应商
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            金额
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            凭证
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-06-15
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            食物采购
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            新鲜羊肉 20斤
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            阿勒泰肉联厂
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥680
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-06-01
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            保护区费用
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            6月份场地使用费
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            阿勒泰野生动物保护区
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥2,000
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-05-15
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            医疗费用
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            常规体检 + 疫苗接种
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            王兽医诊所
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥350
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-04-20
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            医疗费用
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            驱虫治疗
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            王兽医诊所
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥180
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2023-11-16
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            医疗费用
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            伤口处理 + 抗生素
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            王兽医诊所
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥800
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2023-11-18
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            药品采购
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            抗生素、营养剂、消毒用品
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            阿勒泰医药公司
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥1,850
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      所有原始凭证（发票、收据等）均可供查看。请联系管理员获取完整文档。
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'donations' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">捐款记录（最近50笔）</h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            时间
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            捐款人
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            金额
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            方式
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            留言
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-06-18 14:32
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            爱心人士***
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥200
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            微信
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            小灰加油！希望你早日回家！
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-06-18 13:15
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            张**
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥100
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            支付宝
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            看到小灰的故事很感动，加油！
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-06-18 10:22
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            李女士
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥50
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            微信
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            每个生命都值得被温柔对待
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024-06-17 20:45
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            动物保护爱好者
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥500
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            支付宝
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            你们的付出很伟大，小灰要健康长大！
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 bg-yellow-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3">隐私保护说明</h3>
                    <p className="text-gray-700 text-sm">
                      为保护捐款人隐私，我们只显示部分姓名信息。所有捐款数据都是真实的，
                      如需核实，请联系我们并提供相应证明。
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'receipts' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">财务凭证展示</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: '兽医治疗费发票',
                        date: '2024-05-15',
                        vendor: '王兽医诊所',
                        amount: '¥350',
                        description: '小灰常规体检和疫苗接种费用'
                      },
                      {
                        title: '药品采购收据',
                        date: '2023-11-18',
                        vendor: '阿勒泰医药公司',
                        amount: '¥1,850',
                        description: '抗生素、营养剂等医疗用品'
                      },
                      {
                        title: '肉类采购发票',
                        date: '2024-06-15',
                        vendor: '阿勒泰肉联厂',
                        amount: '¥680',
                        description: '新鲜羊肉20斤，小灰的食物'
                      },
                      {
                        title: '保护区使用费收据',
                        date: '2024-06-01',
                        vendor: '阿勒泰野生动物保护区',
                        amount: '¥2,000',
                        description: '6月份场地使用和管理费用'
                      }
                    ].map((receipt, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-1">{receipt.title}</h3>
                            <p className="text-sm text-gray-600">{receipt.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-orange-600">{receipt.amount}</p>
                            <p className="text-xs text-gray-500">{receipt.vendor}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">{receipt.description}</p>
                        <div className="flex space-x-3">
                          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
                            查看原件
                          </button>
                          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400 transition-colors">
                            下载PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-green-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3">权威认证</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-2xl">🏢</span>
                        </div>
                        <h4 className="font-semibold mb-1">政府部门监督</h4>
                        <p className="text-sm text-gray-600">
                          阿勒泰地区林业和草原局定期核查
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-2xl">🔍</span>
                        </div>
                        <h4 className="font-semibold mb-1">第三方审计</h4>
                        <p className="text-sm text-gray-600">
                          立信会计师事务所年度审计
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-2xl">📋</span>
                        </div>
                        <h4 className="font-semibold mb-1">完整档案</h4>
                        <p className="text-sm text-gray-600">
                          所有凭证原件保存备查
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            有任何疑问？我们欢迎监督
          </h3>
          <p className="text-gray-600 mb-8">
            透明是最好的信任。如果您对资金使用有任何疑问，欢迎随时联系我们。
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📞</span>
                <h4 className="font-bold">联系电话</h4>
              </div>
              <p className="text-gray-600">186-xxxx-xxxx</p>
              <p className="text-sm text-gray-500">工作日 9:00-18:00</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📧</span>
                <h4 className="font-bold">邮箱联系</h4>
              </div>
              <p className="text-gray-600">help@xiaohui.org</p>
              <p className="text-sm text-gray-500">24小时内回复</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📍</span>
                <h4 className="font-bold">实地考察</h4>
              </div>
              <p className="text-gray-600">新疆阿勒泰保护区</p>
              <p className="text-sm text-gray-500">需提前预约</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}