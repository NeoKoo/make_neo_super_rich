import { LUCKY_RED_ITEMS, LUCKY_BLUE_ITEMS } from '../../constants/luckyItems';

interface NumberBallProps {
  number: number;
  selected: boolean;
  color: 'red' | 'blue';
  onClick: () => void;
  disabled?: boolean;
  matched?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function NumberBall({
  number,
  selected,
  color,
  onClick,
  disabled = false,
  matched = false,
  size = 'md'
}: NumberBallProps) {
  const luckyItem = color === 'red' ? LUCKY_RED_ITEMS[number] : LUCKY_BLUE_ITEMS[number];

  const sizeClasses: Record<string, string> = {
    xs: 'w-10 h-10 text-sm',
    sm: 'w-12 h-12 text-base',
    md: 'w-16 h-16 text-lg',
    lg: 'w-20 h-20 text-xl'
  };

  const ringColor = color === 'red' ? 'ring-red-400' : 'ring-blue-400';
  const glowColor = color === 'red' ? 'shadow-red-500/50' : 'shadow-blue-500/50';
  const baseColor = color === 'red'
    ? 'from-red-500/80 to-red-700/80'
    : 'from-blue-500/80 to-blue-700/80';
  const selectedGradient = color === 'red'
    ? 'from-red-400 to-red-600'
    : 'from-blue-400 to-blue-600';

  const handleClick = () => {
    // 移动设备震动反馈
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        relative rounded-full
        flex flex-col items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed
        ${selected ? `ring-2 ${ringColor} ring-offset-2 ring-offset-transparent scale-105` : 'opacity-85 hover:opacity-100'}
        ${matched ? 'ring-4 ring-yellow-400 shadow-yellow-500/50 scale-110' : ''}
        animate-pop cursor-pointer
        overflow-hidden
      `}
    >
      {/* 背景渐变 */}
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-br ${selected ? selectedGradient : baseColor}
        transition-all duration-300
      `} />

      {/* 内部光泽层 */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* 主光泽 */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
        {/* 次光泽 */}
        <div className="absolute top-1/3 left-1/3 w-1/4 h-1/4 rounded-full bg-white/60 blur-sm" />
      </div>

      {/* 选中状态的外发光 */}
      {selected && (
        <div className={`
          absolute inset-0 rounded-full
          ${glowColor} blur-xl opacity-60 animate-pulse
        `} />
      )}

      {/* 匹配状态的金色光晕 */}
      {matched && (
        <div className="absolute inset-0 rounded-full shadow-yellow-500/50 blur-2xl opacity-80 animate-pulse" />
      )}

      {/* 文字内容 */}
      <span className="relative z-10 filter drop-shadow-md leading-none mb-0.5">
        {luckyItem}
      </span>
      <span className={`
        relative z-10 text-[10px] font-bold
        text-white/90 leading-none
        ${selected ? 'text-white' : ''}
        text-shadow
      `}>
        {number.toString().padStart(2, '0')}
      </span>
    </button>
  );
}
