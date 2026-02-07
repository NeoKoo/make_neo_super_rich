import { LotteryConfig, NumberSelection } from '../types/lottery'

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export interface NumberPoolManager {
  availableRedBalls: number[]
  availableBlueBalls: number[]
  totalRedCount: number
  totalBlueCount: number
  excludedRedCount: number
  excludedBlueCount: number

  generateRandomSet(config: LotteryConfig): NumberSelection | null
  excludeNumbers(selection: NumberSelection): void
  canGenerate(config: LotteryConfig): boolean
  reset(): void
  getExcludedRedBalls(): Set<number>
  getExcludedBlueBalls(): Set<number>
}

export function createNumberPool(
  config: LotteryConfig,
  initialExcludedRed: Set<number> = new Set(),
  initialExcludedBlue: Set<number> = new Set()
): NumberPoolManager {
  let excludedRedBalls = new Set<number>(initialExcludedRed)
  let excludedBlueBalls = new Set<number>(initialExcludedBlue)

  const totalRedCount = config.redBalls.max - config.redBalls.min + 1
  const totalBlueCount = config.blueBalls.max - config.blueBalls.min + 1

  const getAvailableRedBalls = (): number[] => {
    const available: number[] = []
    for (let i = config.redBalls.min; i <= config.redBalls.max; i++) {
      if (!excludedRedBalls.has(i)) {
        available.push(i)
      }
    }
    return available
  }

  const getAvailableBlueBalls = (): number[] => {
    const available: number[] = []
    for (let i = config.blueBalls.min; i <= config.blueBalls.max; i++) {
      if (!excludedBlueBalls.has(i)) {
        available.push(i)
      }
    }
    return available
  }

  return {
    get availableRedBalls() {
      return getAvailableRedBalls()
    },

    get availableBlueBalls() {
      return getAvailableBlueBalls()
    },

    totalRedCount,
    totalBlueCount,

    get excludedRedCount() {
      return excludedRedBalls.size
    },

    get excludedBlueCount() {
      return excludedBlueBalls.size
    },

    generateRandomSet(config: LotteryConfig): NumberSelection | null {
      if (!this.canGenerate(config)) {
        return null
      }

      const availableRed = getAvailableRedBalls()
      const availableBlue = getAvailableBlueBalls()

      const shuffledRed = shuffle(availableRed)
      const shuffledBlue = shuffle(availableBlue)

      const redBalls = shuffledRed
        .slice(0, config.redBalls.count)
        .sort((a, b) => a - b)

      const blueBalls = shuffledBlue
        .slice(0, config.blueBalls.count)
        .sort((a, b) => a - b)

      return { redBalls, blueBalls }
    },

    excludeNumbers(selection: NumberSelection): void {
      selection.redBalls.forEach(num => excludedRedBalls.add(num))
      selection.blueBalls.forEach(num => excludedBlueBalls.add(num))
    },

    canGenerate(config: LotteryConfig): boolean {
      const availableRed = getAvailableRedBalls()
      const availableBlue = getAvailableBlueBalls()

      return (
        availableRed.length >= config.redBalls.count &&
        availableBlue.length >= config.blueBalls.count
      )
    },

    reset(): void {
      excludedRedBalls.clear()
      excludedBlueBalls.clear()
    },

    getExcludedRedBalls(): Set<number> {
      return new Set(excludedRedBalls)
    },

    getExcludedBlueBalls(): Set<number> {
      return new Set(excludedBlueBalls)
    }
  }
}
