import { quickACValue } from '../../utils/acValueCalculator';
import { quickIntervalCheck, SSQ_INTERVAL_CONFIG, DLT_INTERVAL_CONFIG } from '../../utils/intervalAnalyzer';
import { BadgeAlert } from 'lucide-react';

interface QuickAnalysisProps {
  redBalls: number[];
  lotteryType: string; // '双色球' or '大乐透'
}

export function QuickAnalysis({ redBalls, lotteryType }: QuickAnalysisProps) {
  if (redBalls.length < 3) return null;

  const isSSQ = lotteryType === '双色球';
  const acValue = redBalls.length >= 6 ? quickACValue(redBalls) : null;
  const intervalCheck = quickIntervalCheck(
    redBalls,
    isSSQ ? SSQ_INTERVAL_CONFIG : DLT_INTERVAL_CONFIG
  );

  const getACColor = () => {
    if (!acValue) return 'text-gray-400';
    if (isSSQ) {
      if (acValue >= 7 && acValue <= 9) return 'text-green-400';
      if (acValue >= 6 && acValue <= 10) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (acValue >= 6 && acValue <= 8) return 'text-green-400';
      if (acValue >= 5 && acValue <= 9) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  const getIntervalColor = () => {
    return intervalCheck.isBalanced ? 'text-green-400' : 'text-yellow-400';
  };

  return (
    <div className="mx-4 mb-4 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <BadgeAlert className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-white">实时分析</span>
      </div>

      <div className="flex gap-4 flex-wrap">
        {acValue !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">AC值:</span>
            <span className={`text-lg font-bold ${getACColor()}`}>{acValue}</span>
            {acValue >= (isSSQ ? 7 : 6) && acValue <= (isSSQ ? 9 : 8) && (
              <span className="text-xs px-1.5 py-0.5 bg-green-500/30 text-green-300 rounded">优</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">区间:</span>
          <span className={`text-sm font-bold ${getIntervalColor()}`}>{intervalCheck.ratio}</span>
          {intervalCheck.isBalanced && (
            <span className="text-xs px-1.5 py-0.5 bg-green-500/30 text-green-300 rounded">均衡</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">和值:</span>
          <span className="text-sm font-bold text-white">
            {redBalls.reduce((a, b) => a + b, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
