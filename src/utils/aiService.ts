import { AI_CONFIG } from '../config/ai';
import { LotteryType } from '../types/lottery';
import { getLocalDateFromBeijing } from './dateUtils';

interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ZhipuApiResponse {
  choices: Array<{
    message: {
      content: string;
      reasoning_content?: string;
    };
  }>;
}

interface LotteryRecommendation {
  redBalls: number[];
  blueBalls: number[];
  text: string;
  reasoning?: string;
}

export async function getAIRecommendation(
  lotteryType: LotteryType,
  zodiacSign: string,
  birthDate: string,
  userName: string
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
      `\n\n彩票类型：${lotteryType}\n用户的姓名：${userName}\n用户的星座：${zodiacSign}\n用户的生日：${birthDate}\n今天的日期：${dateStr}`;

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的彩票推荐助手，基于用户的姓名、星座和生日推荐幸运号码。'
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
        thinking: {
          type: 'enabled'
        },
        temperature: 0.7,
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
    const reasoningContent = data.choices[0].message.reasoning_content;

    console.log('[AI Response]', aiContent);
    console.log('[AI Reasoning]', reasoningContent);
    console.log('[AI Response parsed]', parseAIResponse(aiContent, lotteryType));

    return parseAIResponse(aiContent, lotteryType, reasoningContent);
  } catch (error) {
    console.error('AI recommendation error:', error);
    return null;
  }
}

function parseAIResponse(text: string, lotteryType: LotteryType = LotteryType.SHUANGSEQIU, reasoning?: string): LotteryRecommendation | null {
  try {
    const match = text.match(/今晚的开奖号码为：(.+)/);
    if (!match) {
      return null;
    }

    const numbersText = match[1].trim();

    const [redBallsText, blueBallsText] = numbersText.split(' - ');

    if (!redBallsText || !blueBallsText) {
      return null;
    }

    const redBallMax = lotteryType === LotteryType.SHUANGSEQIU ? 33 : 35;
    const blueBallMax = lotteryType === LotteryType.SHUANGSEQIU ? 16 : 12;

    const redBalls = redBallsText
      .split(/\s+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= redBallMax);

    const blueBalls = blueBallsText
      .split(/\s+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= blueBallMax);

    if (redBalls.length === 0 || blueBalls.length === 0) {
      return null;
    }

    return {
      redBalls,
      blueBalls,
      text,
      reasoning
    };
  } catch (error) {
    console.error('Parse AI response error:', error);
    return null;
  }
}
