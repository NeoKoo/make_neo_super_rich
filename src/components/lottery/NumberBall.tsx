interface NumberBallProps {
  number: number;
  selected: boolean;
  color: 'red' | 'blue';
  onClick: () => void;
  disabled?: boolean;
  matched?: boolean;
  size?: 'sm' | 'md' | 'lg';
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
  const sizeClasses: Record<string, string> = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  const colorClasses: Record<string, Record<string, string>> = {
    red: {
      bg: matched 
        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
        : selected 
          ? 'bg-gradient-to-br from-ball-red-selected to-ball-red-end'
          : 'bg-gradient-to-br from-ball-red-start to-ball-red-end',
      shadow: matched 
        ? 'shadow-ball-selected' 
        : selected 
          ? 'shadow-lg shadow-red-500/50'
          : 'shadow-ball-normal'
    },
    blue: {
      bg: matched
        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
        : selected
          ? 'bg-gradient-to-br from-ball-blue-selected to-ball-blue-end'
          : 'bg-gradient-to-br from-ball-blue-start to-ball-blue-end',
      shadow: matched
        ? 'shadow-ball-selected'
        : selected
          ? 'shadow-lg shadow-blue-500/50'
          : 'shadow-ball-normal'
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        rounded-full font-bold text-white
        ${colorClasses[color].bg}
        ${colorClasses[color].shadow}
        transition-all duration-300
        hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${selected ? 'ring-4 ring-white ring-opacity-50' : ''}
      `}
    >
      {number.toString().padStart(2, '0')}
    </button>
  );
}
