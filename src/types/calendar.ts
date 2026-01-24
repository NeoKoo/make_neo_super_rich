/**
 * 日历事件类型
 */
export interface CalendarEvent {
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
  reminderMinutes?: number;
}

/**
 * 日历操作结果
 */
export interface CalendarResult {
  success: boolean;
  method: 'download' | 'copy' | 'unsupported';
  message?: string;
}