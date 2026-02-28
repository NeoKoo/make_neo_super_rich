import { useState } from 'react';
import { SmartFilter as SmartFilterUtil, FilterPreset, FilterSummary } from '../../utils/smartFilter';
import { ReductionFilter } from '../../utils/numberReducer';
import { Filter, CheckCircle2, TrendingUp, Star } from 'lucide-react';

interface SmartFilterProps {
  lotteryType: string; // 'ssq' or 'dlt'
  combinations: Array<{ redBalls: number[]; blueBalls: number[] }>;
  onFilter?: (combinations: Array<{ redBalls: number[]; blueBalls: number[] }>) => void;
}

export function SmartFilter({ lotteryType, combinations, onFilter }: SmartFilterProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('balanced');
  const [customFilter, setCustomFilter] = useState<ReductionFilter>(
    SmartFilterUtil.createCustomFilter()
  );
  const [useCustom, setUseCustom] = useState(false);
  const [filterResult, setFilterResult] = useState<FilterSummary | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const presets = SmartFilter.getPresets(lotteryType);
  const presetNames = Object.keys(presets);

  const handleFilter = async () => {
    setIsFiltering(true);

    // 模拟异步计算
    await new Promise((resolve) => setTimeout(resolve, 500));

    const filterUtil = new SmartFilterUtil(lotteryType);
    const filter = useCustom ? customFilter : presets[selectedPreset].filter;
    const result = filterUtil.applyBatchFilter(combinations, filter);

    setFilterResult(result);
    setIsFiltering(false);
  };

  const handleApply = () => {
    if (filterResult && onFilter) {
      const filteredCombinations = filterResult.topCombinations.map((r) => r.combination);
      onFilter(filteredCombinations);
    }
  };

  const toggleFilterOption = (
    category: keyof ReductionFilter,
    field: string,
    value: any
  ) => {
    setCustomFilter((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const renderCustomFilterControls = () => (
    <div className="space-y-3 p-4 bg-white/5 rounded-lg">
      <h4 className="font-bold text-white mb-3">自定义过滤条件</h4>

      {/* AC Value */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/80">AC值过滤</label>
          <input
            type="checkbox"
            checked={customFilter.acValue?.enabled || false}
            onChange={(e) =>
              toggleFilterOption('acValue', 'enabled', e.target.checked)
            }
            className="w-4 h-4"
          />
        </div>
        {customFilter.acValue?.enabled && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="最小"
              value={customFilter.acValue.min || ''}
              onChange={(e) =>
                toggleFilterOption('acValue', 'min', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
            <input
              type="number"
              placeholder="最大"
              value={customFilter.acValue.max || ''}
              onChange={(e) =>
                toggleFilterOption('acValue', 'max', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
          </div>
        )}
      </div>

      {/* Sum Value */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/80">和值过滤</label>
          <input
            type="checkbox"
            checked={customFilter.sumValue?.enabled || false}
            onChange={(e) =>
              toggleFilterOption('sumValue', 'enabled', e.target.checked)
            }
            className="w-4 h-4"
          />
        </div>
        {customFilter.sumValue?.enabled && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="最小"
              value={customFilter.sumValue.min || ''}
              onChange={(e) =>
                toggleFilterOption('sumValue', 'min', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
            <input
              type="number"
              placeholder="最大"
              value={customFilter.sumValue.max || ''}
              onChange={(e) =>
                toggleFilterOption('sumValue', 'max', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
          </div>
        )}
      </div>

      {/* Odd Even Ratio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/80">奇偶比过滤</label>
          <input
            type="checkbox"
            checked={customFilter.oddEvenRatio?.enabled || false}
            onChange={(e) =>
              toggleFilterOption('oddEvenRatio', 'enabled', e.target.checked)
            }
            className="w-4 h-4"
          />
        </div>
        {customFilter.oddEvenRatio?.enabled && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-white/60">奇数</span>
            <input
              type="number"
              placeholder="最小"
              value={customFilter.oddEvenRatio.minOdd || ''}
              onChange={(e) =>
                toggleFilterOption('oddEvenRatio', 'minOdd', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
            <span className="text-white">-</span>
            <input
              type="number"
              placeholder="最大"
              value={customFilter.oddEvenRatio.maxOdd || ''}
              onChange={(e) =>
                toggleFilterOption('oddEvenRatio', 'maxOdd', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
          </div>
        )}
      </div>

      {/* Span */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/80">跨度过滤</label>
          <input
            type="checkbox"
            checked={customFilter.span?.enabled || false}
            onChange={(e) => toggleFilterOption('span', 'enabled', e.target.checked)}
            className="w-4 h-4"
          />
        </div>
        {customFilter.span?.enabled && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="最小"
              value={customFilter.span.min || ''}
              onChange={(e) =>
                toggleFilterOption('span', 'min', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
            <input
              type="number"
              placeholder="最大"
              value={customFilter.span.max || ''}
              onChange={(e) =>
                toggleFilterOption('span', 'max', parseInt(e.target.value))
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            />
          </div>
        )}
      </div>

      {/* Consecutive */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/80">连号数量限制</label>
          <input
            type="checkbox"
            checked={customFilter.consecutive?.enabled || false}
            onChange={(e) =>
              toggleFilterOption('consecutive', 'enabled', e.target.checked)
            }
            className="w-4 h-4"
          />
        </div>
        {customFilter.consecutive?.enabled && (
          <input
            type="number"
            placeholder="最大连号数"
            value={customFilter.consecutive.maxCount || ''}
            onChange={(e) =>
              toggleFilterOption('consecutive', 'maxCount', parseInt(e.target.value))
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">智能过滤</h3>
        </div>
        <p className="text-white/90 text-sm">
          根据多种条件快速筛选高质量号码组合
        </p>
      </div>

      {/* Input combinations count */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/60 text-sm">待过滤组合</div>
            <div className="text-2xl font-bold text-white">{combinations.length}</div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-sm">号码组</div>
          </div>
        </div>
      </div>

      {/* Preset Selection */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-white">选择过滤方案</h4>
          <button
            onClick={() => setUseCustom(!useCustom)}
            className={`px-3 py-1 rounded text-sm transition-all ${
              useCustom
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            {useCustom ? '自定义' : '预设'}
          </button>
        </div>

        {!useCustom ? (
          <div className="grid grid-cols-2 gap-2">
            {presetNames.map((name) => {
              const preset = presets[name];
              return (
                <button
                  key={name}
                  onClick={() => setSelectedPreset(name)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedPreset === name
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className="text-xs mt-1 opacity-80">{preset.description}</div>
                </button>
              );
            })}
          </div>
        ) : (
          renderCustomFilterControls()
        )}
      </div>

      {/* Filter Button */}
      <button
        onClick={handleFilter}
        disabled={isFiltering || combinations.length === 0}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
      >
        {isFiltering ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            过滤中...
          </>
        ) : (
          <>
            <Filter className="w-5 h-5" />
            开始过滤
          </>
        )}
      </button>

      {/* Results */}
      {filterResult && (
        <div className="space-y-3">
          {/* Stats */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h4 className="font-bold text-white">过滤完成</h4>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {filterResult.totalChecked}
                </div>
                <div className="text-xs text-white/60">检查总数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {filterResult.passedCount}
                </div>
                <div className="text-xs text-white/60">通过过滤</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {filterResult.passRate}%
                </div>
                <div className="text-xs text-white/60">通过率</div>
              </div>
            </div>

            {filterResult.averageScore > 0 && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm">平均质量评分</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-400">
                    {filterResult.averageScore}/100
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Apply button */}
          {onFilter && filterResult.passedCount > 0 && (
            <button
              onClick={handleApply}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              应用过滤结果 ({filterResult.passedCount}组)
            </button>
          )}

          {/* Top combinations */}
          {filterResult.topCombinations.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white">最优组合</h4>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filterResult.topCombinations.slice(0, 5).map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm w-6">
                        {index + 1}
                      </span>
                      <div className="text-sm text-white/80">
                        {result.combination.redBalls.join(', ')} +{' '}
                        {result.combination.blueBalls.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-green-400">
                        {result.score}分
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <Star className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-200/80">
            <strong>提示：</strong>质量评分综合了AC值、奇偶比、区间分布、和值、跨度等多个维度，分数越高表示组合越符合推荐标准。
          </div>
        </div>
      </div>
    </div>
  );
}
