import { useState } from 'react';
import { LotteryType } from '../../types/lottery';
import { getAIRecommendation } from '../../utils/aiService';

interface WealthGodProps {
  lotteryType: LotteryType;
  zodiacSign: string;
  birthDate: string;
  userName: string;
  onSelectNumbers?: (redBalls: number[], blueBalls: number[]) => void;
  onSaveAIRecommendation?: () => void;
}

export function WealthGod({ lotteryType, zodiacSign, birthDate, userName, onSelectNumbers, onSaveAIRecommendation }: WealthGodProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    setReasoning(null);

    try {
      const result = await getAIRecommendation(lotteryType, zodiacSign, birthDate, userName);

      if (result) {
        setRecommendation(result.text);
        setReasoning(result.reasoning || null);

        if (onSelectNumbers) {
          onSelectNumbers(result.redBalls, result.blueBalls);
        }
      } else {
        setError('AI暂时无法生成推荐，请稍后再试');
      }
    } catch (err) {
      setError('生成推荐失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRecommendation(null);
    setReasoning(null);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mb-4 py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        title="AI财神推荐"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl animate-bounce">💰</span>
          <div className="text-left">
            <div className="text-white font-bold text-lg">AI财神推荐</div>
            <div className="text-purple-100 text-xs">
              基于{zodiacSign}星座的幸运号码
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="text-6xl animate-pulse">💰</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">财神AI推荐</h2>
                    <p className="text-purple-100 text-sm mt-1">
                      基于{zodiacSign}星座的幸运号码
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-purple-200 text-3xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      🎯 彩票类型
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {lotteryType === '双色球' ? '双色球' : '大乐透'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      🌟 用户星座
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {zodiacSign}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      👤 用户姓名
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userName}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      📅 用户生日
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {birthDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      📊 今日日期
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString('zh-CN', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {reasoning && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-blue-300 dark:border-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🧠</span>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      AI思考过程
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-lg py-3 px-4 shadow-inner max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {reasoning}
                    </p>
                  </div>
                </div>
              )}

              {recommendation && !loading && (
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-6 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed mb-2">
                      财神推荐
                    </p>
                    <div className="bg-white dark:bg-gray-900 rounded-lg py-4 px-6 shadow-inner">
                      <p className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
                        {recommendation}
                      </p>
                    </div>
                    {onSaveAIRecommendation && (
                      <button
                        onClick={onSaveAIRecommendation}
                        className="mt-4 w-full py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-xl">💰</span>
                          <span>保存并召唤神龙</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleRequest}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
                    loading
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-spin text-2xl">🎰</span>
                      <span>AI正在推算中...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-2xl">💰</span>
                      <span>生成幸运号码</span>
                    </span>
                  )}
                </button>

                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  取消
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  💡 财神AI基于你的姓名、星座和生日推荐，仅供娱乐参考
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  使用智谱AI GLM-4.7模型（深度思考模式）
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </>
  );
}
