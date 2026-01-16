import { useState, useEffect, useCallback } from 'react';
import { LuckyColorResult } from '../types/color';
import { UserSettings } from '../types/settings';
import { calculateLuckyColor } from '../utils/luckyColor';
import { getFromStorage, saveToStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { APP_CONFIG } from '../config/app';

export function useLuckyColor() {
  const [luckyColor, setLuckyColor] = useState<LuckyColorResult>(() => {
    const settings = getFromStorage<UserSettings>(STORAGE_KEYS.USER_SETTINGS, APP_CONFIG.defaultSettings);
    return calculateLuckyColor(
      new Date(new Date().getFullYear(), parseInt(settings.birthDate.split('-')[0]) - 1, parseInt(settings.birthDate.split('-')[1])),
      new Date()
    );
  });

  const updateLuckyColor = useCallback((settings: UserSettings) => {
    const [month, day] = settings.birthDate.split('-').map(Number);
    const birthDate = new Date(new Date().getFullYear(), month - 1, day);
    const currentDate = new Date();
    
    const newLuckyColor = calculateLuckyColor(birthDate, currentDate);
    setLuckyColor(newLuckyColor);
    
    const updatedSettings = {
      ...settings,
      luckyColor: {
        primary: newLuckyColor.primaryColor,
        secondary: newLuckyColor.secondaryColor,
        woodPurpleColors: newLuckyColor.woodPurpleColors
      }
    };
    
    saveToStorage(STORAGE_KEYS.USER_SETTINGS, updatedSettings);
  }, []);

  return {
    luckyColor,
    updateLuckyColor
  };
}
