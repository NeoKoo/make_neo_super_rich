import { memo, useState } from 'react'
import type { PlumBlossomAnalysis } from '../../types/plumBlossom'
import { Sparkles, ChevronDown, ChevronUp, Info, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TRIGRAM_DETAILS, MOVING_LINE_INTERPRETATIONS } from '../../constants/plumBlossom'

interface PlumBlossomCardProps {
  analysis: PlumBlossomAnalysis
}

export function PlumBlossomCard({ analysis }: PlumBlossomCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { hexagram, tiYongRelation, confidence, interpretation, advice } = analysis

  // 获取卦象详细信息
  const upperDetails = TRIGRAM_DETAILS[hexagram.upperTrigram.name]
  const lowerDetails = TRIGRAM_DETAILS[hexagram.lowerTrigram.name]
  const movingLineInfo = MOVING_LINE_INTERPRETATIONS[hexagram.movingLine]

  // 获取运势趋势图标
  const getTrendIcon = () => {
    if (tiYongRelation.isFavorable && confidence >= 80) {
      return <TrendingUp className="w-4 h-4 text-green-400" />
    } else if (tiYongRelation.isFavorable) {
      return <TrendingUp className="w-4 h-4 text-yellow-400" />
    } else if (confidence >= 60) {
      return <Minus className="w-4 h-4 text-gray-400" />
    } else {
      return <TrendingDown className="w-4 h-4 text-red-400" />
    }
  }

  return (
    <div className="bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-purple-500/10 rounded-2xl border border-pink-400/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-pink-300" />
          </div>
          <div className="text-left">
            <div className="text-base font-bold text-white">梅花易数</div>
            <div className="text-xs text-pink-300/80">北宋邵雍创立，时间起卦</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-sm font-semibold text-pink-300">{confidence}%</span>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-pink-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-pink-300" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-pink-400/20 animate-[fadeIn_0.3s_ease-out]">
          {/* 卦象展示 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white">卦象</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-pink-300">{hexagram.name}</span>
                {hexagram.movingLine > 0 && (
                  <span className="text-xs bg-pink-500/30 px-2 py-1 rounded text-pink-200">
                    动爻：第{hexagram.movingLine}爻
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-4">
              {/* 上卦 */}
              <div className="text-center">
                <div className="text-4xl mb-2">{hexagram.upperTrigram.symbol}</div>
                <div className="text-sm font-semibold text-white">{hexagram.upperTrigram.name}卦</div>
                <div className="text-xs text-pink-200/60">{hexagram.upperTrigram.nature}</div>
                <div className="text-xs text-pink-200/80 mt-1">{hexagram.upperTrigram.wuxing}</div>
              </div>

              <div className="text-3xl text-pink-400">☰</div>

              {/* 下卦 */}
              <div className="text-center">
                <div className="text-4xl mb-2">{hexagram.lowerTrigram.symbol}</div>
                <div className="text-sm font-semibold text-white">{hexagram.lowerTrigram.name}卦</div>
                <div className="text-xs text-pink-200/60">{hexagram.lowerTrigram.nature}</div>
                <div className="text-xs text-pink-200/80 mt-1">{hexagram.lowerTrigram.wuxing}</div>
              </div>
            </div>

            {/* 卦辞 */}
            <div className="text-center text-sm text-pink-200/80 italic">
              "{hexagram.description}"
            </div>
          </div>

          {/* 动爻解读 */}
          {hexagram.movingLine > 0 && (
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-pink-300" />
                <div className="text-sm font-semibold text-white">动爻解读</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pink-200/60">位置</span>
                  <span className="text-sm text-pink-200">{movingLineInfo.position}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pink-200/60">含义</span>
                  <span className="text-sm text-pink-200">{movingLineInfo.meaning}</span>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-xs text-pink-200/60 flex-shrink-0">建议</span>
                  <span className="text-sm text-pink-200">{movingLineInfo.advice}</span>
                </div>
              </div>
            </div>
          )}

          {/* 体用关系 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-pink-300" />
              <div className="text-sm font-semibold text-white">体用关系</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* 体卦 */}
              <div className="bg-pink-500/10 rounded-lg p-3">
                <div className="text-xs text-pink-200/60 mb-1">体卦（自身）</div>
                <div className="text-base font-semibold text-white">{tiYongRelation.tiTrigram.name}</div>
                <div className="text-xs text-pink-200/80 mt-1">
                  {upperDetails.description.slice(0, 20)}...
                </div>
              </div>

              {/* 用卦 */}
              <div className="bg-purple-500/10 rounded-lg p-3">
                <div className="text-xs text-purple-200/60 mb-1">用卦（外界）</div>
                <div className="text-base font-semibold text-white">{tiYongRelation.yongTrigram.name}</div>
                <div className="text-xs text-purple-200/80 mt-1">
                  {lowerDetails.description.slice(0, 20)}...
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-pink-200/80">五行关系：</span>
                <span className={`text-sm font-semibold ${tiYongRelation.isFavorable ? 'text-green-400' : 'text-red-400'}`}>
                  {tiYongRelation.relationship}
                </span>
              </div>
              {tiYongRelation.isFavorable ? (
                <div className="flex items-center gap-1 text-green-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">吉利</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">需谨慎</span>
                </div>
              )}
            </div>
          </div>

          {/* 八卦详细属性 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm font-semibold text-white mb-3">八卦属性</div>

            <div className="space-y-3">
              {/* 上卦属性 */}
              <div>
                <div className="text-xs text-pink-200/60 mb-2">{hexagram.upperTrigram.name}卦（{hexagram.upperTrigram.wuxing}）</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-pink-200/60">特性：</span>
                    <span className="text-pink-200">{upperDetails.characteristics.join('、')}</span>
                  </div>
                  <div>
                    <span className="text-pink-200/60">吉物：</span>
                    <span className="text-pink-200">{upperDetails.luckyItems.join('、')}</span>
                  </div>
                </div>
                <div className="text-xs text-pink-200/80 mt-2 italic">
                  {upperDetails.lotteryMeaning}
                </div>
              </div>

              {/* 下卦属性 */}
              <div className="border-t border-pink-400/20 pt-3">
                <div className="text-xs text-purple-200/60 mb-2">{hexagram.lowerTrigram.name}卦（{hexagram.lowerTrigram.wuxing}）</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-purple-200/60">特性：</span>
                    <span className="text-purple-200">{lowerDetails.characteristics.join('、')}</span>
                  </div>
                  <div>
                    <span className="text-purple-200/60">吉物：</span>
                    <span className="text-purple-200">{lowerDetails.luckyItems.join('、')}</span>
                  </div>
                </div>
                <div className="text-xs text-purple-200/80 mt-2 italic">
                  {lowerDetails.lotteryMeaning}
                </div>
              </div>
            </div>
          </div>

          {/* 解读和建议 */}
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-pink-300" />
                <div className="text-sm font-semibold text-white">卦象解读</div>
              </div>
              <div className="text-sm text-pink-200/80 leading-relaxed">
                {interpretation}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-pink-300" />
                <div className="text-sm font-semibold text-white">选号建议</div>
              </div>
              <div className="text-sm text-pink-200/80 leading-relaxed">
                {advice}
              </div>
            </div>
          </div>

          {/* 免责声明 */}
          <div className="bg-pink-500/10 rounded-xl p-3 border border-pink-500/20">
            <div className="text-xs text-pink-200/60 text-center">
              ⚠️ 梅花易数仅供娱乐参考，不构成购彩建议。购彩需理性，量力而行。
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(PlumBlossomCard)
