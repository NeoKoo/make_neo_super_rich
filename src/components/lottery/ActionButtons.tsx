import { CopyButton } from '../common/CopyButton';
import { Button } from '../common/Button';
import { Trash2, Save, Dices } from 'lucide-react';
import { NumberBall } from './NumberBall';
import { soundManager } from '../../utils/soundManager';

interface ActionButtonsProps {
  redBalls: number[];
  blueBalls: number[];
  onClear: () => void;
  onRandom: () => void;
  onSave: () => void;
  isComplete: boolean;
  lotteryType: string;
  loading?: boolean;
}

export function ActionButtons({
  redBalls,
  blueBalls,
  onClear,
  onRandom,
  onSave,
  isComplete,
  lotteryType,
  loading = false
}: ActionButtonsProps) {
  const redLabel = lotteryType === '双色球' ? '红球' : '前区';
  const blueLabel = lotteryType === '双色球' ? '蓝球' : '后区';

  return (
    <div className="fixed bottom-20 left-0 right-0 z-25 pb-safe">
      <div className="bg-gradient-to-t from-background-secondary/95 to-background-secondary/80 backdrop-blur-xl border-t border-white/10">
        <div className="px-4 py-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              {redBalls.length > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-xs text-text-secondary whitespace-nowrap">{redLabel}:</span>
                  <div className="flex gap-1">
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
                  <span className="text-xs text-text-secondary whitespace-nowrap">{blueLabel}:</span>
                  <div className="flex gap-1">
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

            <div className="flex gap-1.5 flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  soundManager.playNumberClear();
                  onClear();
                }}
                loading={loading}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清除</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  soundManager.playStrategySelect();
                  onRandom();
                }}
                loading={loading}
              >
                <Dices className="w-3.5 h-3.5" />
                <span>随机</span>
              </Button>

              <Button
                variant={isComplete ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  if (isComplete) {
                    soundManager.playSaveSuccess();
                    onSave();
                  }
                }}
                disabled={!isComplete}
                loading={loading}
                className={isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-lg shadow-green-500/25' : ''}
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存</span>
              </Button>

              <CopyButton
                numbers={{ redBalls, blueBalls }}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
