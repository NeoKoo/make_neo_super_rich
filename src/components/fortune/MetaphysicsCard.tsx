import { NameAnalysis, ZodiacAnalysis, WuxingAnalysis, NumerologyAnalysis } from '../../types/fortune'
import { ChevronDown, ChevronUp, Sparkles, Star, Flame, Droplets, Wind, Leaf, Mountain } from 'lucide-react'
import { useState } from 'react'

interface MetaphysicsCardProps {
  nameAnalysis: NameAnalysis
  zodiacAnalysis: ZodiacAnalysis
  wuxingAnalysis: WuxingAnalysis
  numerologyAnalysis: NumerologyAnalysis
}

export function MetaphysicsCard({
  nameAnalysis,
  zodiacAnalysis,
  wuxingAnalysis,
  numerologyAnalysis
}: MetaphysicsCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getWuxingIcon = (wuxing: string) => {
    switch (wuxing) {
      case '木':
        return <Leaf className="w-5 h-5" />
      case '火':
        return <Flame className="w-5 h-5" />
      case '土':
        return <Mountain className="w-5 h-5" />
      case '金':
        return <Sparkles className="w-5 h-5" />
      case '水':
        return <Droplets className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  const getWuxingColor = (wuxing: string) => {
    switch (wuxing) {
      case '木':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case '火':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      case '土':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
      case '金':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case '水':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default:
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
    }
  }

  const getFortuneColor = (fortune: string) => {
    switch (fortune) {
      case '大吉':
        return 'text-green-400'
      case '吉':
        return 'text-emerald-400'
      case '中吉':
        return 'text-yellow-400'
      case '平':
        return 'text-gray-400'
      case '凶':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-400/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <div className="text-left">
            <div className="text-base font-bold text-white">玄学分析</div>
            <div className="text-xs text-purple-300/80">基于名字、星座、五行、数字命理</div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-purple-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-300" />
        )}
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-purple-400/20">
          {/* 名字分析 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-purple-300" />
              <div className="text-sm font-semibold text-white">名字分析</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">总笔画数</span>
                <span className="text-base font-bold text-white">{nameAnalysis.totalStrokes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">五行属性</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getWuxingColor(nameAnalysis.wuxing)}`}>
                  {getWuxingIcon(nameAnalysis.wuxing)}
                  <span className="text-sm font-semibold">{nameAnalysis.wuxing}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">吉凶</span>
                <span className={`text-base font-bold ${getFortuneColor(nameAnalysis.fortune)}`}>
                  {nameAnalysis.fortune}
                </span>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80 mb-1">幸运数字</div>
                <div className="flex flex-wrap gap-2">
                  {nameAnalysis.luckyNumbers.map((num, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/30 rounded text-sm text-white font-semibold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80">{nameAnalysis.meaning}</div>
              </div>
            </div>
          </div>

          {/* 星座分析 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-purple-300" />
              <div className="text-sm font-semibold text-white">星座分析</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">星座</span>
                <span className="text-base font-bold text-white">{zodiacAnalysis.sign}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">元素</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
                  zodiacAnalysis.element === '火' ? 'text-red-400 bg-red-500/20 border-red-500/30' :
                  zodiacAnalysis.element === '土' ? 'text-amber-400 bg-amber-500/20 border-amber-500/30' :
                  zodiacAnalysis.element === '风' ? 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' :
                  'text-blue-400 bg-blue-500/20 border-blue-500/30'
                }`}>
                  {zodiacAnalysis.element === '火' && <Flame className="w-4 h-4" />}
                  {zodiacAnalysis.element === '土' && <Mountain className="w-4 h-4" />}
                  {zodiacAnalysis.element === '风' && <Wind className="w-4 h-4" />}
                  {zodiacAnalysis.element === '水' && <Droplets className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{zodiacAnalysis.element}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">今日运势</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-4 rounded-sm ${
                          i <= zodiacAnalysis.todayLuck
                            ? 'bg-gradient-to-t from-purple-500 to-pink-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base font-bold text-white">{zodiacAnalysis.todayLuck}/10</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">幸运方位</span>
                <span className="text-base font-bold text-white">{zodiacAnalysis.luckyDirection}</span>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80 mb-1">幸运数字</div>
                <div className="flex flex-wrap gap-2">
                  {zodiacAnalysis.luckyNumbers.map((num, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/30 rounded text-sm text-white font-semibold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80">{zodiacAnalysis.advice}</div>
              </div>
            </div>
          </div>

          {/* 五行分析 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-purple-300" />
              <div className="text-sm font-semibold text-white">五行分析</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">个人五行</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getWuxingColor(wuxingAnalysis.personalWuxing)}`}>
                  {getWuxingIcon(wuxingAnalysis.personalWuxing)}
                  <span className="text-sm font-semibold">{wuxingAnalysis.personalWuxing}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">今日五行</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getWuxingColor(wuxingAnalysis.todayWuxing)}`}>
                  {getWuxingIcon(wuxingAnalysis.todayWuxing)}
                  <span className="text-sm font-semibold">{wuxingAnalysis.todayWuxing}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">五行关系</span>
                <span className={`text-base font-bold ${
                  wuxingAnalysis.relationship === '相生' ? 'text-green-400' :
                  wuxingAnalysis.relationship === '相克' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {wuxingAnalysis.relationship}
                </span>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80 mb-1">幸运数字</div>
                <div className="flex flex-wrap gap-2">
                  {wuxingAnalysis.luckyNumbers.map((num, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/30 rounded text-sm text-white font-semibold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80">{wuxingAnalysis.advice}</div>
              </div>
            </div>
          </div>

          {/* 数字命理分析 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-purple-300" />
              <div className="text-sm font-semibold text-white">数字命理</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">生命灵数</span>
                <span className="text-base font-bold text-white">{numerologyAnalysis.lifePathNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">今日数字</span>
                <span className="text-base font-bold text-white">{numerologyAnalysis.dailyNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/80">综合数字</span>
                <span className="text-base font-bold text-white">{numerologyAnalysis.combinedNumber}</span>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80 mb-1">幸运数字</div>
                <div className="flex flex-wrap gap-2">
                  {numerologyAnalysis.luckyNumbers.map((num, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/30 rounded text-sm text-white font-semibold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-purple-400/20">
                <div className="text-sm text-purple-200/80">{numerologyAnalysis.meaning}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
