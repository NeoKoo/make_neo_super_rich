import { HotColdAnalysis, NumberFrequency } from '../../types/analysis';
import { NumberBall } from '../lottery/NumberBall';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HotColdNumbersProps {
  analysis: HotColdAnalysis;
  title: string;
  ballType: 'red' | 'blue';
}

export function HotColdNumbers({ analysis, title, ballType }: HotColdNumbersProps) {
  const renderNumberList = (numbers: NumberFrequency[], label: string, icon: React.ReactNode, bgColor: string) => (
    <div className={`${bgColor} rounded-xl p-4 backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-bold text-white">{label}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {numbers.map(freq => (
          <div key={freq.number} className="relative group">
            <NumberBall
              number={freq.number}
              selected={false}
              color={ballType}
              onClick={() => {}}
              size="sm"
            />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              出现 {freq.count} 次 ({(freq.frequency * 100).toFixed(1)}%)
              {freq.missingPeriods > 0 && <div>遗漏 {freq.missingPeriods} 期</div>}
            </div>
          </div>
        ))}
        {numbers.length === 0 && (
          <div className="text-white/60 text-sm">暂无数据</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        <span>{title}</span>
        <span className="text-sm text-text-secondary font-normal">
          (基于最近100期数据)
        </span>
      </h3>
      
      <div className="space-y-3">
        {renderNumberList(
          analysis.hotNumbers,
          '热号 (高频)',
          <TrendingUp className="w-4 h-4 text-red-300" />,
          'bg-gradient-to-br from-red-500/80 to-orange-500/80'
        )}
        
        {renderNumberList(
          analysis.warmNumbers,
          '温号 (中频)',
          <Minus className="w-4 h-4 text-yellow-300" />,
          'bg-gradient-to-br from-yellow-500/80 to-amber-500/80'
        )}
        
        {renderNumberList(
          analysis.coldNumbers,
          '冷号 (低频)',
          <TrendingDown className="w-4 h-4 text-blue-300" />,
          'bg-gradient-to-br from-blue-500/80 to-cyan-500/80'
        )}
      </div>
    </div>
  );
}