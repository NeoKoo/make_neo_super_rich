import { AI_CONFIG } from '../config/ai';
import { getLocalDateFromBeijing } from '../utils/dateUtils';
import { aiRequestQueue, aiAPICache, generateCacheKey, queuedCachedRequest } from './apiQueue';
import { LotteryType } from '../types/lottery';
import {
  EnhancedDailyFortune,
  EnhancedDailyFortuneResult
} from '../types/fortune';
import {
  analyzeMetaphysics,
  calculateMetaphysicsNumbers
} from './metaphysicsCalculator';

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

interface DailyFortune {
  blessing: string;
  luckyTime: string;
  luckyHour: number;
  reason: string;
}

interface DailyFortuneResult {
  success: boolean;
  data?: DailyFortune;
  error?: {
    code: string;
    message: string;
    userFriendlyMessage: string;
  };
}

export async function getDailyFortune(
  zodiacSign: string,
  lotteryType: string,
  birthDate: string
): Promise<DailyFortuneResult> {
  const cacheKey = generateCacheKey('daily_fortune', {
    zodiacSign,
    lotteryType,
    birthDate
  });

  const requestTask = async (): Promise<DailyFortune | null> => {
    const today = getLocalDateFromBeijing();
    const dateStr = today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    const prompt = `作为命理专家，请为用户提供今日运势和幸运购彩时间，并严格按照以下JSON格式输出：

{
  "blessing": "祝福语（1-2句）",
  "luckyTime": "最佳购彩时间段，格式：HH:mm-HH:mm",
  "luckyHour": 最佳小时数字,
  "reason": "幸运原因（基于星座、五行等）"
}

用户信息：
- 星座：${zodiacSign}
- 彩票类型：${lotteryType}
- 生日：${birthDate}
- 今天日期：${dateStr}

重要：只输出JSON格式，不要其他任何文字、说明或分析。`;

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content: '你是命理专家，输出严格的JSON格式数据。'
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
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        temperature: 0.3,
        max_tokens: 500
      })
    });

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

    console.log('[Fortune AI Response]', aiContent.substring(0, 200));

    let fortuneData;
    let parsingMethod = '';

    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/s);
      if (jsonMatch && jsonMatch[0]) {
        parsingMethod = 'JSON regex match';
        console.log('[Fortune Parse] Method:', parsingMethod);
        console.log('[Fortune Parse] JSON matched:', jsonMatch[0]);
        fortuneData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('[Fortune Parse Error] Failed to parse JSON:', parseError);
      console.error('[Fortune Parse Error] Attempting fallback extraction');

      try {
        const blessingMatch = aiContent.match(/blessing[：:]\s*["']?([^"'\n,]+)["']?/i);
        const luckyTimeMatch = aiContent.match(/luckyTime[：:]\s*["']?([^"'\n,]+)["']?/i);
        const luckyHourMatch = aiContent.match(/luckyHour[：:]\s*(\d+)/i);
        const reasonMatch = aiContent.match(/reason[：:]\s*["']?([^"'\n,]+)["']?/i);

        if (blessingMatch || luckyTimeMatch || reasonMatch) {
          parsingMethod = 'Field extraction fallback';
          console.log('[Fortune Parse] Method:', parsingMethod);
          console.log('[Fortune Parse] Extracted fields:', {
            blessing: blessingMatch?.[1],
            luckyTime: luckyTimeMatch?.[1],
            luckyHour: luckyHourMatch?.[1],
            reason: reasonMatch?.[1]
          });

          fortuneData = {
            blessing: blessingMatch?.[1]?.trim() || '今日运势大吉，财运亨通！',
            luckyTime: luckyTimeMatch?.[1]?.trim() || '10:00-12:00',
            luckyHour: luckyHourMatch?.[1] ? parseInt(luckyHourMatch[1]) : 11,
            reason: reasonMatch?.[1]?.trim() || '今日运势最佳时辰'
          };
        } else {
          throw new Error('Failed both JSON and field extraction');
        }
      } catch (fallbackError) {
        console.error('[Fortune Parse Error] Fallback also failed:', fallbackError);
        throw new Error('Failed to parse AI response using all methods');
      }
    }

    console.log('[Fortune Parse] Parsed data:', fortuneData);

    return {
      blessing: fortuneData.blessing || '今日运势大吉，财运亨通！',
      luckyTime: fortuneData.luckyTime || '10:00-12:00',
      luckyHour: fortuneData.luckyHour || 11,
      reason: fortuneData.reason || '今日运势最佳时辰'
    };
  };

  try {
    const result = await queuedCachedRequest(
      aiRequestQueue,
      aiAPICache,
      cacheKey,
      requestTask,
      60 * 60 * 1000
    );

    if (!result) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse AI response',
          userFriendlyMessage: 'AI返回的运势格式有误，请稍后重试'
        }
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Daily fortune error:', error);

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
        userFriendlyMessage: '暂时无法获取运势，请稍后再试'
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

  return '暂时无法获取运势，请稍后再试';
}

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

// 获取增强的运势数据（包含玄学分析）
export async function getEnhancedDailyFortune(
  name: string,
  zodiacSign: string,
  birthDate: string,
  lotteryType: LotteryType
): Promise<EnhancedDailyFortuneResult> {
  const cacheKey = generateCacheKey('enhanced_daily_fortune', {
    name,
    zodiacSign,
    birthDate,
    lotteryType
  });

  const requestTask = async (): Promise<EnhancedDailyFortune | null> => {
    const today = getLocalDateFromBeijing();
    const dateStr = today.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    // 解析生日（添加错误处理）
    let birthDateObj: Date
    try {
      const [birthMonth, birthDay] = birthDate.split('-').map(Number)
      if (isNaN(birthMonth) || isNaN(birthDay) || birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
        throw new Error('Invalid birth date format')
      }
      birthDateObj = new Date(2000, birthMonth - 1, birthDay)
    } catch (error) {
      console.error('[Enhanced Fortune Error] Invalid birth date:', error)
      // 使用默认生日
      birthDateObj = new Date(2000, 0, 1)
    }

    // 使用本地玄学计算（不依赖AI）
    let metaphysics
    let recommendedNumbers
    try {
      metaphysics = analyzeMetaphysics(name, birthDateObj, today)
      recommendedNumbers = calculateMetaphysicsNumbers(
        name,
        birthDateObj,
        today,
        lotteryType
      )
    } catch (error) {
      console.error('[Enhanced Fortune Error] Metaphysics calculation failed:', error)
      throw new Error('玄学计算失败')
    }

    // 使用AI获取祝福语和幸运时间
    const prompt = `作为命理专家，请为用户提供今日运势祝福和幸运购彩时间，并严格按照以下JSON格式输出：

{
  "blessing": "祝福语（1-2句，温暖鼓励）",
  "luckyTime": "最佳购彩时间段，格式：HH:mm-HH:mm",
  "luckyHour": 最佳小时数字,
  "reason": "幸运原因（简短，基于今日运势）"
}

用户信息：
- 名字：${name}
- 星座：${zodiacSign}
- 生日：${birthDate}
- 彩票类型：${lotteryType}
- 今天日期：${dateStr}

玄学分析参考：
- 名字五行：${metaphysics.nameAnalysis.wuxing}
- 星座元素：${metaphysics.zodiacAnalysis.element}
- 今日运势指数：${metaphysics.zodiacAnalysis.todayLuck}
- 五行关系：${metaphysics.wuxingAnalysis.relationship}

重要：只输出JSON格式，不要其他任何文字、说明或分析。`;

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content: '你是命理专家，输出严格的JSON格式数据。'
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
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        temperature: 0.3,
        max_tokens: 500
      })
    });

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

    console.log('[Enhanced Fortune AI Response]', aiContent.substring(0, 200));

    let fortuneData;
    let parsingMethod = '';

    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/s);
      if (jsonMatch && jsonMatch[0]) {
        parsingMethod = 'JSON regex match';
        console.log('[Enhanced Fortune Parse] Method:', parsingMethod);
        fortuneData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('[Enhanced Fortune Parse Error] Failed to parse JSON:', parseError);
      console.error('[Enhanced Fortune Parse Error] Attempting fallback extraction');

      try {
        const blessingMatch = aiContent.match(/blessing[：:]\s*["']?([^"'\n,]+)["']?/i);
        const luckyTimeMatch = aiContent.match(/luckyTime[：:]\s*["']?([^"'\n,]+)["']?/i);
        const luckyHourMatch = aiContent.match(/luckyHour[：:]\s*(\d+)/i);
        const reasonMatch = aiContent.match(/reason[：:]\s*["']?([^"'\n,]+)["']?/i);

        if (blessingMatch || luckyTimeMatch || reasonMatch) {
          parsingMethod = 'Field extraction fallback';
          console.log('[Enhanced Fortune Parse] Method:', parsingMethod);
          fortuneData = {
            blessing: blessingMatch?.[1]?.trim() || '今日运势大吉，财运亨通！',
            luckyTime: luckyTimeMatch?.[1]?.trim() || '10:00-12:00',
            luckyHour: luckyHourMatch?.[1] ? parseInt(luckyHourMatch[1]) : 11,
            reason: reasonMatch?.[1]?.trim() || '今日运势最佳时辰'
          };
        } else {
          throw new Error('Failed both JSON and field extraction');
        }
      } catch (fallbackError) {
        console.error('[Enhanced Fortune Parse Error] Fallback also failed:', fallbackError);
        throw new Error('Failed to parse AI response using all methods');
      }
    }

    console.log('[Enhanced Fortune Parse] Parsed data:', fortuneData);

    // 组合AI结果和本地玄学计算
    return {
      blessing: fortuneData.blessing || '今日运势大吉，财运亨通！',
      luckyTime: fortuneData.luckyTime || '10:00-12:00',
      luckyHour: fortuneData.luckyHour || 11,
      reason: fortuneData.reason || '今日运势最佳时辰',
      metaphysics: {
        ...metaphysics,
        recommendedNumbers
      }
    };
  };

  try {
    const result = await queuedCachedRequest(
      aiRequestQueue,
      aiAPICache,
      cacheKey,
      requestTask,
      60 * 60 * 1000
    );

    if (!result) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse AI response',
          userFriendlyMessage: 'AI返回的运势格式有误，请稍后重试'
        }
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Enhanced daily fortune error:', error);

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
        userFriendlyMessage: '暂时无法获取运势，请稍后再试'
      }
    };
  }
}
