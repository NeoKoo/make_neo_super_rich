

export type WuxingType = '木' | '火' | '土' | '金' | '水'

// 名字分析结果
export interface NameAnalysis {
  totalStrokes: number
  wuxing: WuxingType
  luckyNumbers: number[]
  meaning: string
  fortune: '大吉' | '吉' | '中吉' | '平' | '凶'
}

// 星座深度分析结果
export interface ZodiacAnalysis {
  sign: string
  element: '火' | '土' | '风' | '水'
  luckyNumbers: number[]
  todayLuck: number
  luckyDirection: string
  luckyColor: string
  advice: string
}

// 五行生克分析结果
export interface WuxingAnalysis {
  personalWuxing: WuxingType
  todayWuxing: WuxingType
  relationship: '相生' | '相克' | '相同'
  luckyNumbers: number[]
  advice: string
}

// 数字命理分析结果
export interface NumerologyAnalysis {
  lifePathNumber: number
  dailyNumber: number
  combinedNumber: number
  luckyNumbers: number[]
  meaning: string
}

// 推荐号码
export interface RecommendedNumbers {
  redBalls: number[]
  blueBalls: number[]
  confidence: number
  reasons: string[]
}

// 玄学分析结果
export interface MetaphysicsAnalysis {
  nameAnalysis: NameAnalysis
  zodiacAnalysis: ZodiacAnalysis
  wuxingAnalysis: WuxingAnalysis
  numerologyAnalysis: NumerologyAnalysis
  recommendedNumbers: RecommendedNumbers
}

// 扩展的运势数据
export interface EnhancedDailyFortune {
  blessing: string
  luckyTime: string
  luckyHour: number
  reason: string
  metaphysics: MetaphysicsAnalysis
}

// 增强的运势结果
export interface EnhancedDailyFortuneResult {
  success: boolean
  data?: EnhancedDailyFortune
  error?: {
    code: string
    message: string
    userFriendlyMessage: string
  }
}
