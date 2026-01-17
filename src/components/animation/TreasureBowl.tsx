interface TreasureBowlProps {
  isFull?: boolean;
  isExploding?: boolean;
  onExplosionEnd?: () => void;
}

export function TreasureBowl({ isFull = false, isExploding = false, onExplosionEnd }: TreasureBowlProps) {
  return (
    <div 
      className={`
        relative mx-auto mb-4 transition-all duration-1000 ease-in-out
        ${isExploding ? 'scale-150 opacity-0' : 'scale-100'}
      `}
      onAnimationEnd={isExploding ? onExplosionEnd : undefined}
    >
      {/* 聚宝盆主体 */}
      <div className={`
        relative w-24 h-24 sm:w-32 sm:h-32
        transition-all duration-500
        ${isExploding ? 'animate-explode' : ''}
      `}>
        {/* 盆口 */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-t-full border-4 border-yellow-600 shadow-lg" />
        
        {/* 盆身 */}
        <div className="absolute inset-x-2 top-6 bottom-0 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-b-xl border-4 border-yellow-600 shadow-lg" />
        
        {/* 金色装饰 */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl animate-pulse">
          💰
        </div>
        
        {/* 已选的元宝 */}
        {isFull && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 w-20 h-16 items-end">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className={`
                  text-lg sm:text-xl animate-ingot
                  ${isExploding ? 'animate-ingot-explode' : ''}
                `}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  left: `${Math.random() * 40}px`,
                  top: `${Math.random() * 40}px`
                }}
              >
                🪙
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 聚宝盆底座 */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-4 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-b-2xl border-2 border-yellow-800" />
      
      {/* 发光效果 */}
      {!isExploding && (
        <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
      )}
    </div>
  );
}
