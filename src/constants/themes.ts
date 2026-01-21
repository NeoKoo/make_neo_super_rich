export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
  gradients: {
    primary: string;
    background: string;
    card: string;
  };
  animations?: {
    enabled: boolean;
    type: 'fade' | 'slide' | 'bounce';
  };
}

export const THEMES: Record<string, Theme> = {
  goldenWealth: {
    id: 'goldenWealth',
    name: '金色财富',
    description: '传统金色主题，寓意财富满满',
    colors: {
      primary: '#FFD700',
      secondary: '#FFA500',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      accent: '#FF6347'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FFD700, #FFA500)',
      background: 'linear-gradient(180deg, #1a1a1a, #2d2d2d)',
      card: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))'
    }
  },
  oceanBlue: {
    id: 'oceanBlue',
    name: '深海蓝',
    description: '深邃蓝色主题，象征智慧与冷静',
    colors: {
      primary: '#1E90FF',
      secondary: '#4169E1',
      background: '#0a0a2e',
      surface: '#1e1e3f',
      text: '#ffffff',
      accent: '#00CED1'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1E90FF, #4169E1)',
      background: 'linear-gradient(180deg, #0a0a2e, #1e1e3f)',
      card: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(65, 105, 225, 0.1))'
    }
  },
  forestGreen: {
    id: 'forestGreen',
    name: '森林绿',
    description: '自然绿色主题，代表生机与希望',
    colors: {
      primary: '#228B22',
      secondary: '#32CD32',
      background: '#0d1f0d',
      surface: '#1a2e1a',
      text: '#ffffff',
      accent: '#90EE90'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #228B22, #32CD32)',
      background: 'linear-gradient(180deg, #0d1f0d, #1a2e1a)',
      card: 'linear-gradient(135deg, rgba(34, 139, 34, 0.1), rgba(50, 205, 50, 0.1))'
    }
  },
  purpleDream: {
    id: 'purpleDream',
    name: '紫色梦幻',
    description: '神秘紫色主题，充满梦幻与浪漫',
    colors: {
      primary: '#9370DB',
      secondary: '#8A2BE2',
      background: '#1a0d2e',
      surface: '#2d1a4e',
      text: '#ffffff',
      accent: '#DA70D6'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #9370DB, #8A2BE2)',
      background: 'linear-gradient(180deg, #1a0d2e, #2d1a4e)',
      card: 'linear-gradient(135deg, rgba(147, 112, 219, 0.1), rgba(138, 43, 226, 0.1))'
    }
  },
  sunsetOrange: {
    id: 'sunsetOrange',
    name: '夕阳橙',
    description: '温暖橙色主题，带来温暖与活力',
    colors: {
      primary: '#FF8C00',
      secondary: '#FF6347',
      background: '#2a1a0d',
      surface: '#4a2e1a',
      text: '#ffffff',
      accent: '#FFD700'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FF8C00, #FF6347)',
      background: 'linear-gradient(180deg, #2a1a0d, #4a2e1a)',
      card: 'linear-gradient(135deg, rgba(255, 140, 0, 0.1), rgba(255, 99, 71, 0.1))'
    }
  },
  midnightBlack: {
    id: 'midnightBlack',
    name: '午夜黑',
    description: '极简黑色主题，专注与专业',
    colors: {
      primary: '#434343',
      secondary: '#000000',
      background: '#000000',
      surface: '#1a1a1a',
      text: '#ffffff',
      accent: '#808080'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #434343, #000000)',
      background: 'linear-gradient(180deg, #000000, #1a1a1a)',
      card: 'linear-gradient(135deg, rgba(67, 67, 67, 0.1), rgba(0, 0, 0, 0.1))'
    }
  }
};

export const DEFAULT_THEME = 'goldenWealth';