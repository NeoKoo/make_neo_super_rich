import type { TrigramType } from '../types/plumBlossom'
import type { WuxingType } from '../types/fortune'

// 八卦基本信息
export const TRIGRAMS: Record<TrigramType, {
  name: TrigramType
  number: number
  wuxing: WuxingType
  direction: string
  nature: string
  symbol: string
}> = {
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
    lotteryAdvice: '止步不前，运势一般，等待时机'
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
