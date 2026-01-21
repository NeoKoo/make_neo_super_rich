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
  strategyType: 'balanced_odd_even' | 'sum_range' | 'full_random' | 'ai_god';
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
