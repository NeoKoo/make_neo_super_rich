import { useState, useEffect, useCallback } from 'react';
import { getDailyFortune, isLuckyTime } from '../../utils/fortuneService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../hooks/useToast';
import { APP_CONFIG } from '../../config/app';
import { LotteryType } from '../../types/lottery';
import { Sparkles, Clock, RefreshCw, Star, BookOpen, Sparkle, Bell, BellOff, Calendar, CheckCircle } from 'lucide-react';
import { SkeletonFortune } from '../common/Skeleton';
import { addReminder, getReminders, removeReminder } from '../../utils/notificationManager';
import { addCalendarEvent } from '../../utils/calendarUtils';

interface DailyFortuneProps {
  lotteryType: LotteryType;
}

export function DailyFortune({ lotteryType }: DailyFortuneProps) {
  const [settings] = useLocalStorage(
    'lottery_user_settings',
    APP_CONFIG.defaultSettings
  );
  const [fortune, setFortune] = useState<{
    blessing: string;
    luckyTime: string;
    luckyHour: number;
    reason: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zodiacSign, setZodiacSign] = useState('');
  const [luckyTimeReminderId, setLuckyTimeReminderId] = useState<string | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const { addToast } = useToast();

  // 检查是否已设置幸运时间提醒
  useEffect(() => {
    const reminders = getReminders();
    const luckyReminder = reminders.find(r => r.id === 'lucky_time_reminder');
    if (luckyReminder) {
      setLuckyTimeReminderId(luckyReminder.id);
    }
  }, []);

  // 切换幸运时间提醒
  const toggleLuckyTimeReminder = useCallback(() => {
    if (luckyTimeReminderId) {
      // 取消提醒
      removeReminder(luckyTimeReminderId);
      setLuckyTimeReminderId(null);
    } else if (fortune) {
      // 添加提醒
      const today = new Date();
      const [, endStr] = fortune.luckyTime.split('-').map(t => t.trim());
      const [endHour, endMin] = endStr.split(':').map(Number);

      // 设置提醒时间（提前5分钟）
      const reminderTime = new Date(today);
      reminderTime.setHours(endHour, endMin - 5, 0, 0);

      const id = addReminder({
        lotteryType: '双色球',
        drawTime: reminderTime,
        message: '幸运购彩时间提醒',
        enabled: true,
        minutesBefore: 5
      });
      setLuckyTimeReminderId(id);
    }
  }, [fortune, luckyTimeReminderId]);

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

      // 添加日历事件
      const result = await addCalendarEvent(calendarEvent);
      
      if (result.success) {
        if (result.method === 'download') {
          addToast('日历事件已生成，请选择用日历应用打开', 'success');
        } else if (result.method === 'copy') {
          addToast('信息已复制，请在日历应用中手动创建事件', 'info');
        }
        setCalendarAdded(true);
      } else {
        addToast(result.message || '添加日历失败，请稍后重试', 'error');
      }
    } catch (error) {
      console.error('[DailyFortune] 添加日历失败:', error);
      addToast('添加日历失败，请稍后重试', 'error');
    } finally {
      setCalendarLoading(false);
    }
  }, [fortune, lotteryType, calendarLoading, addToast]);

  useEffect(() => {
    const birthDate = settings.birthDate;
    if (birthDate) {
      const [month, day] = birthDate.split('-').map(Number);
      const sign = getZodiacSign(month, day);
      setZodiacSign(sign);
    } else {
      setZodiacSign('射手座');
    }
  }, [settings.birthDate]);

  const fetchDailyFortune = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 获取基础运势
      const result = await getDailyFortune(
        zodiacSign,
        lotteryType as string,
        settings.birthDate
      );

      if (result.success && result.data) {
        setFortune(result.data);
      } else if (result.error) {
        console.error('[DailyFortune Error]', result.error);
        setError(result.error.userFriendlyMessage);
      } else {
        console.error('[DailyFortune Error] Unknown error - no data and no error');
        setError('暂时无法获取运势');
      }

      // 获取增强运势（包含玄学分析）- 已禁用
      // const enhancedResult = await getEnhancedDailyFortune(
      //   settings.name,
      //   zodiacSign,
      //   settings.birthDate,
      //   lotteryType
      // );

      // if (enhancedResult.success && enhancedResult.data) {
      //   setEnhancedFortune(enhancedResult.data);
      // }
    } catch (err) {
      console.error('[DailyFortune Exception]', err);
      setError('获取运势失败');
    } finally {
      setLoading(false);
    }
  }, [zodiacSign, lotteryType, settings.birthDate, settings.name]);

  useEffect(() => {
    fetchDailyFortune()
  }, [fetchDailyFortune])

  // 每分钟检查一次幸运时间状态，触发重新渲染以更新UI
  useEffect(() => {
    const interval = setInterval(() => {
      // 强制重新渲染以更新幸运时间状态
      if (fortune) {
        const isNowLucky = isLuckyTime(fortune.luckyTime)
        // 可以在这里添加其他逻辑，比如触发通知等
        console.log('[DailyFortune] Checking lucky time:', isNowLucky)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [fortune])

  const handleRefresh = () => {
    fetchDailyFortune()
  };

  if (loading) {
    return <SkeletonFortune />;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-4 mb-4 border border-red-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Sparkle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-red-200">{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-red-300 hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  if (!fortune) {
    return null;
  }

  const isNowLucky = isLuckyTime(fortune.luckyTime);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-fuchsia-500/20 rounded-2xl p-5 mb-4 border border-purple-400/30 shadow-xl shadow-purple-500/10">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-fuchsia-500/20 rounded-full blur-3xl" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 rounded-xl border border-purple-400/30">
            <Sparkles className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <div className="text-base font-bold text-white">今日运势</div>
            <div className="text-xs text-purple-300/80">Neo专属好运指南</div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          title="刷新运势"
        >
          <RefreshCw className="w-5 h-5 text-purple-300 hover:text-white transition-colors" />
        </button>
      </div>

      <div className="mb-4 relative z-10">
        <div className="flex items-start gap-2.5">
          <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-base text-white leading-relaxed font-medium">
            {fortune.blessing}
          </p>
        </div>
      </div>

      <div className={`
        relative overflow-hidden rounded-xl p-4 mb-4
        ${isNowLucky
          ? 'bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-orange-500/90 shadow-lg shadow-amber-500/30'
          : 'bg-gradient-to-r from-purple-900/60 to-violet-900/60 border border-purple-400/20'
        }
      `}>
        {isNowLucky && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        )}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className={`
              p-2 rounded-lg
              ${isNowLucky ? 'bg-white/20' : 'bg-purple-500/30'}
            `}>
              <Clock className={`w-5 h-5 ${isNowLucky ? 'text-white' : 'text-purple-300'}`} />
            </div>
            <div>
              <div className={`text-sm font-semibold ${isNowLucky ? 'text-white' : 'text-purple-200'}`}>
                {isNowLucky ? '✨ 现在就是幸运时间！' : '今日最佳购彩时间'}
              </div>
              <div className={`text-lg font-bold ${isNowLucky ? 'text-white' : 'text-amber-300'}`}>
                {fortune.luckyTime}
              </div>
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
                
                {/* 日历按钮 */}
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
            </div>
          </div>
          {isNowLucky && (
            <div className="animate-bounce">
              <Sparkles className="w-8 h-8 text-white/80" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2.5 text-sm text-purple-200/80 relative z-10">
        <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>{fortune.reason}</p>
      </div>

      {/* 玄学分析卡片 - 已隐藏 */}
      {/* {enhancedFortune && (
        <MetaphysicsCard
          nameAnalysis={enhancedFortune.metaphysics.nameAnalysis}
          zodiacAnalysis={enhancedFortune.metaphysics.zodiacAnalysis}
          wuxingAnalysis={enhancedFortune.metaphysics.wuxingAnalysis}
          numerologyAnalysis={enhancedFortune.metaphysics.numerologyAnalysis}
        />
      )} */}

      {/* 推荐号码 - 已隐藏 */}
      {/* {enhancedFortune && (
        <RecommendedNumbers
          numbers={enhancedFortune.metaphysics.recommendedNumbers}
          onRefresh={fetchDailyFortune}
        />
      )} */}
    </div>
  );
}

function getZodiacSign(month: number, day: number): string {
  const zodiacDates = [
    { name: '摩羯座', endMonth: 1, endDay: 19 },
    { name: '水瓶座', endMonth: 2, endDay: 18 },
    { name: '双鱼座', endMonth: 3, endDay: 20 },
    { name: '白羊座', endMonth: 4, endDay: 19 },
    { name: '金牛座', endMonth: 5, endDay: 20 },
    { name: '双子座', endMonth: 6, endDay: 21 },
    { name: '巨蟹座', endMonth: 7, endDay: 22 },
    { name: '狮子座', endMonth: 8, endDay: 22 },
    { name: '处女座', endMonth: 9, endDay: 22 },
    { name: '天秤座', endMonth: 10, endDay: 23 },
    { name: '天蝎座', endMonth: 11, endDay: 22 },
    { name: '射手座', endMonth: 12, endDay: 21 },
    { name: '摩羯座', endMonth: 12, endDay: 31 }
  ];

  for (const zodiac of zodiacDates) {
    if (month === zodiac.endMonth && day <= zodiac.endDay) {
      return zodiac.name;
    }
  }
  return '摩羯座';
}
