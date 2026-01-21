import { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  children: React.ReactNode;
  onReveal?: () => void;
  revealed?: boolean;
  coverText?: string;
}

export function ScratchCard({ children, onReveal, revealed = false, coverText = '刮开查看开奖结果' }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(revealed);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    setIsRevealed(revealed);
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width, 300); // 最小宽度300px
    const height = Math.max(rect.height, 200); // 最小高度200px
    canvas.width = width;
    canvas.height = height;
    
    console.log('Canvas尺寸:', width, 'x', height, '容器尺寸:', rect.width, 'x', rect.height);

    // 绘制覆盖层
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#e0e0e0');
    gradient.addColorStop(1, '#c0c0c0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加噪点纹理
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2 + 1;
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#a0a0a0';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 添加文字
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 文字换行处理
    const words = coverText.split('');
    const lineHeight = 24;
    const charsPerLine = Math.floor(canvas.width / 20);
    const startY = (canvas.height - (Math.ceil(words.length / charsPerLine) * lineHeight)) / 2;
    
    for (let i = 0; i < words.length; i++) {
      const x = ((i % charsPerLine) + 1) * (canvas.width / (charsPerLine + 1));
      const y = startY + Math.floor(i / charsPerLine) * lineHeight;
      ctx.fillText(words[i], x, y);
    }

    // 设置刮刮效果
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

  }, [isRevealed, coverText]);

  const handleStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratch(e);
    }
  };

  const handleEnd = () => {
    if (isScratching) {
      setIsScratching(false);
      checkReveal();
    }
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container || isRevealed) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const revealedRatio = transparentPixels / totalPixels;

    // 如果刮开超过50%，自动显示全部
    if (revealedRatio > 0.5) {
      revealAll();
    }
  };

  const revealAll = () => {
    setIsRevealed(true);
    onReveal?.();
  };

  return (
    <div ref={containerRef} className="relative rounded-lg overflow-hidden">
      {/* 底层内容（开奖号码） */}
      <div className="relative z-0">
        {children}
      </div>
      
      {/* 刮刮层（覆盖层） */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onPointerDown={handleStart}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerLeave={handleEnd}
          className="absolute inset-0 z-10 cursor-pointer touch-none"
          style={{ touchAction: 'none' }}
        />
      )}
      
      {/* 刮开完成提示 */}
      {isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="animate-fade-out">
            <span className="text-2xl">✨</span>
          </div>
        </div>
      )}
    </div>
  );
}
