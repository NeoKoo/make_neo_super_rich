import { useState } from 'react';
import { Button } from './Button';

interface CopyButtonProps {
  numbers: {
    redBalls: number[];
    blueBalls: number[];
  };
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function CopyButton({ numbers, variant = 'secondary' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    setLoading(true);
    
    const redStr = numbers.redBalls.map(n => n.toString().padStart(2, '0')).join(' ');
    const blueStr = numbers.blueBalls.map(n => n.toString().padStart(2, '0')).join(' ');
    const text = `红球: ${redStr}\n蓝球: ${blueStr}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      disabled={loading}
    >
      {loading ? (
        <span>复制中...</span>
      ) : copied ? (
        <span>✓ 已复制</span>
      ) : (
        <span>📋 复制</span>
      )}
    </Button>
  );
}
