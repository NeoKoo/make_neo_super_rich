export const API_CONFIG = {
  juheKey: import.meta.env.VITE_JUHE_API_KEY || '',
  baseUrl: 'http://apis.juhe.cn/lottery',
  requestTimeout: 10000,
  cacheDuration: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};
