import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, BellOff } from 'lucide-react';
import { soundManager, isSoundEnabled, getSoundVolume, setSoundEnabled, setSoundVolume } from '../../utils/soundManager';

export function SoundSettings() {
  const [enabled, setEnabled] = useState(isSoundEnabled());
  const [volume, setVolume] = useState(getSoundVolume());

  useEffect(() => {
    // 初始化音效系统
    soundManager.initialize();
  }, []);

  const handleToggleEnabled = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    setSoundEnabled(newEnabled);
    
    // 播放测试音效
    if (newEnabled) {
      setTimeout(() => {
        soundManager.playButtonClick();
      }, 100);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setSoundVolume(newVolume);
    
    // 播放测试音效
    if (enabled) {
      soundManager.playButtonClick();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            {enabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-text-muted" />
            )}
          </div>
          <div>
            <div className="text-text-primary font-medium">音效开关</div>
            <div className="text-text-secondary text-sm">启用应用音效</div>
          </div>
        </div>
        
        <button
          onClick={handleToggleEnabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-primary' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-text-primary font-medium mb-2">音量控制</div>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-text-muted" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                />
                <Volume2 className="w-4 h-4 text-text-muted" />
                <span className="text-text-primary font-medium w-12 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-background-secondary/80 to-background-tertiary/50 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <h4 className="font-medium text-text-primary mb-3">音效测试</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => soundManager.playNumberSelect()}
                className="px-3 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-sm font-medium transition-colors"
              >
                选号音效
              </button>
              <button
                onClick={() => soundManager.playButtonClick()}
                className="px-3 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-sm font-medium transition-colors"
              >
                按钮音效
              </button>
              <button
                onClick={() => soundManager.playWinCelebration()}
                className="px-3 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-sm font-medium transition-colors"
              >
                中奖音效
              </button>
              <button
                onClick={() => soundManager.playAIRecommendation()}
                className="px-3 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-sm font-medium transition-colors"
              >
                AI推荐音效
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}