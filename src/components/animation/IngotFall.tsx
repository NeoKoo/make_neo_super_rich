import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface FallingIngot {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

interface IngotFallProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function IngotFall({ trigger, onComplete }: IngotFallProps) {
  const [ingots, setIngots] = useState<FallingIngot[]>([]);

  useEffect(() => {
    if (trigger) {
      const newIngots: FallingIngot[] = [{
        id: Date.now(),
        x: 50, // 屏幕中心
        y: 30, // 号码区域
        rotation: 0,
        delay: 0
      }];
      
      setIngots(newIngots);
      
      // 动画完成后清理
      setTimeout(() => {
        setIngots([]);
        onComplete?.();
      }, 1500);
    }
  }, [trigger, onComplete]);

  if (!trigger || ingots.length === 0) return null;

  const content = (
    <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden">
      {ingots.map(ingot => (
        <div
          key={ingot.id}
          className="absolute animate-ingot-fall"
          style={{
            left: `${ingot.x}%`,
            top: `${ingot.y}%`,
            animationDelay: `${ingot.delay}s`
          }}
        >
          <div className="text-5xl sm:text-6xl filter drop-shadow-lg">
            🪙
          </div>
        </div>
      ))}
    </div>
  );

  return createPortal(content, document.body);
}
