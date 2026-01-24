/**
 * 梅花易数计算器
 * 基于时间起卦，生成彩票推荐号码
 */

import type { LotteryType } from '../types/lottery'
import type { TrigramType, Hexagram, TiYongRelation, PlumBlossomAnalysis } from '../types/plumBlossom'
import { TRIGRAMS, HEXAGRAMS } from '../constants/plumBlossom'
import { WUXING_LUCKY_NUMBERS, WUXING_RELATIONSHIPS } from '../constants/metaphysics'

/**
 * 时间起卦
 * 年(1-12) + 月(1-12) + 日(1-31)之和 ÷ 8 取余数得上卦
 * 加时辰(1-12) ÷ 8 得下卦
 * 总和 ÷ 6 取余数定动爻
 */
export function generateHexagramByTime(date: Date): Hexagram {
  const year = date.getFullYear() % 12 // 将年份转换为1-12
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const shichen = Math.floor((hour + 1) / 2) % 12 + 1 // 时辰（子丑寅卯...）

  // 计算上卦
  const upperSum = year + month + day
  const upperNumber = (upperSum % 8) || 8
  const upperTrigram = getTrigramByNumber(upperNumber)

  // 计算下卦
  const lowerSum = upperSum + shichen
  const lowerNumber = (lowerSum % 8) || 8
  const lowerTrigram = getTrigramByNumber(lowerNumber)

  // 计算动爻
  const totalSum = upperSum + shichen
  const movingLine = (totalSum % 6) || 6

  // 获取卦名和详细信息
  const hexagramKey = `${upperTrigram.name}${lowerTrigram.name}`
  const hexagramInfo = HEXAGRAMS[hexagramKey] || {
    name: '未知卦',
    description: '卦象未知',
    fortune: '平' as const,
    lotteryAdvice: '卦象未知，请谨慎参考'
  }

  return {
    upperTrigram,
    lowerTrigram,
    movingLine,
    name: hexagramInfo.name,
    description: hexagramInfo.description,
    fortune: hexagramInfo.fortune,
    lotteryAdvice: hexagramInfo.lotteryAdvice
  }
}

/**
 * 分析体用关系
 * 体卦代表自身，用卦代表外界
 * 有动爻时，动爻所在卦为用卦，另一卦为体卦
 * 无动爻时，下卦为体卦，上卦为用卦
 */
export function analyzeTiYongRelation(hexagram: Hexagram): TiYongRelation {
  const { upperTrigram, lowerTrigram, movingLine } = hexagram

  // 判断体卦和用卦
  let tiTrigram: typeof TRIGRAMS[TrigramType]
  let yongTrigram: typeof TRIGRAMS[TrigramType]

  if (movingLine === 0) {
    // 无动爻，下卦为体，上卦为用
    tiTrigram = lowerTrigram
    yongTrigram = upperTrigram
  } else {
    // 有动爻，动爻所在卦为用卦
    if (movingLine <= 3) {
      // 动爻在下卦
      tiTrigram = upperTrigram
      yongTrigram = lowerTrigram
    } else {
      // 动爻在上卦
      tiTrigram = lowerTrigram
      yongTrigram = upperTrigram
    }
  }

  // 判断五行生克关系
  const relationship = getWuxingRelationship(tiTrigram.wuxing, yongTrigram.wuxing)

  // 判断吉凶
  const isFavorable = relationship === '相生' || relationship === '相同'

  // 生成分析结果
  const analysis = generateTiYongAnalysis(tiTrigram, yongTrigram, relationship, isFavorable)

  return {
    tiTrigram,
    yongTrigram,
    relationship,
    isFavorable,
    analysis
  }
}

/**
 * 基于梅花易数生成幸运数字
 */
export function generatePlumBlossomLuckyNumbers(
  hexagram: Hexagram,
  tiYongRelation: TiYongRelation,
  lotteryType: LotteryType
): number[] {
  const luckyNumbers: number[] = []

  // 基于体卦五行生成数字
  const tiWuxing = tiYongRelation.tiTrigram.wuxing
  const wuxingNumbers = WUXING_LUCKY_NUMBERS[tiWuxing]
  luckyNumbers.push(...wuxingNumbers)

  // 基于卦象数字生成
  const upperNum = hexagram.upperTrigram.number
  const lowerNum = hexagram.lowerTrigram.number
  luckyNumbers.push(upperNum, lowerNum, upperNum + lowerNum)

  // 基于动爻生成
  if (hexagram.movingLine > 0) {
    luckyNumbers.push(hexagram.movingLine)
    luckyNumbers.push(hexagram.movingLine * 2)
  }

  // 去重并限制范围
  const redBallMax = lotteryType === '双色球' ? 33 : 35

  return [...new Set(luckyNumbers)]
    .map(n => ((n - 1) % redBallMax) + 1) // 确保在有效范围内
    .slice(0, 10) // 取前10个候选数字
}

/**
 * 综合分析
 */
export function analyzePlumBlossom(
  date: Date,
  lotteryType: LotteryType
): PlumBlossomAnalysis {
  // 生成卦象
  const hexagram = generateHexagramByTime(date)

  // 分析体用关系
  const tiYongRelation = analyzeTiYongRelation(hexagram)

  // 生成幸运数字
  const luckyNumbers = generatePlumBlossomLuckyNumbers(hexagram, tiYongRelation, lotteryType)

  // 计算置信度
  const confidence = calculatePlumBlossomConfidence(hexagram, tiYongRelation)

  // 生成解读
  const interpretation = generateInterpretation(hexagram, tiYongRelation)

  // 生成建议
  const advice = generateAdvice(tiYongRelation, confidence, hexagram)

  return {
    hexagram,
    tiYongRelation,
    luckyNumbers,
    confidence,
    interpretation,
    advice
  }
}

// 辅助函数
function getTrigramByNumber(num: number): typeof TRIGRAMS[TrigramType] {
  const trigramKeys: TrigramType[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
  return TRIGRAMS[trigramKeys[num - 1]]
}

function getWuxingRelationship(wuxing1: string, wuxing2: string): '相生' | '相克' | '相同' {
  if (wuxing1 === wuxing2) return '相同'
  const relation = WUXING_RELATIONSHIPS[wuxing1 as keyof typeof WUXING_RELATIONSHIPS]
  if (relation && (relation.generates === wuxing2 || relation.isGeneratedBy === wuxing2)) return '相生'
  return '相克'
}

function calculatePlumBlossomConfidence(hexagram: Hexagram, tiYongRelation: TiYongRelation): number {
  let confidence = 70 // 基础置信度

  // 体用相生加分
  if (tiYongRelation.isFavorable) {
    confidence += 15
  } else {
    confidence -= 10
  }

  // 无动爻加分（卦象稳定）
  if (hexagram.movingLine === 0) {
    confidence += 5
  }

  // 限制范围
  return Math.min(95, Math.max(50, confidence))
}

function generateTiYongAnalysis(
  tiTrigram: typeof TRIGRAMS[TrigramType],
  yongTrigram: typeof TRIGRAMS[TrigramType],
  relationship: string,
  isFavorable: boolean
): string {
  const favorableText = isFavorable ? '吉利' : '需谨慎'
  return `体卦为${tiTrigram.name}卦（${tiTrigram.nature}），用卦为${yongTrigram.name}卦（${yongTrigram.nature}），${relationship}，${favorableText}`
}

function generateInterpretation(hexagram: Hexagram, tiYongRelation: TiYongRelation): string {
  return `得${hexagram.name}卦，${tiYongRelation.analysis}。${hexagram.description}`
}

function generateAdvice(tiYongRelation: TiYongRelation, confidence: number, hexagram: Hexagram): string {
  // 优先使用卦象自身的彩票建议
  if (hexagram.lotteryAdvice) {
    return hexagram.lotteryAdvice
  }

  // 根据体用关系和置信度生成建议
  if (tiYongRelation.isFavorable && confidence >= 80) {
    return '卦象大吉，今日运势极佳，推荐号码可信度高，可以大胆参考！'
  } else if (tiYongRelation.isFavorable) {
    return '卦象吉利，今日运势良好，推荐号码有一定参考价值。'
  } else {
    return '卦象需谨慎，今日运势一般，建议保守参考或等待更好时机。'
  }
}
