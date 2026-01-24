/**
 * 获取北京时间日期
 */
export function getLocalDateFromBeijing(): Date {
  const now = new Date();
  // 直接使用当前时间，因为服务器已经在北京时区
  return now;
}

/**
 * 检查今天是否为星期五
 */
export function isFriday(): boolean {
  const beijingTime = getLocalDateFromBeijing();
  return beijingTime.getDay() === 5; // 5 表示星期五
}

/**
 * 检查今天是否为开奖日
 */
export function isDrawDay(lotteryType: '双色球' | '大乐透'): boolean {
  const beijingTime = getLocalDateFromBeijing();
  const currentDay = beijingTime.getDay(); // 0=周日, 1=周一, ...
  
  // 从lotterySchedule.ts获取开奖日配置
  const drawDays = {
    '双色球': [2, 5, 7], // 周二、周四、周日开奖
    '大乐透': [1, 3, 6]  // 周一、周三、周六开奖
  };
  
  return drawDays[lotteryType].includes(currentDay);
}
