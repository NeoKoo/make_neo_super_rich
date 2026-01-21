import { WuxingType } from '../types/fortune'

// 常用汉字笔画数映射（简化版，包含常用字）
export const HANZI_STROKES: Record<string, number> = {
  // 1-5画
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
  '人': 2, '大': 3, '小': 3, '中': 4, '上': 3,
  '下': 3, '天': 4, '地': 6, '日': 4, '月': 4,
  '水': 4, '火': 4, '木': 4, '金': 8, '土': 3,
  '山': 3, '川': 3, '田': 5, '口': 3, '目': 5,
  '耳': 6, '手': 4, '足': 7, '心': 4, '力': 2,

  // 6-10画
  '高': 10, '创': 6, '杰': 8, '明': 8, '亮': 9,
  '伟': 11, '强': 12, '华': 6, '国': 11, '家': 10,
  '文': 4, '武': 8, '智': 12, '勇': 9, '仁': 4,
  '义': 3, '礼': 5, '信': 9, '德': 15, '才': 3,
  '学': 8, '业': 5, '成': 6, '功': 5, '名': 6,
  '利': 7, '富': 12, '贵': 9, '荣': 9, '昌': 8,
  '盛': 11, '兴': 6, '旺': 8, '安': 6, '宁': 5,
  '平': 5, '和': 8, '顺': 9, '康': 11,
  '福': 13, '寿': 7, '喜': 12, '吉': 6, '祥': 10,
  '瑞': 13, '宝': 8, '珠': 10, '玉': 5,

  // 11-15画
  '辉': 12, '煌': 13, '鹏': 19, '翔': 12,
  '龙': 5, '凤': 14, '麒': 19, '麟': 23, '鹤': 15,
  '松': 8, '柏': 9, '梅': 11, '兰': 5, '竹': 6,
  '菊': 11, '荷': 8, '莲': 10, '桃': 10, '李': 7,
  '春': 9, '夏': 10, '秋': 9, '冬': 5, '东': 5,
  '南': 9, '西': 6, '北': 5, '正': 5,
  '良': 7, '贤': 15, '达': 16, '通': 10,
  '雅': 12, '静': 14, '清': 11, '洁': 9, '美': 9,
  '丽': 7, '艳': 10, '秀': 7, '俊': 9, '英': 8,
  '雄': 12, '豪': 14,

  // 常用姓氏
  '王': 4, '张': 7, '刘': 6, '陈': 7,
  '杨': 7, '赵': 9, '黄': 11, '周': 8, '吴': 7,
  '徐': 10, '孙': 6, '胡': 9, '朱': 6,
  '林': 8, '何': 7, '郭': 10, '马': 3, '罗': 8,
  '梁': 11, '宋': 7, '郑': 8, '谢': 12, '韩': 12,
  '唐': 10, '冯': 5, '于': 3, '董': 12, '萧': 11,
  '程': 12, '曹': 11, '袁': 10, '邓': 9, '许': 6,
  '傅': 12, '沈': 7, '曾': 12, '彭': 12, '吕': 6,
  '苏': 7, '卢': 11, '蒋': 13, '蔡': 17, '贾': 10,
  '丁': 2, '魏': 17, '薛': 16, '叶': 5, '阎': 11,

  // 更多常用字
  '志': 7, '海': 10,
  '波': 8, '宇': 6, '航': 10,
  '浩': 10, '然': 12,
  '磊': 15,
  '超': 12, '娟': 10,
  '慧': 15, '巧': 5, '娜': 9,
  '红': 6, '玲': 10, '芳': 7,
  '燕': 16, '雪': 11, '敏': 11,
  '晓': 16, '婷': 12, '萍': 14, '琴': 12
}

// 五行生克关系
export const WUXING_RELATIONSHIPS: Record<WuxingType, {
  generates: WuxingType
  overcomes: WuxingType
  isGeneratedBy: WuxingType
  isOvercomeBy: WuxingType
  description: string
}> = {
  木: {
    generates: '火',
    overcomes: '土',
    isGeneratedBy: '水',
    isOvercomeBy: '金',
    description: '木生火，木克土，水生木，金克木'
  },
  火: {
    generates: '土',
    overcomes: '金',
    isGeneratedBy: '木',
    isOvercomeBy: '水',
    description: '火生土，火克金，木生火，水克火'
  },
  土: {
    generates: '金',
    overcomes: '水',
    isGeneratedBy: '火',
    isOvercomeBy: '木',
    description: '土生金，土克水，火生土，木克土'
  },
  金: {
    generates: '水',
    overcomes: '木',
    isGeneratedBy: '土',
    isOvercomeBy: '火',
    description: '金生水，金克木，土生金，火克金'
  },
  水: {
    generates: '木',
    overcomes: '火',
    isGeneratedBy: '金',
    isOvercomeBy: '土',
    description: '水生木，水克火，金生水，土克水'
  }
}

// 五行对应的幸运数字
export const WUXING_LUCKY_NUMBERS: Record<WuxingType, number[]> = {
  木: [3, 8, 13, 18, 23, 28, 33],
  火: [2, 7, 12, 17, 22, 27, 32],
  土: [5, 10, 15, 20, 25, 30, 35],
  金: [4, 9, 14, 19, 24, 29, 34],
  水: [1, 6, 11, 16, 21, 26, 31]
}

// 五行对应的颜色
export const WUXING_COLORS: Record<WuxingType, string> = {
  木: '#7D6608',
  火: '#E74C3C',
  土: '#8D6E63',
  金: '#FFD700',
  水: '#1976D2'
}

// 星座元素
export const ZODIAC_ELEMENTS: Record<string, '火' | '土' | '风' | '水'> = {
  '白羊座': '火',
  '狮子座': '火',
  '射手座': '火',
  '金牛座': '土',
  '处女座': '土',
  '摩羯座': '土',
  '双子座': '风',
  '天秤座': '风',
  '水瓶座': '风',
  '巨蟹座': '水',
  '天蝎座': '水',
  '双鱼座': '水'
}

// 星座幸运数字
export const ZODIAC_LUCKY_NUMBERS: Record<string, number[]> = {
  '白羊座': [1, 8, 17],
  '金牛座': [2, 6, 9],
  '双子座': [3, 5, 7],
  '巨蟹座': [2, 7, 11],
  '狮子座': [1, 4, 10],
  '处女座': [5, 14, 23],
  '天秤座': [4, 6, 13],
  '天蝎座': [3, 9, 18],
  '射手座': [3, 9, 12],
  '摩羯座': [1, 4, 8],
  '水瓶座': [4, 7, 11],
  '双鱼座': [3, 7, 12]
}

// 星座幸运方位
export const ZODIAC_DIRECTIONS: Record<string, string> = {
  '白羊座': '东方',
  '金牛座': '东南方',
  '双子座': '南方',
  '巨蟹座': '西南方',
  '狮子座': '西方',
  '处女座': '西北方',
  '天秤座': '西方',
  '天蝎座': '西北方',
  '射手座': '北方',
  '摩羯座': '东北方',
  '水瓶座': '北方',
  '双鱼座': '东北方'
}

// 数字命理含义
export const NUMEROLOGY_MEANINGS: Record<number, string> = {
  1: '领导力强，独立自主，具有开创精神',
  2: '合作协调，善于沟通，富有同情心',
  3: '创造力强，表达力佳，乐观开朗',
  4: '踏实稳重，注重细节，有组织能力',
  5: '自由奔放，喜欢冒险，适应力强',
  6: '责任感强，关爱他人，家庭观念重',
  7: '思考深刻，追求真理，有洞察力',
  8: '务实进取，追求成功，商业头脑好',
  9: '博爱无私，理想主义，有服务精神',
  11: '直觉敏锐，有灵性，具有启发他人的能力',
  22: '梦想家，有远见，能将梦想变为现实',
  33: '大师级人物，具有强大的治愈和引导能力'
}

// 生命灵数幸运数字
export const LIFE_PATH_LUCKY_NUMBERS: Record<number, number[]> = {
  1: [1, 10, 19, 28],
  2: [2, 11, 20, 29],
  3: [3, 12, 21, 30],
  4: [4, 13, 22, 31],
  5: [5, 14, 23, 32],
  6: [6, 15, 24, 33],
  7: [7, 16, 25, 34],
  8: [8, 17, 26, 35],
  9: [9, 18, 27, 36],
  11: [11, 29, 38, 47],
  22: [22, 31, 40, 49],
  33: [33, 42, 51, 60]
}

// 名字笔画数吉凶判断
export function getNameFortune(strokes: number): '大吉' | '吉' | '中吉' | '平' | '凶' {
  const luckyNumbers = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81]
  const goodNumbers = [2, 4, 9, 12, 14, 19, 20, 22, 26, 27, 29, 30, 34, 36, 38, 40, 42, 43, 44, 46, 49, 50, 51, 53, 54, 55, 56, 58, 59, 60, 62, 64, 66, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]
  const mediumNumbers = [10, 18, 28, 33, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68]
  const averageNumbers = [15, 16, 24, 25, 31, 32, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81]

  if (luckyNumbers.includes(strokes)) {
    return '大吉'
  } else if (goodNumbers.includes(strokes)) {
    return '吉'
  } else if (mediumNumbers.includes(strokes)) {
    return '中吉'
  } else if (averageNumbers.includes(strokes)) {
    return '平'
  } else {
    return '凶'
  }
}

// 计算名字五行属性
export function calculateNameWuxing(name: string): WuxingType {
  const strokes = calculateNameStrokes(name)
  const wuxingTypes: WuxingType[] = ['木', '火', '土', '金', '水']
  const index = strokes % 5
  return wuxingTypes[index]
}

// 计算名字笔画数
export function calculateNameStrokes(name: string): number {
  let totalStrokes = 0
  for (const char of name) {
    totalStrokes += HANZI_STROKES[char] || char.charCodeAt(0) % 10 + 1
  }
  return totalStrokes
}

// 计算今日五行（基于日期）
export function calculateTodayWuxing(date: Date): WuxingType {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const sum = day + month + (year % 10)
  const wuxingTypes: WuxingType[] = ['木', '火', '土', '金', '水']
  const index = sum % 5
  return wuxingTypes[index]
}

// 判断五行关系
export function getWuxingRelationship(personal: WuxingType, today: WuxingType): '相生' | '相克' | '相同' {
  if (personal === today) {
    return '相同'
  }
  const relationship = WUXING_RELATIONSHIPS[personal]
  if (relationship.generates === today || relationship.isGeneratedBy === today) {
    return '相生'
  }
  if (relationship.overcomes === today || relationship.isOvercomeBy === today) {
    return '相克'
  }
  return '相同'
}
