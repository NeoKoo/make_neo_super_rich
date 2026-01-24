import { LotteryType } from '../types/lottery'
import {
  NameAnalysis,
  ZodiacAnalysis,
  WuxingAnalysis,
  NumerologyAnalysis,
  RecommendedNumbers,
  WuxingType
} from '../types/fortune'
import {
  calculateNameStrokes,
  calculateNameWuxing,
  getNameFortune,
  WUXING_LUCKY_NUMBERS,
  ZODIAC_ELEMENTS,
  ZODIAC_LUCKY_NUMBERS,
  ZODIAC_DIRECTIONS,
  NUMEROLOGY_MEANINGS,
  LIFE_PATH_LUCKY_NUMBERS,
  getWuxingRelationship,
  calculateTodayWuxing
} from '../constants/metaphysics'
import { calculateLifePathNumber, calculateDailyNumber } from '../constants/numberColorMap'
import { getZodiacSign } from '../constants/zodiacColors'
import {
  getCombinedDynamicFactor,
  adjustLuckyNumbers,
  generateDynamicAdvice,
  generateDynamicLuckyColor,
  generateDynamicLuckyDirection,
  generateDynamicConfidence
} from './dynamicMetaphysics'
import { analyzePlumBlossom } from './plumBlossomCalculator'

// 名字分析
export function analyzeName(name: string): NameAnalysis {
  const totalStrokes = calculateNameStrokes(name)
  const wuxing = calculateNameWuxing(name)
  const fortune = getNameFortune(totalStrokes)

  // 基于名字笔画数生成幸运数字
  const baseLuckyNumbers = WUXING_LUCKY_NUMBERS[wuxing]
  const strokeBasedNumbers = [
    totalStrokes % 35 + 1,
    (totalStrokes * 2) % 35 + 1,
    (totalStrokes * 3) % 35 + 1
  ].map(n => Math.min(n, 35))

  // 合并并去重
  const luckyNumbers = Array.from(new Set([...baseLuckyNumbers, ...strokeBasedNumbers]))

  // 名字含义
  const meanings: Record<string, string> = {
    大吉: '名字寓意吉祥，福星高照，事业有成',
    吉: '名字寓意良好，运势平稳，多有贵人相助',
    中吉: '名字寓意尚可，需要努力，终有回报',
    平: '名字寓意平平，需要更加努力',
    凶: '名字寓意欠佳，需要谨慎行事'
  }

  return {
    totalStrokes,
    wuxing,
    luckyNumbers: luckyNumbers.slice(0, 7),
    meaning: meanings[fortune],
    fortune
  }
}

// 星座深度分析
export function analyzeZodiac(zodiacSign: string, currentDate: Date): ZodiacAnalysis {
  const element = ZODIAC_ELEMENTS[zodiacSign]
  const baseLuckyNumbers = ZODIAC_LUCKY_NUMBERS[zodiacSign]
  const baseLuckyDirection = ZODIAC_DIRECTIONS[zodiacSign]

  // 获取动态因子
  const dynamicFactor = getCombinedDynamicFactor()

  // 计算今日运势指数（1-10），添加动态因子影响
  const day = currentDate.getDate()
  const month = currentDate.getMonth() + 1
  const baseLuck = ((day + month) % 5) + 5
  const adjustedLuck = baseLuck * dynamicFactor
  const todayLuck = Math.min(10, Math.max(1, Math.round(adjustedLuck)))

  // 动态调整幸运数字
  const luckyNumbers = adjustLuckyNumbers(baseLuckyNumbers, dynamicFactor)

  // 动态生成幸运色
  const luckyColor = generateDynamicLuckyColor(element as any)

  // 动态生成幸运方位
  const luckyDirection = generateDynamicLuckyDirection(baseLuckyDirection)

  // 基于运势指数的建议
  let advice = ''
  if (todayLuck >= 8) {
    advice = '今日运势极佳，适合做重要决定，把握机会！'
  } else if (todayLuck >= 6) {
    advice = '今日运势良好，适合稳步前进，保持积极心态。'
  } else if (todayLuck >= 4) {
    advice = '今日运势平稳，适合处理日常事务，谨慎行事。'
  } else {
    advice = '今日运势一般，建议低调行事，避免冒险。'
  }

  return {
    sign: zodiacSign,
    element,
    luckyNumbers,
    todayLuck,
    luckyDirection,
    luckyColor,
    advice
  }
}

// 五行生克分析
export function analyzeWuxing(personalWuxing: WuxingType, currentDate: Date): WuxingAnalysis {
  const todayWuxing = calculateTodayWuxing(currentDate)
  const relationship = getWuxingRelationship(personalWuxing, todayWuxing)
  const baseLuckyNumbers = WUXING_LUCKY_NUMBERS[personalWuxing]

  // 获取动态因子
  const dynamicFactor = getCombinedDynamicFactor()

  // 动态调整幸运数字
  const luckyNumbers = adjustLuckyNumbers(baseLuckyNumbers, dynamicFactor)

  // 基于五行关系的建议
  let baseAdvice = ''
  switch (relationship) {
    case '相生':
      baseAdvice = `今日${personalWuxing}与今日五行${todayWuxing}相生，运势大吉，适合积极行动！`
      break
    case '相克':
      baseAdvice = `今日${personalWuxing}与今日五行${todayWuxing}相克，需要谨慎行事，避免冲突。`
      break
    case '相同':
      baseAdvice = `今日五行与您相同，运势平稳，适合稳步前进。`
      break
  }

  // 使用动态建议生成函数
  const advice = generateDynamicAdvice(baseAdvice, personalWuxing)

  return {
    personalWuxing,
    todayWuxing,
    relationship,
    luckyNumbers,
    advice
  }
}

// 数字命理分析
export function analyzeNumerology(birthDate: Date, currentDate: Date): NumerologyAnalysis {
  const lifePathNumber = calculateLifePathNumber(birthDate)
  const dailyNumber = calculateDailyNumber(currentDate)
  const combinedNumber = Math.floor((lifePathNumber + dailyNumber) / 2)

  const luckyNumbers = LIFE_PATH_LUCKY_NUMBERS[lifePathNumber] || [1, 10, 19, 28]
  const meaning = NUMEROLOGY_MEANINGS[lifePathNumber] || '数字命理分析'

  return {
    lifePathNumber,
    dailyNumber,
    combinedNumber,
    luckyNumbers,
    meaning
  }
}

// 基于玄学元素计算推荐号码
export function calculateMetaphysicsNumbers(
  name: string,
  birthDate: Date,
  currentDate: Date,
  lotteryType: LotteryType
): RecommendedNumbers {
  // 获取各个玄学分析
  const nameAnalysis = analyzeName(name)
  const zodiacSign = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate())
  const zodiacAnalysis = analyzeZodiac(zodiacSign, currentDate)
  const wuxingAnalysis = analyzeWuxing(nameAnalysis.wuxing, currentDate)
  const numerologyAnalysis = analyzeNumerology(birthDate, currentDate)
  const plumBlossomAnalysis = analyzePlumBlossom(currentDate, lotteryType)

  // 收集所有候选号码和权重
  const numberWeights: Record<number, number> = {}

  // 名字分析权重（30%）
  nameAnalysis.luckyNumbers.forEach(num => {
    numberWeights[num] = (numberWeights[num] || 0) + 3
  })

  // 星座分析权重（25%）
  zodiacAnalysis.luckyNumbers.forEach(num => {
    numberWeights[num] = (numberWeights[num] || 0) + 2.5
  })

  // 五行分析权重（25%）
  wuxingAnalysis.luckyNumbers.forEach(num => {
    numberWeights[num] = (numberWeights[num] || 0) + 2.5
  })

  // 数字命理分析权重（20%）
  numerologyAnalysis.luckyNumbers.forEach(num => {
    numberWeights[num] = (numberWeights[num] || 0) + 2
  })

  // 梅花易数分析权重（25%，新增）
  plumBlossomAnalysis.luckyNumbers.forEach(num => {
    numberWeights[num] = (numberWeights[num] || 0) + 2.5
  })

  // 根据彩票类型配置
  const redBallMin = lotteryType === '双色球' ? 1 : 1
  const redBallMax = lotteryType === '双色球' ? 33 : 35
  const redBallCount = 6
  const blueBallMin = lotteryType === '双色球' ? 1 : 1
  const blueBallMax = lotteryType === '双色球' ? 16 : 12
  const blueBallCount = lotteryType === '双色球' ? 1 : 2

  // 生成红球推荐号码
  const redCandidates = Object.entries(numberWeights)
    .filter(([num]) => {
      const n = parseInt(num)
      return n >= redBallMin && n <= redBallMax
    })
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => parseInt(num))

  // 如果候选号码不足，补充随机号码（添加最大尝试次数限制）
  let attempts = 0
  const maxAttempts = 100
  while (redCandidates.length < redBallCount * 2 && attempts < maxAttempts) {
    const randomNum = Math.floor(Math.random() * (redBallMax - redBallMin + 1)) + redBallMin
    if (!redCandidates.includes(randomNum)) {
      redCandidates.push(randomNum)
    }
    attempts++
  }

  // 选择前6个作为推荐
  const redBalls = redCandidates.slice(0, redBallCount).sort((a, b) => a - b)

  // 生成蓝球推荐号码
  const blueCandidates = Object.entries(numberWeights)
    .filter(([num]) => {
      const n = parseInt(num)
      return n >= blueBallMin && n <= blueBallMax
    })
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => parseInt(num))

  // 如果候选号码不足，补充随机号码（添加最大尝试次数限制）
  attempts = 0
  while (blueCandidates.length < blueBallCount * 2 && attempts < maxAttempts) {
    const randomNum = Math.floor(Math.random() * (blueBallMax - blueBallMin + 1)) + blueBallMin
    if (!blueCandidates.includes(randomNum)) {
      blueCandidates.push(randomNum)
    }
    attempts++
  }

  // 选择前1-2个作为推荐
  const blueBalls = blueCandidates.slice(0, blueBallCount).sort((a, b) => a - b)

  // 计算置信度（基于权重分布和多个因素）
  const weights = Object.values(numberWeights)
  const maxWeight = weights.length > 0 ? Math.max(...weights) : 1
  const avgWeight = weights.length > 0
    ? weights.reduce((a, b) => a + b, 0) / weights.length
    : 0

  // 基础置信度（基于权重分布）
  let confidence = weights.length > 0
    ? Math.round((avgWeight / maxWeight) * 100)
    : 50 // 默认置信度

  // 调整置信度（基于候选号码数量）
  const candidateCount = weights.length
  if (candidateCount < 10) {
    confidence -= 10
  } else if (candidateCount >= 20) {
    confidence += 5
  }

  // 获取动态因子
  const dynamicFactor = getCombinedDynamicFactor()
  
  // 使用动态置信度生成函数
  confidence = generateDynamicConfidence(confidence, dynamicFactor)

  // 生成推荐理由
  const reasons: string[] = []
  reasons.push(`名字"${name}"五行属${nameAnalysis.wuxing}，笔画数${nameAnalysis.totalStrokes}`)
  reasons.push(`星座${zodiacSign}，元素${zodiacAnalysis.element}，今日运势指数${zodiacAnalysis.todayLuck}`)
  reasons.push(`五行${wuxingAnalysis.personalWuxing}与今日${wuxingAnalysis.todayWuxing}${wuxingAnalysis.relationship}`)
  reasons.push(`生命灵数${numerologyAnalysis.lifePathNumber}，${numerologyAnalysis.meaning}`)
  reasons.push(`梅花易数：${plumBlossomAnalysis.hexagram.name}，${plumBlossomAnalysis.interpretation}`)
  
  // 添加动态因子影响的理由
  if (dynamicFactor > 1.1) {
    reasons.push('今日天时地利，各项玄学指标均处于高位')
  } else if (dynamicFactor < 0.9) {
    reasons.push('今日玄学能量偏弱，建议谨慎行事')
  } else {
    reasons.push('今日玄学能量平稳，适合常规操作')
  }

  return {
    redBalls,
    blueBalls,
    confidence,
    reasons
  }
}

// 综合玄学分析
export function analyzeMetaphysics(
  name: string,
  birthDate: Date,
  currentDate: Date
): {
  nameAnalysis: NameAnalysis
  zodiacAnalysis: ZodiacAnalysis
  wuxingAnalysis: WuxingAnalysis
  numerologyAnalysis: NumerologyAnalysis
} {
  const nameAnalysis = analyzeName(name)
  const zodiacSign = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate())
  const zodiacAnalysis = analyzeZodiac(zodiacSign, currentDate)
  const wuxingAnalysis = analyzeWuxing(nameAnalysis.wuxing, currentDate)
  const numerologyAnalysis = analyzeNumerology(birthDate, currentDate)

  return {
    nameAnalysis,
    zodiacAnalysis,
    wuxingAnalysis,
    numerologyAnalysis
  }
}
