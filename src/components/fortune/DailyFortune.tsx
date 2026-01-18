import { useState, useEffect } from 'react';
import { getDailyFortune, isLuckyTime } from '../../utils/fortuneService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { APP_CONFIG } from '../../config/app';
import { LotteryType } from '../../types/lottery';
import { Sparkles, Clock, RefreshCw, Star, BookOpen, Sparkle } from 'lucide-react';

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

  // 计算星座
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

  // 获取每日运势
  useEffect(() => {
    fetchDailyFortune();
  }, [lotteryType, zodiacSign]);

  // 定时检查幸运时间状态
  useEffect(() => {
    const interval = setInterval(() => {
      // 每分钟检查一次幸运时间状态
    }, 60000);

    return () => clearInterval(interval);
  }, [fortune?.luckyTime]);

  const fetchDailyFortune = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getDailyFortune(
        zodiacSign,
        lotteryType as string,
        settings.birthDate
      );

      if (result) {
        setFortune(result);
      } else {
        setError('暂时无法获取运势');
      }
    } catch (err) {
      setError('获取运势失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDailyFortune();
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-2xl p-5 mb-4 border border-purple-400/20">
        {/* 动画背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-[shimmer_2s_infinite]" />
        <div className="flex items-center justify-center gap-3 relative z-10">
          <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
          <span className="text-sm text-purple-200">正在获取今日运势...</span>
        </div>
      </div>
    );
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
      {/* 装饰性光晕 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-fuchsia-500/20 rounded-full blur-3xl" />

      {/* 头部 */}
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

      {/* 祝福语 */}
      <div className="mb-4 relative z-10">
        <div className="flex items-start gap-2.5">
          <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-base text-white leading-relaxed font-medium">
            {fortune.blessing}
          </p>
        </div>
      </div>

      {/* 幸运时间 */}
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
            </div>
          </div>
          {isNowLucky && (
            <div className="animate-bounce">
              <Sparkles className="w-8 h-8 text-white/80" />
            </div>
          )}
        </div>
      </div>

      {/* 幸运原因 */}
      <div className="flex items-start gap-2.5 text-sm text-purple-200/80 relative z-10">
        <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>{fortune.reason}</p>
      </div>
    </div>
  );
}

// 辅助函数：计算星座
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
