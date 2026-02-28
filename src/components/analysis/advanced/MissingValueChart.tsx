import { MissingValueAnalysis, MissingValueData } from '../../../types/analysis';
import { NumberBall } from '../../lottery/NumberBall';
import { TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface MissingValueChartProps {
  analysis: MissingValueAnalysis;
  ballType: 'red' | 'blue';
  title?: string;
}

export function MissingValueChart({ analysis, ballType, title }: MissingValueChartProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'superCold' | 'highReplenish'>('all');

  const data = ballType === 'red' ? analysis.red : analysis.blue;
  const superCold = ballType === 'red' ? analysis.superColdRed : analysis.superColdBlue;
  const highReplenish = ballType === 'red' ? analysis.highReplenishRed : analysis.highReplenishBlue;

  const getReplenishColor = (probability: number) => {
    if (probability >= 80) return 'from-green-500 to-emerald-500';
    if (probability >= 60) return 'from-blue-500 to-cyan-500';
    if (probability >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-400';
  };

  const getReplenishLabel = (probability: number) => {
    if (probability >= 80) return '极高';
    if (probability >= 60) return '较高';
    if (probability >= 40) return '中等';
    return '较低';
  };

  const renderNumberCard = (item: MissingValueData) => (
    <div
      key={item.number}
      className="relative group bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/15 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <NumberBall
          number={item.number}
          selected={false}
          color={ballType}
          onClick={() => {}}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium">遗漏 {item.missingPeriods} 期</span>
            {item.isSuperCold && (
              <span className="px-1.5 py-0.5 bg-red-500/30 text-red-300 text-xs rounded">
                超冷
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span>平均: {item.avgMissingPeriods}期</span>
            <span>•</span>
            <span>理论: {item.theoreticalCycle}期</span>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${getReplenishColor(
              item.replenishProbability
            )}`}
          >
            {item.replenishProbability}%
          </div>
          <div className="text-xs text-white/60">回补概率</div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        <div>最大遗漏: {item.maxMissingPeriods}期</div>
        <div>回补概率: {getReplenishLabel(item.replenishProbability)}</div>
      </div>
    </div>
  );

  const renderSuperColdNumbers = () => {
    const superColdData = data.filter((d) => d.isSuperCold);
    if (superColdData.length === 0) {
      return (
        <div className="text-center py-8 text-white/60">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>当前没有超冷号码</p>
          <p className="text-sm">超冷号：遗漏超过理论周期2倍</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h4 className="font-bold text-white">超冷号（高回补潜力）</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{superColdData.map(renderNumberCard)}</div>
      </div>
    );
  };

  const renderHighReplenishNumbers = () => {
    const highReplenishData = data
      .filter((d) => highReplenish.includes(d.number))
      .sort((a, b) => b.replenishProbability - a.replenishProbability);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h4 className="font-bold text-white">高回补概率号码</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{highReplenishData.map(renderNumberCard)}</div>
      </div>
    );
  };

  const renderAllNumbers = () => {
    const sortedData = [...data].sort((a, b) => b.replenishProbability - a.replenishProbability);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h4 className="font-bold text-white">
            全部号码（按回补概率排序）
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {sortedData.map(renderNumberCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <span>{title || (ballType === 'red' ? '红球' : '蓝球')}遗漏值分析</span>
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
        <button
          onClick={() => setSelectedTab('all')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            selectedTab === 'all'
              ? 'bg-blue-500 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          全部号码
        </button>
        <button
          onClick={() => setSelectedTab('superCold')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            selectedTab === 'superCold'
              ? 'bg-red-500 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          超冷号 ({superCold.length})
        </button>
        <button
          onClick={() => setSelectedTab('highReplenish')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            selectedTab === 'highReplenish'
              ? 'bg-yellow-500 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          高概率 ({highReplenish.length})
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {selectedTab === 'all' && renderAllNumbers()}
        {selectedTab === 'superCold' && renderSuperColdNumbers()}
        {selectedTab === 'highReplenish' && renderHighReplenishNumbers()}
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-white/60 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <span>回补概率 ≥ 80%：极高</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <span>回补概率 ≥ 60%：较高</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <span>回补概率 ≥ 40%：中等</span>
          </div>
        </div>
      </div>
    </div>
  );
}
