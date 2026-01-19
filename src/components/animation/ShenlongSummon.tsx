import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ShenlongSummonProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ShenlongSummon({ trigger, onComplete }: ShenlongSummonProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'entering' | 'full' | 'exiting'>('entering');

  useEffect(() => {
    if (trigger) {
      console.log('[ShenlongSummon] Triggered');
      setVisible(true);
      setPhase('entering');

      setTimeout(() => {
        console.log('[ShenlongSummon] Phase: full');
        setPhase('full');
      }, 1500);

      setTimeout(() => {
        console.log('[ShenlongSummon] Phase: exiting');
        setPhase('exiting');
      }, 3500);

      setTimeout(() => {
        console.log('[ShenlongSummon] Complete');
        setVisible(false);
        onComplete?.();
      }, 5000);
    }
  }, [trigger, onComplete]);

  if (!visible) return null;

  const content = (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-orange-900/20 to-transparent animate-fade-in" />

      <div className="absolute inset-0 animate-shenlong-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute text-6xl sm:text-8xl opacity-30 animate-float-slow"
            style={{
              left: `${i * 20}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            ☁️
          </div>
        ))}
      </div>

      <div
        className={`
          absolute left-1/2 bottom-0 -translate-x-1/2
          transform transition-all duration-1000 ease-out
          ${phase === 'entering' ? 'translate-y-full' : 'translate-y-0'}
          ${phase === 'exiting' ? 'opacity-0 scale-110' : ''}
        `}
      >
        <div className="relative">
          <div className={`
            text-[150px] sm:text-[200px] leading-none
            filter drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]
            animate-shenlong-glow
            ${phase === 'full' ? 'animate-shenlong-rise' : ''}
          `}>
            🐉
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`
                w-[200px] h-[200px] sm:w-[280px] sm:h-[280px]
                rounded-full border-4 border-yellow-400/50
                animate-aura-pulse
                ${phase === 'full' ? 'animate-aura-expand' : ''}
              `}
            />
            <div
              className={`
                absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px]
                rounded-full border-2 border-yellow-300/30
                animate-aura-pulse-delayed
                ${phase === 'full' ? 'animate-aura-expand-delayed' : ''}
              `}
            />
          </div>

          {phase === 'full' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-32">
              <div className="text-center animate-wish-appear">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] mb-2">
                  神龙降临
                </div>
                <div className="text-lg sm:text-xl text-yellow-200/90 drop-shadow-md">
                  愿你心想事成
                </div>
                <div className="text-sm sm:text-base text-yellow-100/80 mt-2">
                  ✨ 七星连珠 ✨
                </div>
              </div>
            </div>
          )}

          {phase === 'full' && (
            <div className="absolute -top-20 left-1/2 -translate-x-1/2">
              <div className="text-4xl sm:text-5xl animate-dragon-breath">
                🌟
              </div>
            </div>
          )}
        </div>

        {phase !== 'exiting' && (
          <>
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-4 h-40 bg-gradient-to-t from-yellow-500/60 via-yellow-300/40 to-transparent animate-light-beam" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-8 w-2 h-32 bg-gradient-to-t from-amber-500/50 via-amber-300/30 to-transparent animate-light-beam-delayed" />
            <div className="absolute -bottom-20 left-1/2 translate-x-4 w-2 h-36 bg-gradient-to-t from-orange-500/50 via-orange-300/30 to-transparent animate-light-beam-alt" />
          </>
        )}
      </div>

      {phase === 'full' && (
        <div className="absolute inset-0 animate-sparkle-burst">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-2xl sm:text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${0.5 + Math.random() * 0.5}s ease-out ${i * 0.1}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {phase === 'entering' && (
        <div className="absolute inset-0 bg-amber-400/10 animate-thunder-flash" />
      )}
    </div>
  );

  return createPortal(content, document.body);
}
