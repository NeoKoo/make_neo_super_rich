import { LotterySchedule } from '../types/notifications';

export const LOTTERY_SCHEDULES: Record<string, LotterySchedule> = {
  '双色球': {
    type: '双色球',
    drawDays: [2, 5, 7], // 周二、周四、周日开奖
    drawTime: '21:15'
  },
  '大乐透': {
    type: '大乐透',
    drawDays: [1, 3, 6], // 周一、周三、周六开奖
    drawTime: '20:30'
  }
};

/**
 * 获取下次开奖时间
 */
export function getNextDrawTime(lotteryType: '双色球' | '大乐透'): Date {
  const schedule = LOTTERY_SCHEDULES[lotteryType];
  const now = new Date();
  const currentDay = now.getDay(); // 0=周日, 1=周一, ...
  
  // 找到下一个开奖日
  let nextDrawDay = schedule.drawDays.find(day => day > currentDay);
  if (nextDrawDay === undefined) {
    // 如果本周没有更多开奖日，找到下周的第一个
    nextDrawDay = schedule.drawDays[0];
  }
  
  // 计算下次开奖日期
  const [hours, minutes] = schedule.drawTime.split(':').map(Number);
  const nextDrawDate = new Date(now);
  
  if (nextDrawDay > currentDay) {
    // 本周还有开奖
    nextDrawDate.setDate(now.getDate() + (nextDrawDay - currentDay));
  } else {
    // 下周开奖
    const daysUntilNextDraw = 7 - currentDay + nextDrawDay;
    nextDrawDate.setDate(now.getDate() + daysUntilNextDraw);
  }
  
  nextDrawDate.setHours(hours, minutes, 0, 0);
  
  // 如果时间已经过了，加一周
  if (nextDrawDate <= now) {
    nextDrawDate.setDate(nextDrawDate.getDate() + 7);
  }
  
  return nextDrawDate;
}

/**
 * 检查是否在开奖时间附近
 */
export function isNearDrawTime(lotteryType: '双色球' | '大乐透', minutesBefore: number = 30): boolean {
  const nextDrawTime = getNextDrawTime(lotteryType);
  const now = new Date();
  const timeDiff = nextDrawTime.getTime() - now.getTime();
  const minutesDiff = timeDiff / (1000 * 60);
  
  return minutesDiff > 0 && minutesDiff <= minutesBefore;
}

/**
 * 格式化开奖时间显示
 */
export function formatDrawTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('zh-CN', options);
}