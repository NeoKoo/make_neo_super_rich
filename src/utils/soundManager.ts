export enum SoundEffects {
  NUMBER_SELECT = 'number_select',
  NUMBER_CLEAR = 'number_clear',
  WIN_CELEBRATION = 'win_celebration',
  SCRATCH_CARD = 'scratch_card',
  BUTTON_CLICK = 'button_click',
  AI_RECOMMENDATION = 'ai_recommendation',
  SAVE_SUCCESS = 'save_success',
  STRATEGY_SELECT = 'strategy_select',
  TAB_SWITCH = 'tab_switch',
  NOTIFICATION = 'notification'
}

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
}

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;
  private initialized: boolean = false;

  /**
   * 初始化音效系统
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // 预加载所有音效
      const soundFiles = Object.values(SoundEffects);
      
      for (const soundName of soundFiles) {
        const audio = new Audio(`/sounds/${soundName}.mp3`);
        audio.preload = 'auto';
        
        // 设置默认属性
        audio.volume = this.volume;
        
        // 添加错误处理
        audio.addEventListener('error', (e) => {
          console.warn(`[SoundManager] Failed to load sound: ${soundName}`, e);
        });
        
        this.sounds.set(soundName, audio);
      }
      
      // 从本地存储恢复设置
      this.loadSettings();
      
      this.initialized = true;
      console.log('[SoundManager] Initialized successfully');
    } catch (error) {
      console.error('[SoundManager] Initialization failed:', error);
    }
  }

  /**
   * 播放音效
   */
  async playSound(soundName: SoundEffects, options: SoundOptions = {}): Promise<void> {
    if (!this.enabled || !this.initialized) return;
    
    try {
      const audio = this.sounds.get(soundName);
      if (!audio) {
        console.warn(`[SoundManager] Sound not found: ${soundName}`);
        return;
      }

      // 应用选项
      if (options.volume !== undefined) {
        const originalVolume = audio.volume;
        audio.volume = options.volume * this.volume;
        
        await audio.play();
        
        // 恢复原始音量
        audio.volume = originalVolume;
      } else {
        audio.volume = this.volume;
        await audio.play();
      }
      
      if (options.loop) {
        audio.loop = true;
      }
      
      if (options.playbackRate) {
        audio.playbackRate = options.playbackRate;
      }
      
    } catch (error) {
      // 忽略用户交互相关的错误（如浏览器阻止自动播放）
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.log('[SoundManager] Autoplay blocked, waiting for user interaction');
      } else {
        console.warn(`[SoundManager] Failed to play sound: ${soundName}`, error);
      }
    }
  }

  /**
   * 停止音效
   */
  stopSound(soundName: SoundEffects): void {
    const audio = this.sounds.get(soundName);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * 设置音效开关
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
    
    // 如果禁用，停止所有正在播放的音效
    if (!enabled) {
      this.sounds.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }

  /**
   * 获取音效状态
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(audio => {
      audio.volume = this.volume;
    });
    this.saveSettings();
  }

  /**
   * 获取音量
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 播放按钮点击音效
   */
  playButtonClick(): void {
    this.playSound(SoundEffects.BUTTON_CLICK, { volume: 0.3 });
  }

  /**
   * 播放选号音效
   */
  playNumberSelect(): void {
    this.playSound(SoundEffects.NUMBER_SELECT, { volume: 0.6 });
  }

  /**
   * 播放清除音效
   */
  playNumberClear(): void {
    this.playSound(SoundEffects.NUMBER_CLEAR, { volume: 0.5 });
  }

  /**
   * 播放中奖庆祝音效
   */
  playWinCelebration(): void {
    this.playSound(SoundEffects.WIN_CELEBRATION, { volume: 0.8 });
  }

  /**
   * 播放刮刮乐音效
   */
  playScratchCard(): void {
    this.playSound(SoundEffects.SCRATCH_CARD, { volume: 0.4 });
  }

  /**
   * 播放AI推荐音效
   */
  playAIRecommendation(): void {
    this.playSound(SoundEffects.AI_RECOMMENDATION, { volume: 0.6 });
  }

  /**
   * 播放保存成功音效
   */
  playSaveSuccess(): void {
    this.playSound(SoundEffects.SAVE_SUCCESS, { volume: 0.5 });
  }

  /**
   * 播放策略选择音效
   */
  playStrategySelect(): void {
    this.playSound(SoundEffects.STRATEGY_SELECT, { volume: 0.4 });
  }

  /**
   * 播放标签切换音效
   */
  playTabSwitch(): void {
    this.playSound(SoundEffects.TAB_SWITCH, { volume: 0.3 });
  }

  /**
   * 播放通知音效
   */
  playNotification(): void {
    this.playSound(SoundEffects.NOTIFICATION, { volume: 0.6 });
  }

  /**
   * 保存设置到本地存储
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('sound_settings', JSON.stringify({
        enabled: this.enabled,
        volume: this.volume
      }));
    } catch (error) {
      console.warn('[SoundManager] Failed to save settings:', error);
    }
  }

  /**
   * 从本地存储加载设置
   */
  private loadSettings(): void {
    try {
      const settings = localStorage.getItem('sound_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.enabled = parsed.enabled !== false; // 默认为 true
        this.volume = parsed.volume !== undefined ? parsed.volume : 0.5;
      }
    } catch (error) {
      console.warn('[SoundManager] Failed to load settings:', error);
    }
  }

  /**
   * 获取音效文件URL（用于调试）
   */
  getSoundUrl(soundName: SoundEffects): string {
    return `/sounds/${soundName}.mp3`;
  }

  /**
   * 检查音效文件是否存在
   */
  async checkSoundFiles(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const soundName of Object.values(SoundEffects)) {
      try {
        const response = await fetch(this.getSoundUrl(soundName), { method: 'HEAD' });
        results[soundName] = response.ok;
      } catch (error) {
        results[soundName] = false;
      }
    }
    
    return results;
  }
}

// 导出单例实例
export const soundManager = new SoundManager();

// 导出便捷函数
export const playSound = (soundName: SoundEffects, options?: SoundOptions) => 
  soundManager.playSound(soundName, options);

export const setSoundEnabled = (enabled: boolean) => 
  soundManager.setEnabled(enabled);

export const setSoundVolume = (volume: number) => 
  soundManager.setVolume(volume);

export const isSoundEnabled = () => 
  soundManager.isEnabled();

export const getSoundVolume = () => 
  soundManager.getVolume();