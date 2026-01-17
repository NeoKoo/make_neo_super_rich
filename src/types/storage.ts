import { LotteryType } from './lottery';

export interface StorageDrawCache {
  lotteryId: string;
  lotteryType: LotteryType;
  drawDate: string;
  numbers: {
    redBalls: number[];
    blueBalls: number[];
  };
  cachedAt: number;
  expiresAt: number;
}

// 极速数据API响应接口（用于历史类型保留）
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

// 极速数据API响应接口
export interface JisuApiResponse {
  status: number;
  msg: string;
  result: {
    caipiaoid: string;
    issueno: string;
    number: string;
    refernumber: string;
    opendate: string;
    deadline: string;
    saleamount: string;
    prize?: Array<{
      prizename: string;
      require: string;
      num: string;
      singlebonus: string;
    }>;
  };
}
