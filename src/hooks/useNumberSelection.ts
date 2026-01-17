import { useState, useCallback } from 'react';
import { LotteryConfig } from '../types/lottery';

export function useNumberSelection(config: LotteryConfig) {
  const [redBalls, setRedBalls] = useState<number[]>([]);
  const [blueBalls, setBlueBalls] = useState<number[]>([]);
  const [coinTrigger, setCoinTrigger] = useState(0);

  const triggerCoinAnimation = useCallback(() => {
    setCoinTrigger(prev => prev + 1);
  }, []);

  const toggleRedBall = useCallback((num: number) => {
    setRedBalls(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      
      if (prev.length >= config.redBalls.count) {
        return prev;
      }
      
      // 触发金币动画
      triggerCoinAnimation();
      
      return [...prev, num].sort((a, b) => a - b);
    });
  }, [config.redBalls.count, triggerCoinAnimation]);

  const toggleBlueBall = useCallback((num: number) => {
    setBlueBalls(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      
      if (prev.length >= config.blueBalls.count) {
        return prev;
      }
      
      // 触发金币动画
      triggerCoinAnimation();
      
      return [...prev, num].sort((a, b) => a - b);
    });
  }, [config.blueBalls.count, triggerCoinAnimation]);

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
    coinTrigger
  };
}
