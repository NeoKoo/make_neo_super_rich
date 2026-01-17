import { CopyButton } from '../common/CopyButton';
import { NumberBall } from './NumberBall';

interface SelectedNumbersProps {
  redBalls: number[];
  blueBalls: number[];
  onClear: () => void;
  lotteryType: string;
  isComplete: boolean;
  onSave: () => void;
  onRandom: () => void;
}

export function SelectedNumbers({
  redBalls,
  blueBalls,
  onClear,
  lotteryType,
  isComplete,
  onSave,
  onRandom
}: SelectedNumbersProps) {
  const redLabel = lotteryType === '双色球' ? '红球' : '前区';
  const blueLabel = lotteryType === '双色球' ? '蓝球' : '后区';

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 z-30 pb-safe">
      <div className="px-4 py-3">
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

          <div className="flex gap-2">
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
