/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#6D28D9',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
        cta: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
        wood: {
          primary: '#7D6608',
          light: '#9A7D0A',
          dark: '#5D4E37',
        },
        background: {
          primary: '#0F0F1A',
          secondary: '#16213E',
          tertiary: '#1A1A2E',
          glass: 'rgba(26, 26, 46, 0.8)',
          'glass-light': 'rgba(255, 255, 255, 0.1)',
          'glass-heavy': 'rgba(26, 26, 46, 0.95)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8C5D6',
          muted: '#94A3B8',
          'muted-light': '#CBD5E1',
        },
        ball: {
          'red-start': '#EF4444',
          'red-end': '#DC2626',
          'red-selected': '#F87171',
          'red-match': '#FBBF24',
          'blue-start': '#3B82F6',
          'blue-end': '#2563EB',
          'blue-selected': '#60A5FA',
          'blue-match': '#FBBF24',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(124, 58, 237, 0.5)',
        'glow-lg': '0 0 50px rgba(124, 58, 237, 0.6)',
        'glow-cta': '0 0 25px rgba(6, 182, 212, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
        'ball-selected': '0 0 15px 3px rgba(251, 191, 36, 0.8)',
        'ball-normal': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 40px 0 rgba(124, 58, 237, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(124, 58, 237, 0.5)' },
          '50%': { boxShadow: '0 0 50px rgba(124, 58, 237, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aurora': 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 50%, #7C3AED 100%)',
        'aurora-soft': 'linear-gradient(135deg, rgba(124, 58, 237, 0.8) 0%, rgba(6, 182, 212, 0.8) 50%, rgba(124, 58, 237, 0.8) 100%)',
      },
    },
  },
  plugins: [],
}
