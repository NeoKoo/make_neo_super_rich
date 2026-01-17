import { useMemo } from 'react';
import { LotteryType, LotteryConfig } from '../types/lottery';
import { LOTTERY_CONFIGS, getLotteryTypeByDate } from '../constants/lotteryTypes';
import { getLocalDateFromBeijing } from '../utils/dateUtils';

export function useLotteryConfig(date?: Date): {
  lotteryType: LotteryType;
  config: LotteryConfig;
} {
  // 如果没有传入date，使用北京时间
  const targetDate = date || getLocalDateFromBeijing();
  
  const lotteryType = useMemo(() => getLotteryTypeByDate(targetDate), [targetDate]);
  const config = useMemo(() => LOTTERY_CONFIGS[lotteryType], [lotteryType]);
  
  return { lotteryType, config };
}
