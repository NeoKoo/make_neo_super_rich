import { WuxingColor, WuxingType } from '../types/color';

export const WUXING_COLORS: Record<WuxingType, WuxingColor> = {
  木: { primary: '#7D6608', secondary: '#9A7D0A', name: '木质棕' },
  火: { primary: '#E74C3C', secondary: '#C0392B', name: '火焰红' },
  土: { primary: '#8D6E63', secondary: '#795548', name: '大地褐' },
  金: { primary: '#FFD700', secondary: '#FFC107', name: '金色' },
  水: { primary: '#1976D2', secondary: '#1565C0', name: '深蓝' }
};

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

const stemWuxing: Record<string, WuxingType> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

export function calculateWuxing(birthDate: Date): WuxingType {
  const year = birthDate.getFullYear();
  const stemIndex = (year - 4) % 10;
  const stem = heavenlyStems[stemIndex];
  const stemWuxingType = stemWuxing[stem];
  return stemWuxingType;
}
