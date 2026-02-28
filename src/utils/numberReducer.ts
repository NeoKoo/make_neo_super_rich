import { ACValueConfig, quickACValue, SSQ_AC_CONFIG, DLT_AC_CONFIG } from './acValueCalculator';
import {
  IntervalConfig,
  quickIntervalCheck,
  SSQ_INTERVAL_CONFIG,
  DLT_INTERVAL_CONFIG,
} from './intervalAnalyzer';

/**
 * 号码缩水器
 * 将复式投注转换为优化组合，大幅减少投注成本
 */

const COST_PER_BET = 2; // 每注彩票价格（元）

export interface NumberPool {
  redBalls: number[];
  blueBalls: number[];
}

export interface ReductionFilter {
  // AC值过滤
  acValue?: {
    min?: number;
    max?: number;
    enabled?: boolean;
  };
  // 和值过滤
  sumValue?: {
    min?: number;
    max?: number;
    enabled?: boolean;
  };
  // 奇偶比过滤
  oddEvenRatio?: {
    minOdd?: number;
    maxOdd?: number;
    enabled?: boolean;
  };
  // 区间分布过滤
  intervalDistribution?: {
    requireBalanced?: boolean;
    avoidExtreme?: boolean;
    minBalanceScore?: number;
    enabled?: boolean;
  };
  // 跨度过滤
  span?: {
    min?: number;
    max?: number;
    enabled?: boolean;
  };
  // 连号过滤
  consecutive?: {
    maxCount?: number;
    enabled?: boolean;
  };
  // 尾数过滤
  tailNumbers?: {
    minUnique?: number;
    maxUnique?: number;
    enabled?: boolean;
  };
}

export interface ReductionResult {
  originalCount: number;
  reducedCount: number;
  reductionRate: number; // 缩水率 (%)
  combinations: Array<{
    redBalls: number[];
    blueBalls: number[];
    reason?: string; // 不符合的原因（如果被过滤）
  }>;
  costSavings: {
    originalCost: number;
    reducedCost: number;
    savings: number;
  };
}

export interface ReductionStats {
  filterReasons: Record<string, number>; // 各过滤条件过滤掉的数量
  passedCount: number;
  totalChecked: number;
}

/**
 * 号码缩水器类
 */
export class NumberReducer {
  private lotteryType: string; // 'ssq' or 'dlt'
  private acConfig: ACValueConfig;
  private intervalConfig: IntervalConfig;

  constructor(lotteryType: string) {
    this.lotteryType = lotteryType;

    // 根据彩种设置配置
    if (lotteryType === 'ssq') {
      this.acConfig = SSQ_AC_CONFIG;
      this.intervalConfig = SSQ_INTERVAL_CONFIG;
    } else {
      this.acConfig = DLT_AC_CONFIG;
      this.intervalConfig = DLT_INTERVAL_CONFIG;
    }
  }

  /**
   * 生成所有可能的组合
   */
  private generateCombinations(pool: NumberPool): number[][][] {
    const combinations: number[][][] = [];

    // 生成红球组合（C(n,6)或C(n,5)）
    const redCount = this.lotteryType === 'ssq' ? 6 : 5;
    const redCombinations = this.combine(pool.redBalls, redCount);

    // 生成蓝球组合（C(n,1)或C(n,2)）
    const blueCount = this.lotteryType === 'ssq' ? 1 : 2;
    const blueCombinations = this.combine(pool.blueBalls, blueCount);

    // 组合红球和蓝球
    for (const redBalls of redCombinations) {
      for (const blueBalls of blueCombinations) {
        combinations.push([redBalls, blueBalls]);
      }
    }

    return combinations;
  }

  /**
   * 组合算法 C(n,k)
   */
  private combine(arr: number[], k: number): number[][] {
    const result: number[][] = [];

    // 排序输入数组以确保组合有序
    const sorted = [...arr].sort((a, b) => a - b);

    function combine(start: number, chosen: number[]) {
      if (chosen.length === k) {
        result.push([...chosen]);
        return;
      }

      for (let i = start; i < sorted.length; i++) {
        chosen.push(sorted[i]);
        combine(i + 1, chosen);
        chosen.pop();
      }
    }

    combine(0, []);
    return result;
  }

  /**
   * 检查单个组合是否符合过滤条件
   */
  private checkCombination(
    redBalls: number[],
    blueBalls: number[],
    filter: ReductionFilter
  ): { passed: boolean; reason?: string } {
    // AC值检查
    if (filter.acValue?.enabled) {
      const acValue = quickACValue(redBalls);
      const min = filter.acValue.min ?? this.acConfig.minOptimal;
      const max = filter.acValue.max ?? this.acConfig.maxOptimal;
      if (acValue < min || acValue > max) {
        return { passed: false, reason: `AC值(${acValue})不在范围[${min}, ${max}]` };
      }
    }

    // 和值检查
    if (filter.sumValue?.enabled) {
      const sum = redBalls.reduce((a, b) => a + b, 0);
      const min = filter.sumValue.min ?? 70;
      const max = filter.sumValue.max ?? 130;
      if (sum < min || sum > max) {
        return { passed: false, reason: `和值(${sum})不在范围[${min}, ${max}]` };
      }
    }

    // 奇偶比检查
    if (filter.oddEvenRatio?.enabled) {
      const oddCount = redBalls.filter((n) => n % 2 === 1).length;
      const minOdd = filter.oddEvenRatio.minOdd ?? 1;
      const maxOdd = filter.oddEvenRatio.maxOdd ?? 5;
      if (oddCount < minOdd || oddCount > maxOdd) {
        return { passed: false, reason: `奇偶比(${oddCount}:${redBalls.length - oddCount})不在范围` };
      }
    }

    // 区间分布检查
    if (filter.intervalDistribution?.enabled) {
      const check = quickIntervalCheck(redBalls, this.intervalConfig);
      if (filter.intervalDistribution.requireBalanced && !check.isBalanced) {
        return {
          passed: false,
          reason: `区间分布(${check.ratio})不均衡`,
        };
      }
    }

    // 跨度检查
    if (filter.span?.enabled) {
      const span = Math.max(...redBalls) - Math.min(...redBalls);
      const min = filter.span.min ?? 15;
      const max = filter.span.max ?? 32;
      if (span < min || span > max) {
        return { passed: false, reason: `跨度(${span})不在范围[${min}, ${max}]` };
      }
    }

    // 连号检查
    if (filter.consecutive?.enabled) {
      const sorted = [...redBalls].sort((a, b) => a - b);
      let maxConsecutive = 1;
      let currentConsecutive = 1;

      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1] + 1) {
          currentConsecutive++;
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
          currentConsecutive = 1;
        }
      }

      const maxAllowed = filter.consecutive.maxCount ?? 3;
      if (maxConsecutive > maxAllowed) {
        return { passed: false, reason: `连号数量(${maxConsecutive})超过${maxAllowed}` };
      }
    }

    // 尾数检查
    if (filter.tailNumbers?.enabled) {
      const tails = new Set(redBalls.map((n) => n % 10));
      const minUnique = filter.tailNumbers.minUnique ?? 3;
      const maxUnique = filter.tailNumbers.maxUnique ?? 6;

      if (tails.size < minUnique || tails.size > maxUnique) {
        return { passed: false, reason: `尾数数量(${tails.size})不在范围[${minUnique}, ${maxUnique}]` };
      }
    }

    return { passed: true };
  }

  /**
   * 执行缩水
   */
  reduce(pool: NumberPool, filter: ReductionFilter): ReductionResult {
    const allCombinations = this.generateCombinations(pool);
    const originalCount = allCombinations.length;

    const passed: Array<{ redBalls: number[]; blueBalls: number[] }> = [];
    const stats: ReductionStats = {
      filterReasons: {},
      passedCount: 0,
      totalChecked: originalCount,
    };

    for (const [redBalls, blueBalls] of allCombinations) {
      const check = this.checkCombination(redBalls, blueBalls, filter);

      if (check.passed) {
        passed.push({ redBalls, blueBalls });
        stats.passedCount++;
      } else if (check.reason) {
        stats.filterReasons[check.reason] = (stats.filterReasons[check.reason] || 0) + 1;
      }
    }

    // 计算成本
    const originalCost = originalCount * COST_PER_BET;
    const reducedCost = passed.length * COST_PER_BET;

    return {
      originalCount,
      reducedCount: passed.length,
      reductionRate: Math.round(((originalCount - passed.length) / originalCount) * 100),
      combinations: passed,
      costSavings: {
        originalCost,
        reducedCost,
        savings: originalCost - reducedCost,
      },
    };
  }

  /**
   * 获取预设缩水方案
   */
  static getPresetFilters(lotteryType: string): Record<string, any> {
    if (lotteryType === 'ssq') {
      return {
        conservative: {
          name: '保守型',
          // 保守型：所有指标都在最优范围
          acValue: { min: 7, max: 9, enabled: true },
          sumValue: { min: 90, max: 120, enabled: true },
          oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
          intervalDistribution: { requireBalanced: true, enabled: true },
          span: { min: 20, max: 30, enabled: true },
          consecutive: { maxCount: 2, enabled: true },
          tailNumbers: { minUnique: 4, maxUnique: 6, enabled: true },
        },
        balanced: {
          name: '均衡型',
          // 均衡型：适度放宽条件
          acValue: { min: 6, max: 10, enabled: true },
          sumValue: { min: 80, max: 130, enabled: true },
          oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
          intervalDistribution: { avoidExtreme: true, enabled: true },
          span: { min: 18, max: 32, enabled: true },
          consecutive: { maxCount: 3, enabled: true },
        },
        aggressive: {
          name: '激进型',
          // 激进型：包含更多冷门组合
          acValue: { min: 5, max: 11, enabled: true },
          sumValue: { min: 70, max: 140, enabled: true },
          oddEvenRatio: { minOdd: 1, maxOdd: 5, enabled: true },
          intervalDistribution: { minBalanceScore: 40, enabled: true },
        },
      };
    } else {
      return {
        conservative: {
          // 保守型：所有指标都在最优范围
          acValue: { min: 7, max: 9, enabled: true },
          sumValue: { min: 90, max: 120, enabled: true },
          oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
          intervalDistribution: { requireBalanced: true, enabled: true },
          span: { min: 20, max: 30, enabled: true },
          consecutive: { maxCount: 2, enabled: true },
          tailNumbers: { minUnique: 4, maxUnique: 6, enabled: true },
        },
        balanced: {
          // 均衡型：适度放宽条件
          acValue: { min: 6, max: 10, enabled: true },
          sumValue: { min: 80, max: 130, enabled: true },
          oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
          intervalDistribution: { avoidExtreme: true, enabled: true },
          span: { min: 18, max: 32, enabled: true },
          consecutive: { maxCount: 3, enabled: true },
        },
        aggressive: {
          name: '激进型',
          // 激进型：包含更多冷门组合
          acValue: { min: 5, max: 11, enabled: true },
          sumValue: { min: 70, max: 140, enabled: true },
          oddEvenRatio: { minOdd: 1, maxOdd: 5, enabled: true },
          intervalDistribution: { minBalanceScore: 40, enabled: true },
        },
      };
    }
  }
}

/**
 * 快速缩水（使用默认过滤器）
 */
export function quickReduce(
  lotteryType: string,
  pool: NumberPool,
  presetName: string
): ReductionResult {
  const reducer = new NumberReducer(lotteryType);
  const presets = NumberReducer.getPresetFilters(lotteryType);
  const filter = presets[presetName] || presets.balanced;

  return reducer.reduce(pool, filter);
}
