export interface NumberFrequency {
  number: number;
  count: number;
  frequency: number;
  lastAppeared: number; // 最后出现的期数
  missingPeriods: number; // 遗漏期数
}

export interface HotColdAnalysis {
  hotNumbers: NumberFrequency[];    // 热号（高频）
  warmNumbers: NumberFrequency[];  // 温号（中频）
  coldNumbers: NumberFrequency[];   // 冷号（低频）
}

export interface PersonalSelectionPattern {
  oddEvenRatio: number;        // 奇偶比例偏好
  sumRange: [number, number];   // 和值范围偏好
  consecutiveNumbers: boolean;  // 是否喜欢连号
  favoriteNumbers: number[];    // 常选号码
  avoidNumbers: number[];       // 避免的号码
}

export interface PersonalAnalysis {
  totalSelections: number;           // 总选号次数
  winningCount: number;             // 中奖次数
  winningRate: number;              // 中奖率
  bestStrategy: string;             // 最佳策略
  selectionPattern: PersonalSelectionPattern;
  recentSelections: Array<{
    timestamp: number;
    numbers: { redBalls: number[]; blueBalls: number[] };
    strategyType: string;
    won: boolean;
    prizeLevel?: number;
  }>;
}

export interface DrawStatistics {
  drawNumber: string;
  redBalls: number[];
  blueBalls: number[];
  sum: number;
  oddCount: number;
  evenCount: number;
  consecutiveCount: number;
  span: number; // 跨度
}

export interface AnalysisData {
  hotColdAnalysis: {
    red: HotColdAnalysis;
    blue: HotColdAnalysis;
  };
  drawStatistics: DrawStatistics[];
  personalAnalysis: PersonalAnalysis;
  trendData: {
    period: string;
    redSum: number;
    blueSum: number;
    oddRatio: number;
  }[];
  missingValueAnalysis?: MissingValueAnalysis;
}

// 遗漏值分析相关类型
export interface MissingValueData {
  number: number;              // 号码
  missingPeriods: number;      // 当前遗漏期数
  maxMissingPeriods: number;   // 历史最大遗漏期数
  avgMissingPeriods: number;   // 平均遗漏周期
  theoreticalCycle: number;    // 理论遗漏周期
  replenishProbability: number; // 回补概率 (0-100)
  isSuperCold: boolean;        // 是否超冷号（遗漏 > 2x理论周期）
  lastAppeared: number;        // 最后出现期数
}

export interface MissingValueConfig {
  totalNumbers: number;        // 总号码数
  numbersPerDraw: number;      // 每期开出号码数
  superColdThreshold: number;  // 超冷号阈值倍数（默认2）
  analysisPeriods: number;     // 分析期数
}

export interface MissingValueAnalysis {
  red: MissingValueData[];      // 红球遗漏值数据
  blue: MissingValueData[];     // 蓝球遗漏值数据
  superColdRed: number[];       // 超冷红球列表
  superColdBlue: number[];      // 超冷蓝球列表
  highReplenishRed: number[];   // 高回补概率红球（top 10）
  highReplenishBlue: number[];  // 高回补概率蓝球（top 5）
  analysisDate: number;         // 分析时间戳
}