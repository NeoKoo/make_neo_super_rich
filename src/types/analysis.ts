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
}