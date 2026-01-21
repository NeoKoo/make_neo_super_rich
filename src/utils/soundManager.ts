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
  volume?: number
  loop?: boolean
  playbackRate?: number
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.5
  private initialized: boolean = false

  /**
   * 初始化音效系统
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // 创建 AudioContext
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // 从本地存储恢复设置
      this.loadSettings()

      this.initialized = true
      console.log('[SoundManager] Initialized successfully with Web Audio API')
    } catch (error) {
      console.error('[SoundManager] Initialization failed:', error)
    }
  }

  /**
   * 确保 AudioContext 已创建
   */
  private ensureAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  /**
   * 创建增益节点（音量控制）
   */
  private createGainNode(ctx: AudioContext, volume: number): GainNode {
    const gainNode = ctx.createGain()
    gainNode.gain.value = volume * this.volume
    return gainNode
  }

  /**
   * 播放按钮点击音效 - 短促的点击声
   */
  private playButtonClickSound(ctx: AudioContext, volume: number): void {
    const oscillator = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)

    gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.05)
  }

  /**
   * 播放选号音效 - 清脆的上升音调
   */
  private playNumberSelectSound(ctx: AudioContext, volume: number): void {
    const oscillator = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator.type = 'sine'
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15)

    gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.15)
  }

  /**
   * 播放清除音效 - 柔和的下降音调
   */
  private playNumberClearSound(ctx: AudioContext, volume: number): void {
    const oscillator = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator.type = 'sine'
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12)

    gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.12)
  }

  /**
   * 播放中奖庆祝音效 - 欢快的和弦
   */
  private playWinCelebrationSound(ctx: AudioContext, volume: number): void {
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    const duration = 0.3

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = this.createGainNode(ctx, volume)

      oscillator.type = 'triangle'
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08)

      gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime + index * 0.08)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.08 + duration)

      oscillator.start(ctx.currentTime + index * 0.08)
      oscillator.stop(ctx.currentTime + index * 0.08 + duration)
    })
  }

  /**
   * 播放刮刮乐音效 - 摩擦音效
   */
  private playScratchCardSound(ctx: AudioContext, volume: number): void {
    const bufferSize = ctx.sampleRate * 0.15
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.createGainNode(ctx, volume)
    const filter = ctx.createBiquadFilter()

    filter.type = 'highpass'
    filter.frequency.value = 1000

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

    noise.start(ctx.currentTime)
  }

  /**
   * 播放AI推荐音效 - 科技感的上升音
   */
  private playAIRecommendationSound(ctx: AudioContext, volume: number): void {
    const oscillator1 = ctx.createOscillator()
    const oscillator2 = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator1.type = 'sine'
    oscillator2.type = 'sine'

    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator1.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2)

    oscillator2.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2)

    gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator1.start(ctx.currentTime)
    oscillator2.start(ctx.currentTime)
    oscillator1.stop(ctx.currentTime + 0.2)
    oscillator2.stop(ctx.currentTime + 0.2)
  }

  /**
   * 播放保存成功音效 - 成功的提示音
   */
  private playSaveSuccessSound(ctx: AudioContext, volume: number): void {
    const oscillator = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator.type = 'sine'
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5

    gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }

  /**
   * 播放策略选择音效 - 策略选择的音效
   */
  private playStrategySelectSound(ctx: AudioContext, volume: number): void {
    const oscillator = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator.type = 'square'
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(440, ctx.currentTime)
    oscillator.frequency.setValueAtTime(550, ctx.currentTime + 0.05)
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.1)

    gainNode.gain.setValueAtTime(volume * this.volume * 0.5, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.15)
  }

  /**
   * 播放标签切换音效 - 轻柔的切换音
   */
  private playTabSwitchSound(ctx: AudioContext, volume: number): void {
    const oscillator = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator.type = 'sine'
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(700, ctx.currentTime)
    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.03)

    gainNode.gain.setValueAtTime(volume * this.volume * 0.6, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.06)
  }

  /**
   * 播放通知音效 - 通知提示音
   */
  private playNotificationSound(ctx: AudioContext, volume: number): void {
    const oscillator1 = ctx.createOscillator()
    const oscillator2 = ctx.createOscillator()
    const gainNode = this.createGainNode(ctx, volume)

    oscillator1.type = 'sine'
    oscillator2.type = 'sine'

    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator1.frequency.setValueAtTime(880, ctx.currentTime) // A5
    oscillator2.frequency.setValueAtTime(1108.73, ctx.currentTime) // C#6

    gainNode.gain.setValueAtTime(volume * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)

    oscillator1.start(ctx.currentTime)
    oscillator2.start(ctx.currentTime)
    oscillator1.stop(ctx.currentTime + 0.25)
    oscillator2.stop(ctx.currentTime + 0.25)
  }

  /**
   * 播放音效
   */
  async playSound(soundName: SoundEffects, options: SoundOptions = {}): Promise<void> {
    if (!this.enabled || !this.initialized) return

    try {
      const ctx = this.ensureAudioContext()

      // 恢复 AudioContext（如果被挂起）
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }

      const volume = options.volume ?? 0.5

      switch (soundName) {
        case SoundEffects.BUTTON_CLICK:
          this.playButtonClickSound(ctx, volume)
          break
        case SoundEffects.NUMBER_SELECT:
          this.playNumberSelectSound(ctx, volume)
          break
        case SoundEffects.NUMBER_CLEAR:
          this.playNumberClearSound(ctx, volume)
          break
        case SoundEffects.WIN_CELEBRATION:
          this.playWinCelebrationSound(ctx, volume)
          break
        case SoundEffects.SCRATCH_CARD:
          this.playScratchCardSound(ctx, volume)
          break
        case SoundEffects.AI_RECOMMENDATION:
          this.playAIRecommendationSound(ctx, volume)
          break
        case SoundEffects.SAVE_SUCCESS:
          this.playSaveSuccessSound(ctx, volume)
          break
        case SoundEffects.STRATEGY_SELECT:
          this.playStrategySelectSound(ctx, volume)
          break
        case SoundEffects.TAB_SWITCH:
          this.playTabSwitchSound(ctx, volume)
          break
        case SoundEffects.NOTIFICATION:
          this.playNotificationSound(ctx, volume)
          break
        default:
          console.warn(`[SoundManager] Unknown sound: ${soundName}`)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.log('[SoundManager] Autoplay blocked, waiting for user interaction')
      } else {
        console.warn(`[SoundManager] Failed to play sound: ${soundName}`, error)
      }
    }
  }

  /**
   * 停止音效（Web Audio API 不支持停止特定音效，此方法保留用于兼容性）
   */
  stopSound(_soundName: SoundEffects): void {
    // Web Audio API 生成的音效无法单独停止
    // 保留此方法以保持 API 兼容性
  }

  /**
   * 设置音效开关
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    this.saveSettings()
  }

  /**
   * 获取音效状态
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  /**
   * 获取音量
   */
  getVolume(): number {
    return this.volume
  }

  /**
   * 播放按钮点击音效
   */
  playButtonClick(): void {
    this.playSound(SoundEffects.BUTTON_CLICK, { volume: 0.3 })
  }

  /**
   * 播放选号音效
   */
  playNumberSelect(): void {
    this.playSound(SoundEffects.NUMBER_SELECT, { volume: 0.6 })
  }

  /**
   * 播放清除音效
   */
  playNumberClear(): void {
    this.playSound(SoundEffects.NUMBER_CLEAR, { volume: 0.5 })
  }

  /**
   * 播放中奖庆祝音效
   */
  playWinCelebration(): void {
    this.playSound(SoundEffects.WIN_CELEBRATION, { volume: 0.8 })
  }

  /**
   * 播放刮刮乐音效
   */
  playScratchCard(): void {
    this.playSound(SoundEffects.SCRATCH_CARD, { volume: 0.4 })
  }

  /**
   * 播放AI推荐音效
   */
  playAIRecommendation(): void {
    this.playSound(SoundEffects.AI_RECOMMENDATION, { volume: 0.6 })
  }

  /**
   * 播放保存成功音效
   */
  playSaveSuccess(): void {
    this.playSound(SoundEffects.SAVE_SUCCESS, { volume: 0.5 })
  }

  /**
   * 播放策略选择音效
   */
  playStrategySelect(): void {
    this.playSound(SoundEffects.STRATEGY_SELECT, { volume: 0.4 })
  }

  /**
   * 播放标签切换音效
   */
  playTabSwitch(): void {
    this.playSound(SoundEffects.TAB_SWITCH, { volume: 0.3 })
  }

  /**
   * 播放通知音效
   */
  playNotification(): void {
    this.playSound(SoundEffects.NOTIFICATION, { volume: 0.6 })
  }

  /**
   * 保存设置到本地存储
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('sound_settings', JSON.stringify({
        enabled: this.enabled,
        volume: this.volume
      }))
    } catch (error) {
      console.warn('[SoundManager] Failed to save settings:', error)
    }
  }

  /**
   * 从本地存储加载设置
   */
  private loadSettings(): void {
    try {
      const settings = localStorage.getItem('sound_settings')
      if (settings) {
        const parsed = JSON.parse(settings)
        this.enabled = parsed.enabled !== false
        this.volume = parsed.volume !== undefined ? parsed.volume : 0.5
      }
    } catch (error) {
      console.warn('[SoundManager] Failed to load settings:', error)
    }
  }

  /**
   * 检查音效系统是否可用
   */
  isAvailable(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext)
  }
}

// 导出单例实例
export const soundManager = new SoundManager()

// 导出便捷函数
export const playSound = (soundName: SoundEffects, options?: SoundOptions) =>
  soundManager.playSound(soundName, options)

export const setSoundEnabled = (enabled: boolean) =>
  soundManager.setEnabled(enabled)

export const setSoundVolume = (volume: number) =>
  soundManager.setVolume(volume)

export const isSoundEnabled = () =>
  soundManager.isEnabled()

export const getSoundVolume = () =>
  soundManager.getVolume()
