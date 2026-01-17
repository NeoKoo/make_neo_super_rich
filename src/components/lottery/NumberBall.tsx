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
    xs: 'w-9 h-9 text-base',
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };

  const ringColor = color === 'red' ? 'ring-red-400' : 'ring-blue-400';
  const glowColor = color === 'red' ? 'shadow-red-500/50' : 'shadow-blue-500/50';

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
        glass-orb rounded-full
        flex flex-col items-center justify-center
        transition-all duration-300 transform
        hover:scale-110 active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed
        ${selected ? `ring-2 ${ringColor} ${glowColor} ring-offset-2 ring-offset-transparent scale-105` : 'opacity-80 hover:opacity-100'}
        ${matched ? 'ring-4 ring-yellow-400 shadow-yellow-500/50 scale-110' : ''}
        animate-pop
      `}
    >
      <span className="filter drop-shadow-md leading-none mb-0.5">{luckyItem}</span>
      <span className={`text-[10px] font-bold text-white/90 leading-none ${selected ? 'text-white' : ''} text-glow`}>
        {number.toString().padStart(2, '0')}
      </span>
    </button>
  );
}
