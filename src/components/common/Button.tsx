import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center
    rounded-xl font-semibold
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
    overflow-hidden
  `;

  const variantStyles: Record<string, string> = {
    primary: `
      bg-gradient-to-r from-primary via-primary to-primary-dark
      hover:from-primary-light hover:to-primary
      text-white
      shadow-lg shadow-primary/25
      hover:shadow-xl hover:shadow-primary/40
      focus:ring-primary/50
      ring-2 ring-primary/20
    `,
    gold: `
      bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500
      hover:from-amber-400 hover:to-yellow-400
      text-gray-900
      shadow-lg shadow-amber-500/25
      hover:shadow-xl hover:shadow-amber-500/40
      focus:ring-amber-500/50
      ring-2 ring-amber-500/20
    `,
    secondary: `
      bg-gradient-to-br from-gray-600 to-gray-700
      hover:from-gray-500 hover:to-gray-600
      text-white
      shadow-lg shadow-gray-500/20
      focus:ring-gray-500/50
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700
      hover:from-red-500 hover:to-red-600
      text-white
      shadow-lg shadow-red-500/25
      focus:ring-red-500/50
    `,
    ghost: `
      bg-white/5 hover:bg-white/10
      text-text-primary
      border border-white/10
      hover:border-white/20
      focus:ring-white/30
    `
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* 光泽效果 */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current relative z-10" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
