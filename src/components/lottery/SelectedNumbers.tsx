import { CopyButton } from '../common/CopyButton';
import { NumberBall } from './NumberBall';
import { TreasureBowl } from '../animation/TreasureBowl';

interface SelectedNumbersProps {
  redBalls: number[];
  blueBalls: number[];
  onClear: () => void;
  lotteryType: string;
  isComplete: boolean;
  onSave: () => void;
  onRandom: () => void;
  isExploding?: boolean;
  onExplosionEnd?: () => void;
}

export function SelectedNumbers({
  redBalls,
  blueBalls,
  onClear,
  lotteryType,
  isComplete,
  onSave,
  onRandom,
  isExploding = false,
  onExplosionEnd
}: SelectedNumbersProps) {
  const redLabel = lotteryType === '双色球' ? '红球' : '前区';
  const blueLabel = lotteryType === '双色球' ? '蓝球' : '后区';
  const isFull = isComplete;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 z-30 pb-safe">
      {/* 聚宝盆 */}
      {!isExploding && (
        <div className="absolute -top-32 left-1/2 -translate-x-1/2">
          <TreasureBowl 
            isFull={isFull} 
            isExploding={isExploding}
            onExplosionEnd={onExplosionEnd}
          />
        </div>
      )}
      
      <div className="px-4 py-3 pt-28">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            {redBalls.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-text-secondary whitespace-nowrap">{redLabel}:</span>
                <div className="flex gap-1.5">
                  {redBalls.map(num => (
                    <NumberBall
                      key={`red-${num}`}
                      number={num}
                      selected={true}
                      color="red"
                      onClick={() => { }}
                      size="xs"
                    />
                  ))}
                </div>
              </div>
            )}

            {blueBalls.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary whitespace-nowrap">{blueLabel}:</span>
                <div className="flex gap-1.5">
                  {blueBalls.map(num => (
                    <NumberBall
                      key={`blue-${num}`}
                      number={num}
                      selected={true}
                      color="blue"
                      onClick={() => { }}
                      size="xs"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onClear}
              className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
            >
              清除
            </button>

            <button
              onClick={onRandom}
              className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors"
            >
              🎲 随机
            </button>

            <button
              onClick={onSave}
              disabled={!isComplete}
              className={`
                px-3 py-2 rounded-lg text-sm font-semibold transition-colors
                ${isComplete
                  ? 'bg-success hover:bg-green-600 text-white'
                  : 'bg-gray-600 text-text-muted cursor-not-allowed'
                }
              `}
            >
              💾 保存
            </button>

            <CopyButton
              numbers={{ redBalls, blueBalls }}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
