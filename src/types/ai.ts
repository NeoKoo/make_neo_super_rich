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

export interface NumberSetRecommendation {
  redBalls: number[]
  blueBalls: number[]
  numberReasons: NumberReason[] // 每个号码的详细理由
  setAnalysis: {
    summary: string // 该组号码的分析摘要
    fortuneLevel: '大吉' | '吉' | '中吉' | '平' | '凶'
    keyStrengths: string[] // 关键优势
    recommendationRank: number // 推荐排名 (1-5)
  }
}

export interface EnhancedLotteryRecommendation {
  // 兼容旧版本：保留单组号码字段
  redBalls: number[]
  blueBalls: number[]
  text: string
  numberReasons: NumberReason[] // 每个号码的详细理由

  // 新增：多组号码推荐
  recommendations: NumberSetRecommendation[] // 5组号码推荐

  overallAnalysis: {
    summary: string // 整体分析摘要
    fortuneLevel?: '大吉' | '吉' | '中吉' | '平' | '凶' // 运势等级（可选，用于向后兼容）
    bestSet: number // 最佳推荐组编号
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