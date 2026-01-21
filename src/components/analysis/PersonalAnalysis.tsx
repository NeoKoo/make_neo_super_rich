import { type PersonalAnalysis } from '../../types/analysis';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

interface PersonalAnalysisProps {
  analysis: PersonalAnalysis;
}

export function PersonalAnalysis({ analysis }: PersonalAnalysisProps) {
  const { totalSelections, winningCount, winningRate, bestStrategy, selectionPattern } = analysis;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        个人选号分析
      </h3>
      
      {/* 统计概览 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-300" />
            <span className="text-sm text-text-secondary">总选号次数</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{totalSelections}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-green-300" />
            <span className="text-sm text-text-secondary">中奖次数</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{winningCount}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-300" />
            <span className="text-sm text-text-secondary">中奖率</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {(winningRate * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-sm text-text-secondary">最佳策略</span>
          </div>
          <div className="text-lg font-bold text-text-primary truncate">
            {getStrategyDisplayName(bestStrategy)}
          </div>
        </div>
      </div>
      
      {/* 选号模式分析 */}
      <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-xl p-4 backdrop-blur-sm border border-white/10">
        <h4 className="font-semibold text-text-primary mb-3">选号模式分析</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">奇偶比例偏好</span>
            <span className="text-sm font-medium text-text-primary">
              {(selectionPattern.oddEvenRatio * 100).toFixed(0)}% 奇数
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">和值范围</span>
            <span className="text-sm font-medium text-text-primary">
              {selectionPattern.sumRange[0]} - {selectionPattern.sumRange[1]}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">连号倾向</span>
            <span className={`text-sm font-medium ${
              selectionPattern.consecutiveNumbers ? 'text-green-400' : 'text-gray-400'
            }`}>
              {selectionPattern.consecutiveNumbers ? '喜欢连号' : '避免连号'}
            </span>
          </div>
        </div>
      </div>
      
      {/* 常选号码 */}
      {selectionPattern.favoriteNumbers.length > 0 && (
        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <h4 className="font-semibold text-text-primary mb-3">常选号码</h4>
          <div className="flex flex-wrap gap-2">
            {selectionPattern.favoriteNumbers.map(num => (
              <div
                key={num}
                className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-sm font-medium text-primary"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 最近选号记录 */}
      {analysis.recentSelections.length > 0 && (
        <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <h4 className="font-semibold text-text-primary mb-3">最近选号记录</h4>
          <div className="space-y-2">
            {analysis.recentSelections.slice(-5).reverse().map((record, index) => (
              <div key={record.timestamp} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">#{index + 1}</span>
                  <span className="text-text-secondary">
                    {record.numbers.redBalls.join(', ')} + {record.numbers.blueBalls.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-xs">
                    {getStrategyDisplayName(record.strategyType)}
                  </span>
                  {record.won && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      中奖
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getStrategyDisplayName(strategy: string): string {
  const strategyNames: Record<string, string> = {
    'balanced_odd_even': '平衡奇偶',
    'sum_range': '和值范围',
    'full_random': '完全随机',
    'ai_god': 'AI财神推荐',
    'manual': '手动选号'
  };
  
  return strategyNames[strategy] || strategy;
}