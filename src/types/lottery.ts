export enum LotteryType {
  SHUANGSEQIU = '双色球',
  DALETOU = '大乐透'
}

export interface LotteryConfig {
  type: LotteryType;
  redBalls: { min: number; max: number; count: number };
  blueBalls: { min: number; max: number; count: number };
  drawDays: number[];
  drawTime: string;
}

export interface NumberSelection {
  redBalls: number[];
  blueBalls: number[];
}

export interface StrategyTips {
  oddEvenRatio: string;
  sumRange: { min: number; max: number };
  hotNumbers: number[];
  coldNumbers: number[];
}
