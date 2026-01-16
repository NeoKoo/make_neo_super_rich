import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const baseClasses = 'bg-background-secondary rounded-xl border border-white/10';
  const hoverClass = hover ? 'hover:border-primary/50 hover:shadow-glow transition-all duration-300' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
