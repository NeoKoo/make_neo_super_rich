import { DrawStatistics } from '../types/analysis';

/**
 * 区间分析器
 * 将号码分为3个区间，分析分布规律
 */

export interface IntervalConfig {
  lotteryType: string; // 'ssq' or 'dlt'
  intervals: {
    small: [number, number];   // 小区间
    medium: [number, number];  // 中区间
    large: [number, number];   // 大区间
  };
}

export interface IntervalDistribution {
  small: number;   // 小区间号码数量
  medium: number;  // 中区间号码数量
  large: number;   // 大区间号码数量
  ratio: string;   // 分布比例，如 "2:2:2"
}

export interface IntervalAnalysis {
  distribution: IntervalDistribution;
  isBalanced: boolean;
  isExtreme: boolean;
  balanceScore: number;  // 0-100，越高越均衡
  recommendation: string;
}

export interface IntervalStatistics {
  totalAnalyzed: number;
  intervalFrequency: {
    small: number;
    medium: number;
    large: number;
  };
  commonDistributions: {
    distribution: string;
    count: number;
    percentage: number;
  }[];
}

/**
 * 判断号码所属区间
 */
function getInterval(number: number, config: IntervalConfig): 'small' | 'medium' | 'large' {
  const [smallMin, smallMax] = config.intervals.small;
  const [mediumMin, mediumMax] = config.intervals.medium;
  const [largeMin, largeMax] = config.intervals.large;

  if (number >= smallMin && number <= smallMax) return 'small';
  if (number >= mediumMin && number <= mediumMax) return 'medium';
  if (number >= largeMin && number <= largeMax) return 'large';

  // 默认返回小区间
  return 'small';
}

/**
 * 计算号码组合的区间分布
 */
export function calculateIntervalDistribution(
  numbers: number[],
  config: IntervalConfig
): IntervalDistribution {
  const distribution = {
    small: 0,
    medium: 0,
    large: 0,
  };

  for (const num of numbers) {
    const interval = getInterval(num, config);
    distribution[interval]++;
  }

  return {
    ...distribution,
    ratio: `${distribution.small}:${distribution.medium}:${distribution.large}`,
  };
}

/**
 * 分析区间分布
 */
export function analyzeIntervalDistribution(
  numbers: number[],
  config: IntervalConfig
): IntervalAnalysis {
  const distribution = calculateIntervalDistribution(numbers, config);
  const total = numbers.length;

  // 计算均衡度评分
  // 理想分布：每个区间约占1/3
  const idealRatio = total / 3;
  const smallDiff = Math.abs(distribution.small - idealRatio);
  const mediumDiff = Math.abs(distribution.medium - idealRatio);
  const largeDiff = Math.abs(distribution.large - idealRatio);

  const totalDiff = smallDiff + mediumDiff + largeDiff;
  const maxDiff = total; // 最差情况：所有号码都在一个区间
  const balanceScore = Math.max(0, Math.round(100 - (totalDiff / maxDiff) * 100));

  // 判断是否均衡（偏差不超过1个号码）
  const isBalanced = smallDiff <= 1 && mediumDiff <= 1 && largeDiff <= 1;

  // 判断是否极端分布（超过2/3的号码在一个区间）
  const isExtreme =
    distribution.small > (total * 2) / 3 ||
    distribution.medium > (total * 2) / 3 ||
    distribution.large > (total * 2) / 3;

  // 生成建议
  let recommendation: string;
  if (isExtreme) {
    recommendation = `极端分布(${distribution.ratio})，建议增加其他区间的号码以提高中奖概率`;
  } else if (isBalanced) {
    recommendation = `均衡分布(${distribution.ratio})，区间分布合理，符合推荐模式`;
  } else {
    recommendation = `分布(${distribution.ratio})较均衡，可适当调整以达到最优分布`;
  }

  return {
    distribution,
    isBalanced,
    isExtreme,
    balanceScore,
    recommendation,
  };
}

/**
 * 分析历史数据的区间统计
 */
export function analyzeIntervalStatistics(
  drawData: DrawStatistics[],
  config: IntervalConfig
): IntervalStatistics {
  const intervalFrequency = {
    small: 0,
    medium: 0,
    large: 0,
  };

  const distributionCounts: Record<string, number> = {};

  for (const draw of drawData) {
    const distribution = calculateIntervalDistribution(draw.redBalls, config);

    intervalFrequency.small += distribution.small;
    intervalFrequency.medium += distribution.medium;
    intervalFrequency.large += distribution.large;

    const ratio = distribution.ratio;
    distributionCounts[ratio] = (distributionCounts[ratio] || 0) + 1;
  }

  // 转换为百分比并排序
  const totalDraws = drawData.length;
  const commonDistributions = Object.entries(distributionCounts)
    .map(([distribution, count]) => ({
      distribution,
      count,
      percentage: Math.round((count / totalDraws) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 取前10个最常见的分布

  return {
    totalAnalyzed: drawData.length,
    intervalFrequency,
    commonDistributions,
  };
}

/**
 * 根据区间分布过滤号码组合
 */
export function filterByIntervalDistribution(
  numberSets: number[][],
  config: IntervalConfig,
  options: {
    requireBalanced?: boolean;       // 要求均衡分布
    avoidExtreme?: boolean;          // 避免极端分布
    minBalanceScore?: number;        // 最低均衡分数
  } = {}
): number[][] {
  return numberSets.filter((numbers) => {
    const analysis = analyzeIntervalDistribution(numbers, config);

    if (options.requireBalanced && !analysis.isBalanced) return false;
    if (options.avoidExtreme && analysis.isExtreme) return false;
    if (options.minBalanceScore && analysis.balanceScore < options.minBalanceScore) return false;

    return true;
  });
}

/**
 * 生成推荐的区间分布
 */
export function getRecommendedDistributions(count: number): string[] {
  const recommendations: string[] = [];

  // 均衡分布
  if (count === 6) {
    // 双色球推荐分布
    recommendations.push('2:2:2', '3:2:1', '2:3:1', '1:2:3', '2:1:3');
  } else if (count === 5) {
    // 大乐透推荐分布
    recommendations.push('2:2:1', '2:1:2', '1:2:2', '3:1:1', '1:3:1');
  }

  return recommendations;
}

/**
 * 双色球区间配置
 */
export const SSQ_INTERVAL_CONFIG: IntervalConfig = {
  lotteryType: 'ssq',
  intervals: {
    small: [1, 11],
    medium: [12, 22],
    large: [23, 33],
  },
};

/**
 * 大乐透区间配置
 */
export const DLT_INTERVAL_CONFIG: IntervalConfig = {
  lotteryType: 'dlt',
  intervals: {
    small: [1, 12],
    medium: [13, 24],
    large: [25, 35],
  },
};

/**
 * 快速检查区间分布
 */
export function quickIntervalCheck(
  numbers: number[],
  config: IntervalConfig
): { isBalanced: boolean; ratio: string } {
  const distribution = calculateIntervalDistribution(numbers, config);
  const total = numbers.length;
  const idealRatio = total / 3;

  const isBalanced =
    Math.abs(distribution.small - idealRatio) <= 1 &&
    Math.abs(distribution.medium - idealRatio) <= 1 &&
    Math.abs(distribution.large - idealRatio) <= 1;

  return {
    isBalanced,
    ratio: distribution.ratio,
  };
}
