import { WuxingColor, WuxingType } from '../types/color';

export const WUXING_COLORS: Record<WuxingType, WuxingColor> = {
  木: { primary: '#7D6608', secondary: '#9A7D0A', name: '木质棕' },
  火: { primary: '#E74C3C', secondary: '#C0392B', name: '火焰红' },
  土: { primary: '#8D6E63', secondary: '#795548', name: '大地褐' },
  金: { primary: '#FFD700', secondary: '#FFC107', name: '金色' },
  水: { primary: '#1976D2', secondary: '#1565C0', name: '深蓝' }
};

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const stemWuxing: Record<string, WuxingType> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const branchWuxing: Record<string, WuxingType> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
  '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
  '戌': '土', '亥': '水'
};

export function calculateWuxing(birthDate: Date): WuxingType {
  const year = birthDate.getFullYear();
  
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  
  const stem = heavenlyStems[stemIndex];
  const branch = earthlyBranches[branchIndex];
  
  const stemWuxingType = stemWuxing[stem];
  const branchWuxingType = branchWuxing[branch];
  
  return stemWuxingType;
}
