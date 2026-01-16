import { LotteryType } from '../types/lottery';
import { DrawResult, LotteryApiResponse, JisuApiResponse } from '../types/storage';
import { API_CONFIG } from '../config/api';

// 极速数据彩票ID映射
const LOTTERY_ID_MAP: Record<LotteryType, number> = {
  [LotteryType.SHUANGSEQIU]: 11, // 双色球
  [LotteryType.DALETOU]: 14      // 大乐透
};

// 极速数据API响应接口
interface JisuDrawResult {
  caipiaoid: string;
  issueno: string;
  number: string;       // 红球，格式: "05 07 10 18 19 21 27"
  refernumber: string; // 蓝球，格式: "28"
  opendate: string;    // 开奖日期，格式: "2014-10-29"
  deadline: string;     // 兑奖截止日期
  saleamount: string;   // 销售额
  prize?: Array<{
    prizename: string;
    require: string;
    num: string;
    singlebonus: string;
  }>;
}

interface JisuApiData {
  status: number;
  msg: string;
  result: JisuDrawResult;
}

export async function fetchLatestDraw(lotteryType: LotteryType): Promise<DrawResult | null> {
  try {
    const caipiaoid = LOTTERY_ID_MAP[lotteryType];
    const url = `${API_CONFIG.baseUrl}/caipiao/query?appkey=${API_CONFIG.jisuKey}&caipiaoid=${caipiaoid}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.requestTimeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: JisuApiData = await response.json();
    
    if (data.status !== 0) {
      console.error('查询开奖结果失败:', data.msg);
      return null;
    }
    
    if (!data.result) {
      return null;
    }
    
    const result = data.result;
    const numberStr = result.number;
    const numbers = numberStr.split(' ').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const referNumbers = result.refernumber.split(' ').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    
    const redBallsCount = lotteryType === LotteryType.SHUANGSEQIU ? 6 : 5;
    
    return {
      lotteryId: result.issueno,
      lotteryType,
      drawDate: result.opendate,
      numbers: {
        redBalls: numbers.slice(0, redBallsCount),
        blueBalls: referNumbers
      },
      issue: result.issueno
    };
  } catch (error) {
    console.error('请求开奖结果失败:', error);
    return null;
  }
}

export async function fetchDrawByIssue(
  lotteryType: LotteryType,
  issue: string
): Promise<DrawResult | null> {
  try {
    const caipiaoid = LOTTERY_ID_MAP[lotteryType];
    const url = `${API_CONFIG.baseUrl}/caipiao/query?appkey=${API_CONFIG.jisuKey}&caipiaoid=${caipiaoid}&issueno=${issue}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.requestTimeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: JisuApiData = await response.json();
    
    if (data.status !== 0) {
      return null;
    }
    
    if (!data.result) {
      return null;
    }
    
    const result = data.result;
    const numberStr = result.number;
    const numbers = numberStr.split(' ').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const referNumbers = result.refernumber.split(' ').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    
    const redBallsCount = lotteryType === LotteryType.SHUANGSEQIU ? 6 : 5;
    
    return {
      lotteryId: result.issueno,
      lotteryType,
      drawDate: result.opendate,
      numbers: {
        redBalls: numbers.slice(0, redBallsCount),
        blueBalls: referNumbers
      },
      issue: result.issueno
    };
  } catch (error) {
    console.error('查询开奖结果失败:', error);
    return null;
  }
}

export function calculatePrize(
  userNumbers: { redBalls: number[]; blueBalls: number[] },
  drawNumbers: { redBalls: number[]; blueBalls: number[] },
  lotteryType: LotteryType
): { redMatches: number; blueMatches: number; prize: string } {
  const redMatches = userNumbers.redBalls.filter(n => drawNumbers.redBalls.includes(n)).length;
  const blueMatches = userNumbers.blueBalls.filter(n => drawNumbers.blueBalls.includes(n)).length;
  
  let prize = '未中奖';
  
  if (lotteryType === LotteryType.SHUANGSEQIU) {
    if (redMatches === 6 && blueMatches === 1) prize = '一等奖 🏆';
    else if (redMatches === 6 && blueMatches === 0) prize = '二等奖 🥈';
    else if (redMatches === 5 && blueMatches === 1) prize = '三等奖 🥉';
    else if (redMatches === 5 && blueMatches === 0) prize = '四等奖';
    else if (redMatches === 4 && blueMatches === 1) prize = '四等奖';
    else if (redMatches === 4 && blueMatches === 0) prize = '五等奖';
    else if (redMatches === 3 && blueMatches === 1) prize = '五等奖';
    else if (redMatches === 2 && blueMatches === 1) prize = '六等奖';
    else if (redMatches === 1 && blueMatches === 1) prize = '六等奖';
    else if (redMatches === 0 && blueMatches === 1) prize = '六等奖';
  } else {
    if (redMatches === 5 && blueMatches === 2) prize = '一等奖 🏆';
    else if (redMatches === 5 && blueMatches === 1) prize = '二等奖 🥈';
    else if (redMatches === 5 && blueMatches === 0) prize = '三等奖 🥉';
    else if (redMatches === 4 && blueMatches === 2) prize = '三等奖 🥉';
    else if (redMatches === 4 && blueMatches === 1) prize = '四等奖';
    else if (redMatches === 3 && blueMatches === 2) prize = '四等奖';
    else if (redMatches === 4 && blueMatches === 0) prize = '五等奖';
    else if (redMatches === 3 && blueMatches === 1) prize = '五等奖';
    else if (redMatches === 2 && blueMatches === 2) prize = '五等奖';
    else if (redMatches === 3 && blueMatches === 0) prize = '六等奖';
    else if (redMatches === 2 && blueMatches === 1) prize = '六等奖';
    else if (redMatches === 1 && blueMatches === 2) prize = '六等奖';
    else if (redMatches === 2 && blueMatches === 0) prize = '七等奖';
    else if (redMatches === 1 && blueMatches === 1) prize = '七等奖';
    else if (redMatches === 0 && blueMatches === 2) prize = '七等奖';
    else if (redMatches === 1 && blueMatches === 0) prize = '八等奖';
    else if (redMatches === 0 && blueMatches === 1) prize = '八等奖';
  }
  
  return { redMatches, blueMatches, prize };
}
