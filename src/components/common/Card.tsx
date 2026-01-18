import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'glass' | 'gradient';
}

export function Card({
  children,
  className = '',
  hover = false,
  variant = 'glass'
}: CardProps) {
  const baseClasses = `
    rounded-2xl border border-white/10
    backdrop-blur-xl
    transition-all duration-300 ease-out
  `;

  const variantClasses: Record<string, string> = {
    default: 'bg-background-secondary',
    glass: `
      bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50
      shadow-xl shadow-black/20
    `,
    gradient: `
      bg-gradient-to-br from-primary/10 via-background-secondary/80 to-background-tertiary/50
      border-primary/20
      shadow-lg shadow-primary/10
    `
  };

  const hoverClass = hover
    ? `
      hover:border-primary/30
      hover:shadow-xl hover:shadow-primary/20
      hover:-translate-y-1
      cursor-pointer
    `
    : '';

  return (
    <div className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${hoverClass}
      ${className}
    `}>
      {/* 顶部光泽效果 */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
      </div>
      {children}
    </div>
  );
}
