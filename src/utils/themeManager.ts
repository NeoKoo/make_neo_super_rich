import { Theme, THEMES, DEFAULT_THEME } from '../constants/themes';

class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: Theme;
  private listeners: Set<(theme: Theme) => void> = new Set();

  private constructor() {
    this.currentTheme = this.loadTheme();
    this.applyTheme(this.currentTheme);
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * 设置主题
   */
  setTheme(themeId: string): void {
    const theme = THEMES[themeId];
    if (!theme) {
      console.warn(`[ThemeManager] Theme not found: ${themeId}`);
      return;
    }

    this.currentTheme = theme;
    this.saveTheme(theme);
    this.applyTheme(theme);
    this.notifyListeners(theme);
  }

  /**
   * 获取所有可用主题
   */
  getAvailableThemes(): Theme[] {
    return Object.values(THEMES);
  }

  /**
   * 添加主题变化监听器
   */
  addListener(listener: (theme: Theme) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 应用主题到DOM
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // 设置CSS变量
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--background-primary', theme.colors.background);
    root.style.setProperty('--background-secondary', theme.colors.surface);
    root.style.setProperty('--text-primary', theme.colors.text);
    root.style.setProperty('--accent-color', theme.colors.accent);
    
    // 设置渐变
    root.style.setProperty('--primary-gradient', theme.gradients.primary);
    root.style.setProperty('--background-gradient', theme.gradients.background);
    root.style.setProperty('--card-gradient', theme.gradients.card);
    
    // 设置主题ID到body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.id}`);
    
    console.log(`[ThemeManager] Applied theme: ${theme.name}`);
  }

  /**
   * 保存主题到本地存储
   */
  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem('selected_theme', theme.id);
    } catch (error) {
      console.warn('[ThemeManager] Failed to save theme:', error);
    }
  }

  /**
   * 从本地存储加载主题
   */
  private loadTheme(): Theme {
    try {
      const savedThemeId = localStorage.getItem('selected_theme');
      const theme = THEMES[savedThemeId || DEFAULT_THEME];
      return theme || THEMES[DEFAULT_THEME];
    } catch (error) {
      console.warn('[ThemeManager] Failed to load theme:', error);
      return THEMES[DEFAULT_THEME];
    }
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(listener => {
      try {
        listener(theme);
      } catch (error) {
        console.error('[ThemeManager] Error in theme listener:', error);
      }
    });
  }

  /**
   * 重置到默认主题
   */
  resetToDefault(): void {
    this.setTheme(DEFAULT_THEME);
  }

  /**
   * 获取主题预览URL
   */
  getThemePreviewUrl(themeId: string): string {
    return `/themes/${themeId}-preview.png`;
  }
}

// 导出单例实例
export const themeManager = ThemeManager.getInstance();

// 导出便捷函数
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const setTheme = (themeId: string) => themeManager.setTheme(themeId);
export const getAvailableThemes = () => themeManager.getAvailableThemes();
export const addThemeListener = (listener: (theme: Theme) => void) => themeManager.addListener(listener);
export const resetTheme = () => themeManager.resetToDefault();