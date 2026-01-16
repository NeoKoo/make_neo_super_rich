export const API_CONFIG = {
  jisuKey: import.meta.env.VITE_JISU_API_KEY || '',
  baseUrl: 'https://api.jisuapi.com',
  requestTimeout: 10000,
  cacheDuration: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  
  // 极速数据彩票ID映射
  lotteryIdMap: {
    '双色球': 11,
    '大乐透': 14
  }
};
