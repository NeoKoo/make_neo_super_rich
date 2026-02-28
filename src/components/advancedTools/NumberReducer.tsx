import { useState } from 'react';
import { NumberBall } from '../lottery/NumberBall';
import { NumberReducer, NumberPool, ReductionResult } from '../../utils/numberReducer';
import { Settings, TrendingDown, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

interface NumberReducerProps {
  lotteryType: string; // 'ssq' or 'dlt'
  onApply?: (combinations: Array<{ redBalls: number[]; blueBalls: number[] }>) => void;
}

export function NumberReducer({ lotteryType, onApply }: NumberReducerProps) {
  const [selectedRedBalls, setSelectedRedBalls] = useState<number[]>([]);
  const [selectedBlueBalls, setSelectedBlueBalls] = useState<number[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('balanced');
  const [reductionResult, setReductionResult] = useState<ReductionResult | null>(null);
  const [isReducing, setIsReducing] = useState(false);

  const redBallRange = lotteryType === 'ssq' ? 33 : 35;
  const blueBallRange = lotteryType === 'ssq' ? 16 : 12;

  const presets = NumberReducer.getPresetFilters(lotteryType);
  const presetNames = Object.keys(presets);

  const handleRedBallClick = (number: number) => {
    setSelectedRedBalls((prev) => {
      if (prev.includes(number)) {
        return prev.filter((n) => n !== number);
      } else if (prev.length < 20) {
        // 最多选20个
        return [...prev, number].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  const handleBlueBallClick = (number: number) => {
    setSelectedBlueBalls((prev) => {
      if (prev.includes(number)) {
        return prev.filter((n) => n !== number);
      } else if (prev.length < 10) {
        // 最多选10个
        return [...prev, number].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  const handleReduce = async () => {
    if (selectedRedBalls.length < 6 || selectedBlueBalls.length < 1) {
      alert('请至少选择6个红球和1个蓝球');
      return;
    }

    setIsReducing(true);

    // 模拟异步计算
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reducer = new NumberReducer(lotteryType);
    const pool: NumberPool = {
      redBalls: selectedRedBalls,
      blueBalls: selectedBlueBalls,
    };

    const filter = presets[selectedPreset];
    const result = reducer.reduce(pool, filter);

    setReductionResult(result);
    setIsReducing(false);
  };

  const handleApply = () => {
    if (reductionResult && onApply) {
      onApply(reductionResult.combinations);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">号码缩水工具</h3>
        </div>
        <p className="text-white/90 text-sm">
          将复式投注转换为优化组合，大幅降低投注成本
        </p>
      </div>

      {/* Preset Selection */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
        <h4 className="font-bold text-white mb-3">选择缩水方案</h4>
        <div className="grid grid-cols-3 gap-2">
          {presetNames.map((name) => {
            const preset = presets[name];
            return (
              <button
                key={name}
                onClick={() => setSelectedPreset(name)}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedPreset === name
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                <div className="font-medium text-sm">{name}</div>
                <div className="text-xs mt-1 opacity-80">{preset.name}</div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-sm text-white/60">
          {presets[selectedPreset].description}
        </div>
      </div>

      {/* Number Selection */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 space-y-4">
        {/* Red Balls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">
              红球 ({selectedRedBalls.length}/20)
            </h4>
            {selectedRedBalls.length >= 6 && (
              <button
                onClick={() => setSelectedRedBalls([])}
                className="text-xs text-white/60 hover:text-white"
              >
                清空
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
            {Array.from({ length: redBallRange }, (_, i) => i + 1).map((num) => (
              <NumberBall
                key={num}
                number={num}
                selected={selectedRedBalls.includes(num)}
                color="red"
                onClick={handleRedBallClick}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Blue Balls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">
              蓝球 ({selectedBlueBalls.length}/10)
            </h4>
            {selectedBlueBalls.length >= 1 && (
              <button
                onClick={() => setSelectedBlueBalls([])}
                className="text-xs text-white/60 hover:text-white"
              >
                清空
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: blueBallRange }, (_, i) => i + 1).map((num) => (
              <NumberBall
                key={num}
                number={num}
                selected={selectedBlueBalls.includes(num)}
                color="blue"
                onClick={handleBlueBallClick}
                size="sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reduce Button */}
      <button
        onClick={handleReduce}
        disabled={isReducing || selectedRedBalls.length < 6 || selectedBlueBalls.length < 1}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
      >
        {isReducing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            缩水中...
          </>
        ) : (
          <>
            <TrendingDown className="w-5 h-5" />
            开始缩水
          </>
        )}
      </button>

      {/* Results */}
      {reductionResult && (
        <div className="space-y-3">
          {/* Stats */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h4 className="font-bold text-white">缩水完成</h4>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {reductionResult.originalCount}
                </div>
                <div className="text-xs text-white/60">原始组合</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {reductionResult.reducedCount}
                </div>
                <div className="text-xs text-white/60">缩水后</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {reductionResult.reductionRate}%
                </div>
                <div className="text-xs text-white/60">缩水率</div>
              </div>
            </div>

            {/* Cost savings */}
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">节省投注金额</span>
                </div>
                <span className="text-xl font-bold text-green-400">
                  ¥{reductionResult.costSavings.savings}
                </span>
              </div>
              <div className="text-xs text-white/60 mt-1">
                原始: ¥{reductionResult.costSavings.originalCost} → 缩水后: ¥
                {reductionResult.costSavings.reducedCost}
              </div>
            </div>
          </div>

          {/* Apply button */}
          {onApply && (
            <button
              onClick={handleApply}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              应用缩水结果 ({reductionResult.reducedCount}注)
            </button>
          )}

          {/* Preview first few combinations */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
            <h4 className="font-bold text-white mb-3">
              预览 (前{Math.min(5, reductionResult.combinations.length)}组)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {reductionResult.combinations.slice(0, 5).map((combo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                >
                  <span className="text-white/60 text-sm w-8">{index + 1}.</span>
                  <div className="flex flex-wrap gap-1">
                    {combo.redBalls.map((num) => (
                      <NumberBall
                        key={`red-${num}`}
                        number={num}
                        selected={false}
                        color="red"
                        onClick={() => {}}
                        size="xs"
                      />
                    ))}
                    {combo.blueBalls.map((num) => (
                      <NumberBall
                        key={`blue-${num}`}
                        number={num}
                        selected={false}
                        color="blue"
                        onClick={() => {}}
                        size="xs"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {reductionResult.combinations.length > 5 && (
              <div className="text-center text-white/60 text-sm mt-2">
                还有 {reductionResult.combinations.length - 5} 组组合...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-200/80">
            <strong>注意：</strong>号码缩水会过滤掉部分组合，可能影响中奖概率。请根据实际情况选择合适的缩水方案。
          </div>
        </div>
      </div>
    </div>
  );
}
