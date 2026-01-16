export interface HistoryRecord {
  id: string;
  lotteryType: '双色球' | '大乐透';
  lotteryId: string;
  numbers: {
    redBalls: number[];
    blueBalls: number[];
  };
  timestamp: number;
  strategyType: 'balanced_odd_even' | 'sum_range' | 'full_random';
  drawDate?: string;
  drawNumbers?: {
    redBalls: number[];
    blueBalls: number[];
  };
  matchCount?: {
    red: number;
    blue: number;
  };
  prize?: string;
}

export interface DrawResult {
  lotteryId: string;
  lotteryType: '双色球' | '大乐透';
  drawDate: string;
  numbers: {
    redBalls: number[];
    blueBalls: number[];
  };
  issue: string;
}
