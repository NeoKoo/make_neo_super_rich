import { WuxingType } from '../types/fortune'
import { getLocalDateFromBeijing } from './dateUtils'

/**
 * 基于当前时间生成动态因子
 */
export function generateTimeBasedFactor(): number {
  const now = getLocalDateFromBeijing()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  
  // 基于时分秒生成0.8-1.2之间的动态因子
  const timeFactor = 0.8 + (hours / 24) * 0.2 + (minutes / 60) * 0.1 + (seconds / 60) * 0.1
  return Math.min(1.2, Math.max(0.8, timeFactor))
}

/**
 * 生成月相影响因子
 */
export function generateMoonPhaseFactor(): number {
  const now = getLocalDateFromBeijing()
  const day = now.getDate()
  
  // 简化的月相计算，基于日期生成0.9-1.1之间的因子
  const moonPhase = (day % 30) / 30 // 0-1之间
  return 0.9 + Math.sin(moonPhase * Math.PI * 2) * 0.1
}

/**
 * 生成节气影响因子
 */
export function generateSolarTermFactor(): number {
  const now = getLocalDateFromBeijing()
  const month = now.getMonth() + 1
  const day = now.getDate()
  
  // 简化的节气计算，基于月份和日期生成0.95-1.05之间的因子
  const solarTermProgress = ((month - 1) * 2 + (day / 15)) % 24
  return 0.95 + Math.sin(solarTermProgress * Math.PI / 12) * 0.05
}

/**
 * 生成随机波动因子
 */
export function generateRandomFactor(min: number = 0.9, max: number = 1.1): number {
  return min + Math.random() * (max - min)
}

/**
 * 综合动态因子
 */
export function getCombinedDynamicFactor(): number {
  const timeFactor = generateTimeBasedFactor()
  const moonPhaseFactor = generateMoonPhaseFactor()
  const solarTermFactor = generateSolarTermFactor()
  const randomFactor = generateRandomFactor()
  
  // 综合所有因子，并限制在合理范围内
  const combined = timeFactor * moonPhaseFactor * solarTermFactor * randomFactor
  return Math.min(1.3, Math.max(0.7, combined))
}

/**
 * 动态调整幸运数字
 */
export function adjustLuckyNumbers(baseNumbers: number[], dynamicFactor: number): number[] {
  // 基于动态因子调整数字顺序和权重
  const adjusted = [...baseNumbers].map(num => {
    // 为每个数字添加基于动态因子的权重
    const weight = dynamicFactor + (num % 7) * 0.05
    return { num, weight }
  })
  
  // 按权重排序
  adjusted.sort((a, b) => b.weight - a.weight)
  
  // 添加一些随机性
  if (Math.random() > 0.7) {
    // 30%概率打乱顺序
    const idx1 = Math.floor(Math.random() * adjusted.length)
    const idx2 = Math.floor(Math.random() * adjusted.length)
    ;[adjusted[idx1], adjusted[idx2]] = [adjusted[idx2], adjusted[idx1]]
  }
  
  return adjusted.map(item => item.num)
}

/**
 * 动态生成运势建议
 */
export function generateDynamicAdvice(baseAdvice: string, wuxing: WuxingType): string {
  const dynamicAdvices: Record<WuxingType, string[]> = {
    '木': [
      '今日木气旺盛，适合开拓新领域，把握机会！',
      '木行能量充沛，创造力强，适合创新思维。',
      '木元素活跃，人际关系和谐，适合社交活动。'
    ],
    '火': [
      '今日火势强劲，热情高涨，适合展现领导力！',
      '火行能量充沛，行动力强，适合启动新项目。',
      '火元素活跃，表达欲强，适合沟通交流。'
    ],
    '土': [
      '今日土气稳定，踏实前行，适合长期规划！',
      '土行能量充沛，稳定性强，适合处理事务。',
      '土元素活跃，安全感强，适合家庭活动。'
    ],
    '金': [
      '今日金气锐利，思维清晰，适合做重要决定！',
      '金行能量充沛，决断力强，适合解决问题。',
      '金元素活跃，正义感强，适合维护权益。'
    ],
    '水': [
      '今日水流顺畅，灵感丰富，适合创意工作！',
      '水行能量充沛，适应性強，适合灵活应对。',
      '水元素活跃，感受力强，适合情感交流。'
    ]
  }
  
  const advices = dynamicAdvices[wuxing] || dynamicAdvices['土']
  const randomIndex = Math.floor(Math.random() * advices.length)
  
  // 70%概率使用动态建议，30%概率使用基础建议
  return Math.random() > 0.3 ? advices[randomIndex] : baseAdvice
}

/**
 * 动态生成幸运色
 */
export function generateDynamicLuckyColor(wuxing: WuxingType): string {
  const baseColors: Record<WuxingType, string[]> = {
    '木': ['#22C55E', '#16A34A', '#15803D', '#166534', '#14532D'],
    '火': ['#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'],
    '土': ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'],
    '金': ['#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12'],
    '水': ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A']
  }
  
  const colors = baseColors[wuxing] || baseColors['土']
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

/**
 * 动态生成幸运方位
 */
export function generateDynamicLuckyDirection(baseDirection: string): string {
  const directions = ['东方', '东南方', '南方', '西南方', '西方', '西北方', '北方', '东北方']
  const currentIndex = directions.indexOf(baseDirection)
  
  // 60%概率返回基础方位，40%概率返回相邻方位
  if (Math.random() > 0.4) {
    return baseDirection
  }
  
  // 返回相邻方位
  const offset = Math.random() > 0.5 ? 1 : -1
  const newIndex = (currentIndex + offset + directions.length) % directions.length
  return directions[newIndex]
}

/**
 * 动态生成置信度
 */
export function generateDynamicConfidence(baseConfidence: number, dynamicFactor: number): number {
  // 基于动态因子调整置信度
  let adjusted = baseConfidence * dynamicFactor
  
  // 添加随机波动
  adjusted += (Math.random() - 0.5) * 10
  
  // 限制在合理范围内
  return Math.min(95, Math.max(55, Math.round(adjusted)))
}