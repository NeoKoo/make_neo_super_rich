import { useState, useCallback } from 'react';
import { LotteryConfig } from '../types/lottery';

export function useNumberSelection(config: LotteryConfig) {
  const [redBalls, setRedBalls] = useState<number[]>([]);
  const [blueBalls, setBlueBalls] = useState<number[]>([]);
  const [ingotTrigger, setIngotTrigger] = useState(0);

  const triggerIngotAnimation = useCallback(() => {
    setIngotTrigger(prev => prev + 1);
  }, []);

  const toggleRedBall = useCallback((num: number) => {
    setRedBalls(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      
      if (prev.length >= config.redBalls.count) {
        return prev;
      }
      
      // 触发元宝掉落动画
      triggerIngotAnimation();
      
      // 触发震动反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      return [...prev, num].sort((a, b) => a - b);
    });
  }, [config.redBalls.count, triggerIngotAnimation]);

  const toggleBlueBall = useCallback((num: number) => {
    setBlueBalls(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      
      if (prev.length >= config.blueBalls.count) {
        return prev;
      }
      
      // 触发元宝掉落动画
      triggerIngotAnimation();
      
      // 触发震动反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      return [...prev, num].sort((a, b) => a - b);
    });
  }, [config.blueBalls.count, triggerIngotAnimation]);

  const clearSelection = useCallback(() => {
    setRedBalls([]);
    setBlueBalls([]);
  }, []);

  const setNumbers = useCallback((redBalls: number[], blueBalls: number[]) => {
    setRedBalls(redBalls);
    setBlueBalls(blueBalls);
  }, []);

  const isComplete = redBalls.length === config.redBalls.count && 
                    blueBalls.length === config.blueBalls.count;
  
  const redProgress = `${redBalls.length}/${config.redBalls.count}`;
  const blueProgress = `${blueBalls.length}/${config.blueBalls.count}`;

  return {
    redBalls,
    blueBalls,
    toggleRedBall,
    toggleBlueBall,
    clearSelection,
    setNumbers,
    isComplete,
    redProgress,
    blueProgress,
    ingotTrigger
  };
}
