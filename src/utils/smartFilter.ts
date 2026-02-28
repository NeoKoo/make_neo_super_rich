import { quickACValue, SSQ_AC_CONFIG, DLT_AC_CONFIG } from './acValueCalculator';
import {
  quickIntervalCheck,
  SSQ_INTERVAL_CONFIG,
  DLT_INTERVAL_CONFIG,
} from './intervalAnalyzer';
import { ReductionFilter } from './numberReducer';

/**
 * 智能过滤系统
 * 根据多种条件快速过滤号码组合
 */

export interface FilterPreset {
  name: string;
  description: string;
  filter: ReductionFilter;
}

export interface FilterResult {
  combination: {
    redBalls: number[];
    blueBalls: number[];
  };
  passed: boolean;
  reason?: string;
  score?: number; // 0-100，组合质量评分
}

export interface FilterSummary {
  totalChecked: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  averageScore: number;
  topCombinations: FilterResult[];
}

/**
 * 智能过滤器类
 */
export class SmartFilter {
  private lotteryType: string; // 'ssq' or 'dlt'
  private acConfig: typeof SSQ_AC_CONFIG | typeof DLT_AC_CONFIG;
  private intervalConfig: typeof SSQ_INTERVAL_CONFIG | typeof DLT_INTERVAL_CONFIG;

  constructor(lotteryType: string) {
    this.lotteryType = lotteryType;
    this.acConfig = lotteryType === 'ssq' ? SSQ_AC_CONFIG : DLT_AC_CONFIG;
    this.intervalConfig = lotteryType === 'ssq' ? SSQ_INTERVAL_CONFIG : DLT_INTERVAL_CONFIG;
  }

  /**
   * 计算号码组合的质量评分
   */
  private calculateQualityScore(
    redBalls: number[],
    blueBalls: number[]
  ): number {
    let score = 0;
    const maxScore = 100;

    // 1. AC值评分 (20分)
    const acValue = quickACValue(redBalls);
    if (acValue >= this.acConfig.minOptimal && acValue <= this.acConfig.maxOptimal) {
      score += 20;
    } else if (acValue >= this.acConfig.minOptimal - 1 && acValue <= this.acConfig.maxOptimal + 1) {
      score += 15;
    } else {
      score += 10;
    }

    // 2. 奇偶比评分 (15分)
    const oddCount = redBalls.filter((n) => n % 2 === 1).length;
    const idealOdd = redBalls.length / 2;
    const oddDiff = Math.abs(oddCount - idealOdd);
    if (oddDiff <= 1) {
      score += 15;
    } else if (oddDiff <= 2) {
      score += 10;
    } else {
      score += 5;
    }

    // 3. 区间分布评分 (20分)
    const intervalCheck = quickIntervalCheck(redBalls, this.intervalConfig);
    if (intervalCheck.isBalanced) {
      score += 20;
    } else {
      // 检查是否接近均衡
      const [small, medium, large] = intervalCheck.ratio.split(':').map(Number);
      const ideal = redBalls.length / 3;
      const maxDiff = Math.max(
        Math.abs(small - ideal),
        Math.abs(medium - ideal),
        Math.abs(large - ideal)
      );
      if (maxDiff <= 2) {
        score += 15;
      } else {
        score += 10;
      }
    }

    // 4. 和值评分 (15分)
    const sum = redBalls.reduce((a, b) => a + b, 0);
    const idealSum = this.lotteryType === 'ssq' ? 102 : 90; // 理论和值
    const sumDiff = Math.abs(sum - idealSum);
    if (sumDiff <= 10) {
      score += 15;
    } else if (sumDiff <= 20) {
      score += 12;
    } else if (sumDiff <= 30) {
      score += 8;
    } else {
      score += 5;
    }

    // 5. 跨度评分 (15分)
    const span = Math.max(...redBalls) - Math.min(...redBalls);
    const idealSpan = this.lotteryType === 'ssq' ? 25 : 28;
    const spanDiff = Math.abs(span - idealSpan);
    if (spanDiff <= 5) {
      score += 15;
    } else if (spanDiff <= 10) {
      score += 12;
    } else {
      score += 8;
    }

    // 6. 尾数多样性评分 (15分)
    const tails = new Set(redBalls.map((n) => n % 10));
    if (tails.size >= redBalls.length - 1) {
      score += 15;
    } else if (tails.size >= redBalls.length - 2) {
      score += 12;
    } else {
      score += 8;
    }

    return Math.min(maxScore, score);
  }

  /**
   * 应用过滤器到单个组合
   */
  applyFilter(
    redBalls: number[],
    blueBalls: number[],
    filter: ReductionFilter
  ): FilterResult {
    // 检查是否通过过滤
    let passed = true;
    let reason: string | undefined;

    // AC值检查
    if (filter.acValue?.enabled) {
      const acValue = quickACValue(redBalls);
      const min = filter.acValue.min ?? this.acConfig.minOptimal;
      const max = filter.acValue.max ?? this.acConfig.maxOptimal;
      if (acValue < min || acValue > max) {
        passed = false;
        reason = `AC值${acValue}超出范围[${min}-${max}]`;
      }
    }

    // 和值检查
    if (passed && filter.sumValue?.enabled) {
      const sum = redBalls.reduce((a, b) => a + b, 0);
      const min = filter.sumValue.min ?? 70;
      const max = filter.sumValue.max ?? 130;
      if (sum < min || sum > max) {
        passed = false;
        reason = `和值${sum}超出范围[${min}-${max}]`;
      }
    }

    // 奇偶比检查
    if (passed && filter.oddEvenRatio?.enabled) {
      const oddCount = redBalls.filter((n) => n % 2 === 1).length;
      const minOdd = filter.oddEvenRatio.minOdd ?? 2;
      const maxOdd = filter.oddEvenRatio.maxOdd ?? 4;
      if (oddCount < minOdd || oddCount > maxOdd) {
        passed = false;
        reason = `奇偶比${oddCount}:${redBalls.length - oddCount}超出范围`;
      }
    }

    // 区间分布检查
    if (passed && filter.intervalDistribution?.enabled) {
      const check = quickIntervalCheck(redBalls, this.intervalConfig);
      if (filter.intervalDistribution.requireBalanced && !check.isBalanced) {
        passed = false;
        reason = `区间分布${check.ratio}不均衡`;
      }
    }

    // 跨度检查
    if (passed && filter.span?.enabled) {
      const span = Math.max(...redBalls) - Math.min(...redBalls);
      const min = filter.span.min ?? 15;
      const max = filter.span.max ?? 32;
      if (span < min || span > max) {
        passed = false;
        reason = `跨度${span}超出范围[${min}-${max}]`;
      }
    }

    // 连号检查
    if (passed && filter.consecutive?.enabled) {
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
        passed = false;
        reason = `连号数量${maxConsecutive}超过限制${maxAllowed}`;
      }
    }

    // 尾数检查
    if (passed && filter.tailNumbers?.enabled) {
      const tails = new Set(redBalls.map((n) => n % 10));
      const minUnique = filter.tailNumbers.minUnique ?? 3;
      const maxUnique = filter.tailNumbers.maxUnique ?? 6;
      if (tails.size < minUnique || tails.size > maxUnique) {
        passed = false;
        reason = `尾数数量${tails.size}超出范围[${minUnique}-${maxUnique}]`;
      }
    }

    return {
      combination: { redBalls, blueBalls },
      passed,
      reason,
      score: passed ? this.calculateQualityScore(redBalls, blueBalls) : undefined,
    };
  }

  /**
   * 批量应用过滤器
   */
  applyBatchFilter(
    combinations: Array<{ redBalls: number[]; blueBalls: number[] }>,
    filter: ReductionFilter
  ): FilterSummary {
    const results: FilterResult[] = [];
    let passedCount = 0;
    let totalScore = 0;

    for (const combo of combinations) {
      const result = this.applyFilter(combo.redBalls, combo.blueBalls, filter);
      results.push(result);

      if (result.passed) {
        passedCount++;
        totalScore += result.score || 0;
      }
    }

    // 获取评分最高的组合
    const topCombinations = results
      .filter((r) => r.passed && r.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10);

    return {
      totalChecked: combinations.length,
      passedCount,
      failedCount: combinations.length - passedCount,
      passRate: Math.round((passedCount / combinations.length) * 100),
      averageScore: passedCount > 0 ? Math.round(totalScore / passedCount) : 0,
      topCombinations,
    };
  }

  /**
   * 获取预设过滤方案
   */
  static getPresets(lotteryType: string): Record<string, FilterPreset> {
    if (lotteryType === 'ssq') {
      return {
        conservative: {
          name: '保守型',
          description: '所有指标都在最优范围内，追求高稳定性',
          filter: {
            acValue: { min: 7, max: 9, enabled: true },
            sumValue: { min: 90, max: 115, enabled: true },
            oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
            intervalDistribution: { requireBalanced: true, enabled: true },
            span: { min: 20, max: 30, enabled: true },
            consecutive: { maxCount: 2, enabled: true },
            tailNumbers: { minUnique: 4, maxUnique: 6, enabled: true },
          },
        },
        balanced: {
          name: '均衡型',
          description: '适度放宽条件，平衡数量和质量',
          filter: {
            acValue: { min: 6, max: 10, enabled: true },
            sumValue: { min: 80, max: 125, enabled: true },
            oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
            intervalDistribution: { avoidExtreme: true, enabled: true },
            span: { min: 18, max: 32, enabled: true },
            consecutive: { maxCount: 3, enabled: true },
            tailNumbers: { minUnique: 3, maxUnique: 6, enabled: true },
          },
        },
        aggressive: {
          name: '激进型',
          description: '包含更多冷门组合，追求高回报',
          filter: {
            acValue: { min: 5, max: 11, enabled: true },
            sumValue: { min: 70, max: 135, enabled: true },
            oddEvenRatio: { minOdd: 1, maxOdd: 5, enabled: true },
            intervalDistribution: { minBalanceScore: 40, enabled: true },
            span: { min: 15, max: 33, enabled: true },
            tailNumbers: { minUnique: 3, maxUnique: 6, enabled: true },
          },
        },
        acOptimal: {
          name: 'AC值优化',
          description: '优先选择AC值在最优范围内的组合',
          filter: {
            acValue: { min: 7, max: 9, enabled: true },
            oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
            intervalDistribution: { requireBalanced: true, enabled: true },
          },
        },
        coldNumbers: {
          name: '冷号捕手',
          description: '适合选择遗漏值较高的冷号组合',
          filter: {
            sumValue: { min: 75, max: 130, enabled: true },
            oddEvenRatio: { minOdd: 2, maxOdd: 4, enabled: true },
            span: { min: 20, max: 32, enabled: true },
          },
        },
      };
    } else {
      // 大乐透预设
      return {
        conservative: {
          name: '保守型',
          description: '所有指标都在最优范围内',
          filter: {
            acValue: { min: 6, max: 8, enabled: true },
            sumValue: { min: 70, max: 110, enabled: true },
            oddEvenRatio: { minOdd: 2, maxOdd: 3, enabled: true },
            intervalDistribution: { requireBalanced: true, enabled: true },
            span: { min: 22, max: 32, enabled: true },
          },
        },
        balanced: {
          name: '均衡型',
          description: '适度放宽条件',
          filter: {
            acValue: { min: 5, max: 9, enabled: true },
            sumValue: { min: 60, max: 120, enabled: true },
            oddEvenRatio: { minOdd: 1, maxOdd: 4, enabled: true },
            intervalDistribution: { avoidExtreme: true, enabled: true },
            span: { min: 20, max: 34, enabled: true },
          },
        },
      };
    }
  }

  /**
   * 创建自定义过滤器
   */
  static createCustomFilter(baseFilter: ReductionFilter = {}): ReductionFilter {
    return {
      acValue: { enabled: false, ...baseFilter.acValue },
      sumValue: { enabled: false, ...baseFilter.sumValue },
      oddEvenRatio: { enabled: false, ...baseFilter.oddEvenRatio },
      intervalDistribution: { enabled: false, ...baseFilter.intervalDistribution },
      span: { enabled: false, ...baseFilter.span },
      consecutive: { enabled: false, ...baseFilter.consecutive },
      tailNumbers: { enabled: false, ...baseFilter.tailNumbers },
    };
  }
}

/**
 * 快速过滤（使用预设方案）
 */
export function quickFilter(
  lotteryType: string,
  combinations: Array<{ redBalls: number[]; blueBalls: number[] }>,
  presetName: string
): FilterSummary {
  const filter = new SmartFilter(lotteryType);
  const presets = SmartFilter.getPresets(lotteryType);
  const preset = presets[presetName] || presets.balanced;

  return filter.applyBatchFilter(combinations, preset.filter);
}
