import { LotteryType } from './lottery';

export interface HistoryRecord {
  id: string;
  lotteryType: LotteryType;
  lotteryId: string;
  numbers: {
    redBalls: number[];
    blueBalls: number[];
  };
  timestamp: number;
  strategyType: 'balanced_odd_even' | 'sum_range' | 'full_random' | 'ai_god' | 'reverse_selection';

  // 批量保存的多组号码（用于反选模式保存所有剩余号码）
  batchSelections?: {
    redBalls: number[];
    blueBalls: number[];
  }[];

  // 批量保存时的统计信息
  batchInfo?: {
    totalSets: number;        // 总共保存了多少组
    remainingRed: number[];   // 剩余未使用的红球
    remainingBlue: number[];  // 剩余未使用的蓝球
  };

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
  won?: boolean;
  prizeLevel?: number;
}

export interface DrawResult {
  lotteryId: string;
  lotteryType: LotteryType;
  drawDate: string;
  numbers: {
    redBalls: number[];
    blueBalls: number[];
  };
  issue: string;
}
