import { useState, useEffect } from 'react';
import { getDailyFortune, isLuckyTime } from '../../utils/fortuneService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { APP_CONFIG } from '../../config/app';
import { LotteryType } from '../../types/lottery';

interface DailyFortuneProps {
  lotteryType: LotteryType;
}

export function DailyFortune({ lotteryType }: DailyFortuneProps) {
  const [settings, setSettings] = useLocalStorage(
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
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="animate-spin text-xl">🔮</span>
          <span className="text-sm text-purple-200">正在获取运势...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span className="text-sm text-purple-200">{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="text-purple-300 hover:text-white text-sm transition-colors"
          >
            🔄
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
    <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-4 mb-4 border border-purple-400/30">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <div>
            <div className="text-sm font-bold text-white">今日运势</div>
            <div className="text-xs text-purple-200">Neo专属</div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="text-purple-300 hover:text-white transition-colors"
          title="刷新运势"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* 祝福语 */}
      <div className="mb-3">
        <div className="flex items-start gap-2">
          <span className="text-xl">✨</span>
          <p className="text-base text-white leading-relaxed">
            {fortune.blessing}
          </p>
        </div>
      </div>

      {/* 幸运时间 */}
      <div className={`mb-3 p-3 rounded-lg ${
        isNowLucky
          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg'
          : 'bg-purple-900/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={isNowLucky ? 'animate-pulse text-2xl' : 'text-2xl'}>
              {isNowLucky ? '🌟' : '🕐'}
            </span>
            <div>
              <div className="text-sm font-semibold text-white">
                {isNowLucky ? '现在就是幸运时间！' : '今日最佳购彩时间'}
              </div>
              <div className={`text-lg font-bold ${isNowLucky ? 'text-white' : 'text-yellow-300'}`}>
                {fortune.luckyTime}
              </div>
            </div>
          </div>
          {isNowLucky && (
            <div className="animate-bounce">
              <span className="text-2xl">🎯</span>
            </div>
          )}
        </div>
      </div>

      {/* 幸运原因 */}
      <div className="flex items-start gap-2 text-sm text-purple-200">
        <span>📖</span>
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
