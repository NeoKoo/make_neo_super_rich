/**
 * 获取北京时间（东八区）
 */
export function getBeijingDate(): Date {
  const now = new Date();
  // UTC时间 + 8小时 = 北京时间
  return new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
}

/**
 * 获取当前北京时间对应的本地时间Date对象（用于后续操作）
 * 这样可以使用getDay()等方法，但基于北京时间
 */
export function getLocalDateFromBeijing(): Date {
  const beijingTime = getBeijingDate();
  // 创建一个新的Date对象，其值就是北京时间的时间戳
  return new Date(beijingTime.getTime());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateWithWeekday(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDaysUntil(targetDate: Date): number {
  const now = getLocalDateFromBeijing();
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getHoursUntil(targetDate: Date): number {
  const now = getLocalDateFromBeijing();
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60));
}

export function getMinutesUntil(targetDate: Date): number {
  const now = getLocalDateFromBeijing();
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60));
}

export function getSecondsUntil(targetDate: Date): number {
  const now = getLocalDateFromBeijing();
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / 1000);
}
