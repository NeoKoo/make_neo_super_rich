import { useState, useCallback } from 'react';
import { LuckyColorResult } from '../types/color';
import { UserSettings } from '../types/settings';
import { calculateLuckyColor } from '../utils/luckyColor';
import { getFromStorage, saveToStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { APP_CONFIG } from '../config/app';
import { getLocalDateFromBeijing } from '../utils/dateUtils';

export function useLuckyColor() {
  const [luckyColor, setLuckyColor] = useState<LuckyColorResult>(() => {
    const settings = getFromStorage<UserSettings>(STORAGE_KEYS.USER_SETTINGS, APP_CONFIG.defaultSettings);
    const currentDate = getLocalDateFromBeijing();
    return calculateLuckyColor(
      new Date(currentDate.getFullYear(), parseInt(settings.birthDate.split('-')[0]) - 1, parseInt(settings.birthDate.split('-')[1])),
      currentDate
    );
  });

  const updateLuckyColor = useCallback((settings: UserSettings) => {
    const currentDate = getLocalDateFromBeijing();
    const [month, day] = settings.birthDate.split('-').map(Number);
    const birthDate = new Date(currentDate.getFullYear(), month - 1, day);
    
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
