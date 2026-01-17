import { StorageDrawCache } from '../types/storage';
import { DrawResult } from '../types/history';
import { getFromStorage, saveToStorage } from './storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { API_CONFIG } from '../config/api';

export function getDrawFromCache(lotteryId: string): StorageDrawCache | null {
  try {
    const caches = getFromStorage<StorageDrawCache[]>(STORAGE_KEYS.DRAW_CACHE, []);
    const cached = caches.find(c => c.lotteryId === lotteryId);
    
    if (!cached) {
      return null;
    }
    
    if (Date.now() > cached.expiresAt) {
      removeDrawFromCache(lotteryId);
      return null;
    }
    
    return cached;
  } catch (error) {
    console.error('获取开奖缓存失败:', error);
    return null;
  }
}

export function saveDrawToCache(drawResult: DrawResult): void {
  try {
    const caches = getFromStorage<StorageDrawCache[]>(STORAGE_KEYS.DRAW_CACHE, []);
    
    const existingIndex = caches.findIndex(c => c.lotteryId === drawResult.lotteryId);
    const newCache: StorageDrawCache = {
      lotteryId: drawResult.lotteryId,
      lotteryType: drawResult.lotteryType,
      drawDate: drawResult.drawDate,
      numbers: drawResult.numbers,
      cachedAt: Date.now(),
      expiresAt: Date.now() + API_CONFIG.cacheDuration
    };
    
    if (existingIndex >= 0) {
      caches[existingIndex] = newCache;
    } else {
      caches.push(newCache);
    }
    
    saveToStorage(STORAGE_KEYS.DRAW_CACHE, caches);
  } catch (error) {
    console.error('保存开奖缓存失败:', error);
  }
}

export function removeDrawFromCache(lotteryId: string): void {
  try {
    const caches = getFromStorage<StorageDrawCache[]>(STORAGE_KEYS.DRAW_CACHE, []);
    const filtered = caches.filter(c => c.lotteryId !== lotteryId);
    saveToStorage(STORAGE_KEYS.DRAW_CACHE, filtered);
  } catch (error) {
    console.error('移除开奖缓存失败:', error);
  }
}

export function clearExpiredCaches(): void {
  try {
    const caches = getFromStorage<StorageDrawCache[]>(STORAGE_KEYS.DRAW_CACHE, []);
    const now = Date.now();
    const validCaches = caches.filter(c => c.expiresAt > now);
    saveToStorage(STORAGE_KEYS.DRAW_CACHE, validCaches);
  } catch (error) {
    console.error('清理过期缓存失败:', error);
  }
}

export function clearAllCaches(): void {
  try {
    saveToStorage(STORAGE_KEYS.DRAW_CACHE, []);
  } catch (error) {
    console.error('清理所有缓存失败:', error);
  }
}
