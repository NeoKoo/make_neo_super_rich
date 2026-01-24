# 梅花易数功能设计文档

## 功能概述

将梅花易数（北宋邵雍创立的占卜方法）整合到现有玄学推荐系统中，作为新的分析维度，通过时间起卦自动生成彩票推荐号码。

## 梅花易数简介

梅花易数是北宋理学家邵雍（邵康节）创立的占卜方法，以"心物感应"为核心，通过时间、数字、外应等触发点起卦，无需复杂工具，适合快速占断。

### 核心概念
- **体用关系**：体卦代表自身/问事主体，用卦代表外界/问事对象
- **五行生克**：生为吉，克为凶，结合动爻、卦气旺衰判断结果
- **八卦属性**：每卦对应自然现象、五行属性、方位等

## 设计原则

1. **自动起卦**：使用当前时间自动起卦，无需用户干预
2. **无缝整合**：作为新维度整合到现有玄学系统中
3. **保持一致性**：遵循现有代码风格和架构模式

## 系统架构

### 1. 类型定义 (`src/types/plumBlossom.ts`)

```typescript
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
```

### 2. 常量配置 (`src/constants/plumBlossom.ts`)

```typescript
// 八卦基本信息
export const TRIGRAMS: Record<TrigramType, Trigram> = {
  乾: { name: '乾', number: 1, wuxing: '金', direction: '西北', nature: '天', symbol: '☰' },
  兑: { name: '兑', number: 2, wuxing: '金', direction: '西', nature: '泽', symbol: '☱' },
  离: { name: '离', number: 3, wuxing: '火', direction: '南', nature: '火', symbol: '☲' },
  震: { name: '震', number: 4, wuxing: '木', direction: '东', nature: '雷', symbol: '☳' },
  巽: { name: '巽', number: 5, wuxing: '木', direction: '东南', nature: '风', symbol: '☴' },
  坎: { name: '坎', number: 6, wuxing: '水', direction: '北', nature: '水', symbol: '☵' },
  艮: { name: '艮', number: 7, wuxing: '土', direction: '东北', nature: '山', symbol: '☶' },
  坤: { name: '坤', number: 8, wuxing: '土', direction: '西南', nature: '地', symbol: '☷' }
}

// 六十四卦名称和解读
export const HEXAGRAMS: Record<string, {
  name: string
  description: string
  fortune: '大吉' | '吉' | '中吉' | '平' | '凶'
  lotteryAdvice: string
}> = {
  // 乾宫八卦
  '乾乾': {
    name: '乾为天',
    description: '元亨利贞，天行健，君子以自强不息',
    fortune: '大吉',
    lotteryAdvice: '天时地利人和，运势极佳，可大胆选号，信心满满'
  },
  '乾兑': {
    name: '天泽履',
    description: '履虎尾，不咥人，亨',
    fortune: '吉',
    lotteryAdvice: '如履薄冰，需谨慎行事，稳扎稳打，不可贪心'
  },
  '乾离': {
    name: '天火同人',
    description: '同人于野，亨，利涉大川',
    fortune: '大吉',
    lotteryAdvice: '众志成城，运势上升，适合合买或参考他人意见'
  },
  '乾震': {
    name: '天雷无妄',
    description: '无妄，元亨利贞，其匪正有眚',
    fortune: '吉',
    lotteryAdvice: '顺其自然，不可强求，保持平常心，好运自来'
  },
  '乾巽': {
    name: '天风姤',
    description: '姤，女壮，勿用取女',
    fortune: '中吉',
    lotteryAdvice: '需注意时机，不可操之过急，耐心等待最佳时机'
  },
  '乾坎': {
    name: '天水讼',
    description: '讼，有孚窒惕，中吉',
    fortune: '中吉',
    lotteryAdvice: '运势有起伏，需谨慎选择，避免冲动决策'
  },
  '乾艮': {
    name: '天山遁',
    description: '遁，亨，小利贞',
    fortune: '中吉',
    lotteryAdvice: '宜静不宜动，保守为上，等待时机再行动'
  },
  '乾坤': {
    name: '天地否',
    description: '否，否之匪人，不利君子贞',
    fortune: '凶',
    lotteryAdvice: '运势不佳，建议暂停购彩，等待运势好转'
  },
  // 兑宫八卦
  '兑乾': {
    name: '泽天夬',
    description: '夬，扬于王庭，孚号有厉',
    fortune: '中吉',
    lotteryAdvice: '需果断决策，但不可鲁莽，三思而后行'
  },
  '兑兑': {
    name: '兑为泽',
    description: '兑，亨，利贞',
    fortune: '吉',
    lotteryAdvice: '心情愉悦，运势良好，适合轻松选号'
  },
  '兑离': {
    name: '泽火革',
    description: '革，巳日乃孚，元亨利贞',
    fortune: '大吉',
    lotteryAdvice: '变革之时，运势大好，可尝试新的选号策略'
  },
  '兑震': {
    name: '泽雷随',
    description: '随，元亨利贞，无咎',
    fortune: '吉',
    lotteryAdvice: '随遇而安，顺势而为，好运自然跟随'
  },
  '兑巽': {
    name: '泽风大过',
    description: '大过，栋桡，利有攸往',
    fortune: '中吉',
    lotteryAdvice: '运势强劲，但需注意分寸，不可过度投入'
  },
  '兑坎': {
    name: '泽水困',
    description: '困，亨，贞，大人吉',
    fortune: '中吉',
    lotteryAdvice: '虽有困难，但坚持必有收获，不可轻言放弃'
  },
  '兑艮': {
    name: '泽山咸',
    description: '咸，亨，利贞，取女吉',
    fortune: '大吉',
    lotteryAdvice: '心想事成，运势极佳，可大胆追求目标'
  },
  '兑坤': {
    name: '泽地萃',
    description: '萃，亨，王假有庙',
    fortune: '吉',
    lotteryAdvice: '聚财聚气，运势上升，适合积极行动'
  },
  // 离宫八卦
  '离乾': {
    name: '火天大有',
    description: '大有，元亨',
    fortune: '大吉',
    lotteryAdvice: '大有可为，运势鼎盛，是选号的好时机'
  },
  '离兑': {
    name: '火泽睽',
    description: '睽，小事吉',
    fortune: '中吉',
    lotteryAdvice: '小事顺利，大事需谨慎，不可贪大求全'
  },
  '离离': {
    name: '离为火',
    description: '离，利贞，亨',
    fortune: '吉',
    lotteryAdvice: '光明正大，运势平稳，适合常规选号'
  },
  '离震': {
    name: '火雷噬嗑',
    description: '噬嗑，亨，利用狱',
    fortune: '吉',
    lotteryAdvice: '果断行动，清除障碍，运势逐渐好转'
  },
  '离巽': {
    name: '火风鼎',
    description: '鼎，元吉，亨',
    fortune: '大吉',
    lotteryAdvice: '鼎盛之时，运势极佳，可把握机会'
  },
  '离坎': {
    name: '火水未济',
    description: '未济，亨，小狐汔济',
    fortune: '中吉',
    lotteryAdvice: '尚未成功，但已接近，继续努力必有收获'
  },
  '离艮': {
    name: '火山旅',
    description: '旅，小亨，旅贞吉',
    fortune: '中吉',
    lotteryAdvice: '运势平稳，适合小试牛刀，不宜大动干戈'
  },
  '离坤': {
    name: '火地晋',
    description: '晋，康侯用锡马蕃庶',
    fortune: '大吉',
    lotteryAdvice: '运势上升，步步高升，是选号的黄金时机'
  },
  // 震宫八卦
  '震乾': {
    name: '雷天大壮',
    description: '大壮，利贞',
    fortune: '吉',
    lotteryAdvice: '气势如虹，运势强劲，可大胆行动'
  },
  '震兑': {
    name: '雷泽归妹',
    description: '归妹，征凶，无攸利',
    fortune: '凶',
    lotteryAdvice: '运势不佳，建议暂停，等待时机'
  },
  '震离': {
    name: '雷火丰',
    description: '丰，亨，王假之',
    fortune: '大吉',
    lotteryAdvice: '丰衣足食，运势极佳，可把握机会'
  },
  '震震': {
    name: '震为雷',
    description: '震，亨，震来虩虩',
    fortune: '吉',
    lotteryAdvice: '雷声震震，运势起伏，需谨慎行事'
  },
  '震巽': {
    name: '雷风恒',
    description: '恒，亨，无咎',
    fortune: '吉',
    lotteryAdvice: '持之以恒，运势平稳，适合长期坚持'
  },
  '震坎': {
    name: '雷水解',
    description: '解，利西南',
    fortune: '吉',
    lotteryAdvice: '困难解除，运势好转，可积极行动'
  },
  '震艮': {
    name: '雷山小过',
    description: '小过，亨，利贞',
    fortune: '中吉',
    lotteryAdvice: '小有收获，运势一般，保持平常心'
  },
  '震坤': {
    name: '雷地豫',
    description: '豫，利建侯行师',
    fortune: '大吉',
    lotteryAdvice: '豫悦快乐，运势极佳，可大胆选号'
  },
  // 巽宫八卦
  '巽乾': {
    name: '风天小畜',
    description: '小畜，亨，密云不雨',
    fortune: '中吉',
    lotteryAdvice: '蓄势待发，运势平稳，等待时机'
  },
  '巽兑': {
    name: '风泽中孚',
    description: '中孚，豚鱼吉，利涉大川',
    fortune: '大吉',
    lotteryAdvice: '诚信为本，运势极佳，可放心选号'
  },
  '巽离': {
    name: '风火家人',
    description: '家人，利女贞',
    fortune: '吉',
    lotteryAdvice: '家庭和睦，运势良好，适合合买'
  },
  '巽震': {
    name: '风雷益',
    description: '益，利有攸往，利涉大川',
    fortune: '大吉',
    lotteryAdvice: '增益之时，运势上升，可把握机会'
  },
  '巽巽': {
    name: '巽为风',
    description: '巽，小亨，利有攸往',
    fortune: '吉',
    lotteryAdvice: '风行天下，运势平稳，适合常规操作'
  },
  '巽坎': {
    name: '风水涣',
    description: '涣，亨，王假有庙',
    fortune: '吉',
    lotteryAdvice: '散去烦恼，运势好转，可积极行动'
  },
  '巽艮': {
    name: '风山渐',
    description: '渐，女归吉',
    fortune: '吉',
    lotteryAdvice: '循序渐进，运势平稳，稳步前进'
  },
  '巽坤': {
    name: '风地观',
    description: '观，盥而不荐',
    fortune: '中吉',
    lotteryAdvice: '观望为主，运势一般，不宜冲动'
  },
  // 坎宫八卦
  '坎乾': {
    name: '水天需',
    description: '需，有孚，光亨',
    fortune: '吉',
    lotteryAdvice: '需等待时机，运势平稳，耐心等待'
  },
  '坎兑': {
    name: '水泽节',
    description: '节，亨，苦节不可贞',
    fortune: '中吉',
    lotteryAdvice: '节制为上，运势一般，不宜过度投入'
  },
  '坎离': {
    name: '水火既济',
    description: '既济，亨，小利贞',
    fortune: '大吉',
    lotteryAdvice: '功成名就，运势极佳，可把握机会'
  },
  '坎震': {
    name: '水雷屯',
    description: '屯，元亨利贞',
    fortune: '中吉',
    lotteryAdvice: '起步阶段，运势一般，需耐心等待'
  },
  '坎巽': {
    name: '水风井',
    description: '井，改邑不改井',
    fortune: '吉',
    lotteryAdvice: '井水不竭，运势平稳，可稳步前进'
  },
  '坎坎': {
    name: '坎为水',
    description: '坎，习坎，有孚',
    fortune: '中吉',
    lotteryAdvice: '坎坎坷坷，运势起伏，需谨慎行事'
  },
  '坎艮': {
    name: '水山蹇',
    description: '蹇，利西南，不利东北',
    fortune: '中吉',
    lotteryAdvice: '困难重重，但坚持必有收获'
  },
  '坎坤': {
    name: '水地比',
    description: '比，吉，原筮元永贞',
    fortune: '大吉',
    lotteryAdvice: '比肩而行，运势极佳，适合合买'
  },
  // 艮宫八卦
  '艮乾': {
    name: '山天大畜',
    description: '大畜，利贞，不家食吉',
    fortune: '大吉',
    lotteryAdvice: '积蓄力量，运势极佳，可把握机会'
  },
  '艮兑': {
    name: '山泽损',
    description: '损，有孚，元吉',
    fortune: '中吉',
    lotteryAdvice: '损中有益，运势一般，需谨慎选择'
  },
  '艮离': {
    name: '山火贲',
    description: '贲，亨，小利有攸往',
    fortune: '吉',
    lotteryAdvice: '文饰之美，运势良好，适合常规选号'
  },
  '艮震': {
    name: '山雷颐',
    description: '颐，贞吉，观颐',
    fortune: '吉',
    lotteryAdvice: '颐养身心，运势平稳，保持平常心'
  },
  '艮巽': {
    name: '山风蛊',
    description: '蛊，元亨，利涉大川',
    fortune: '中吉',
    lotteryAdvice: '整顿之时，运势一般，需谨慎行事'
  },
  '艮坎': {
    name: '山水蒙',
    description: '蒙，亨，匪我求童蒙',
    fortune: '中吉',
    lotteryAdvice: '启蒙之时，运势一般，需谨慎选择'
  },
  '艮艮': {
    name: '艮为山',
    description: '艮，其背，不获其身',
    fortune: '中吉',
    lottery建议: '止步不前，运势一般，等待时机'
  },
  '艮坤': {
    name: '山地剥',
    description: '剥，不利有攸往',
    fortune: '凶',
    lotteryAdvice: '剥落之时，运势不佳，建议暂停'
  },
  // 坤宫八卦
  '坤乾': {
    name: '地天泰',
    description: '泰，小往大来，吉亨',
    fortune: '大吉',
    lotteryAdvice: '国泰民安，运势极佳，可大胆选号'
  },
  '坤兑': {
    name: '地泽临',
    description: '临，元亨利贞',
    fortune: '大吉',
    lotteryAdvice: '临门一脚，运势极佳，可把握机会'
  },
  '坤离': {
    name: '地火明夷',
    description: '明夷，利艰贞',
    fortune: '中吉',
    lotteryAdvice: '光明受损，运势一般，需谨慎行事'
  },
  '坤震': {
    name: '地雷复',
    description: '复，亨，出入无疾',
    fortune: '吉',
    lotteryAdvice: '复兴之时，运势上升，可积极行动'
  },
  '坤巽': {
    name: '地风升',
    description: '升，元亨，用见大人',
    fortune: '大吉',
    lotteryAdvice: '升腾之时，运势极佳，可把握机会'
  },
  '坤坎': {
    name: '地水师',
    description: '师，贞，丈人，吉',
    fortune: '吉',
    lotteryAdvice: '师出有名，运势良好，可积极行动'
  },
  '坤艮': {
    name: '地山谦',
    description: '谦，亨，君子有终',
    fortune: '大吉',
    lotteryAdvice: '谦受益，运势极佳，可把握机会'
  },
  '坤坤': {
    name: '坤为地',
    description: '坤，元亨，利牝马之贞',
    fortune: '吉',
    lotteryAdvice: '厚德载物，运势平稳，适合常规选号'
  }
}

// 动爻解读
export const MOVING_LINE_INTERPRETATIONS: Record<number, {
  position: string
  meaning: string
  advice: string
}> = {
  0: {
    position: '无动爻',
    meaning: '卦象稳定，静待时机',
    advice: '运势平稳，适合常规操作，保持耐心'
  },
  1: {
    position: '初爻',
    meaning: '事之始，潜龙勿用',
    advice: '起始阶段，需谨慎行事，不宜冒进'
  },
  2: {
    position: '二爻',
    meaning: '见龙在田，利见大人',
    advice: '时机渐佳，可开始行动，但仍需谨慎'
  },
  3: {
    position: '三爻',
    meaning: '君子终日乾乾',
    advice: '努力奋斗，保持警惕，不可松懈'
  },
  4: {
    position: '四爻',
    meaning: '或跃在渊，进退有据',
    advice: '关键时期，需谨慎决策，把握机会'
  },
  5: {
    position: '五爻',
    meaning: '飞龙在天，利见大人',
    advice: '运势极佳，可大胆行动，把握黄金时机'
  },
  6: {
    position: '上爻',
    meaning: '亢龙有悔，物极必反',
    advice: '盛极而衰，需适可而止，不可贪心'
  }
}

// 卦气旺衰判断规则
export const HEXAGRAM_PROSPERITY_RULES = {
  // 根据季节判断卦气旺衰
  // 春季（3-5月）：木旺、火相、土死、金囚、水休
  // 夏季（6-8月）：火旺、土相、金死、水囚、木休
  // 秋季（9-11月）：金旺、水相、木死、火囚、土休
  // 冬季（12-2月）：水旺、木相、火死、土囚、金休
  
  getSeason: (month: number): '春' | '夏' | '秋' | '冬' => {
    if (month >= 3 && month <= 5) return '春'
    if (month >= 6 && month <= 8) return '夏'
    if (month >= 9 && month <= 11) return '秋'
    return '冬'
  },
  
  getWuxingProsperity: (wuxing: WuxingType, season: '春' | '夏' | '秋' | '冬'): {
    state: '旺' | '相' | '休' | '囚' | '死'
    description: string
    effect: number // 对运势的影响系数
  } => {
    const prosperityMap = {
      春: { 木: { state: '旺', desc: '木气旺盛，生机勃勃', effect: 1.2 },
             火: { state: '相', desc: '火气次旺，蓄势待发', effect: 1.1 },
             土: { state: '死', desc: '土气衰败，不宜妄动', effect: 0.8 },
             金: { state: '囚', desc: '金气被囚，需谨慎', effect: 0.7 },
             水: { state: '休', desc: '水气休养，平稳发展', effect: 0.9 } },
      夏: { 火: { state: '旺', desc: '火气旺盛，热情高涨', effect: 1.2 },
             土: { state: '相', desc: '土气次旺，稳重前行', effect: 1.1 },
             金: { state: '死', desc: '金气衰败，不宜冲动', effect: 0.8 },
             水: { state: '囚', desc: '水气被囚，需保守', effect: 0.7 },
             木: { state: '休', desc: '木气休养，保持耐心', effect: 0.9 } },
      秋: { 金: { state: '旺', desc: '金气旺盛，锐意进取', effect: 1.2 },
             水: { state: '相', desc: '水气次旺，顺势而为', effect: 1.1 },
             木: { state: '死', desc: '木气衰败，不宜冒险', effect: 0.8 },
             火: { state: '囚', desc: '火气被囚，需冷静', effect: 0.7 },
             土: { state: '休', desc: '土气休养，稳步前进', effect: 0.9 } },
      冬: { 水: { state: '旺', desc: '水气旺盛，灵感丰富', effect: 1.2 },
             木: { state: '相', desc: '木气次旺，蓄势待发', effect: 1.1 },
             火: { state: '死', desc: '火气衰败，不宜激进', effect: 0.8 },
             土: { state: '囚', desc: '土气被囚，需谨慎', effect: 0.7 },
             金: { state: '休', desc: '金气休养，保持冷静', effect: 0.9 } }
    }
    return prosperityMap[season][wuxing]
  }
}

// 八卦详细属性
export const TRIGRAM_DETAILS: Record<TrigramType, {
  description: string
  characteristics: string[]
  luckyItems: string[]
  tabooItems: string[]
  lotteryMeaning: string
}> = {
  乾: {
    description: '乾为天，刚健中正，自强不息',
    characteristics: ['刚健', '正直', '领导力', '进取心', '果断'],
    luckyItems: ['金属制品', '圆形物品', '黄金', '白色衣物'],
    tabooItems: ['破损物品', '尖锐物', '红色物品'],
    lotteryMeaning: '乾卦代表天，象征权威和力量。得此卦者，运势强劲，适合大胆选号，信心满满'
  },
  兑: {
    description: '兑为泽，喜悦和谐，口舌是非',
    characteristics: ['喜悦', '沟通', '表达', '和谐', '灵活'],
    luckyItems: ['白色物品', '镜子', '乐器', '甜食'],
    tabooItems: ['破损容器', '苦味食物', '黑色物品'],
    lotteryMeaning: '兑卦代表泽，象征喜悦和沟通。得此卦者，心情愉悦，运势良好，适合轻松选号'
  },
  离: {
    description: '离为火，光明照耀，热情奔放',
    characteristics: ['热情', '光明', '创造力', '表达力', '活力'],
    luckyItems: ['红色物品', '蜡烛', '灯笼', '太阳图案'],
    tabooItems: ['水', '蓝色物品', '潮湿物品'],
    lotteryMeaning: '离卦代表火，象征光明和热情。得此卦者，运势上升，适合积极行动'
  },
  震: {
    description: '震为雷，震动觉醒，奋发向上',
    characteristics: ['勇敢', '果断', '创新', '行动力', '进取'],
    luckyItems: ['绿色物品', '木质制品', '雷声图案', '龙形饰品'],
    tabooItems: ['金属物品', '安静环境', '停滞不前'],
    lotteryMeaning: '震卦代表雷，象征震动和觉醒。得此卦者，运势强劲，可大胆行动'
  },
  巽: {
    description: '巽为风，柔顺温和，随风而动',
    characteristics: ['灵活', '适应', '温和', '智慧', '沟通'],
    luckyItems: ['绿色物品', '羽毛', '风车', '花草'],
    tabooItems: ['重物', '固执', '停滞'],
    lotteryMeaning: '巽卦代表风，象征灵活和适应。得此卦者，运势平稳，适合常规操作'
  },
  坎: {
    description: '坎为水，险陷深渊，智慧深沉',
    characteristics: ['智慧', '深沉', '适应', '谨慎', '洞察力'],
    luckyItems: ['蓝色物品', '水', '鱼类', '黑色物品'],
    tabooItems: ['火', '红色物品', '干燥环境'],
    lotteryMeaning: '坎卦代表水，象征险陷和智慧。得此卦者，运势起伏，需谨慎行事'
  },
  艮: {
    description: '艮为山，稳重静止，止步不前',
    characteristics: ['稳重', '耐心', '坚持', '保守', '稳健'],
    luckyItems: ['黄色物品', '石头', '山形图案', '土制品'],
    tabooItems: ['移动', '急躁', '冲动'],
    lotteryMeaning: '艮卦代表山，象征稳重和静止。得此卦者，运势平稳，需耐心等待'
  },
  坤: {
    description: '坤为地，厚德载物，包容万物',
    characteristics: ['包容', '稳重', '耐心', '温和', '支持'],
    luckyItems: ['黄色物品', '土地', '方形物品', '布料'],
    tabooItems: ['尖锐物', '争斗', '冲动'],
    lotteryMeaning: '坤卦代表地，象征包容和支持。得此卦者，运势平稳，适合常规选号'
  }
}

// 五行生克关系（复用 metaphysics.ts 中的定义）
```

### 3. 核心计算逻辑 (`src/utils/plumBlossomCalculator.ts`)

```typescript
/**
 * 梅花易数计算器
 * 基于时间起卦，生成彩票推荐号码
 */

import { Date } from 'date-fns'
import { TrigramType, Trigram, Hexagram, TiYongRelation, PlumBlossomAnalysis } from '../types/plumBlossom'
import { TRIGRAMS, HEXAGRAM_NAMES } from '../constants/plumBlossom'
import { WUXING_RELATIONSHIPS } from '../constants/metaphysics'

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

  // 获取卦名
  const hexagramKey = `${upperTrigram.name}${lowerTrigram.name}`
  const name = HEXAGRAM_NAMES[hexagramKey] || '未知卦'

  return {
    upperTrigram,
    lowerTrigram,
    movingLine,
    name,
    description: getHexagramDescription(hexagramKey, movingLine)
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
  let tiTrigram: Trigram
  let yongTrigram: Trigram

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
  const blueBallMax = lotteryType === '双色球' ? 16 : 12

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
  const advice = generateAdvice(tiYongRelation, confidence)

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
function getTrigramByNumber(num: number): Trigram {
  const trigramKeys: TrigramType[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
  return TRIGRAMS[trigramKeys[num - 1]]
}

function getWuxingRelationship(wuxing1: WuxingType, wuxing2: WuxingType): '相生' | '相克' | '相同' {
  if (wuxing1 === wuxing2) return '相同'
  const relation = WUXING_RELATIONSHIPS[wuxing1]
  if (relation.generates === wuxing2 || relation.isGeneratedBy === wuxing2) return '相生'
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
  tiTrigram: Trigram,
  yongTrigram: Trigram,
  relationship: string,
  isFavorable: boolean
): string {
  const favorableText = isFavorable ? '吉利' : '需谨慎'
  return `体卦为${tiTrigram.name}卦（${tiTrigram.nature}），用卦为${yongTrigram.name}卦（${yongTrigram.nature}），${relationship}，${favorableText}`
}

function generateInterpretation(hexagram: Hexagram, tiYongRelation: TiYongRelation): string {
  return `得${hexagram.name}卦，${tiYongRelation.analysis}。${hexagram.description}`
}

function generateAdvice(tiYongRelation: TiYongRelation, confidence: number): string {
  if (tiYongRelation.isFavorable && confidence >= 80) {
    return '卦象大吉，今日运势极佳，推荐号码可信度高，可以大胆参考！'
  } else if (tiYongRelation.isFavorable) {
    return '卦象吉利，今日运势良好，推荐号码有一定参考价值。'
  } else {
    return '卦象需谨慎，今日运势一般，建议保守参考或等待更好时机。'
  }
}
```

### 4. 整合到现有玄学系统

修改 `src/utils/metaphysicsCalculator.ts`：

```typescript
// 在现有导入中添加
import { analyzePlumBlossom } from './plumBlossomCalculator'

// 修改 calculateMetaphysicsNumbers 函数，添加梅花易数权重
export function calculateMetaphysicsNumbers(
  name: string,
  birthDate: Date,
  currentDate: Date,
  lotteryType: LotteryType
): RecommendedNumbers {
  // ... 现有代码 ...

  // 梅花易数分析权重（新增，25%）
  const plumBlossomAnalysis = analyzePlumBlossom(currentDate, lotteryType)
  plumBlossomAnalysis.luckyNumbers.forEach(num => {
    numberWeights[num] = (numberWeights[num] || 0) + 2.5
  })

  // ... 现有代码 ...

  // 更新推荐理由，添加梅花易数
  reasons.push(`梅花易数：${plumBlossomAnalysis.hexagram.name}，${plumBlossomAnalysis.interpretation}`)

  return {
    redBalls,
    blueBalls,
    confidence,
    reasons
  }
}
```

### 5. UI组件设计

创建 `src/components/plumBlossom/PlumBlossomCard.tsx`：

```typescript
import { memo, useState } from 'react'
import type { PlumBlossomAnalysis } from '../../types/plumBlossom'
import { YinYang, Sparkles, ChevronDown, ChevronUp, Info, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TRIGRAM_DETAILS, MOVING_LINE_INTERPRETATIONS } from '../../constants/plumBlossom'

interface PlumBlossomCardProps {
  analysis: PlumBlossomAnalysis
}

export function PlumBlossomCard({ analysis }: PlumBlossomCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { hexagram, tiYongRelation, confidence, interpretation, advice } = analysis

  // 获取卦象详细信息
  const upperDetails = TRIGRAM_DETAILS[hexagram.upperTrigram.name]
  const lowerDetails = TRIGRAM_DETAILS[hexagram.lowerTrigram.name]
  const movingLineInfo = MOVING_LINE_INTERPRETATIONS[hexagram.movingLine]

  // 获取运势趋势图标
  const getTrendIcon = () => {
    if (tiYongRelation.isFavorable && confidence >= 80) {
      return <TrendingUp className="w-4 h-4 text-green-400" />
    } else if (tiYongRelation.isFavorable) {
      return <TrendingUp className="w-4 h-4 text-yellow-400" />
    } else if (confidence >= 60) {
      return <Minus className="w-4 h-4 text-gray-400" />
    } else {
      return <TrendingDown className="w-4 h-4 text-red-400" />
    }
  }

  return (
    <div className="bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-purple-500/10 rounded-2xl border border-pink-400/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/30 rounded-lg">
            <YinYang className="w-5 h-5 text-pink-300" />
          </div>
          <div className="text-left">
            <div className="text-base font-bold text-white">梅花易数</div>
            <div className="text-xs text-pink-300/80">北宋邵雍创立，时间起卦</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-sm font-semibold text-pink-300">{confidence}%</span>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-pink-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-pink-300" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-pink-400/20 animate-[fadeIn_0.3s_ease-out]">
          {/* 卦象展示 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white">卦象</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-pink-300">{hexagram.name}</span>
                {hexagram.movingLine > 0 && (
                  <span className="text-xs bg-pink-500/30 px-2 py-1 rounded text-pink-200">
                    动爻：第{hexagram.movingLine}爻
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-4">
              {/* 上卦 */}
              <div className="text-center">
                <div className="text-4xl mb-2">{hexagram.upperTrigram.symbol}</div>
                <div className="text-sm font-semibold text-white">{hexagram.upperTrigram.name}卦</div>
                <div className="text-xs text-pink-200/60">{hexagram.upperTrigram.nature}</div>
                <div className="text-xs text-pink-200/80 mt-1">{hexagram.upperTrigram.wuxing}</div>
              </div>

              <div className="text-3xl text-pink-400">☰</div>

              {/* 下卦 */}
              <div className="text-center">
                <div className="text-4xl mb-2">{hexagram.lowerTrigram.symbol}</div>
                <div className="text-sm font-semibold text-white">{hexagram.lowerTrigram.name}卦</div>
                <div className="text-xs text-pink-200/60">{hexagram.lowerTrigram.nature}</div>
                <div className="text-xs text-pink-200/80 mt-1">{hexagram.lowerTrigram.wuxing}</div>
              </div>
            </div>

            {/* 卦辞 */}
            <div className="text-center text-sm text-pink-200/80 italic">
              "{hexagram.description}"
            </div>
          </div>

          {/* 动爻解读 */}
          {hexagram.movingLine > 0 && (
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-pink-300" />
                <div className="text-sm font-semibold text-white">动爻解读</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pink-200/60">位置</span>
                  <span className="text-sm text-pink-200">{movingLineInfo.position}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pink-200/60">含义</span>
                  <span className="text-sm text-pink-200">{movingLineInfo.meaning}</span>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-xs text-pink-200/60 flex-shrink-0">建议</span>
                  <span className="text-sm text-pink-200">{movingLineInfo.advice}</span>
                </div>
              </div>
            </div>
          )}

          {/* 体用关系 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-pink-300" />
              <div className="text-sm font-semibold text-white">体用关系</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* 体卦 */}
              <div className="bg-pink-500/10 rounded-lg p-3">
                <div className="text-xs text-pink-200/60 mb-1">体卦（自身）</div>
                <div className="text-base font-semibold text-white">{tiYongRelation.tiTrigram.name}</div>
                <div className="text-xs text-pink-200/80 mt-1">
                  {upperDetails.description.slice(0, 20)}...
                </div>
              </div>

              {/* 用卦 */}
              <div className="bg-purple-500/10 rounded-lg p-3">
                <div className="text-xs text-purple-200/60 mb-1">用卦（外界）</div>
                <div className="text-base font-semibold text-white">{tiYongRelation.yongTrigram.name}</div>
                <div className="text-xs text-purple-200/80 mt-1">
                  {lowerDetails.description.slice(0, 20)}...
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-pink-200/80">五行关系：</span>
                <span className={`text-sm font-semibold ${tiYongRelation.isFavorable ? 'text-green-400' : 'text-red-400'}`}>
                  {tiYongRelation.relationship}
                </span>
              </div>
              {tiYongRelation.isFavorable ? (
                <div className="flex items-center gap-1 text-green-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">吉利</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">需谨慎</span>
                </div>
              )}
            </div>
          </div>

          {/* 八卦详细属性 */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm font-semibold text-white mb-3">八卦属性</div>
            
            <div className="space-y-3">
              {/* 上卦属性 */}
              <div>
                <div className="text-xs text-pink-200/60 mb-2">{hexagram.upperTrigram.name}卦（{hexagram.upperTrigram.wuxing}）</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-pink-200/60">特性：</span>
                    <span className="text-pink-200">{upperDetails.characteristics.join('、')}</span>
                  </div>
                  <div>
                    <span className="text-pink-200/60">吉物：</span>
                    <span className="text-pink-200">{upperDetails.luckyItems.join('、')}</span>
                  </div>
                </div>
                <div className="text-xs text-pink-200/80 mt-2 italic">
                  {upperDetails.lotteryMeaning}
                </div>
              </div>

              {/* 下卦属性 */}
              <div className="border-t border-pink-400/20 pt-3">
                <div className="text-xs text-purple-200/60 mb-2">{hexagram.lowerTrigram.name}卦（{hexagram.lowerTrigram.wuxing}）</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-purple-200/60">特性：</span>
                    <span className="text-purple-200">{lowerDetails.characteristics.join('、')}</span>
                  </div>
                  <div>
                    <span className="text-purple-200/60">吉物：</span>
                    <span className="text-purple-200">{lowerDetails.luckyItems.join('、')}</span>
                  </div>
                </div>
                <div className="text-xs text-purple-200/80 mt-2 italic">
                  {lowerDetails.lotteryMeaning}
                </div>
              </div>
            </div>
          </div>

          {/* 解读和建议 */}
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-pink-300" />
                <div className="text-sm font-semibold text-white">卦象解读</div>
              </div>
              <div className="text-sm text-pink-200/80 leading-relaxed">
                {interpretation}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-pink-300" />
                <div className="text-sm font-semibold text-white">选号建议</div>
              </div>
              <div className="text-sm text-pink-200/80 leading-relaxed">
                {advice}
              </div>
            </div>
          </div>

          {/* 免责声明 */}
          <div className="bg-pink-500/10 rounded-xl p-3 border border-pink-500/20">
            <div className="text-xs text-pink-200/60 text-center">
              ⚠️ 梅花易数仅供娱乐参考，不构成购彩建议。购彩需理性，量力而行。
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(PlumBlossomCard)
```

### 6. 更新类型定义

修改 `src/types/fortune.ts`，添加梅花易数到玄学分析：

```typescript
// 梅花易数分析结果
import type { PlumBlossomAnalysis } from './plumBlossom'

// 扩展玄学分析结果
export interface MetaphysicsAnalysis {
  nameAnalysis: NameAnalysis
  zodiacAnalysis: ZodiacAnalysis
  wuxingAnalysis: WuxingAnalysis
  numerologyAnalysis: NumerologyAnalysis
  plumBlossomAnalysis: PlumBlossomAnalysis // 新增
  recommendedNumbers: RecommendedNumbers
}
```

### 7. 更新主页展示

修改 `src/components/fortune/RecommendedNumbers.tsx`，在推荐理由中展示梅花易数信息：

```typescript
// 在推荐理由中添加梅花易数图标和说明
<div className="flex items-start gap-2">
  <YinYang className="w-4 h-4 text-pink-300 flex-shrink-0 mt-0.5" />
  <span className="text-sm text-amber-200/80">梅花易数：{plumBlossomInfo}</span>
</div>
```

## 实现步骤

1. ✅ 创建类型定义 `src/types/plumBlossom.ts`
2. ✅ 创建常量配置 `src/constants/plumBlossom.ts`
3. ✅ 实现核心计算逻辑 `src/utils/plumBlossomCalculator.ts`
4. ✅ 创建UI组件 `src/components/plumBlossom/PlumBlossomCard.tsx`
5. ✅ 整合到现有玄学系统 `src/utils/metaphysicsCalculator.ts`
6. ✅ 更新类型定义 `src/types/fortune.ts`
7. ✅ 更新主页展示 `src/components/fortune/RecommendedNumbers.tsx`
8. ✅ 测试和验证

## 注意事项

1. **八卦数字对应**：乾1、兑2、离3、震4、巽5、坎6、艮7、坤8
2. **动爻计算**：余数为0时取6（上爻）
3. **体用判断**：有动爻时动爻所在卦为用卦，无动爻时下卦为体卦
4. **五行生克**：相生为吉，相克为凶，相同为平
5. **数字范围**：确保生成的数字在彩票号码有效范围内

## 扩展性

未来可以扩展的功能：
1. 支持数字起卦方式
2. 支持外应起卦（预设场景选择）
3. 添加卦象详细解读
4. 添加卦气旺衰判断
5. 支持历史卦象记录和查询
