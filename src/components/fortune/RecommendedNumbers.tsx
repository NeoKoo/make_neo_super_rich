import { memo, useState, useEffect } from 'react'
import type { RecommendedNumbers } from '../../types/fortune'
import { NumberBall } from '../lottery/NumberBall'
import { ChevronDown, Sparkles, Copy, Check, RefreshCw, Shuffle } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import { getCombinedDynamicFactor } from '../../utils/dynamicMetaphysics'

interface RecommendedNumbersProps {
  numbers: RecommendedNumbers
}

function RecommendedNumbers({ numbers, onRefresh }: RecommendedNumbersProps & { onRefresh?: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dynamicFactor, setDynamicFactor] = useState(1)
  const [highlightedBalls, setHighlightedBalls] = useState<number[]>([])
  const { addToast } = useToast()

  // 动态更新因子和效果
  useEffect(() => {
    const updateDynamicFactor = () => {
      setDynamicFactor(getCombinedDynamicFactor())
      
      // 随机高亮一些球
      const redHighlights: number[] = []
      const blueHighlights: number[] = []
      
      // 随机选择2-3个红球高亮
      const redCount = Math.floor(Math.random() * 2) + 2
      for (let i = 0; i < redCount; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.redBalls.length)
        if (!redHighlights.includes(numbers.redBalls[randomIndex])) {
          redHighlights.push(numbers.redBalls[randomIndex])
        }
      }
      
      // 随机选择1个蓝球高亮
      if (numbers.blueBalls.length > 0) {
        const randomIndex = Math.floor(Math.random() * numbers.blueBalls.length)
        blueHighlights.push(numbers.blueBalls[randomIndex])
      }
      
      setHighlightedBalls([...redHighlights, ...blueHighlights])
    }
    
    updateDynamicFactor()
    const interval = setInterval(updateDynamicFactor, 30000) // 每30秒更新一次
    
    return () => clearInterval(interval)
  }, [numbers.redBalls, numbers.blueBalls])

  const handleToggle = () => {
    setAnimating(true)
    setExpanded(!expanded)
    setTimeout(() => setAnimating(false), 300)
  }

  const handleCopy = async () => {
    const text = `推荐号码：\n红球：${numbers.redBalls.join(' ')}\n蓝球：${numbers.blueBalls.join(' ')}\n置信度：${numbers.confidence}%`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      addToast('推荐号码已复制到剪贴板', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      addToast('复制失败，请手动复制', 'error')
    }
  }

  const handleRefreshNumbers = async () => {
    if (onRefresh) {
      setRefreshing(true)
      try {
        await onRefresh()
        addToast('推荐号码已刷新', 'success')
      } catch (error) {
        addToast('刷新失败，请稍后重试', 'error')
      } finally {
        setRefreshing(false)
      }
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return '高'
    if (confidence >= 60) return '中'
    return '低'
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl border border-amber-400/20 overflow-hidden relative z-0">
      {/* Header */}
      <button
        onClick={handleToggle}
        className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-300 ${animating ? 'scale-[0.98]' : 'scale-100'}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-left">
            <div className="text-base font-bold text-white">玄学推荐号码</div>
            <div className="text-xs text-amber-300/80">基于名字、星座、五行、数字命理综合计算</div>
          </div>
        </div>
        <div className={`transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="w-5 h-5 text-amber-300" />
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-amber-400/20 animate-[fadeIn_0.3s_ease-out]">
          {/* 动态因子指示器 */}
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-200/80">玄学能量指数</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-purple-300">
                  {Math.round(dynamicFactor * 100)}%
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  dynamicFactor > 1.1 ? 'bg-green-400' :
                  dynamicFactor > 0.9 ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
              </div>
            </div>
            <div className="text-xs text-amber-200/60">
              {dynamicFactor > 1.1 ? '玄学能量高涨，推荐号码可信度提升' :
               dynamicFactor > 0.9 ? '玄学能量平稳，推荐号码保持稳定' :
               '玄学能量偏低，建议谨慎参考'}
            </div>
          </div>

          {/* 置信度 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-200/80">推荐置信度</span>
              <span className={`text-2xl font-bold ${getConfidenceColor(numbers.confidence)}`}>
                {numbers.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  numbers.confidence >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  numbers.confidence >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${numbers.confidence}%` }}
              />
            </div>
            <div className="text-xs text-amber-200/60">
              置信度等级：<span className={`font-semibold ${getConfidenceColor(numbers.confidence)}`}>
                {getConfidenceLabel(numbers.confidence)}
              </span>
            </div>
          </div>

          {/* 推荐号码 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white">推荐号码</div>
              <div className="flex items-center gap-2">
                {onRefresh && (
                  <button
                    onClick={handleRefreshNumbers}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/30 hover:bg-purple-500/40 rounded-lg transition-colors disabled:opacity-50"
                    title="刷新推荐号码"
                  >
                    {refreshing ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-purple-300 animate-spin" />
                        <span className="text-sm text-purple-300">刷新中</span>
                      </>
                    ) : (
                      <>
                        <Shuffle className="w-4 h-4 text-purple-300" />
                        <span className="text-sm text-purple-300">刷新</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/30 hover:bg-amber-500/40 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span className="text-sm text-amber-300">复制</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 红球 */}
            <div className="mb-4">
              <div className="text-sm text-amber-200/80 mb-2">红球</div>
              <div className="flex flex-wrap gap-2">
                {numbers.redBalls.map((num, index) => (
                  <NumberBall
                    key={`red-${index}`}
                    number={num}
                    color="red"
                    selected={false}
                    onClick={() => {}}
                    size="lg"
                    highlighted={highlightedBalls.includes(num)}
                  />
                ))}
              </div>
            </div>

            {/* 蓝球 */}
            <div>
              <div className="text-sm text-amber-200/80 mb-2">蓝球</div>
              <div className="flex flex-wrap gap-2">
                {numbers.blueBalls.map((num, index) => (
                  <NumberBall
                    key={`blue-${index}`}
                    number={num}
                    color="blue"
                    selected={false}
                    onClick={() => {}}
                    size="lg"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 推荐理由 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm font-semibold text-white mb-3">推荐理由</div>
            <ul className="space-y-2">
              {numbers.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-amber-200/80">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 免责声明 */}
          <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
            <div className="text-xs text-amber-200/60 text-center">
              ⚠️ 本推荐号码基于玄学分析计算，仅供娱乐参考，不构成购彩建议。购彩需理性，量力而行。
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(RecommendedNumbers)
