import { HistoryRecord } from '../../types/history';
import { CopyButton } from '../common/CopyButton';
import { ScratchCard } from '../scratch/ScratchCard';
import { NumberBall } from '../lottery/NumberBall';
import { useState } from 'react';

interface HistoryItemProps {
  record: HistoryRecord;
  onDelete: () => void;
}

export function HistoryItem({ record, onDelete }: HistoryItemProps) {
  const [revealed, setRevealed] = useState(false);

  const date = new Date(record.timestamp);
  const dateStr = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const redLabel = record.lotteryType === '双色球' ? '红球' : '前区';
  const blueLabel = record.lotteryType === '双色球' ? '蓝球' : '后区';

  const handleReveal = () => {
    setRevealed(true);
  };

  return (
    <div className="bg-background-secondary rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">📅 {dateStr}</span>
          <button
            onClick={onDelete}
            className="text-text-secondary hover:text-status-error transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0111.138 14H9.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">彩票类型：</span>
          <span className="px-2 py-0.5 bg-primary rounded text-white text-xs">
            {record.lotteryType}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-text-secondary mb-2">您的号码：</div>

          <div className="mb-2 flex items-center flex-wrap gap-1">
            <span className="text-sm text-text-secondary mr-2">{redLabel}：</span>
            {record.numbers.redBalls.map((num) => (
              <NumberBall
                key={`hist-user-red-${num}`}
                number={num}
                selected={true}
                color="red"
                onClick={() => { }}
                size="xs"
                matched={record.drawNumbers?.redBalls.includes(num)}
              />
            ))}
          </div>

          <div className="flex items-center flex-wrap gap-1">
            <span className="text-sm text-text-secondary mr-2">{blueLabel}：</span>
            {record.numbers.blueBalls.map((num) => (
              <NumberBall
                key={`hist-user-blue-${num}`}
                number={num}
                selected={true}
                color="blue"
                onClick={() => { }}
                size="xs"
                matched={record.drawNumbers?.blueBalls.includes(num)}
              />
            ))}
          </div>
        </div>

        {record.drawNumbers ? (
          <div className="mb-4">
            <ScratchCard
              coverText={`刮开查看${record.lotteryType}开奖号码`}
              revealed={revealed}
              onReveal={handleReveal}
            >
              <div className="min-h-[200px] p-3 bg-yellow-500/10 rounded-lg border-l-4 border-yellow-500">
                <div className="text-sm text-yellow-500 font-semibold mb-2">🎯 开奖号码：</div>

                <div className="mb-2 flex items-center flex-wrap gap-1">
                  <span className="text-sm text-text-secondary mr-2">{redLabel}：</span>
                  {record.drawNumbers.redBalls.map(num => (
                    <NumberBall
                      key={`hist-draw-red-${num}`}
                      number={num}
                      selected={true}
                      color="red"
                      onClick={() => { }}
                      size="xs"
                    />
                  ))}
                </div>

                <div className="flex items-center flex-wrap gap-1">
                  <span className="text-sm text-text-secondary mr-2">{blueLabel}：</span>
                  {record.drawNumbers.blueBalls.map(num => (
                    <NumberBall
                      key={`hist-draw-blue-${num}`}
                      number={num}
                      selected={true}
                      color="blue"
                      onClick={() => { }}
                      size="xs"
                    />
                  ))}
                </div>

                {revealed && record.matchCount && (
                  <div className="mt-3 pt-3 border-t border-yellow-500/20">
                    <div className="text-sm">
                      🏆 {record.prize || '未中奖'}
                      <span className="ml-2 text-text-secondary">
                        （命中 {record.matchCount.red} 个{redLabel}，{record.matchCount.blue} 个{blueLabel}）
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScratchCard>
          </div>
        ) : (
          <div className="mb-4 p-3 text-center text-text-secondary">
            ⏳ 未开奖
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <CopyButton
          numbers={record.numbers}
          variant="ghost"
        />
      </div>
    </div>
  );
}
