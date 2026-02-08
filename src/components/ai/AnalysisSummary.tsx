import { memo } from 'react'
import { EnhancedLotteryRecommendation } from '../../types/ai'
import { Sparkles, Clock, Zap, Star, Flame, Target, Lightbulb } from 'lucide-react'

interface AnalysisSummaryProps {
  recommendation: EnhancedLotteryRecommendation
}

function AnalysisSummary({ recommendation }: AnalysisSummaryProps) {
  const getFortuneLevelColor = (level: string) => {
    switch (level) {
      case '大吉':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case '吉':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
      case '中吉':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case '平':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      case '凶':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getEnergyLevelColor = (level: number) => {
    if (level >= 90) return 'from-green-500 to-emerald-500'
    if (level >= 75) return 'from-yellow-500 to-orange-500'
    if (level >= 60) return 'from-blue-500 to-cyan-500'
    return 'from-gray-500 to-slate-500'
  }

  return (
    <div className="space-y-4">
      {/* 整体分析 */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">整体分析</h3>
        </div>
        
        {/* 运势等级 */}
        {recommendation.overallAnalysis.fortuneLevel && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-purple-200/80">运势等级</span>
            <div className={`px-3 py-1 rounded-lg border ${getFortuneLevelColor(recommendation.overallAnalysis.fortuneLevel)}`}>
              <span className="text-sm font-semibold">{recommendation.overallAnalysis.fortuneLevel}</span>
            </div>
          </div>
        )}

        {/* 分析摘要 */}
        <div className="mb-3 p-3 bg-white/5 dark:bg-gray-800/30 rounded-lg">
          <p className="text-sm text-white leading-relaxed">
            {recommendation.overallAnalysis.summary}
          </p>
        </div>

        {/* 关键影响因素 */}
        <div className="mb-3">
          <div className="text-xs text-purple-200/80 mb-2">关键影响因素</div>
          <div className="flex flex-wrap gap-1.5">
            {recommendation.overallAnalysis.keyFactors.map((factor, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        {/* 购彩建议 */}
        <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
          <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-blue-300 mb-1">购彩建议</div>
            <p className="text-sm text-white leading-relaxed">
              {recommendation.overallAnalysis.advice}
            </p>
          </div>
        </div>

        {/* 最佳购彩时机 */}
        <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <Clock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-green-300 mb-1">最佳购彩时机</div>
            <p className="text-sm text-white leading-relaxed">
              {recommendation.overallAnalysis.bestTiming}
            </p>
          </div>
        </div>
      </div>

      {/* 玄学洞察 */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">玄学洞察</h3>
        </div>

        {/* 能量指数 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-200/80">当日能量指数</span>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-amber-300">
                {recommendation.metaphysicsInsight.energyLevel}%
              </div>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getEnergyLevelColor(recommendation.metaphysicsInsight.energyLevel)}`} />
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getEnergyLevelColor(recommendation.metaphysicsInsight.energyLevel)} transition-all duration-500`}
              style={{ width: `${recommendation.metaphysicsInsight.energyLevel}%` }}
            />
          </div>
        </div>

        {/* 星座影响 */}
        <div className="mb-3 p-3 bg-white/5 dark:bg-gray-800/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-yellow-300 mb-1">星座影响</div>
              <p className="text-sm text-white leading-relaxed">
                {recommendation.metaphysicsInsight.zodiacInfluence}
              </p>
            </div>
          </div>
        </div>

        {/* 五行平衡 */}
        <div className="mb-3 p-3 bg-white/5 dark:bg-gray-800/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-red-300 mb-1">五行平衡</div>
              <p className="text-sm text-white leading-relaxed">
                {recommendation.metaphysicsInsight.wuxingBalance}
              </p>
            </div>
          </div>
        </div>

        {/* 数字命理模式 */}
        <div className="p-3 bg-white/5 dark:bg-gray-800/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-blue-300 mb-1">数字命理模式</div>
              <p className="text-sm text-white leading-relaxed">
                {recommendation.metaphysicsInsight.numerologyPattern}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(AnalysisSummary)
