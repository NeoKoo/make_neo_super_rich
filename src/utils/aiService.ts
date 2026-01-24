import { AI_CONFIG } from '../config/ai';
import { LotteryType } from '../types/lottery';
import { EnhancedLotteryRecommendation, AIRecommendationResult } from '../types/ai';
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


/**
 * 清除 AI 推荐缓存
 */
export function clearAIRecommendationCache(): void {
  aiAPICache.clearByPrefix('ai_recommendation');
  console.log('[AI Recommendation] Cache cleared');
}

export async function getAIRecommendation(
  lotteryType: LotteryType,
  zodiacSign: string,
  birthDate: string,
  userName: string
): Promise<AIRecommendationResult> {
  console.log('[AI Recommendation] Starting request with params:', {
    lotteryType,
    zodiacSign,
    birthDate,
    userName
  });

  const cacheKey = generateCacheKey('ai_recommendation', {
    lotteryType,
    zodiacSign,
    birthDate,
    userName
  });

  console.log('[AI Recommendation] Cache key:', cacheKey);

  const requestTask = async (): Promise<EnhancedLotteryRecommendation | null> => {
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
        content: '你是一个专业的玄学彩票推荐大师，精通星座、五行、数字命理等玄学理论。请根据用户的信息提供专业的彩票推荐和详细的玄学分析。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeout);

    console.log('[AI Recommendation] Sending request to:', `${AI_CONFIG.baseUrl}/chat/completions`);
    console.log('[AI Recommendation] API Key:', AI_CONFIG.apiKey ? `${AI_CONFIG.apiKey.substring(0, 8)}...` : 'NOT SET');
    console.log('[AI Recommendation] Model:', AI_CONFIG.model);

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
        max_tokens: 30000
      }),
      signal: controller.signal
    });

    console.log('[AI Recommendation] Response status:', response.status, response.statusText);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('[AI Recommendation] API Error Response:', errorText);

      let errorData: ZhipuApiError | null = null;

      try {
        errorData = JSON.parse(errorText) as ZhipuApiError;
      } catch (e) {
        console.error('[AI Recommendation] Failed to parse error response');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const errorCode = errorData?.error?.code || response.status.toString();
      const errorMessage = errorData?.error?.message || errorText;

      console.error('[AI Recommendation] Error code:', errorCode, 'Error message:', errorMessage);
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

function parseAIResponse(text: string, lotteryType: LotteryType = LotteryType.SHUANGSEQIU): EnhancedLotteryRecommendation | null {
  try {
    console.log('[AI Parse] Attempting to parse JSON response for:', lotteryType);

    // 尝试解析JSON格式的响应
    let jsonData: any;
    try {
      jsonData = JSON.parse(text);
    } catch (jsonError) {
      console.error('[AI Parse Error] Failed to parse JSON:', jsonError);
      console.log('[AI Parse] Attempting to extract JSON from text');
      
      // 尝试从文本中提取JSON部分
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[AI Parse Error] No JSON found in response');
        return null;
      }
      
      jsonData = JSON.parse(jsonMatch[0]);
    }

    console.log('[AI Parse] Parsed JSON data:', jsonData);

    // 验证必要字段
    if (!jsonData.redBalls || !jsonData.blueBalls || !Array.isArray(jsonData.redBalls) || !Array.isArray(jsonData.blueBalls)) {
      console.error('[AI Parse Error] Missing or invalid redBalls/blueBalls fields');
      return null;
    }

    const redBallMax = lotteryType === LotteryType.SHUANGSEQIU ? 33 : 35;
    const blueBallMax = lotteryType === LotteryType.SHUANGSEQIU ? 16 : 12;

    const redBalls = jsonData.redBalls
      .map((n: any) => parseInt(n))
      .filter((n: number) => !isNaN(n) && n >= 1 && n <= redBallMax);

    const blueBalls = jsonData.blueBalls
      .map((n: any) => parseInt(n))
      .filter((n: number) => !isNaN(n) && n >= 1 && n <= blueBallMax);

    console.log('[AI Parse] Red balls:', redBalls);
    console.log('[AI Parse] Blue balls:', blueBalls);

    if (redBalls.length === 0 || blueBalls.length === 0) {
      console.error('[AI Parse Error] No valid balls after filtering');
      return null;
    }

    // 构建增强的推荐结果
    const result: EnhancedLotteryRecommendation = {
      redBalls,
      blueBalls,
      text: jsonData.overallAnalysis?.summary || 'AI财神推荐',
      numberReasons: jsonData.numberReasons || [],
      overallAnalysis: jsonData.overallAnalysis || {
        summary: '综合分析显示今日运势良好',
        fortuneLevel: '吉',
        keyFactors: ['星座运势', '五行平衡', '数字能量'],
        advice: '建议在幸运时间内购买',
        bestTiming: '今日下午3-5点'
      },
      metaphysicsInsight: jsonData.metaphysicsInsight || {
        zodiacInfluence: '星座能量加持',
        wuxingBalance: '五行相生相助',
        numerologyPattern: '数字组合吉利',
        energyLevel: 75
      }
    };

    // 处理每个号码的理由，确保有默认值
    result.numberReasons = result.numberReasons.map((reason: any) => ({
      number: reason.number || 0,
      type: reason.type || 'red',
      reasons: {
        primary: reason.reasons?.primary || '此号码能量强劲',
        metaphysics: reason.reasons?.metaphysics || '符合玄学原理',
        zodiac: reason.reasons?.zodiac || '与用户星座相合',
        wuxing: reason.reasons?.wuxing || '五行属性相生',
        numerology: reason.reasons?.numerology || '数字命理吉祥',
        timing: reason.reasons?.timing || '时机恰到好处'
      },
      confidence: reason.confidence || 75,
      luckyElements: reason.luckyElements || ['幸运数字', '吉利符号']
    }));

    return result;
  } catch (error) {
    console.error('Parse AI response error:', error);
    return null;
  }
}
