import { AI_CONFIG } from '../config/ai';
import { LotteryType } from '../types/lottery';
import { EnhancedLotteryRecommendation, AIRecommendationResult } from '../types/ai';
import { getLocalDateFromBeijing } from './dateUtils';
import { aiRequestQueue, aiAPICache, generateCacheKey, queuedCachedRequest } from './apiQueue';

/**
 * 修复AI生成的常见JSON错误
 */
function cleanJSON(jsonString: string): string {
  let cleaned = jsonString;

  // 1. 移除数组或对象末尾的多余逗号
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  // 2. 移除不完整的对象（可能因为AI被截断）
  // 查找最后一个完整的对象
  const lastBraceIndex = cleaned.lastIndexOf('}');
  if (lastBraceIndex > 0) {
    const firstBraceIndex = cleaned.indexOf('{');
    if (firstBraceIndex >= 0) {
      // 提取最外层的完整JSON
      const extracted = cleaned.substring(firstBraceIndex, lastBraceIndex + 1);
      // 检查是否是完整的
      try {
        JSON.parse(extracted);
        cleaned = extracted;
      } catch (e) {
        // 如果不完整，尝试修复
        console.log('[cleanJSON] Attempting to fix incomplete JSON');
      }
    }
  }

  // 3. 移除可能的尾随垃圾字符
  cleaned = cleaned.trim();

  // 4. 移除控制字符
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');

  return cleaned;
}

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

/**
 * 带重试的 fetch 请求
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  retryDelay = 2000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[AI Recommendation] Attempt ${attempt}/${maxRetries}`);
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryDelay * attempt;
        
        console.log(`[AI Recommendation] Rate limited (429), retrying after ${delay}ms`);
        lastError = new Error(`Rate limited (429), retrying after ${delay}ms`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`[AI Recommendation] Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
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

    const response = await fetchWithRetry(
      `${AI_CONFIG.baseUrl}/chat/completions`,
      {
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
      },
      3, // 最多重试 3 次
      2000 // 初始延迟 2 秒
    );

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

    console.log('[AI Response] Raw content:', aiContent);
    console.log('[AI Response] Content length:', aiContent.length);

    const parsedResult = parseAIResponse(aiContent, lotteryType);
    console.log('[AI Response] Parsed result:', parsedResult);
    console.log('[AI Response] Parsed result keys:', parsedResult ? Object.keys(parsedResult) : 'null');

    return parsedResult;
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

    // 处理超时错误（AbortError）
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'AI请求超时',
          userFriendlyMessage: 'AI请求超时，生成5组号码需要较长时间，请稍后再试'
        }
      };
    }

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
        userFriendlyMessage: error instanceof Error && error.message.includes('aborted')
          ? 'AI请求超时，生成5组号码需要较长时间，请稍后再试'
          : 'AI暂时无法生成推荐，请稍后再试'
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
    '429': '请求过于频繁（429），请等待几秒后重试',
    '500': '服务器错误，请稍后再试',
    '503': '服务暂时不可用，请稍后再试',
    'ABORTED': 'AI请求超时，生成5组号码需要较长时间，请稍后再试'
  };

  if (errorCodeMap[error.code]) {
    return errorCodeMap[error.code];
  }

  // 检查是否是超时错误
  if (error.message.includes('aborted') || error.message.includes('timeout')) {
    return 'AI请求超时，生成5组号码需要较长时间，请稍后再试';
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
    console.log('[AI Parse] Full response length:', text.length);
    console.log('[AI Parse] Response preview (first 1000 chars):', text.substring(0, 1000));

    // 预处理：清理文本中的特殊字符
    let cleanText = text;

    // 移除markdown代码块标记
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // 替换所有反引号为空格
    cleanText = cleanText.replace(/`/g, ' ');

    // 移除可能存在的注释（单行和多行）
    cleanText = cleanText.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

    // 修复常见的JSON错误
    cleanText = cleanJSON(cleanText);

    console.log('[AI Parse] Cleaned text preview (first 1000 chars):', cleanText.substring(0, 1000));

    // 尝试解析JSON
    let jsonData: any;
    try {
      jsonData = JSON.parse(cleanText);
      console.log('[AI Parse] Direct parse successful, keys:', Object.keys(jsonData));
    } catch (jsonError) {
      console.error('[AI Parse Error] Direct parse failed:', jsonError);

      // 移除可能的markdown代码块标记
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // 尝试提取JSON对象（从清理后的文本中）
      // 尝试多种提取方法
      let extractedJson: string | null = null;

      // 方法1: 尝试匹配完整的JSON对象（平衡花括号）
      const firstBraceIndex = cleanText.indexOf('{');
      if (firstBraceIndex >= 0) {
        let braceCount = 0;
        let inString = false;
        let escapeNext = false;

        for (let i = firstBraceIndex; i < cleanText.length; i++) {
          const char = cleanText[i];

          if (escapeNext) {
            escapeNext = false;
            continue;
          }

          if (char === '\\') {
            escapeNext = true;
            continue;
          }

          if (char === '"') {
            inString = !inString;
            continue;
          }

          if (!inString) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;

            if (braceCount === 0) {
              // 找到完整的JSON对象
              extractedJson = cleanText.substring(firstBraceIndex, i + 1);
              console.log('[AI Parse] Extracted complete JSON using brace counting');
              break;
            }
          }
        }
      }

      if (!extractedJson) {
        console.error('[AI Parse Error] Could not extract complete JSON');
        console.log('[AI Parse] Cleaned text (first 2000 chars):', cleanText.substring(0, 2000));
        console.log('[AI Parse] Cleaned text length:', cleanText.length);
        return null;
      }

      // 尝试多次修复和解析
      let parseAttempts = 0;
      const maxAttempts = 3;

      while (parseAttempts < maxAttempts) {
        try {
          jsonData = JSON.parse(extractedJson);
          console.log('[AI Parse] Parse successful on attempt', parseAttempts + 1);
          break;
        } catch (parseError: any) {
          parseAttempts++;
          console.error('[AI Parse Error] Parse attempt', parseAttempts, 'failed:', parseError.message);

          if (parseAttempts >= maxAttempts) {
            console.error('[AI Parse Error] All parse attempts failed');
            console.log('[AI Parse] Extracted JSON:', extractedJson.substring(0, 1000));
            return null;
          }

          // 尝试进一步清理
          extractedJson = cleanJSON(extractedJson);
        }
      }

      if (!jsonData) {
        return null;
      }
    }

    console.log('[AI Parse] Parsed JSON data keys:', Object.keys(jsonData));
    console.log('[AI Parse] Has recommendations:', !!jsonData.recommendations);
    console.log('[AI Parse] Has redBalls/blueBalls:', !!jsonData.redBalls, !!jsonData.blueBalls);

    const redBallMax = lotteryType === LotteryType.SHUANGSEQIU ? 33 : 35;
    const blueBallMax = lotteryType === LotteryType.SHUANGSEQIU ? 16 : 12;

    // 新格式：包含 recommendations 数组
    if (jsonData.recommendations && Array.isArray(jsonData.recommendations) && jsonData.recommendations.length > 0) {
      console.log('[AI Parse] New format with recommendations array, count:', jsonData.recommendations.length);

      const recommendations = jsonData.recommendations.map((rec: any, index: number) => {
        if (!rec.redBalls || !rec.blueBalls) {
          console.error('[AI Parse Error] Missing redBalls/blueBalls in recommendation', index);
          return null;
        }

        const redBalls = rec.redBalls
          .map((n: any) => parseInt(n))
          .filter((n: number) => !isNaN(n) && n >= 1 && n <= redBallMax);

        const blueBalls = rec.blueBalls
          .map((n: any) => parseInt(n))
          .filter((n: number) => !isNaN(n) && n >= 1 && n <= blueBallMax);

        if (redBalls.length === 0 || blueBalls.length === 0) {
          console.error('[AI Parse Error] No valid balls in recommendation', index);
          return null;
        }

        // 处理号码理由 - 可能是字符串数组或对象数组
        let numberReasons: any[] = [];
        const rawReasons = rec.numberReasons || [];

        if (rawReasons.length > 0) {
          // 判断是字符串数组还是对象数组
          if (typeof rawReasons[0] === 'string') {
            // 字符串数组：转换为对象数组
            let ballIndex = 0;
            numberReasons = redBalls.map((ball: number) => {
              const reasonText = rawReasons[ballIndex] || `红球 ${ball} 是幸运号码`;
              ballIndex++;
              return {
                number: ball,
                type: 'red' as const,
                reasons: {
                  primary: reasonText,
                  metaphysics: '符合玄学原理',
                  zodiac: '与用户星座相合',
                  wuxing: '五行属性平衡',
                  numerology: '数字命理吉祥',
                  timing: '时机恰到好处'
                },
                confidence: 75 + Math.floor(Math.random() * 20),
                luckyElements: ['幸运数字', '吉利符号']
              };
            });

            blueBalls.forEach((ball: number) => {
              const reasonText = rawReasons[ballIndex] || `蓝球 ${ball} 是幸运号码`;
              ballIndex++;
              numberReasons.push({
                number: ball,
                type: 'blue' as const,
                reasons: {
                  primary: reasonText,
                  metaphysics: '符合玄学原理',
                  zodiac: '与用户星座相合',
                  wuxing: '五行属性平衡',
                  numerology: '数字命理吉祥',
                  timing: '时机恰到好处'
                },
                confidence: 75 + Math.floor(Math.random() * 20),
                luckyElements: ['幸运数字', '吉利符号']
              });
            });
          } else {
            // 对象数组：直接使用
            numberReasons = rawReasons;
          }
        }

        // 如果没有号码理由，生成默认的
        if (numberReasons.length === 0) {
          numberReasons = redBalls.map((ball: number) => ({
            number: ball,
            type: 'red' as const,
            reasons: {
              primary: `红球 ${ball} 是幸运号码`,
              metaphysics: '符合五行相生原理',
              zodiac: '与用户星座相合',
              wuxing: '五行属性平衡',
              numerology: '数字能量强劲',
              timing: '时机恰到好处'
            },
            confidence: 75 + Math.floor(Math.random() * 20),
            luckyElements: ['幸运数字', '吉利符号']
          }));

          blueBalls.forEach((ball: number) => {
            numberReasons.push({
              number: ball,
              type: 'blue' as const,
              reasons: {
                primary: `蓝球 ${ball} 是幸运号码`,
                metaphysics: '符合五行相生原理',
                zodiac: '与用户星座相合',
                wuxing: '五行属性平衡',
                numerology: '数字能量强劲',
                timing: '时机恰到好处'
              },
              confidence: 75 + Math.floor(Math.random() * 20),
              luckyElements: ['幸运数字', '吉利符号']
            });
          });
        }

        // 处理setAnalysis - 可能是字符串或对象
        let setAnalysis: any;
        if (typeof rec.setAnalysis === 'string') {
          setAnalysis = {
            summary: rec.setAnalysis,
            fortuneLevel: ['吉', '中吉', '吉', '吉', '中吉'][index] as '大吉' | '吉' | '中吉' | '平' | '凶',
            keyStrengths: ['能量平衡', '数字吉利', '运势亨通'],
            recommendationRank: index + 1
          };
        } else {
          setAnalysis = rec.setAnalysis || {
            summary: `第${index + 1}组号码推荐`,
            fortuneLevel: '吉' as const,
            keyStrengths: ['能量平衡', '数字吉利'],
            recommendationRank: index + 1
          };
        }

        return {
          redBalls,
          blueBalls,
          numberReasons,
          setAnalysis
        };
      }).filter((rec: any) => rec !== null);

      if (recommendations.length === 0) {
        console.error('[AI Parse Error] No valid recommendations after filtering');
        return null;
      }

      // 使用第一组作为默认推荐（向后兼容）
      const firstSet = recommendations[0];

      const result: EnhancedLotteryRecommendation = {
        // 向后兼容：使用第一组数据
        redBalls: firstSet.redBalls,
        blueBalls: firstSet.blueBalls,
        text: jsonData.overallAnalysis?.summary || 'AI财神推荐',
        numberReasons: firstSet.numberReasons,

        // 新增：多组推荐
        recommendations,

        overallAnalysis: {
          summary: jsonData.overallAnalysis?.summary || '综合分析显示今日运势良好',
          bestSet: jsonData.overallAnalysis?.bestSet || 1,
          keyFactors: jsonData.overallAnalysis?.keyFactors || ['星座运势', '五行平衡', '数字能量'],
          advice: jsonData.overallAnalysis?.advice || '建议在幸运时间内购买',
          bestTiming: jsonData.overallAnalysis?.bestTiming || '今日下午3-5点'
        },
        metaphysicsInsight: jsonData.metaphysicsInsight || {
          zodiacInfluence: '星座能量加持',
          wuxingBalance: '五行相生相助',
          numerologyPattern: '数字组合吉利',
          energyLevel: 75
        }
      };

      console.log('[AI Parse] Successfully parsed', recommendations.length, 'recommendations');
      return result;
    }

    // 旧格式：单组号码（向后兼容）
    console.log('[AI Parse] Using old format (single set)');

    if (!jsonData.redBalls || !jsonData.blueBalls || !Array.isArray(jsonData.redBalls) || !Array.isArray(jsonData.blueBalls)) {
      console.error('[AI Parse Error] Missing or invalid redBalls/blueBalls fields');
      console.error('[AI Parse] redBalls:', jsonData.redBalls, 'blueBalls:', jsonData.blueBalls);
      return null;
    }

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

    // 生成号码理由
    let numberReasons = jsonData.numberReasons || [];

    if (!numberReasons || numberReasons.length === 0) {
      console.log('[AI Parse] No numberReasons from AI, generating default reasons');

      // 为每个红球生成默认理由
      numberReasons = redBalls.map((ball: number) => ({
        number: ball,
        type: 'red' as const,
        reasons: {
          primary: `红球 ${ball} 是今日幸运号码之一`,
          metaphysics: '符合五行相生原理',
          zodiac: '与用户星座相合',
          wuxing: '五行属性平衡',
          numerology: '数字能量强劲',
          timing: '时机恰到好处'
        },
        confidence: 75 + Math.floor(Math.random() * 20),
        luckyElements: ['幸运数字', '吉利符号']
      }));

      // 为每个蓝球生成默认理由
      blueBalls.forEach((ball: number) => {
        numberReasons.push({
          number: ball,
          type: 'blue' as const,
          reasons: {
            primary: `蓝球 ${ball} 是今日幸运号码之一`,
            metaphysics: '符合五行相生原理',
            zodiac: '与用户星座相合',
            wuxing: '五行属性平衡',
            numerology: '数字能量强劲',
            timing: '时机恰到好处'
          },
          confidence: 75 + Math.floor(Math.random() * 20),
          luckyElements: ['幸运数字', '吉利符号']
        });
      });
    } else {
      // 处理 AI 返回的 numberReasons
      numberReasons = numberReasons.map((reason: any, mapIndex: number) => {
        if (typeof reason === 'string') {
          console.log('[AI Parse] Reason is string, trying to parse:', reason);
          try {
            reason = JSON.parse(reason);
          } catch (e) {
            console.error('[AI Parse] Failed to parse reason string:', e);
          }
        }

        let ballNumber = reason.number;
        if (ballNumber === undefined || ballNumber === null) {
          if (mapIndex < redBalls.length) {
            ballNumber = redBalls[mapIndex];
          } else {
            ballNumber = blueBalls[mapIndex - redBalls.length];
          }
          console.log('[AI Parse] No number field, using ball from array:', ballNumber);
        }

        return {
          number: ballNumber || 0,
          type: reason.type || (mapIndex < redBalls.length ? 'red' : 'blue'),
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
        };
      });
    }

    // 生成5组推荐（基于AI返回的一组进行变体）
    console.log('[AI Parse] Generating 5 recommendations from single set');
    const allRedBalls = Array.from({ length: redBallMax }, (_, i) => i + 1);
    const allBlueBalls = Array.from({ length: blueBallMax }, (_, i) => i + 1);
    const usedRedBalls = new Set(redBalls);
    const usedBlueBalls = new Set(blueBalls);
    const availableRedBalls = allRedBalls.filter(n => !usedRedBalls.has(n));
    const availableBlueBalls = allBlueBalls.filter(n => !usedBlueBalls.has(n));

    // Shuffle available balls
    const shuffleArray = <T,>(arr: T[]): T[] => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    const recommendations = [
      {
        redBalls: [...redBalls].sort((a, b) => a - b),
        blueBalls: [...blueBalls].sort((a, b) => a - b),
        numberReasons: [...numberReasons],
        setAnalysis: {
          summary: jsonData.overallAnalysis?.summary || 'AI财神推荐',
          fortuneLevel: (jsonData.overallAnalysis?.fortuneLevel || '吉') as '大吉' | '吉' | '中吉' | '平' | '凶',
          keyStrengths: jsonData.overallAnalysis?.keyFactors || ['能量平衡', '数字吉利'],
          recommendationRank: 1
        }
      }
    ];

    // 生成另外4组变体
    for (let i = 1; i < 5; i++) {
      const shuffledRed = shuffleArray(availableRedBalls);
      const shuffledBlue = shuffleArray(availableBlueBalls);

      const newRedBalls = shuffledRed.slice(0, redBalls.length).sort((a, b) => a - b);
      const newBlueBalls = shuffledBlue.slice(0, blueBalls.length).sort((a, b) => a - b);

      const newNumberReasons = [
        ...newRedBalls.map((ball: number) => ({
          number: ball,
          type: 'red' as const,
          reasons: {
            primary: `红球 ${ball} 是幸运号码`,
            metaphysics: '符合五行相生原理',
            zodiac: '与用户星座相合',
            wuxing: '五行属性平衡',
            numerology: '数字能量强劲',
            timing: '时机恰到好处'
          },
          confidence: 70 + Math.floor(Math.random() * 25),
          luckyElements: ['幸运数字', '吉利符号']
        })),
        ...newBlueBalls.map((ball: number) => ({
          number: ball,
          type: 'blue' as const,
          reasons: {
            primary: `蓝球 ${ball} 是幸运号码`,
            metaphysics: '符合五行相生原理',
            zodiac: '与用户星座相合',
            wuxing: '五行属性平衡',
            numerology: '数字能量强劲',
            timing: '时机恰到好处'
          },
          confidence: 70 + Math.floor(Math.random() * 25),
          luckyElements: ['幸运数字', '吉利符号']
        }))
      ];

      recommendations.push({
        redBalls: newRedBalls,
        blueBalls: newBlueBalls,
        numberReasons: newNumberReasons,
        setAnalysis: {
          summary: `基于AI推荐的变体${i + 1}`,
          fortuneLevel: ['吉', '中吉', '吉', '中吉'][i] as '大吉' | '吉' | '中吉' | '平' | '凶',
          keyStrengths: ['能量平衡', '数字吉利', '运势亨通', '时机巧合'],
          recommendationRank: i + 1
        }
      });
    }

    // 构建增强的推荐结果
    const result: EnhancedLotteryRecommendation = {
      // 向后兼容：使用第一组数据
      redBalls: recommendations[0].redBalls,
      blueBalls: recommendations[0].blueBalls,
      text: jsonData.overallAnalysis?.summary || 'AI财神推荐',
      numberReasons: recommendations[0].numberReasons,

      // 新增：多组推荐
      recommendations,

      overallAnalysis: jsonData.overallAnalysis || {
        summary: '综合分析显示今日运势良好',
        bestSet: 1,
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

    console.log('[AI Parse] Successfully generated', recommendations.length, 'recommendations from single set');
    return result;
  } catch (error) {
    console.error('[AI Parse] Parse AI response error:', error);
    console.error('[AI Parse] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return null;
  }
}
