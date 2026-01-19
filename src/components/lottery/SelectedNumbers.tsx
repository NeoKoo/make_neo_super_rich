import { CopyButton } from '../common/CopyButton';
import { NumberBall } from './NumberBall';
import { Trash2, Save, Dices } from 'lucide-react';

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
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      {/* 玻璃背景 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/95 to-background-secondary/80 backdrop-blur-xl border-t border-white/10" />

      <div className="px-4 py-2 sm:py-3 pt-4 relative">
        <div className="flex items-center justify-between gap-3">
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

          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gray-700/80 hover:bg-gray-600 text-white text-xs sm:text-sm transition-all duration-300 hover:scale-105"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">清除</span>
            </button>

            <button
              onClick={onRandom}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
            >
              <Dices className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">随机</span>
            </button>

            <button
              onClick={onSave}
              disabled={!isComplete}
              className={`
                flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300
                ${isComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/25 hover:scale-105'
                  : 'bg-gray-600/80 text-text-muted cursor-not-allowed'
                }
              `}
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">保存</span>
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
