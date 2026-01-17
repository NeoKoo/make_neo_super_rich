import { CopyButton } from '../common/CopyButton';

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
    <div className="fixed bottom-16 left-0 right-0 bg-background-secondary border-t border-white/10 z-30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            {redBalls.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-text-secondary">{redLabel}:</span>
                {redBalls.map(num => (
                  <span 
                    key={num}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-gradient-to-br from-red-500 to-red-700 text-white shadow-ball-normal"
                  >
                    {num.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>
            )}
            
            {blueBalls.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">{blueLabel}:</span>
                {blueBalls.map(num => (
                  <span 
                    key={num}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-ball-normal"
                  >
                    {num.toString().padStart(2, '0')}
                  </span>
                ))}
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
