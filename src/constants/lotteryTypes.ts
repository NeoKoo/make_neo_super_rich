import { LotteryConfig, LotteryType } from '../types/lottery';

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  [LotteryType.SHUANGSEQIU]: {
    type: LotteryType.SHUANGSEQIU,
    redBalls: { min: 1, max: 33, count: 6 },
    blueBalls: { min: 1, max: 16, count: 1 },
    drawDays: [2, 4, 0],
    drawTime: '21:15'
  },
  [LotteryType.DALETOU]: {
    type: LotteryType.DALETOU,
    redBalls: { min: 1, max: 35, count: 5 },
    blueBalls: { min: 1, max: 12, count: 2 },
    drawDays: [1, 3, 5],
    drawTime: '20:30'
  }
};

export function getLotteryTypeByDate(date: Date): LotteryType {
  const dayOfWeek = date.getDay();
  
  if ([1, 3, 6].includes(dayOfWeek)) {
    return LotteryType.SHUANGSEQIU;
  }
  
  if ([0, 2, 5].includes(dayOfWeek)) {
    return LotteryType.DALETOU;
  }
  
  return LotteryType.SHUANGSEQIU;
}

export function getNextDrawDate(lotteryType: LotteryType): Date {
  const config = LOTTERY_CONFIGS[lotteryType];
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  let daysUntilDraw = config.drawDays.find(day => day > dayOfWeek);
  if (daysUntilDraw === undefined) {
    daysUntilDraw = config.drawDays[0];
  }
  
  const nextDraw = new Date(today);
  nextDraw.setDate(today.getDate() + (daysUntilDraw - dayOfWeek + 7) % 7);
  const [hours, minutes] = config.drawTime.split(':').map(Number);
  nextDraw.setHours(hours, minutes, 0, 0);
  
  return nextDraw;
}
