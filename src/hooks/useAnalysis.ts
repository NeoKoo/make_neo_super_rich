import { useMemo } from 'react';
import { LotteryType } from '../types/lottery';
import { HistoryRecord } from '../types/history';
import { AnalysisData } from '../types/analysis';
import { AnalysisService } from '../utils/analysisService';
import { useHistory } from './useHistory';
import { useLotteryConfig } from './useLotteryConfig';

export function useAnalysis(): AnalysisData | null {
  const { history } = useHistory();
  const { lotteryType } = useLotteryConfig();
  
  const analysisData = useMemo(() => {
    if (history.length === 0) {
      return null;
    }
    
    return AnalysisService.generateCompleteAnalysis(history, lotteryType);
  }, [history, lotteryType]);
  
  return analysisData;
}