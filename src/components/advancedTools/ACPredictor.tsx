import { useState } from 'react';
import { NumberBall } from '../lottery/NumberBall';
import { calculateACValue, ACValueConfig } from '../../utils/acValueCalculator';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ACPredictorProps {
  numbers: number[];
  lotteryType: string; // 'ssq' or 'dlt'
}

export function ACPredictor({ numbers, lotteryType }: ACPredictorProps) {
  const config: ACValueConfig =
    lotteryType === 'ssq'
      ? { lotteryType: 'ssq', minOptimal: 7, maxOptimal: 9 }
      : { lotteryType: 'dlt', minOptimal: 6, maxOptimal: 8 };

  const result = calculateACValue(numbers, config);

  const getLevelIcon = () => {
    switch (result.level) {
      case 'optimal':
        return <Target className="w-5 h-5 text-green-400" />;
      case 'low':
        return <TrendingDown className="w-5 h-5 text-yellow-400" />;
      case 'high':
        return <TrendingUp className="w-5 h-5 text-red-400" />;
    }
  };

  const getLevelColor = () => {
    switch (result.level) {
      case 'optimal':
        return 'from-green-500/80 to-emerald-500/80';
      case 'low':
        return 'from-yellow-500/80 to-orange-500/80';
      case 'high':
        return 'from-red-500/80 to-pink-500/80';
    }
  };

  const getLevelText = () => {
    switch (result.level) {
      case 'optimal':
        return '最优';
      case 'low':
        return '偏低';
      case 'high':
        return '偏高';
    }
  };

  return (
    <div className="space-y-4">
      <div className={`bg-gradient-to-r ${getLevelColor()} rounded-xl p-4 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getLevelIcon()}
            <h3 className="text-lg font-bold text-white">AC值分析</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{result.acValue}</div>
            <div className="text-xs text-white/80">AC值</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white font-medium">
            {getLevelText()}
          </span>
          <span className="text-white/80 text-sm">
            推荐范围：{config.minOptimal} - {config.maxOptimal}
          </span>
        </div>

        <p className="text-white/90 text-sm">{result.recommendation}</p>
      </div>

      {/* Details */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Minus className="w-4 h-4" />
          详细信息
        </h4>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 mb-1">号码数量</div>
            <div className="text-xl font-bold text-white">{numbers.length}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 mb-1">不重复差值</div>
            <div className="text-xl font-bold text-white">{result.uniqueDifferences}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 mb-1">总差值数</div>
            <div className="text-xl font-bold text-white">{result.differences.length}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 mb-1">质量评分</div>
            <div
              className={`text-xl font-bold ${
                result.level === 'optimal'
                  ? 'text-green-400'
                  : result.level === 'low'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {result.level === 'optimal' ? 'A+' : result.level === 'low' ? 'B' : 'B-'}
            </div>
          </div>
        </div>
      </div>

      {/* Number display */}
      {numbers.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <h4 className="font-bold text-white mb-3">当前号码</h4>
          <div className="flex flex-wrap gap-2">
            {numbers.map((num) => (
              <NumberBall
                key={num}
                number={num}
                selected={true}
                color="red"
                onClick={() => {}}
                size="md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Formula explanation */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="font-bold text-blue-300 mb-2 text-sm">💡 AC值计算公式</h4>
        <p className="text-white/80 text-sm">
          AC值 = 号码个数 - (不同差值个数 + 1)
        </p>
        <p className="text-white/60 text-xs mt-2">
          AC值反映号码组合的复杂程度。推荐选择AC值在最优范围内的组合，可以提高号码的分散性和覆盖率。
        </p>
      </div>
    </div>
  );
}
