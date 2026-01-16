export interface StorageDrawCache {
  lotteryId: string;
  lotteryType: '双色球' | '大乐透';
  drawDate: string;
  numbers: {
    redBalls: number[];
    blueBalls: number[];
  };
  cachedAt: number;
  expiresAt: number;
}

export interface LotteryApiResponse {
  error_code: number;
  reason: string;
  result?: {
    lottery_id: string;
    lottery_name: string;
    lottery_res: string;
    lottery_no: string;
    lottery_date: string;
    lottery_exdate?: string;
    lottery_sale_amount?: string;
    lottery_pool_amount?: string;
  };
}
