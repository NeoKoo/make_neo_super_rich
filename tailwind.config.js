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
          DEFAULT: '#8E44AD',
          light: '#9B59B6',
          dark: '#6C3483',
        },
        wood: {
          primary: '#7D6608',
          light: '#9A7D0A',
          dark: '#5D4E37',
        },
        background: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          tertiary: '#0f0f1a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b8c5d6',
          muted: '#7f8c8d',
        },
        ball: {
          'red-start': '#ff4444',
          'red-end': '#cc0000',
          'red-selected': '#e74c3c',
          'red-match': '#ffd700',
          'blue-start': '#4444ff',
          'blue-end': '#0000cc',
          'blue-selected': '#3498db',
          'blue-match': '#ffd700',
        },
        status: {
          success: '#27ae60',
          warning: '#f39c12',
          error: '#e74c3c',
          info: '#3498db',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(142, 68, 173, 0.5)',
        'ball-selected': '0 0 10px 2px rgba(255, 215, 0, 0.8)',
        'ball-normal': '0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'bounce-subtle': 'bounce 1s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
