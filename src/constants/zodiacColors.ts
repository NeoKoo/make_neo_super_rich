import { ZodiacColor } from '../types/color';

export const ZODIAC_COLORS: Record<string, ZodiacColor> = {
  白羊座: { primary: '#E74C3C', secondary: '#C0392B', name: '火红色' },
  金牛座: { primary: '#27AE60', secondary: '#1E8449', name: '森林绿' },
  双子座: { primary: '#F39C12', secondary: '#D68910', name: '阳光黄' },
  巨蟹座: { primary: '#9B59B6', secondary: '#8E44AD', name: '月光紫' },
  狮子座: { primary: '#E74C3C', secondary: '#F1C40F', name: '金色' },
  处女座: { primary: '#85C1E9', secondary: '#5DADE2', name: '天空蓝' },
  天秤座: { primary: '#F4D03F', secondary: '#D4AC0D', name: '柔和黄' },
  天蝎座: { primary: '#8B0000', secondary: '#A93226', name: '深红' },
  射手座: { primary: '#6C3483', secondary: '#884EA0', name: '皇家紫' },
  摩羯座: { primary: '#2E4053', secondary: '#34495E', name: '深灰' },
  水瓶座: { primary: '#3498DB', secondary: '#2980B9', name: '电光蓝' },
  双鱼座: { primary: '#5DADE2', secondary: '#3498DB', name: '海蓝色' }
};

export function getZodiacSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return '双子座';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return '巨蟹座';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '天秤座';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '天蝎座';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '射手座';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
  return '双鱼座';
}
