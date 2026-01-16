import { NumerologyColor } from '../types/color';

export const NUMBER_COLOR_MAP: Record<number, NumerologyColor> = {
  1: { color: '#E74C3C', name: '红色' },
  2: { color: '#F1C40F', name: '黄色' },
  3: { color: '#E67E22', name: '橙色' },
  4: { color: '#27AE60', name: '绿色' },
  5: { color: '#3498DB', name: '蓝色' },
  6: { color: '#2980B9', name: '靛色' },
  7: { color: '#8E44AD', name: '紫色' },
  8: { color: '#E91E63', name: '粉色' },
  9: { color: '#8B4513', name: '棕色' }
};

export function calculateLifePathNumber(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  const yearSum = String(year).split('').map(Number).reduce((a, b) => a + b, 0);
  const totalSum = yearSum + month + day;
  
  return reduceToSingleDigit(totalSum);
}

export function calculateDailyNumber(date: Date): number {
  const day = date.getDate();
  const sum = String(day).split('').map(Number).reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(num: number): number {
  while (num >= 10 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return num;
}
