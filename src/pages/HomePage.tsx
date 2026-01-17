import { getLocalDateFromBeijing } from '../utils/dateUtils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLotteryConfig } from '../hooks/useLotteryConfig';
import { useNumberSelection } from '../hooks/useNumberSelection';
import { useLuckyColor } from '../hooks/useLuckyColor';
import { useHistory } from '../hooks/useHistory';
import { useRandomNumbers } from '../hooks/useRandomNumbers';
import { useToast } from '../hooks/useToast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { RandomStrategy } from '../constants/randomStrategies';
import { LotteryTypeBadge } from '../components/lottery/LotteryTypeBadge';
import { NumberGrid } from '../components/lottery/NumberGrid';
import { SelectedNumbers } from '../components/lottery/SelectedNumbers';
import { RandomStrategyModal } from '../components/lottery/RandomStrategyModal';
import { TabBar } from '../components/layout/TabBar';
import { WealthGod } from '../components/ai/WealthGod';
import { DailyFortune } from '../components/fortune/DailyFortune';
import { APP_CONFIG } from '../config/app';

export function HomePage() {
  const navigate = useNavigate();
  const { lotteryType, config } = useLotteryConfig();
  const { redBalls, blueBalls, toggleRedBall, toggleBlueBall, clearSelection, setNumbers, isComplete } = useNumberSelection(config);
  const { luckyColor } = useLuckyColor();
  const { addHistory } = useHistory();
  const { generateNumbers } = useRandomNumbers();
  const { success, error } = useToast();
  const [settings] = useLocalStorage(
    'lottery_user_settings',
    APP_CONFIG.defaultSettings
  );
  
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [zodiacSign, setZodiacSign] = useState('');
  
  useEffect(() => {
    const birthDate = settings.birthDate;
    if (birthDate) {
      const [month, day] = birthDate.split('-').map(Number);
      const sign = getZodiacSign(month, day);
      setZodiacSign(sign);
    } else {
      setZodiacSign('未知');
    }
  }, [settings.birthDate]);

  const handleRandom = (strategy: RandomStrategy) => {
    try {
      const numbers = generateNumbers(strategy, config);
      setNumbers(numbers.redBalls, numbers.blueBalls);
      success('随机选号成功');
    } catch (err) {
      error('随机选号失败');
    }
  };

  const handleSave = () => {
    if (!isComplete) {
      error('请先完成选号');
      return;
    }

    const today = getLocalDateFromBeijing();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const lotteryId = `${year}${month}${day}`;

    addHistory({
      lotteryType: lotteryType,
      lotteryId,
      numbers: { redBalls, blueBalls },
      timestamp: Date.now(),
      strategyType: 'ai_god',
    });

    success('保存成功');
    navigate('/history');
  };

  const handleAIRecommend = (redBalls: number[], blueBalls: number[]) => {
    setNumbers(redBalls, blueBalls);
    success('AI财神推荐成功');
  };

  return (
    <div className="min-h-screen pb-32 bg-background-primary" style={{ '--primary-color': luckyColor.primaryColor } as React.CSSProperties}>
      <div className="px-4 pt-4 pb-32">
        <LotteryTypeBadge type={lotteryType} />
        
        <DailyFortune lotteryType={lotteryType} />
        
        <WealthGod
          lotteryType={lotteryType}
          zodiacSign={zodiacSign}
          birthDate={settings.birthDate}
          onSelectNumbers={handleAIRecommend}
        />
        
        <NumberGrid
          title="红球区"
          min={config.redBalls.min}
          max={config.redBalls.max}
          selected={redBalls}
          onSelect={toggleRedBall}
          color="red"
          matched={[]}
        />
        
        <NumberGrid
          title="蓝球区"
          min={config.blueBalls.min}
          max={config.blueBalls.max}
          selected={blueBalls}
          onSelect={toggleBlueBall}
          color="blue"
          matched={[]}
          size="sm"
        />
      </div>

      <SelectedNumbers
        redBalls={redBalls}
        blueBalls={blueBalls}
        onClear={clearSelection}
        lotteryType={lotteryType}
        isComplete={isComplete}
        onSave={handleSave}
        onRandom={() => setShowStrategyModal(true)}
      />

      <RandomStrategyModal
        isOpen={showStrategyModal}
        onClose={() => setShowStrategyModal(false)}
        onSelectStrategy={handleRandom}
      />

      <TabBar />
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
