import { memo } from 'react'
import { NumberReason } from '../../types/ai'
import { Sparkles, Star, Flame, Clock, Zap } from 'lucide-react'

interface NumberReasonCardProps {
  reason: NumberReason
}

function NumberReasonCard({ reason }: NumberReasonCardProps) {
  const getReasonIcon = (type: string) => {
    switch (type) {
      case 'metaphysics':
        return <Sparkles className="w-4 h-4" />
      case 'zodiac':
        return <Star className="w-4 h-4" />
      case 'wuxing':
        return <Flame className="w-4 h-4" />
      case 'numerology':
        return <Zap className="w-4 h-4" />
      case 'timing':
        return <Clock className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  const getReasonLabel = (type: string) => {
    switch (type) {
      case 'metaphysics':
        return '玄学'
      case 'zodiac':
        return '星座'
      case 'wuxing':
        return '五行'
      case 'numerology':
        return '命理'
      case 'timing':
        return '时机'
      default:
        return '其他'
    }
  }

  const getReasonColor = (type: string) => {
    switch (type) {
      case 'metaphysics':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'zodiac':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'wuxing':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'numerology':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'timing':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'from-green-500 to-emerald-500'
    if (confidence >= 75) return 'from-yellow-500 to-orange-500'
    if (confidence >= 60) return 'from-blue-500 to-cyan-500'
    return 'from-gray-500 to-slate-500'
  }

  const getBallColor = (type: 'red' | 'blue') => {
    return type === 'red' 
      ? 'bg-gradient-to-br from-red-500 to-red-600' 
      : 'bg-gradient-to-br from-blue-500 to-blue-600'
  }

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 border border-white/10 dark:border-gray-700/50 backdrop-blur-sm">
      {/* 号码展示 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${getBallColor(reason.type)} flex items-center justify-center shadow-lg`}>
            <span className="text-xl font-bold text-white">{reason.number}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {reason.type === 'red' ? '红球' : '蓝球'} {reason.number}
            </div>
            <div className="text-xs text-gray-400">
              置信度: {reason.confidence}%
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getConfidenceColor(reason.confidence)} text-white text-xs font-semibold shadow-md`}>
          {reason.confidence >= 90 ? '极强' : reason.confidence >= 75 ? '强' : reason.confidence >= 60 ? '中' : '一般'}
        </div>
      </div>

      {/* 主要推荐理由 */}
      <div className="mb-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white font-medium leading-relaxed">
            {reason.reasons.primary}
          </p>
        </div>
      </div>

      {/* 详细理由列表 */}
      <div className="space-y-2">
        {Object.entries(reason.reasons)
          .filter(([key]) => key !== 'primary')
          .map(([key, value]) => (
            <div
              key={key}
              className="flex items-start gap-2 p-2 rounded-lg bg-white/5 dark:bg-gray-800/30 hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${getReasonColor(key)} flex-shrink-0`}>
                {getReasonIcon(key)}
                <span className="text-xs font-semibold">{getReasonLabel(key)}</span>
              </div>
              <p className="text-xs text-gray-300 dark:text-gray-400 leading-relaxed flex-1">
                {value}
              </p>
            </div>
          ))}
      </div>

      {/* 幸运元素 */}
      {reason.luckyElements && reason.luckyElements.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10 dark:border-gray-700/50">
          <div className="text-xs text-gray-400 mb-2">幸运元素</div>
          <div className="flex flex-wrap gap-1.5">
            {reason.luckyElements.map((element, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30"
              >
                {element}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(NumberReasonCard)
