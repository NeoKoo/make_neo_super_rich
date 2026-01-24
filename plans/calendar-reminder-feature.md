# 日历提醒功能实施计划

## 功能概述
在现有的最佳购彩时间组件中添加日历提醒功能，允许用户将幸运购彩时间添加到手机系统日历中。

## 技术方案
采用.ics日历文件方案为主，复制功能为备选的组合方案。

## 实施步骤

### 1. 创建日历工具函数

#### 1.1 创建 `src/utils/calendarUtils.ts`

```typescript
/**
 * 日历事件类型定义
 */
export interface CalendarEvent {
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
  reminderMinutes?: number;
}

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
export function downloadCalendarFile(event: CalendarEvent): Promise<boolean> {
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
      
      resolve(true);
    } catch (error) {
      console.error('[CalendarUtils] 下载日历文件失败:', error);
      resolve(false);
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
export async function copyCalendarEvent(event: CalendarEvent): Promise<boolean> {
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
    return true;
  } catch (error) {
    console.error('[CalendarUtils] 复制失败:', error);
    return false;
  }
}
```

### 2. 修改DailyFortune组件

#### 2.1 添加日历按钮和状态管理

在`src/components/fortune/DailyFortune.tsx`中：

```typescript
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  generateCalendarEvent, 
  downloadCalendarFile, 
  isDownloadSupported, 
  copyCalendarEvent 
} from '../../utils/calendarUtils';

// 在组件内添加状态
const [calendarAdded, setCalendarAdded] = useState(false);
const [calendarLoading, setCalendarLoading] = useState(false);

// 添加日历提醒处理函数
const handleAddToCalendar = useCallback(async () => {
  if (!fortune || calendarLoading) return;

  setCalendarLoading(true);

  try {
    // 解析幸运时间
    const [startTimeStr, endTimeStr] = fortune.luckyTime.split('-').map(t => t.trim());
    const [startHour, startMin] = startTimeStr.split(':').map(Number);
    const [endHour, endMin] = endTimeStr.split(':').map(Number);

    // 创建今天的日期
    const today = new Date();
    const startTime = new Date(today);
    startTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date(today);
    endTime.setHours(endHour, endMin, 0, 0);

    // 创建日历事件
    const calendarEvent = {
      title: '幸运购彩时间',
      startTime,
      endTime,
      description: `今日最佳购彩时间，好运连连！\n彩票类型：${lotteryType}\n推荐理由：${fortune.reason}`,
      reminderMinutes: 5
    };

    // 尝试下载.ics文件
    if (isDownloadSupported()) {
      const success = await downloadCalendarFile(calendarEvent);
      if (success) {
        addToast('日历事件已生成，请选择用日历应用打开', 'success');
        setCalendarAdded(true);
      } else {
        // 下载失败，尝试复制
        const copySuccess = await copyCalendarEvent(calendarEvent);
        if (copySuccess) {
          addToast('信息已复制，请在日历应用中手动创建事件', 'info');
        } else {
          addToast('添加日历失败，请稍后重试', 'error');
        }
      }
    } else {
      // 浏览器不支持下载，使用复制
      const copySuccess = await copyCalendarEvent(calendarEvent);
      if (copySuccess) {
        addToast('信息已复制，请在日历应用中手动创建事件', 'info');
      } else {
        addToast('当前浏览器不支持此功能', 'error');
      }
    }
  } catch (error) {
    console.error('[DailyFortune] 添加日历失败:', error);
    addToast('添加日历失败，请稍后重试', 'error');
  } finally {
    setCalendarLoading(false);
  }
}, [fortune, lotteryType, calendarLoading, addToast]);
```

#### 2.2 修改UI部分

在幸运时间部分添加日历按钮：

```typescript
// 在幸运时间显示区域添加日历按钮
<div className="flex items-center gap-2">
  <button
    onClick={toggleLuckyTimeReminder}
    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
    title={luckyTimeReminderId ? '取消提醒' : '设置提醒'}
  >
    {luckyTimeReminderId ? (
      <BellOff className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
    ) : (
      <Bell className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
    )}
  </button>
  
  {/* 新增日历按钮 */}
  <button
    onClick={handleAddToCalendar}
    disabled={calendarLoading || calendarAdded}
    className={`p-2 rounded-lg transition-all ${
      calendarLoading 
        ? 'bg-white/10 cursor-not-allowed' 
        : calendarAdded
        ? 'bg-green-500/20 hover:bg-green-500/30'
        : 'hover:bg-white/5'
    }`}
    title={calendarAdded ? '已添加到日历' : '添加到日历'}
  >
    {calendarLoading ? (
      <RefreshCw className="w-5 h-5 text-purple-300 animate-spin" />
    ) : calendarAdded ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <Calendar className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
    )}
  </button>
</div>
```

### 3. 添加类型定义

在`src/types/calendar.ts`中创建类型定义：

```typescript
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
```

### 4. 测试计划

#### 4.1 功能测试
- [ ] 日历文件生成是否正确
- [ ] 下载功能是否正常工作
- [ ] 复制功能是否正常工作
- [ ] 状态管理是否正确
- [ ] 错误处理是否完善

#### 4.2 兼容性测试
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 微信内置浏览器
- [ ] 桌面Chrome/Firefox/Safari

#### 4.3 用户体验测试
- [ ] 加载状态显示
- [ ] 成功/失败提示
- [ ] 按钮状态变化
- [ ] 操作指引是否清晰

### 5. 部署注意事项

1. **文件MIME类型**：确保服务器正确处理.ics文件的MIME类型
2. **CORS设置**：如果需要，配置正确的CORS头
3. **缓存策略**：避免缓存.ics文件
4. **移动端适配**：确保在移动设备上下载体验良好

### 6. 后续优化方向

1. **Web Share API集成**：在支持的浏览器中使用更原生的分享体验
2. **重复事件支持**：支持设置重复的购彩提醒
3. **多平台支持**：考虑直接集成Google Calendar、Apple Calendar等平台API
4. **智能提醒**：根据用户行为智能调整提醒时间

## 实施时间线

1. **第一阶段**（1-2天）：实现基础日历工具函数
2. **第二阶段**（1天）：修改DailyFortune组件
3. **第三阶段**（1天）：测试和优化
4. **第四阶段**（0.5天）：文档和部署

总计：3.5-4.5天完成全部功能