import { useState, useCallback } from 'react'
import { LotteryType } from '../../types/lottery'
import { EnhancedLotteryRecommendation } from '../../types/ai'
import { getAIRecommendation } from '../../utils/aiService'
import { soundManager } from '../../utils/soundManager'
import NumberReasonCard from './NumberReasonCard'
import AnalysisSummary from './AnalysisSummary'
import { Copy, Check } from 'lucide-react'

interface WealthGodProps {
  lotteryType: LotteryType
  zodiacSign: string
  birthDate: string
  userName: string
  onSelectNumbers?: (redBalls: number[], blueBalls: number[]) => void
  onSaveAIRecommendation?: (recommendations: Array<{redBalls: number[], blueBalls: number[]}>) => void
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
  const [selectedSetIndex, setSelectedSetIndex] = useState(0) // 选中的组索引
  const [copiedSetIndex, setCopiedSetIndex] = useState<number | null>(null) // 复制状态
  const [saved, setSaved] = useState(false) // 保存状态

  const handleRequest = async () => {
    setLoading(true)
    setError(null)
    setRecommendation(null)
    setShowDetails(false)
    setSelectedSetIndex(0)

    try {
      const result = await getAIRecommendation(lotteryType, zodiacSign, birthDate, userName)

      if (result.success && result.data) {
        setRecommendation(result.data)

        // 如果有多组推荐，默认选择第一组（或最佳组）
        if (result.data.recommendations && result.data.recommendations.length > 0) {
          const bestSetIndex = (result.data.overallAnalysis?.bestSet || 1) - 1
          const validIndex = Math.max(0, Math.min(bestSetIndex, result.data.recommendations.length - 1))
          setSelectedSetIndex(validIndex)

          if (onSelectNumbers) {
            const selectedSet = result.data.recommendations[validIndex]
            onSelectNumbers(selectedSet.redBalls, selectedSet.blueBalls)
          }
        } else if (onSelectNumbers) {
          // 向后兼容：使用旧格式的单组数据
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

  const handleSetSelect = (index: number) => {
    setSelectedSetIndex(index)
    if (recommendation && recommendation.recommendations && recommendation.recommendations[index]) {
      const selectedSet = recommendation.recommendations[index]
      if (onSelectNumbers) {
        onSelectNumbers(selectedSet.redBalls, selectedSet.blueBalls)
      }
    }
  }

  const getCurrentSet = () => {
    if (!recommendation) return null
    if (recommendation.recommendations && recommendation.recommendations.length > 0) {
      return recommendation.recommendations[selectedSetIndex]
    }
    // 向后兼容：使用旧格式
    return {
      redBalls: recommendation.redBalls,
      blueBalls: recommendation.blueBalls,
      numberReasons: recommendation.numberReasons,
      setAnalysis: {
        summary: recommendation.text,
        fortuneLevel: recommendation.overallAnalysis?.fortuneLevel || '吉',
        keyStrengths: recommendation.overallAnalysis?.keyFactors || [],
        recommendationRank: 1
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setRecommendation(null)
    setError(null)
    setShowDetails(false)
  }

  // 复制号码到剪贴板
  const handleCopyNumbers = useCallback((setIndex: number) => {
    if (!recommendation) return

    let text = ''
    const redLabel = lotteryType === '双色球' ? '红球' : '前区'
    const blueLabel = lotteryType === '双色球' ? '蓝球' : '后区'

    if (recommendation.recommendations && recommendation.recommendations.length > 0) {
      // 复制指定的一组
      const set = recommendation.recommendations[setIndex]
      text = `第${setIndex + 1}组\n${redLabel}：${set.redBalls.join(' ')}\n${blueLabel}：${set.blueBalls.join(' ')}`
    } else {
      // 向后兼容：单组
      text = `${redLabel}：${recommendation.redBalls.join(' ')}\n${blueLabel}：${recommendation.blueBalls.join(' ')}`
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSetIndex(setIndex)
      soundManager.playSaveSuccess()
      if ('vibrate' in navigator) {
        navigator.vibrate([50])
      }
      setTimeout(() => setCopiedSetIndex(null), 2000)
    }).catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
  }, [recommendation, lotteryType])

  // 复制所有组
  const handleCopyAllNumbers = useCallback(() => {
    if (!recommendation) return

    const redLabel = lotteryType === '双色球' ? '红球' : '前区'
    const blueLabel = lotteryType === '双色球' ? '蓝球' : '后区'

    let text = ''

    if (recommendation.recommendations && recommendation.recommendations.length > 0) {
      text = recommendation.recommendations.map((set, index) => {
        return `第${index + 1}组\n${redLabel}：${set.redBalls.join(' ')}\n${blueLabel}：${set.blueBalls.join(' ')}`
      }).join('\n\n')
    } else {
      text = `${redLabel}：${recommendation.redBalls.join(' ')}\n${blueLabel}：${recommendation.blueBalls.join(' ')}`
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSetIndex(-1) // -1 表示复制了所有组
      soundManager.playSaveSuccess()
      if ('vibrate' in navigator) {
        navigator.vibrate([50])
      }
      setTimeout(() => setCopiedSetIndex(null), 2000)
    }).catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
  }, [recommendation, lotteryType])

  // 直接保存（不触发神龙）
  const handleDirectSave = useCallback(() => {
    if (!onSaveAIRecommendation || !recommendation) return

    soundManager.playSaveSuccess()
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100])
    }

    if (recommendation.recommendations && recommendation.recommendations.length > 0) {
      onSaveAIRecommendation(recommendation.recommendations.map(rec => ({
        redBalls: rec.redBalls,
        blueBalls: rec.blueBalls
      })))
    } else {
      onSaveAIRecommendation([{
        redBalls: recommendation.redBalls,
        blueBalls: recommendation.blueBalls
      }])
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [recommendation, onSaveAIRecommendation])

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
                  {/* 多组推荐展示 */}
                  {recommendation.recommendations && recommendation.recommendations.length > 0 ? (
                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-6 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-3">✨</div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed mb-2">
                          财神为您推荐了 {recommendation.recommendations.length} 组幸运号码
                        </p>
                        {recommendation.overallAnalysis?.bestSet && (
                          <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                            ⭐ 最佳推荐：第{recommendation.overallAnalysis.bestSet}组
                          </p>
                        )}
                      </div>

                      {/* 组选择按钮 */}
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {recommendation.recommendations.map((set, index) => {
                          const isBestSet = recommendation.overallAnalysis?.bestSet === index + 1
                          const isSelected = selectedSetIndex === index
                          return (
                            <button
                              key={index}
                              onClick={() => handleSetSelect(index)}
                              className={`
                                py-3 px-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105
                                ${isSelected
                                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                                  : isBestSet
                                    ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-600'
                                }
                              `}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <div className="text-lg">
                                  {isBestSet ? '⭐' : isSelected ? '✓' : `${index + 1}`}
                                </div>
                                <div className="text-xs opacity-90">
                                  {set.setAnalysis?.fortuneLevel || '吉'}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* 当前选中组的号码展示 */}
                      {getCurrentSet() && (
                        <div className="bg-white dark:bg-gray-900 rounded-lg py-3 px-4 shadow-inner mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                              第{selectedSetIndex + 1}组 - {getCurrentSet()!.setAnalysis?.summary || '推荐号码'}
                            </span>
                            <button
                              onClick={() => handleCopyNumbers(selectedSetIndex)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              title="复制这组号码"
                            >
                              {copiedSetIndex === selectedSetIndex ? (
                                <>
                                  <Check className="w-4 h-4 text-green-500" />
                                  <span className="text-xs text-green-500">已复制</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  <span className="text-xs text-gray-600 dark:text-gray-400">复制</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed text-center">
                            红球：{getCurrentSet()!.redBalls.join(' ')} - 蓝球：{getCurrentSet()!.blueBalls.join(' ')}
                          </p>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={handleDirectSave}
                          disabled={saved}
                          className={`py-2 px-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                            saved
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-md'
                          }`}
                        >
                          {saved ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>已保存</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg">💾</span>
                              <span>保存号码</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCopyAllNumbers}
                          className={`py-2 px-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                            copiedSetIndex === -1
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                              : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-md'
                          }`}
                        >
                          {copiedSetIndex === -1 ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>已复制全部</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>复制全部</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 切换详情按钮 */}
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all transform hover:scale-[1.02] shadow-md"
                      >
                        {showDetails ? '🔽 收起详细分析' : '🔍 查看详细分析'}
                      </button>
                    </div>
                  ) : (
                    /* 向后兼容：单组展示 */
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
                  )}

                  {/* 详细分析 */}
                  {showDetails && (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      {/* 整体分析和玄学洞察 */}
                      <AnalysisSummary recommendation={recommendation} />

                      {/* 当前选中组的分析 */}
                      {getCurrentSet() && getCurrentSet()!.setAnalysis && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl">📊</div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                              第{selectedSetIndex + 1}组分析
                            </h3>
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
                              {getCurrentSet()!.setAnalysis.fortuneLevel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {getCurrentSet()!.setAnalysis.summary}
                          </p>
                          {getCurrentSet()!.setAnalysis.keyStrengths && getCurrentSet()!.setAnalysis.keyStrengths.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">关键优势：</div>
                              <div className="flex flex-wrap gap-1">
                                {getCurrentSet()!.setAnalysis.keyStrengths.map((strength, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-xs">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 每个号码的详细理由 */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-xl">🎱</div>
                          <h3 className="text-base font-bold text-white">
                            号码推荐理由 {recommendation.recommendations && recommendation.recommendations.length > 0 ? `(第${selectedSetIndex + 1}组)` : ''}
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {(getCurrentSet()?.numberReasons || recommendation.numberReasons).map((reason, index) => (
                            <NumberReasonCard key={index} reason={reason} />
                          ))}
                        </div>
                      </div>

                      {/* 保存按钮 */}
                      {onSaveAIRecommendation && (
                        <button
                          onClick={() => {
                            if (recommendation.recommendations && recommendation.recommendations.length > 0) {
                              // 保存所有5组
                              onSaveAIRecommendation(recommendation.recommendations.map(rec => ({
                                redBalls: rec.redBalls,
                                blueBalls: rec.blueBalls
                              })))
                            } else {
                              // 向后兼容：保存单组
                              onSaveAIRecommendation([{
                                redBalls: recommendation.redBalls,
                                blueBalls: recommendation.blueBalls
                              }])
                            }
                          }}
                          className="w-full py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span className="text-xl">💰</span>
                            <span>
                              保存并召唤神龙
                              {recommendation.recommendations && recommendation.recommendations.length > 0
                                ? ` (${recommendation.recommendations.length}组)`
                                : ''}
                            </span>
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
