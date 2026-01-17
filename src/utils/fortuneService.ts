import { AI_CONFIG } from '../config/ai';
import { getLocalDateFromBeijing } from '../utils/dateUtils';

interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ZhipuApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface DailyFortune {
  blessing: string;        // 祝福语
  luckyTime: string;       // 幸运时间
  luckyHour: number;       // 幸运时段（小时）
  reason: string;          // 幸运原因（玄学/星座理论）
}

/**
 * 调用智谱AI获取每日运势和幸运时间
 */
export async function getDailyFortune(
  zodiacSign: string,
  lotteryType: string,
  birthDate: string
): Promise<DailyFortune | null> {
  try {
    const today = getLocalDateFromBeijing();
    const dateStr = today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    const prompt = `你是专业的命理大师和星座运势专家。请基于用户的星座和今天的日期，提供今日运势和幸运购买彩票的时间。

要求：
1. 祝福语：1-2句吉祥祝福，要充满正能量
2. 幸运时间：给出今天最佳的购买彩票时间段（格式：HH:mm-HH:mm，如：09:00-11:00）
3. 幸运原因：简要说明为什么这个时间幸运（基于星座、五行、神煞等玄学理论）
4. 输出格式：使用JSON格式，不要有多余文字

输出JSON格式示例：
{
  "blessing": "今日紫气东来，财运亨通，万事如意！",
  "luckyTime": "09:00-11:00",
  "luckyHour": 10,
  "reason": "今日为贵人时，辰巳时财运最旺，适合购买彩票"
}

用户信息：
- 星座：${zodiacSign}
- 彩票类型：${lotteryType}
- 生日：${birthDate}
- 今天日期：${dateStr}

请只输出JSON格式，不要其他内容。`;

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content: '你是中国传统的命理大师和星座运势专家，精通紫微斗数、八字命理、星座运势等各种玄学理论。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.zhipuKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: ZhipuApiResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI');
    }

    const aiContent = data.choices[0].message.content.trim();
    
    // 解析AI返回的JSON
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const fortuneData = JSON.parse(jsonMatch[0]);

    return {
      blessing: fortuneData.blessing || '今日运势大吉，财运亨通！',
      luckyTime: fortuneData.luckyTime || '10:00-12:00',
      luckyHour: fortuneData.luckyHour || 11,
      reason: fortuneData.reason || '今日运势最佳时辰'
    };
  } catch (error) {
    console.error('Daily fortune error:', error);
    return null;
  }
}

/**
 * 判断当前是否在幸运时间内
 */
export function isLuckyTime(luckyTime: string): boolean {
  try {
    const [start, end] = luckyTime.split('-').map(t => t.trim());
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const now = getLocalDateFromBeijing();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    const currentTotalMin = currentHour * 60 + currentMin;
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    
    return currentTotalMin >= startTotalMin && currentTotalMin <= endTotalMin;
  } catch (error) {
    console.error('Lucky time check error:', error);
    return false;
  }
}
