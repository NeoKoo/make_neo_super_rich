import { IntervalConfig, calculateIntervalDistribution, analyzeIntervalDistribution } from '../../../utils/intervalAnalyzer';
import { NumberBall } from '../../lottery/NumberBall';
import { BarChart3, Target, TrendingUp } from 'lucide-react';

interface IntervalDistributionProps {
  numbers: number[];
  lotteryType: string; // 'ssq' or 'dlt'
}

export function IntervalDistribution({ numbers, lotteryType }: IntervalDistributionProps) {
  const config: IntervalConfig =
    lotteryType === 'ssq'
      ? {
          lotteryType: 'ssq',
          intervals: {
            small: [1, 11],
            medium: [12, 22],
            large: [23, 33],
          },
        }
      : {
          lotteryType: 'dlt',
          intervals: {
            small: [1, 12],
            medium: [13, 24],
            large: [25, 35],
          },
        };

  const analysis = analyzeIntervalDistribution(numbers, config);

  const getIntervalColor = (type: 'small' | 'medium' | 'large') => {
    switch (type) {
      case 'small':
        return 'from-blue-500 to-cyan-500';
      case 'medium':
        return 'from-purple-500 to-pink-500';
      case 'large':
        return 'from-orange-500 to-red-500';
    }
  };

  const getIntervalLabel = (type: 'small' | 'medium' | 'large') => {
    switch (type) {
      case 'small':
        return '小区';
      case 'medium':
        return '中区';
      case 'large':
        return '大区';
    }
  };

  const getIntervalRange = (type: 'small' | 'medium' | 'large') => {
    const [min, max] = config.intervals[type];
    return `${min.toString().padStart(2, '0')}-${max}`;
  };

  const idealRatio = Math.round(numbers.length / 3);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">区间分布分析</h3>
        </div>
        <p className="text-white/90 text-sm">
          分析号码在不同区间的分布是否均衡
        </p>
      </div>

      {/* Score Card */}
      <div
        className={`bg-gradient-to-r ${
          analysis.isBalanced
            ? 'from-green-500/20 to-emerald-500/20 border border-green-500/30'
            : analysis.isExtreme
            ? 'from-red-500/20 to-orange-500/20 border border-red-500/30'
            : 'from-yellow-500/20 to-amber-500/20 border border-yellow-500/30'
        } rounded-xl p-4 backdrop-blur-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {analysis.isBalanced ? (
              <Target className="w-8 h-8 text-green-400" />
            ) : analysis.isExtreme ? (
              <TrendingUp className="w-8 h-8 text-red-400" />
            ) : (
              <BarChart3 className="w-8 h-8 text-yellow-400" />
            )}
            <div>
              <div className="text-white/80 text-sm">均衡度评分</div>
              <div className="text-3xl font-bold text-white">{analysis.balanceScore}</div>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.isBalanced
                  ? 'bg-green-500 text-white'
                  : analysis.isExtreme
                  ? 'bg-red-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              {analysis.isBalanced ? '均衡' : analysis.isExtreme ? '极端' : '一般'}
            </div>
            <div className="text-white/60 text-xs mt-1">
              分布比例: {analysis.distribution.ratio}
            </div>
          </div>
        </div>

        {analysis.recommendation && (
          <div className="mt-3 p-2 bg-white/10 rounded-lg">
            <p className="text-white/90 text-sm">{analysis.recommendation}</p>
          </div>
        )}
      </div>

      {/* Interval Distribution Chart */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
        <h4 className="font-bold text-white mb-4">区间分布详情</h4>

        <div className="space-y-4">
          {(['small', 'medium', 'large'] as const).map((type) => {
            const count = analysis.distribution[type];
            const percentage = (count / numbers.length) * 100;
            const diff = count - idealRatio;

            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded bg-gradient-to-r ${getIntervalColor(type)}`}
                    />
                    <span className="text-white font-medium">{getIntervalLabel(type)}</span>
                    <span className="text-white/60">({getIntervalRange(type)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{count}个</span>
                    <span className="text-white/60">
                      ({percentage.toFixed(1)}%)
                    </span>
                    {diff !== 0 && (
                      <span
                        className={`text-xs ${
                          diff > 0 ? 'text-red-400' : 'text-blue-400'
                        }`}
                      >
                        {diff > 0 ? '+' : ''}
                        {diff}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getIntervalColor(type)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Ideal line indicator */}
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>
                    理想值: {idealRatio}个 ({((idealRatio / numbers.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual representation */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-white/80 text-sm mb-3">号码分布可视化</div>
          <div className="flex items-center gap-1 h-12 bg-white/5 rounded-lg overflow-hidden">
            {Array.from({ length: lotteryType === 'ssq' ? 33 : 35 }, (_, i) => i + 1).map(
              (num) => {
                let interval: 'small' | 'medium' | 'large';
                if (num >= config.intervals.small[0] && num <= config.intervals.small[1]) {
                  interval = 'small';
                } else if (
                  num >= config.intervals.medium[0] &&
                  num <= config.intervals.medium[1]
                ) {
                  interval = 'medium';
                } else {
                  interval = 'large';
                }

                const isSelected = numbers.includes(num);

                return (
                  <div
                    key={num}
                    className={`flex-1 h-full ${isSelected ? `bg-gradient-to-t ${getIntervalColor(interval)}` : 'bg-white/5'} transition-all`}
                    title={`${num} ${isSelected ? `(已选)` : ''}`}
                  />
                );
              }
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/60">
            <span>01</span>
            <span>
              {lotteryType === 'ssq' ? '11' : '12'}
            </span>
            <span>
              {lotteryType === 'ssq' ? '22' : '24'}
            </span>
            <span>
              {lotteryType === 'ssq' ? '33' : '35'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected numbers by interval */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
        <h4 className="font-bold text-white mb-3">各区间选号</h4>
        <div className="space-y-3">
          {(['small', 'medium', 'large'] as const).map((type) => {
            const [min, max] = config.intervals[type];
            const intervalNumbers = numbers.filter((n) => n >= min && n <= max);

            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${getIntervalColor(type)}`}
                  />
                  <span className="text-white/80">{getIntervalLabel(type)}</span>
                  <span className="text-white/60">({getIntervalRange(type)})</span>
                  <span className="ml-auto text-white font-bold">{intervalNumbers.length}个</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {intervalNumbers.length > 0 ? (
                    intervalNumbers.map((num) => (
                      <NumberBall
                        key={num}
                        number={num}
                        selected={true}
                        color="red"
                        onClick={() => {}}
                        size="sm"
                      />
                    ))
                  ) : (
                    <div className="text-white/40 text-sm">未选择</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
        <div className="text-xs text-blue-200/80 space-y-1">
          <div className="font-bold text-blue-300 mb-2">💡 推荐分布比例</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>
              <strong>均衡分布：</strong>
              {numbers.length === 6 ? '2:2:2 或 3:2:1' : '2:2:1'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>
              <strong>避免：</strong>超过2/3的号码集中在一个区间
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
