import { getLocalDateFromBeijing, isFriday } from '../utils/dateUtils';
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
import { RandomStrategyModal } from '../components/lottery/RandomStrategyModal';
import { ActionButtons } from '../components/lottery/ActionButtons';
import { WealthGod } from '../components/ai/WealthGod';
import { DailyFortune } from '../components/fortune/DailyFortune';
import { CoinAnimation } from '../components/animation/CoinAnimation';
import { DragonBallAnimation } from '../components/animation/DragonBallAnimation';
import { ShenlongSummon } from '../components/animation/ShenlongSummon';
import { NoDrawDayAnimation } from '../components/animation/NoDrawDayAnimation';
import { PlumBlossomCard } from '../components/plumBlossom/PlumBlossomCard';
import { APP_CONFIG } from '../config/app';
import { analyzePlumBlossom } from '../utils/plumBlossomCalculator';

export function HomePage() {
  const navigate = useNavigate();
  const { lotteryType, config } = useLotteryConfig();
  const { redBalls, blueBalls, toggleRedBall, toggleBlueBall, clearSelection, setNumbers, isComplete, dragonBallTrigger } = useNumberSelection(config);
  const { luckyColor } = useLuckyColor();
  const { addHistory } = useHistory();
  const { generateNumbers } = useRandomNumbers();
  const { success, error } = useToast();
  const [settings] = useLocalStorage(
    'lottery_user_settings',
    APP_CONFIG.defaultSettings
  );
  
  // 检查今天是否为星期五
  const todayIsFriday = isFriday();
  
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [zodiacSign, setZodiacSign] = useState('');
  const [showCoinsAfterExplosion, setShowCoinsAfterExplosion] = useState(false);
  const [showShenlongSummon, setShowShenlongSummon] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [plumBlossomAnalysis, setPlumBlossomAnalysis] = useState<any>(null);
  
  useEffect(() => {
    const birthDate = settings.birthDate;
    if (birthDate) {
      const [month, day] = birthDate.split('-').map(Number);
      const sign = getZodiacSign(month, day);
      setZodiacSign(sign);
    } else {
      setZodiacSign('未知');
    }

    // 计算梅花易数分析
    const currentDate = getLocalDateFromBeijing();
    const plumBlossomResult = analyzePlumBlossom(currentDate, lotteryType);
    setPlumBlossomAnalysis(plumBlossomResult);
  }, [settings.birthDate, lotteryType]);
 
  const handleRandom = (strategy: RandomStrategy) => {
    try {
      const numbers = generateNumbers(strategy, config);
      setNumbers(numbers.redBalls, numbers.blueBalls);
      success('随机选号成功');
    } catch (err) {
      error('随机选号失败');
    }
  };
 
  const handleSave = async () => {
    if (!isComplete) {
      error('请先完成选号');
      return;
    }

    setIsSaving(true);

    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
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

      setTimeout(() => {
        console.log('[HomePage] Triggering celebration animations');
        setShowCoinsAfterExplosion(true);
        setShowShenlongSummon(true);
      }, 1000);

      setTimeout(() => {
        navigate('/history');
      }, 5500);
    } finally {
      setIsSaving(false);
    }
  };
 
  const handleAIRecommend = (redBalls: number[], blueBalls: number[]) => {
    setNumbers(redBalls, blueBalls);
    success('AI财神推荐成功');
  };
 
  const handleSaveAIRecommendation = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
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
 
    setTimeout(() => {
      console.log('[HomePage] Triggering celebration animations');
      setShowCoinsAfterExplosion(true);
      setShowShenlongSummon(true);
    }, 1000);
 
    setTimeout(() => {
      navigate('/history');
    }, 5500);
  };
 
  const handleCelebrationComplete = () => {
    setShowCoinsAfterExplosion(false);
  };
 
  const handleShenlongComplete = () => {
    setShowShenlongSummon(false);
  };
 
  return (
    <div className="min-h-screen bg-background-primary pb-40" style={{ '--primary-color': luckyColor.primaryColor } as React.CSSProperties}>
      <div className="px-4 pt-4 pb-48">
        <LotteryTypeBadge type={lotteryType} />
        
        {todayIsFriday ? (
          <NoDrawDayAnimation />
        ) : (
          <>
            <DailyFortune lotteryType={lotteryType} />
            
            {plumBlossomAnalysis && <PlumBlossomCard analysis={plumBlossomAnalysis} />}
            
            <WealthGod
              lotteryType={lotteryType}
              zodiacSign={zodiacSign}
              birthDate={settings.birthDate}
              userName={settings.name || '高创杰'}
              onSelectNumbers={handleAIRecommend}
              onSaveAIRecommendation={handleSaveAIRecommendation}
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
          </>
        )}
      </div>

      {!todayIsFriday && (
        <>
          <RandomStrategyModal
            isOpen={showStrategyModal}
            onClose={() => setShowStrategyModal(false)}
            onSelectStrategy={handleRandom}
          />

          <ActionButtons
            redBalls={redBalls}
            blueBalls={blueBalls}
            onClear={clearSelection}
            onRandom={() => setShowStrategyModal(true)}
            onSave={handleSave}
            isComplete={isComplete}
            lotteryType={lotteryType}
            loading={isSaving}
          />

          <DragonBallAnimation
            trigger={dragonBallTrigger}
          />

          <CoinAnimation
            trigger={showCoinsAfterExplosion}
            type="large"
            onComplete={handleCelebrationComplete}
          />

          <ShenlongSummon
            trigger={showShenlongSummon}
            onComplete={handleShenlongComplete}
          />
        </>
      )}
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
