import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Coin {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  size: number;
}

interface CoinAnimationProps {
  trigger: boolean;
  type?: 'small' | 'large';
  onComplete?: () => void;
}

export function CoinAnimation({ trigger, type = 'small', onComplete }: CoinAnimationProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (trigger) {
      const coinCount = type === 'large' ? 100 : 20;
      const newCoins: Coin[] = [];
      
      for (let i = 0; i < coinCount; i++) {
        newCoins.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          delay: Math.random() * 0.5,
          size: type === 'large' ? Math.random() * 20 + 20 : Math.random() * 15 + 10
        });
      }
      
      setCoins(newCoins);
      
      if (type === 'large') {
        setTimeout(() => setShowText(true), 500);
      }
      
      // 3秒后清除动画
      setTimeout(() => {
        setCoins([]);
        setShowText(false);
        onComplete?.();
      }, 3000);
    }
  }, [trigger, type, onComplete]);

  if (!trigger || coins.length === 0) return null;

  const content = (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {coins.map(coin => (
        <div
          key={coin.id}
          className={`absolute ${
            type === 'large' ? 'animate-coin-fall-large' : 'animate-coin-fall'
          }`}
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
            animationDelay: `${coin.delay}s`,
            transform: `rotate(${coin.rotation}deg)`
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg flex items-center justify-center border-2 border-yellow-600">
            <span className="text-yellow-700 font-bold text-xs">$</span>
          </div>
        </div>
      ))}
      
      {type === 'large' && showText && (
        <div className="absolute inset-0 flex items-center justify-center animate-celebration-text">
          <div className="text-center px-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <div className="text-4xl font-bold text-yellow-400 mb-2 text-glow">
              今晚的一等奖号码
            </div>
            <div className="text-3xl font-bold text-yellow-300 text-glow">
              已被你获取
            </div>
            <div className="text-xl text-white mt-4 animate-pulse">
              请明天去领奖
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
