import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { STRATEGIES, RandomStrategyConfig, RandomStrategy } from '../../constants/randomStrategies';

interface RandomStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStrategy: (strategy: RandomStrategy) => void;
}

export function RandomStrategyModal({ isOpen, onClose, onSelectStrategy }: RandomStrategyModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎲 选择随机选号策略">
      <div className="space-y-3">
        {(Object.entries(STRATEGIES) as [RandomStrategy, RandomStrategyConfig][]).map(([key, strategy]) => (
          <button
            key={key}
            onClick={() => {
              onSelectStrategy(key);
              onClose();
            }}
            className="w-full p-4 rounded-lg bg-background-tertiary hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center space-x-4"
          >
            <span className="text-4xl">{strategy.icon}</span>
            <div className="text-left flex-1">
              <div className="font-bold text-lg text-text-primary">{strategy.name}</div>
              <div className="text-sm text-text-secondary">{strategy.description}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
