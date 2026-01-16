import { useCallback } from 'react';
import { LotteryConfig } from '../types/lottery';
import { NumberSelection } from '../types/lottery';
import { generateRandomNumbers } from '../utils/randomStrategies';

export function useRandomNumbers() {
  const generateNumbers = useCallback((
    strategy: 'balanced_odd_even' | 'sum_range' | 'full_random',
    config: LotteryConfig
  ): NumberSelection => {
    return generateRandomNumbers(strategy, config);
  }, []);

  return {
    generateNumbers
  };
}
