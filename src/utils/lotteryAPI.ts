import { LotteryType } from '../types/lottery';
import { DrawResult, LotteryApiResponse } from '../types/storage';
import { API_CONFIG } from '../config/api';

const LOTTERY_ID_MAP: Record<LotteryType, string> = {
  [LotteryType.SHUANGSEQIU]: 'ssq',
  [LotteryType.DALETOU]: 'dlt'
};

export async function fetchLatestDraw(lotteryType: LotteryType): Promise<DrawResult | null> {
  try {
    const lotteryId = LOTTERY_ID_MAP[lotteryType];
    const url = `${API_CONFIG.baseUrl}/query?key=${API_CONFIG.juheKey}&lottery_id=${lotteryId}`;
    
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
    
    const data: LotteryApiResponse = await response.json();
    
    if (data.error_code !== 0) {
      console.error('查询开奖结果失败:', data.reason);
      return null;
    }
    
    if (!data.result) {
      return null;
    }
    
    const result = data.result;
    const numberStr = result.lottery_res;
    const numbers = numberStr.split(',').map(n => parseInt(n.trim()));
    
    const redBallsCount = lotteryType === LotteryType.SHUANGSEQIU ? 6 : 5;
    
    return {
      lotteryId: result.lottery_id,
      lotteryType,
      drawDate: result.lottery_date,
      numbers: {
        redBalls: numbers.slice(0, redBallsCount),
        blueBalls: numbers.slice(redBallsCount)
      },
      issue: result.lottery_no
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
    const lotteryId = LOTTERY_ID_MAP[lotteryType];
    const url = `${API_CONFIG.baseUrl}/query?key=${API_CONFIG.juheKey}&lottery_id=${lotteryId}&lottery_no=${issue}`;
    
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
    
    const data: LotteryApiResponse = await response.json();
    
    if (data.error_code !== 0) {
      return null;
    }
    
    if (!data.result) {
      return null;
    }
    
    const result = data.result;
    const numberStr = result.lottery_res;
    const numbers = numberStr.split(',').map(n => parseInt(n.trim()));
    
    const redBallsCount = lotteryType === LotteryType.SHUANGSEQIU ? 6 : 5;
    
    return {
      lotteryId: result.lottery_id,
      lotteryType,
      drawDate: result.lottery_date,
      numbers: {
        redBalls: numbers.slice(0, redBallsCount),
        blueBalls: numbers.slice(redBallsCount)
      },
      issue: result.lottery_no
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
