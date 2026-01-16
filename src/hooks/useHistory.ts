import { useState, useEffect, useCallback } from 'react';
import { HistoryRecord } from '../types/history';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { LotteryType } from '../types/lottery';

export function useHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const savedHistory = getFromStorage<HistoryRecord[]>(STORAGE_KEYS.HISTORY, []);
    const sortedHistory = savedHistory.sort((a, b) => b.timestamp - a.timestamp);
    setHistory(sortedHistory);
  }, []);

  const addHistory = useCallback((record: Omit<HistoryRecord, 'id'>) => {
    const newRecord: HistoryRecord = {
      ...record,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    saveToStorage(STORAGE_KEYS.HISTORY, updatedHistory);
  }, [history]);

  const updateHistory = useCallback((id: string, updates: Partial<HistoryRecord>) => {
    const updatedHistory = history.map(record => 
      record.id === id ? { ...record, ...updates } : record
    );
    setHistory(updatedHistory);
    saveToStorage(STORAGE_KEYS.HISTORY, updatedHistory);
  }, [history]);

  const deleteHistory = useCallback((id: string) => {
    const updatedHistory = history.filter(record => record.id !== id);
    setHistory(updatedHistory);
    saveToStorage(STORAGE_KEYS.HISTORY, updatedHistory);
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    removeFromStorage(STORAGE_KEYS.HISTORY);
  }, []);

  const getHistoryByType = useCallback((lotteryType: LotteryType) => {
    return history.filter(record => record.lotteryType === lotteryType);
  }, [history]);

  return {
    history,
    addHistory,
    updateHistory,
    deleteHistory,
    clearHistory,
    getHistoryByType
  };
}
