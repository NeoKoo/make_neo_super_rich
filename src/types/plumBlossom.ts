import type { WuxingType } from './fortune'

// 八卦类型
export type TrigramType = '乾' | '坤' | '震' | '巽' | '坎' | '离' | '艮' | '兑'

// 八卦属性
export interface Trigram {
  name: TrigramType
  number: number // 1-8
  wuxing: WuxingType
  direction: string
  nature: string
  symbol: string
}

// 卦象信息
export interface Hexagram {
  upperTrigram: Trigram
  lowerTrigram: Trigram
  movingLine: number // 1-6, 0表示无动爻
  name: string // 卦名
  description: string // 卦辞
  fortune: '大吉' | '吉' | '中吉' | '平' | '凶'
  lotteryAdvice: string
}

// 体用关系
export interface TiYongRelation {
  tiTrigram: Trigram // 体卦（自身）
  yongTrigram: Trigram // 用卦（外界）
  relationship: '相生' | '相克' | '相同'
  isFavorable: boolean // 是否吉利
  analysis: string // 分析结果
}

// 梅花易数分析结果
export interface PlumBlossomAnalysis {
  hexagram: Hexagram
  tiYongRelation: TiYongRelation
  luckyNumbers: number[]
  confidence: number
  interpretation: string
  advice: string
}
