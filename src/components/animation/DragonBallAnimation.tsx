import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface FallingDragonBall {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: 'red' | 'orange' | 'gold';
}

interface DragonBallAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function DragonBallAnimation({ trigger, onComplete }: DragonBallAnimationProps) {
  const [dragonBalls, setDragonBalls] = useState<FallingDragonBall[]>([]);

  useEffect(() => {
    if (trigger) {
      const newBalls: FallingDragonBall[] = [{
        id: Date.now(),
        x: 50,
        y: 40,
        rotation: 0,
        color: 'orange'
      }];

      setDragonBalls(newBalls);

      setTimeout(() => {
        setDragonBalls([]);
        onComplete?.();
      }, 600);
    }
  }, [trigger, onComplete]);

  if (!trigger || dragonBalls.length === 0) return null;

  const content = (
    <div className="fixed inset-0 z-[95] pointer-events-none overflow-hidden">
      {dragonBalls.map(ball => (
        <div
          key={ball.id}
          className="absolute animate-dragonball-fall"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
          }}
        >
          <div className={`
            relative w-10 h-10 sm:w-12 sm:h-12
            rounded-full shadow-lg
            ${ball.color === 'red' ? 'bg-gradient-to-br from-orange-500 to-red-600' :
              ball.color === 'orange' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
              'bg-gradient-to-br from-yellow-400 to-yellow-600'}
            border-2 border-white/30
            animate-dragonball-rotate
          `}>
            <div className="absolute inset-0 rounded-full opacity-60">
              <div className="absolute top-1 left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-white/60 to-transparent" />
              <div className="absolute top-1/3 left-1/3 w-1/4 h-1/4 rounded-full bg-white/70 blur-sm" />
            </div>

            <div className="absolute inset-2 flex items-center justify-center">
              <div className="text-white font-bold text-lg sm:text-xl drop-shadow-md">☀️</div>
            </div>

            <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-md animate-pulse" />
          </div>

          <div className={`
            absolute -top-4 -right-4 w-6 h-6 rounded-full
            ${ball.color === 'red' ? 'bg-orange-400' :
              ball.color === 'orange' ? 'bg-orange-300' :
              'bg-yellow-300'}
            opacity-40 blur-sm animate-dragonball-trail
          `} />
          <div className={`
            absolute -top-8 -right-8 w-4 h-4 rounded-full
            ${ball.color === 'red' ? 'bg-orange-400' :
              ball.color === 'orange' ? 'bg-orange-300' :
              'bg-yellow-300'}
            opacity-20 blur-sm animate-dragonball-trail-delayed
          `} />
        </div>
      ))}
    </div>
  );

  return createPortal(content, document.body);
}
