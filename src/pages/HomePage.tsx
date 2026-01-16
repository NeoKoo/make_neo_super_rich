import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LotteryType } from '../../types/lottery';
import { useLotteryConfig } from '../../hooks/useLotteryConfig';
import { useNumberSelection } from '../../hooks/useNumberSelection';
import { useLuckyColor } from '../../hooks/useLuckyColor';
import { useHistory } from '../../hooks/useHistory';
import { useRandomNumbers } from '../../hooks/useRandomNumbers';
import { useToast } from '../../hooks/useToast';
import { RandomStrategy } from '../../constants/randomStrategies';
import { LotteryTypeBadge } from '../lottery/LotteryTypeBadge';
import { NumberGrid } from '../lottery/NumberGrid';
import { SelectedNumbers } from '../lottery/SelectedNumbers';
import { RandomStrategyModal } from '../lottery/RandomStrategyModal';
import { TabBar } from '../layout/TabBar';

export function HomePage() {
  const navigate = useNavigate();
  const { lotteryType, config } = useLotteryConfig();
  const { redBalls, blueBalls, toggleRedBall, toggleBlueBall, clearSelection, setNumbers, isComplete } = useNumberSelection(config);
  const { luckyColor } = useLuckyColor();
  const { addHistory } = useHistory();
  const { generateNumbers } = useRandomNumbers();
  const { success, error } = useToast();
  
  const [showStrategyModal, setShowStrategyModal] = useState(false);

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

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const lotteryId = `${year}${month}${day}`;

    addHistory({
      lotteryType: lotteryType as '双色球' | '大乐透',
      lotteryId,
      numbers: { redBalls, blueBalls },
      timestamp: Date.now(),
      strategyType: 'full_random',
    });

    success('保存成功');
    navigate('/history');
  };

  return (
    <div className="min-h-screen pb-32 bg-background-primary" style={{ '--primary-color': luckyColor.primaryColor }}>
      <div className="px-4 pt-4 pb-32">
        <LotteryTypeBadge type={lotteryType} />
        
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
