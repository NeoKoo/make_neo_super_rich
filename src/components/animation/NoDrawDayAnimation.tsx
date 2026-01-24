import { useEffect, useState } from 'react';

export function NoDrawDayAnimation() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse">
          <svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-ping opacity-20"></div>
      </div>
      
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          今天没有开奖
        </h2>
        <p className="text-gray-600 mb-2">
          双色球和大乐透在周五都不开奖
        </p>
        <p className="text-lg font-medium text-orange-500 animate-pulse">
          明天继续冲{dots}
        </p>
      </div>

      <div className="mt-8 flex space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}