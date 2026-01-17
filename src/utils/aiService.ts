import { AI_CONFIG } from '../config/ai';
import { LotteryType } from '../types/lottery';
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

interface LotteryRecommendation {
  redBalls: number[];
  blueBalls: number[];
  text: string;
}

/**
 * 调用智谱AI API获取彩票推荐
 */
export async function getAIRecommendation(
  lotteryType: LotteryType,
  zodiacSign: string,
  birthDate: string
): Promise<LotteryRecommendation | null> {
  try {
    const today = getLocalDateFromBeijing();
    const dateStr = today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    const prompt = AI_CONFIG.defaultPrompt +
      `\n\n彩票类型：${lotteryType}\n用户的星座：${zodiacSign}\n用户的生日：${birthDate}\n今天的日期：${dateStr}`;

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的彩票推荐助手，基于用户的星座和生日推荐幸运号码。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeout);

    const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.zhipuKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        temperature: 0.7, // 温度参数，控制随机性
        max_tokens: 200
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: ZhipuApiResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI');
    }

    const aiContent = data.choices[0].message.content.trim();
    
    // 解析AI返回的内容
    return parseAIResponse(aiContent);
  } catch (error) {
    console.error('AI recommendation error:', error);
    return null;
  }
}

/**
 * 解析AI返回的号码推荐
 */
function parseAIResponse(text: string): LotteryRecommendation | null {
  try {
    // 提取号码部分
    const match = text.match(/今晚的开奖号码为：(.+)/);
    if (!match) {
      return null;
    }

    const numbersText = match[1].trim();
    
    // 分离红球和蓝球
    const [redBallsText, blueBallsText] = numbersText.split(' - ');
    
    if (!redBallsText || !blueBallsText) {
      return null;
    }

    // 解析红球
    const redBalls = redBallsText
      .split(/\s+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= 33);

    // 解析蓝球
    const blueBalls = blueBallsText
      .split(/\s+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= 16);

    if (redBalls.length === 0 || blueBalls.length === 0) {
      return null;
    }

    return {
      redBalls,
      blueBalls,
      text
    };
  } catch (error) {
    console.error('Parse AI response error:', error);
    return null;
  }
}
