import { AI_CONFIG } from '../config/ai';
import { LotteryType } from '../types/lottery';
import { getLocalDateFromBeijing } from './dateUtils';
import { aiRequestQueue, aiAPICache, generateCacheKey, queuedCachedRequest } from './apiQueue';

interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ZhipuApiError {
  error: {
    code: string;
    message: string;
    type?: string;
  };
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

interface AIRecommendationResult {
  success: boolean;
  data?: LotteryRecommendation;
  error?: {
    code: string;
    message: string;
    userFriendlyMessage: string;
  };
}

export async function getAIRecommendation(
  lotteryType: LotteryType,
  zodiacSign: string,
  birthDate: string,
  userName: string
): Promise<AIRecommendationResult> {
  const cacheKey = generateCacheKey('ai_recommendation', {
    lotteryType,
    zodiacSign,
    birthDate,
    userName
  });

  const requestTask = async (): Promise<LotteryRecommendation | null> => {
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
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 200
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      let errorData: ZhipuApiError | null = null;

      try {
        errorData = JSON.parse(errorText) as ZhipuApiError;
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const errorCode = errorData?.error?.code || response.status.toString();
      const errorMessage = errorData?.error?.message || errorText;

      throw new APIError(errorCode, errorMessage, response.status);
    }

    const data: ZhipuApiResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI');
    }

    const aiContent = data.choices[0].message.content.trim();

    console.log('[AI Response]', aiContent);
    console.log('[AI Response parsed]', parseAIResponse(aiContent, lotteryType));

    return parseAIResponse(aiContent, lotteryType);
  };

  try {
    const result = await queuedCachedRequest(
      aiRequestQueue,
      aiAPICache,
      cacheKey,
      requestTask,
      30 * 60 * 1000
    );

    if (!result) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse AI response',
          userFriendlyMessage: 'AI返回的号码格式有误，请稍后重试'
        }
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('AI recommendation error:', error);

    if (error instanceof APIError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          userFriendlyMessage: getFriendlyErrorMessage(error)
        }
      };
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN',
        message: error instanceof Error ? error.message : 'Unknown error',
        userFriendlyMessage: 'AI暂时无法生成推荐，请稍后再试'
      }
    };
  }
}

class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

function getFriendlyErrorMessage(error: APIError): string {
  const errorCodeMap: Record<string, string> = {
    '400': '请求参数错误',
    '401': 'API密钥无效或已过期',
    '403': '权限不足',
    '429': '请求过于频繁，请稍后再试',
    '500': '服务器错误，请稍后再试',
    '503': '服务暂时不可用，请稍后再试'
  };

  if (errorCodeMap[error.code]) {
    return errorCodeMap[error.code];
  }

  if (error.statusCode >= 400 && error.statusCode < 500) {
    return `请求错误 (${error.statusCode})，请检查网络连接`;
  }

  if (error.statusCode >= 500) {
    return `服务器错误 (${error.statusCode})，请稍后再试`;
  }

  return 'AI暂时无法生成推荐，请稍后再试';
}

function parseAIResponse(text: string, lotteryType: LotteryType = LotteryType.SHUANGSEQIU): LotteryRecommendation | null {
  try {
    console.log('[AI Parse] Attempting to parse response for:', lotteryType);

    const match = text.match(/今晚的开奖号码为：(.+)/);
    if (!match) {
      console.error('[AI Parse Error] No "今晚的开奖号码为：" pattern found in:', text);
      return null;
    }

    const numbersText = match[1].trim();
    console.log('[AI Parse] Numbers text extracted:', numbersText);

    const parts = numbersText.split(' - ');
    console.log('[AI Parse] Split parts:', parts);

    if (parts.length < 2) {
      console.error('[AI Parse Error] Not enough parts after split:', parts);
      return null;
    }

    const [redBallsText, blueBallsText] = parts;

    if (!redBallsText || !blueBallsText) {
      console.error('[AI Parse Error] Red or blue balls text is empty');
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

    console.log('[AI Parse] Red balls:', redBalls);
    console.log('[AI Parse] Blue balls:', blueBalls);

    if (redBalls.length === 0 || blueBalls.length === 0) {
      console.error('[AI Parse Error] No valid balls after filtering');
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
