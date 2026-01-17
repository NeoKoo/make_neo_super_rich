import { useState, useCallback } from 'react';
import { HistoryRecord, DrawResult } from '../types/history';
import { LotteryType } from '../types/lottery';
import { fetchLatestDraw, fetchDrawByIssue, calculatePrize } from '../utils/lotteryAPI';
import { getDrawFromCache, saveDrawToCache } from '../utils/drawCache';

export function useLotteryAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndCheckDraws = useCallback(async (history: HistoryRecord[]): Promise<HistoryRecord[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedRecords = await Promise.all(
        history.map(async (record) => {
          if (record.drawNumbers) {
            return record;
          }

          const cached = getDrawFromCache(record.lotteryId);
          let drawResult: DrawResult | null = null;
          
          if (cached) {
            drawResult = {
              lotteryId: cached.lotteryId,
              lotteryType: cached.lotteryType,
              drawDate: cached.drawDate,
              numbers: cached.numbers,
              issue: cached.lotteryId
            };
          } else {
            drawResult = await fetchDrawByIssue(record.lotteryType, record.lotteryId);
          }
          
          if (drawResult) {
            saveDrawToCache(drawResult);
            
            const match = calculatePrize(record.numbers, drawResult.numbers, record.lotteryType);
            
            return {
              ...record,
              drawDate: drawResult.drawDate,
              drawNumbers: drawResult.numbers,
              matchCount: {
                red: match.redMatches,
                blue: match.blueMatches
              },
              prize: match.prize
            };
          }
          
          return record;
        })
      );
      
      return updatedRecords;
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
      return history;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLatestDrawInternal = useCallback(async (lotteryType: LotteryType): Promise<DrawResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchLatestDraw(lotteryType);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchAndCheckDraws,
    fetchLatestDraw
  };
}
