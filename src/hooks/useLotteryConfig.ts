import { useMemo } from 'react';
import { LotteryType, LotteryConfig } from '../types/lottery';
import { LOTTERY_CONFIGS, getLotteryTypeByDate } from '../constants/lotteryTypes';

export function useLotteryConfig(date: Date = new Date()): {
  lotteryType: LotteryType;
  config: LotteryConfig;
} {
  const lotteryType = useMemo(() => getLotteryTypeByDate(date), [date]);
  const config = useMemo(() => LOTTERY_CONFIGS[lotteryType], [lotteryType]);
  
  return { lotteryType, config };
}
