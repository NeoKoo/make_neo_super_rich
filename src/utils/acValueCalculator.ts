/**
 * AC值（数字复杂度指数）计算器
 * AC值反映号码组合的复杂程度
 *
 * 公式：AC值 = 号码个数 - (不同差值个数 + 1)
 *
 * 推荐范围：
 * - 双色球：6-10（最优7-9）
 * - 大乐透：5-9（最优6-8）
 */

export interface ACValueResult {
  acValue: number;
  level: 'low' | 'optimal' | 'high';
  recommendation: string;
  differences: number[];
  uniqueDifferences: number;
}

export interface ACValueConfig {
  lotteryType: string; // 'ssq' or 'dlt'
  minOptimal: number;
  maxOptimal: number;
}

/**
 * 计算号码组合的AC值
 */
export function calculateACValue(numbers: number[], config: ACValueConfig): ACValueResult {
  if (numbers.length < 2) {
    return {
      acValue: 0,
      level: 'low',
      recommendation: '号码数量不足，无法计算AC值',
      differences: [],
      uniqueDifferences: 0,
    };
  }

  // 排序号码
  const sorted = [...numbers].sort((a, b) => a - b);

  // 计算所有两两差值
  const differences: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      differences.push(sorted[j] - sorted[i]);
    }
  }

  // 计算不重复差值个数
  const uniqueDifferences = new Set(differences).size;

  // 计算AC值: AC = 不重复差值个数 - 号码个数 + 1
  const acValue = uniqueDifferences - numbers.length + 1;

  // 判断AC值等级
  let level: 'low' | 'optimal' | 'high';
  let recommendation: string;

  if (acValue < config.minOptimal) {
    level = 'low';
    recommendation = `AC值过低(${acValue})，号码组合过于简单，建议增加号码的分散性`;
  } else if (acValue > config.maxOptimal) {
    level = 'high';
    recommendation = `AC值过高(${acValue})，号码组合过于复杂，建议简化号码分布`;
  } else {
    level = 'optimal';
    recommendation = `AC值最优(${acValue})，号码组合复杂度适中`;
  }

  return {
    acValue,
    level,
    recommendation,
    differences,
    uniqueDifferences,
  };
}

/**
 * 批量计算多组号码的AC值
 */
export function calculateBatchACValue(
  numberSets: number[][],
  config: ACValueConfig
): ACValueResult[] {
  return numberSets.map((numbers) => calculateACValue(numbers, config));
}

/**
 * 过滤掉AC值不符合要求的号码组合
 */
export function filterByACValue(
  numberSets: number[][],
  config: ACValueConfig,
  minAC?: number,
  maxAC?: number
): number[][] {
  const min = minAC ?? config.minOptimal;
  const max = maxAC ?? config.maxOptimal;

  return numberSets.filter((numbers) => {
    const result = calculateACValue(numbers, config);
    return result.acValue >= min && result.acValue <= max;
  });
}

/**
 * 根据AC值对号码组合进行排序
 */
export function sortByACValue(
  numberSets: number[][],
  config: ACValueConfig,
  order: 'asc' | 'desc' = 'desc'
): number[][] {
  return numberSets.sort((a, b) => {
    const acA = calculateACValue(a, config).acValue;
    const acB = calculateACValue(b, config).acValue;
    return order === 'asc' ? acA - acB : acB - acA;
  });
}

/**
 * 获取AC值统计信息
 */
export function getACValueStatistics(
  numberSets: number[][],
  config: ACValueConfig
): {
  min: number;
  max: number;
  avg: number;
  distribution: Record<string, number>;
} {
  const results = calculateBatchACValue(numberSets, config);
  const acValues = results.map((r) => r.acValue);

  const min = Math.min(...acValues);
  const max = Math.max(...acValues);
  const avg = acValues.reduce((sum, val) => sum + val, 0) / acValues.length;

  // 统计分布
  const distribution: Record<string, number> = {};
  for (const result of results) {
    const key = result.level;
    distribution[key] = (distribution[key] || 0) + 1;
  }

  return {
    min,
    max,
    avg: Math.round(avg * 100) / 100,
    distribution,
  };
}

/**
 * 双色球AC值配置
 */
export const SSQ_AC_CONFIG: ACValueConfig = {
  lotteryType: 'ssq',
  minOptimal: 7,
  maxOptimal: 9,
};

/**
 * 大乐透AC值配置
 */
export const DLT_AC_CONFIG: ACValueConfig = {
  lotteryType: 'dlt',
  minOptimal: 6,
  maxOptimal: 8,
};

/**
 * 快速计算AC值（仅返回数值）
 * AC值公式：AC = 不重复差值个数 - 号码个数 + 1
 */
export function quickACValue(numbers: number[]): number {
  if (numbers.length < 2) return 0;

  const sorted = [...numbers].sort((a, b) => a - b);
  const differences = new Set<number>();

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      differences.add(sorted[j] - sorted[i]);
    }
  }

  // AC = 不重复差值个数 - 号码个数 + 1
  return differences.size - numbers.length + 1;
}
