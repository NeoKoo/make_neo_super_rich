import type { CalendarEvent, CalendarResult } from '../types/calendar';

/**
 * 生成.ics格式的日历文件内容
 */
export function generateICSContent(event: CalendarEvent): string {
  const formatDateTime = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const uid = `lottery-lucky-time-${Date.now()}@makeNeoRich`;
  const startTime = formatDateTime(event.startTime);
  const endTime = formatDateTime(event.endTime);
  const reminderMinutes = event.reminderMinutes || 5;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//彩票选号助手//幸运购彩时间//CN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:幸运购彩时间到了！
TRIGGER:-PT${reminderMinutes}M
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

/**
 * 下载.ics文件
 */
export function downloadCalendarFile(event: CalendarEvent): Promise<CalendarResult> {
  return new Promise((resolve) => {
    try {
      const icsContent = generateICSContent(event);
      const blob = new Blob([icsContent], { 
        type: 'text/calendar;charset=utf-8' 
      });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `幸运购彩时间-${new Date().toISOString().split('T')[0]}.ics`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL对象
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      resolve({
        success: true,
        method: 'download',
        message: '日历文件已下载'
      });
    } catch (error) {
      console.error('[CalendarUtils] 下载日历文件失败:', error);
      resolve({
        success: false,
        method: 'download',
        message: '下载失败'
      });
    }
  });
}

/**
 * 检查浏览器是否支持文件下载
 */
export function isDownloadSupported(): boolean {
  return !!(document.createElement('a').download !== undefined && 
           typeof Blob !== 'undefined' && 
           typeof URL !== 'undefined' && 
           typeof URL.createObjectURL !== 'undefined');
}

/**
 * 复制日历事件信息到剪贴板
 */
export async function copyCalendarEvent(event: CalendarEvent): Promise<CalendarResult> {
  try {
    const formatTime = (date: Date): string => {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
      });
    };

    const text = `事件：${event.title}
时间：${formatTime(event.startTime)}
描述：${event.description}

请手动在日历应用中创建此事件`;

    await navigator.clipboard.writeText(text);
    return {
      success: true,
      method: 'copy',
      message: '信息已复制到剪贴板'
    };
  } catch (error) {
    console.error('[CalendarUtils] 复制失败:', error);
    return {
      success: false,
      method: 'copy',
      message: '复制失败'
    };
  }
}

/**
 * 添加日历事件的主要函数
 */
export async function addCalendarEvent(event: CalendarEvent): Promise<CalendarResult> {
  // 优先尝试下载.ics文件
  if (isDownloadSupported()) {
    const downloadResult = await downloadCalendarFile(event);
    if (downloadResult.success) {
      return downloadResult;
    }
  }
  
  // 下载失败或不支持，尝试复制
  const copyResult = await copyCalendarEvent(event);
  if (copyResult.success) {
    return copyResult;
  }
  
  // 都失败了
  return {
    success: false,
    method: 'unsupported',
    message: '当前浏览器不支持此功能'
  };
}