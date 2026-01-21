import { useState, useEffect } from 'react';
import { Theme } from '../../constants/themes';
import { getCurrentTheme, setTheme, getAvailableThemes, addThemeListener } from '../../utils/themeManager';
import { soundManager } from '../../utils/soundManager';
import { Check, Palette } from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
  return (
    <button
      onClick={() => {
        soundManager.playButtonClick();
        onClick();
      }}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
        ${isActive 
          ? 'border-primary shadow-lg shadow-primary/30 bg-gradient-to-br from-primary/10 to-primary/5' 
          : 'border-white/10 hover:border-white/20 bg-gradient-to-br from-background-secondary/50 to-background-tertiary/30'
        }
      `}
    >
      {isActive && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="space-y-3">
        {/* 主题预览 */}
        <div className="flex gap-2">
          <div 
            className="w-8 h-8 rounded-full border-2 border-white/20"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div 
            className="w-8 h-8 rounded-full border-2 border-white/20"
            style={{ backgroundColor: theme.colors.secondary }}
          />
          <div 
            className="w-8 h-8 rounded-full border-2 border-white/20"
            style={{ backgroundColor: theme.colors.accent }}
          />
        </div>
        
        {/* 主题信息 */}
        <div className="text-left">
          <h4 className="font-semibold text-text-primary">{theme.name}</h4>
          <p className="text-xs text-text-secondary mt-1">{theme.description}</p>
        </div>
        
        {/* 颜色样本 */}
        <div className="grid grid-cols-5 gap-1">
          {Object.values(theme.colors).slice(0, 5).map((color, index) => (
            <div
              key={index}
              className="h-4 rounded-sm border border-white/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

interface ThemeSelectorProps {
  onThemeChange?: (theme: Theme) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getCurrentTheme());
  const [availableThemes] = useState<Theme[]>(getAvailableThemes());

  useEffect(() => {
    const unsubscribe = addThemeListener((theme) => {
      setCurrentTheme(theme);
      onThemeChange?.(theme);
    });

    return unsubscribe;
  }, [onThemeChange]);

  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-text-primary">主题选择</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableThemes.map(theme => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={currentTheme.id === theme.id}
            onClick={() => handleThemeSelect(theme)}
          />
        ))}
      </div>
      
      {/* 当前主题信息 */}
      <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-xl p-4 backdrop-blur-sm border border-white/10">
        <h4 className="font-semibold text-text-primary mb-3">当前主题详情</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">主题名称：</span>
            <span className="text-text-primary font-medium ml-2">{currentTheme.name}</span>
          </div>
          <div>
            <span className="text-text-secondary">主色调：</span>
            <span 
              className="inline-block w-4 h-4 rounded ml-2 align-middle border border-white/20"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}