export interface Reminder {
  id: string;
  lotteryType: '双色球' | '大乐透';
  drawTime: Date;
  message: string;
  enabled: boolean;
  minutesBefore: number; // 提前多少分钟提醒
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  defaultMinutesBefore: number;
}

export interface LotterySchedule {
  type: '双色球' | '大乐透';
  drawDays: number[]; // 星期几开奖 (0=周日, 1=周一, ...)
  drawTime: string; // 开奖时间 "21:15"
}