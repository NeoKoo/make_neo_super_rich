import { LuckyColorResult } from '../types/color';
import { ZODIAC_COLORS, getZodiacSign } from '../constants/zodiacColors';
import { WUXING_COLORS, calculateWuxing } from '../constants/wuxingColors';
import { NUMBER_COLOR_MAP, calculateLifePathNumber, calculateDailyNumber } from '../constants/numberColorMap';

export function calculateLuckyColor(birthDate: Date, currentDate: Date): LuckyColorResult {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  const zodiacSign = getZodiacSign(month, day);
  const zodiacResult = ZODIAC_COLORS[zodiacSign];
  
  const wuxingType = calculateWuxing(birthDate);
  const wuxingResult = WUXING_COLORS[wuxingType];
  
  const lifePath = calculateLifePathNumber(birthDate);
  const dailyNumber = calculateDailyNumber(currentDate);
  
  const combined = Math.floor((lifePath + dailyNumber) / 2);
  const numerologyColor = NUMBER_COLOR_MAP[combined] || NUMBER_COLOR_MAP[7];
  
  const colorCount: Record<string, number> = {};
  
  [zodiacResult.primary, wuxingResult.primary, numerologyColor.color].forEach(color => {
    colorCount[color] = (colorCount[color] || 0) + 1;
  });
  
  const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
  const primaryColor = sortedColors[0]?.[0] || '#8E44AD';
  
  const woodPurpleColors = [
    '#8E44AD',
    '#9B59B6',
    '#6C3483',
    '#884EA0',
    '#7D6608',
    '#9A7D0A',
    '#8B4513',
    '#A0522D',
    '#4A235A',
    '#5B2C6F',
    '#6C3483',
    '#7D3C98'
  ];
  
  return {
    zodiacColor: zodiacResult.primary,
    wuxingColor: wuxingResult.primary,
    numerologyColor: numerologyColor.color,
    primaryColor,
    secondaryColor: zodiacResult.secondary,
    woodPurpleColors
  };
}
