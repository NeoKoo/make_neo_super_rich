# 音效系统说明

## 概述

本项目使用 **Web Audio API** 实时生成合成音效，无需外部 MP3 文件。所有音效均由浏览器动态生成，具有以下优势：

- ✅ 无需下载外部音频文件
- ✅ 加载速度快
- ✅ 可自定义音效参数
- ✅ 跨平台兼容性好
- ✅ 文件体积小

## 音效列表

| 音效名称 | 枚举值 | 用途 | 音效类型 |
|---------|--------|------|---------|
| 按钮点击音效 | `BUTTON_CLICK` | 通用按钮点击 | 短促点击声 |
| 选号音效 | `NUMBER_SELECT` | 用户选择号码 | 清脆上升音调 |
| 清除音效 | `NUMBER_CLEAR` | 用户取消选择号码 | 柔和下降音调 |
| 中奖庆祝音效 | `WIN_CELEBRATION` | 用户中奖 | 欢快和弦 (C5-E5-G5-C6) |
| 刮刮乐音效 | `SCRATCH_CARD` | 用户刮开刮刮乐 | 高通滤波噪声 |
| AI推荐音效 | `AI_RECOMMENDATION` | AI生成推荐 | 双音科技感上升音 |
| 保存成功音效 | `SAVE_SUCCESS` | 保存选号成功 | 成功提示音 (C5-E5) |
| 策略选择音效 | `STRATEGY_SELECT` | 选择随机策略 | 方波三连音 |
| 标签切换音效 | `TAB_SWITCH` | 切换底部标签 | 轻柔切换音 |
| 通知音效 | `NOTIFICATION` | 显示通知 | 双音提示 (A5-C#6) |

## 使用方式

### 基础使用

```typescript
import { soundManager } from '@/utils/soundManager'

// 初始化音效系统
await soundManager.initialize()

// 播放特定音效
soundManager.playButtonClick()
soundManager.playNumberSelect()
soundManager.playWinCelebration()
```

### 使用便捷函数

```typescript
import {
  playSound,
  setSoundEnabled,
  setSoundVolume,
  isSoundEnabled,
  getSoundVolume
} from '@/utils/soundManager'

// 播放音效
playSound(SoundEffects.BUTTON_CLICK, { volume: 0.5 })

// 控制音效
setSoundEnabled(true)  // 启用音效
setSoundVolume(0.7)     // 设置音量 (0-1)

// 查询状态
console.log(isSoundEnabled())  // true/false
console.log(getSoundVolume())   // 0.7
```

### 在 React 组件中使用

```typescript
import { useEffect } from 'react'
import { soundManager } from '@/utils/soundManager'

function MyComponent() {
  useEffect(() => {
    // 初始化音效系统
    soundManager.initialize()
  }, [])

  const handleClick = () => {
    soundManager.playButtonClick()
    // 其他逻辑...
  }

  return <button onClick={handleClick}>点击</button>
}
```

## 音效参数

### 播放选项

```typescript
interface SoundOptions {
  volume?: number        // 音量 (0-1)，默认 0.5
  loop?: boolean         // 是否循环（暂不支持）
  playbackRate?: number  // 播放速率（暂不支持）
}
```

### 预设音量

每种音效都有预设的播放音量：

- 按钮点击: 0.3
- 标签切换: 0.3
- 策略选择: 0.4
- 刮刮乐: 0.4
- 清除: 0.5
- 保存成功: 0.5
- 选号: 0.6
- AI推荐: 0.6
- 通知: 0.6
- 中奖庆祝: 0.8

## 技术实现

### Web Audio API

音效系统使用以下 Web Audio API 组件：

- **AudioContext**: 音频上下文
- **OscillatorNode**: 振荡器（生成音调）
- **GainNode**: 增益节点（控制音量）
- **BiquadFilterNode**: 双二阶滤波器（刮刮乐音效）
- **BufferSourceNode**: 缓冲源（噪声生成）

### 音效类型

1. **正弦波 (sine)**: 平滑的音调
2. **方波 (square)**: 电子感较强的音调
3. **三角波 (triangle)**: 介于正弦和方波之间
4. **噪声**: 随机信号（刮刮乐效果）

## 浏览器兼容性

Web Audio API 支持以下浏览器：

- ✅ Chrome 14+
- ✅ Firefox 25+
- ✅ Safari 6+
- ✅ Edge 12+
- ✅ Opera 15+

### 检测支持

```typescript
const isSupported = soundManager.isAvailable()
if (!isSupported) {
  console.warn('Web Audio API not supported')
}
```

## 注意事项

1. **用户交互**: 浏览器要求用户先与页面交互后才能播放音频
2. **自动播放策略**: 首次播放可能需要用户点击或触摸
3. **性能**: 音效生成是实时的，不会占用额外存储空间
4. **音量控制**: 全局音量设置会叠加到单个音效的音量上

## 自定义音效

如需修改音效参数，编辑 [`src/utils/soundManager.ts`](src/utils/soundManager.ts) 中的对应方法：

```typescript
private playNumberSelectSound(ctx: AudioContext, volume: number): void {
  // 修改频率、时长、波形等参数
  oscillator.frequency.setValueAtTime(600, ctx.currentTime)
  // ...
}
```

## 未来扩展

如果需要使用真实的音频文件，可以：

1. 将 MP3 文件放入此目录
2. 修改 `soundManager.ts` 使用 `Audio` 元素加载文件
3. 保持现有的 API 接口不变
