import { useState } from 'react'
import { LotteryType } from '../../types/lottery'
import { EnhancedLotteryRecommendation } from '../../types/ai'
import { getAIRecommendation } from '../../utils/aiService'
import { soundManager } from '../../utils/soundManager'
import NumberReasonCard from './NumberReasonCard'
import AnalysisSummary from './AnalysisSummary'

interface WealthGodProps {
  lotteryType: LotteryType
  zodiacSign: string
  birthDate: string
  userName: string
  onSelectNumbers?: (redBalls: number[], blueBalls: number[]) => void
  onSaveAIRecommendation?: () => void
}

export function WealthGod({
  lotteryType,
  zodiacSign,
  birthDate,
  userName,
  onSelectNumbers,
  onSaveAIRecommendation
}: WealthGodProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<EnhancedLotteryRecommendation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleRequest = async () => {
    setLoading(true)
    setError(null)
    setRecommendation(null)
    setShowDetails(false)

    try {
      const result = await getAIRecommendation(lotteryType, zodiacSign, birthDate, userName)

      if (result.success && result.data) {
        setRecommendation(result.data)

        if (onSelectNumbers) {
          onSelectNumbers(result.data.redBalls, result.data.blueBalls)
        }
      } else if (result.error) {
        console.error('[WealthGod Error]', result.error)
        setError(result.error.userFriendlyMessage)
      } else {
        console.error('[WealthGod Error] Unknown error - no data and no error')
        setError('AI暂时无法生成推荐，请稍后再试')
      }
    } catch (err) {
      console.error('[WealthGod Exception]', err)
      setError('生成推荐失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setRecommendation(null)
    setError(null)
    setShowDetails(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mb-4 py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        title="AI财神推荐"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl animate-bounce">💰</span>
          <div className="text-left">
            <div className="text-white font-bold text-lg">AI财神推荐</div>
            <div className="text-purple-100 text-xs">
              基于{zodiacSign}星座的幸运号码
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="text-6xl animate-pulse">💰</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">财神AI推荐</h2>
                    <p className="text-purple-100 text-sm mt-1">
                      基于{zodiacSign}星座的幸运号码
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-purple-200 text-3xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* 用户信息 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      🎯 彩票类型
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {lotteryType === '双色球' ? '双色球' : '大乐透'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      🌟 用户星座
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {zodiacSign}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      👤 用户姓名
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userName}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      📅 用户生日
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {birthDate}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      📊 今日日期
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString('zh-CN', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 推荐结果 */}
              {recommendation && !loading && (
                <>
                  {/* 推荐号码展示 */}
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-6 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">✨</div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed mb-2">
                        财神推荐号码
                      </p>
                      <div className="bg-white dark:bg-gray-900 rounded-lg py-3 px-4 shadow-inner">
                        <p className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
                          红球：{recommendation.redBalls.join(' ')} - 蓝球：{recommendation.blueBalls.join(' ')}
                        </p>
                      </div>
                    </div>

                    {/* 切换详情按钮 */}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all transform hover:scale-[1.02] shadow-md"
                    >
                      {showDetails ? '🔽 收起详细分析' : '🔍 查看详细分析'}
                    </button>
                  </div>

                  {/* 详细分析 */}
                  {showDetails && (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      {/* 整体分析和玄学洞察 */}
                      <AnalysisSummary recommendation={recommendation} />

                      {/* 每个号码的详细理由 */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-xl">🎱</div>
                          <h3 className="text-base font-bold text-white">号码推荐理由</h3>
                        </div>
                        <div className="space-y-3">
                          {recommendation.numberReasons.map((reason, index) => (
                            <NumberReasonCard key={index} reason={reason} />
                          ))}
                        </div>
                      </div>

                      {/* 保存按钮 */}
                      {onSaveAIRecommendation && (
                        <button
                          onClick={onSaveAIRecommendation}
                          className="w-full py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span className="text-xl">💰</span>
                            <span>保存并召唤神龙</span>
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => {
                    soundManager.playAIRecommendation()
                    handleRequest()
                  }}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
                    loading
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-spin text-2xl">🎰</span>
                      <span>AI正在推算中...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-2xl">💰</span>
                      <span>生成幸运号码</span>
                    </span>
                  )}
                </button>

                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  取消
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  💡 财神AI基于你的姓名、星座和生日推荐，仅供娱乐参考
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
