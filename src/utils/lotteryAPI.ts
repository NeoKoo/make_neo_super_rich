import { LotteryType } from '../types/lottery';
import { DrawResult } from '../types/history';
import { API_CONFIG } from '../config/api';

// 极速数据彩票ID映射
const LOTTERY_ID_MAP: Record<LotteryType, number> = {
  [LotteryType.SHUANGSEQIU]: 11, // 双色球
  [LotteryType.DALETOU]: 14      // 大乐透
};

/**
 * 将日期格式（YYYYMMDD）转换为期号格式（YYYYNNN）
 * 双色球：每年约154期（每周二、四、日开奖）
 * 大乐透：每年约156期（每周一、三、六开奖）
 */
function convertDateToIssue(dateStr: string, lotteryType: LotteryType): string {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6));
  const day = parseInt(dateStr.substring(6, 8));

  const date = new Date(year, month - 1, day);

  // 根据彩票类型计算期号
  let issueNumber: number;

  if (lotteryType === LotteryType.SHUANGSEQIU) {
    // 双色球：每周二、四、日开奖
    // 从2024-01-01（周一）开始计算
    // 2024-01-01是周一，第一期的开奖日期是2024-01-02（周二）
    const firstDrawDate = new Date(year, 0, 2); // 2024-01-02
    const daysSinceFirstDraw = Math.floor((date.getTime() - firstDrawDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceFirstDraw < 0) {
      // 如果日期在第一期之前，返回上一年的最后一期
      return convertDateToIssue(`${year - 1}1231`, lotteryType);
    }

    // 计算完整周数
    const weeksSinceFirstDraw = Math.floor(daysSinceFirstDraw / 7);
    const dayOfWeek = (firstDrawDate.getDay() + daysSinceFirstDraw % 7) % 7;

    // 双色球每周开奖3次（周二、四、日）
    // 0=周日, 1=周一, 2=周二, 3=周三, 4=周四, 5=周五, 6=周六
    let drawsThisWeek = 0;
    if (dayOfWeek >= 2) drawsThisWeek++; // 周二
    if (dayOfWeek >= 4) drawsThisWeek++; // 周四
    if (dayOfWeek === 0) drawsThisWeek++; // 周日

    issueNumber = weeksSinceFirstDraw * 3 + drawsThisWeek;
  } else {
    // 大乐透：每周一、三、六开奖
    // 从2024-01-01（周一）开始计算
    // 2024-01-01是周一，第一期的开奖日期就是2024-01-01（周一）
    const firstDrawDate = new Date(year, 0, 1); // 2024-01-01
    const daysSinceFirstDraw = Math.floor((date.getTime() - firstDrawDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceFirstDraw < 0) {
      return convertDateToIssue(`${year - 1}1231`, lotteryType);
    }

    // 计算完整周数
    const weeksSinceFirstDraw = Math.floor(daysSinceFirstDraw / 7);
    const dayOfWeek = (firstDrawDate.getDay() + daysSinceFirstDraw % 7) % 7;

    // 大乐透每周开奖3次（周一、三、六）
    let drawsThisWeek = 0;
    if (dayOfWeek >= 1) drawsThisWeek++; // 周一
    if (dayOfWeek >= 3) drawsThisWeek++; // 周三
    if (dayOfWeek >= 6) drawsThisWeek++; // 周六

    issueNumber = weeksSinceFirstDraw * 3 + drawsThisWeek;
  }

  return `${year}${String(issueNumber).padStart(3, '0')}`;
}

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
    // 检查期号格式，如果是日期格式（YYYYMMDD），转换为期号格式（YYYYNNN）
    let apiIssue = issue;
    if (/^\d{8}$/.test(issue)) {
      apiIssue = convertDateToIssue(issue, lotteryType);
      console.log('[lotteryAPI] 期号格式转换:', { dateIssue: issue, apiIssue });
    }

    const caipiaoid = LOTTERY_ID_MAP[lotteryType];
    const url = `${API_CONFIG.baseUrl}/caipiao/query?appkey=${API_CONFIG.jisuKey}&caipiaoid=${caipiaoid}&issueno=${apiIssue}`;

    console.log('[lotteryAPI] 请求开奖结果:', {
      lotteryType,
      originalIssue: issue,
      apiIssue,
      caipiaoid,
      url: url.replace(API_CONFIG.jisuKey, '***'),
      hasKey: !!API_CONFIG.jisuKey
    });

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

    console.log('[lotteryAPI] 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: JisuApiData = await response.json();

    console.log('[lotteryAPI] API响应数据:', data);

    if (data.status !== 0) {
      console.warn('[lotteryAPI] API返回错误:', data.msg);
      return null;
    }

    if (!data.result) {
      console.warn('[lotteryAPI] API返回空结果');
      return null;
    }

    const result = data.result;
    const numberStr = result.number;
    const numbers = numberStr.split(' ').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const referNumbers = result.refernumber.split(' ').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    const redBallsCount = lotteryType === LotteryType.SHUANGSEQIU ? 6 : 5;

    const drawResult = {
      lotteryId: result.issueno,
      lotteryType,
      drawDate: result.opendate,
      numbers: {
        redBalls: numbers.slice(0, redBallsCount),
        blueBalls: referNumbers
      },
      issue: result.issueno
    };

    console.log('[lotteryAPI] 解析后的开奖结果:', drawResult);

    return drawResult;
  } catch (error) {
    console.error('[lotteryAPI] 查询开奖结果失败:', error);
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
