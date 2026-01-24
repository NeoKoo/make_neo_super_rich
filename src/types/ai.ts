export interface NumberReason {
  number: number
  type: 'red' | 'blue'
  reasons: {
    primary: string // 主要推荐理由
    metaphysics: string // 玄学相关理由
    zodiac: string // 星座相关理由
    wuxing: string // 五行相关理由
    numerology: string // 数字命理理由
    timing: string // 时机相关理由
  }
  confidence: number // 该号码的置信度 (0-100)
  luckyElements: string[] // 相关的幸运元素
}

export interface EnhancedLotteryRecommendation {
  redBalls: number[]
  blueBalls: number[]
  text: string
  numberReasons: NumberReason[] // 每个号码的详细理由
  overallAnalysis: {
    summary: string // 整体分析摘要
    fortuneLevel: '大吉' | '吉' | '中吉' | '平' | '凶'
    keyFactors: string[] // 关键影响因素
    advice: string // 购彩建议
    bestTiming: string // 最佳购彩时机
  }
  metaphysicsInsight: {
    zodiacInfluence: string // 星座影响分析
    wuxingBalance: string // 五行平衡分析
    numerologyPattern: string // 数字命理模式
    energyLevel: number // 当日能量指数 (0-100)
  }
}

export interface AIRecommendationResult {
  success: boolean
  data?: EnhancedLotteryRecommendation
  error?: {
    code: string
    message: string
    userFriendlyMessage: string
  }
}