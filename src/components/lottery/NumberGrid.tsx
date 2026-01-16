import { NumberBall } from './NumberBall';

interface NumberGridProps {
  title: string;
  min: number;
  max: number;
  selected: number[];
  onSelect: (num: number) => void;
  color: 'red' | 'blue';
  matched?: number[];
  size?: 'sm' | 'md' | 'lg';
}

export function NumberGrid({ 
  title, 
  min, 
  max, 
  selected, 
  onSelect, 
  color,
  matched = [],
  size = 'md'
}: NumberGridProps) {
  const numbers = Array.from(
    { length: max - min + 1 },
    (_, i) => min + i
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">
          {title}
        </h3>
        <span className="text-sm text-text-secondary">
          {color === 'red' ? '🔴' : '🔵'} {selected.length}/{max - min + 1}
        </span>
      </div>
      
      <div className="grid grid-cols-8 gap-3">
        {numbers.map(num => (
          <NumberBall
            key={num}
            number={num}
            selected={selected.includes(num)}
            matched={matched.includes(num)}
            color={color}
            onClick={() => onSelect(num)}
            disabled={selected.length >= 6 && !selected.includes(num)}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}
