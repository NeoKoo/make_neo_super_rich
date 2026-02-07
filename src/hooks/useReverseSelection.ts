import { useState, useCallback, useMemo } from 'react'
import { LotteryConfig, NumberSelection } from '../types/lottery'
import { createNumberPool, NumberPoolManager } from '../utils/numberPoolManager'

export interface ReverseSelectionState {
  isActive: boolean
  currentSelection: NumberSelection | null
  excludedRedBalls: Set<number>
  excludedBlueBalls: Set<number>
  history: NumberSelection[]
  showNumberPool: boolean
  isAnimating: boolean
}

export interface UseReverseSelectionReturn {
  state: ReverseSelectionState
  poolManager: NumberPoolManager
  generateNewSelection: () => boolean
  excludeCurrentSelection: () => void
  keepCurrentSelection: () => NumberSelection | null
  resetSelection: () => void
  toggleNumberPool: () => void
  setIsAnimating: (isAnimating: boolean) => void
  openReverseSelection: () => void
  closeReverseSelection: () => void
}

export function useReverseSelection(
  config: LotteryConfig
): UseReverseSelectionReturn {
  const [state, setState] = useState<ReverseSelectionState>({
    isActive: false,
    currentSelection: null,
    excludedRedBalls: new Set(),
    excludedBlueBalls: new Set(),
    history: [],
    showNumberPool: false,
    isAnimating: false
  })

  const poolManager = useMemo(
    () => createNumberPool(config, state.excludedRedBalls, state.excludedBlueBalls),
    [config, state.excludedRedBalls, state.excludedBlueBalls]
  )

  const generateNewSelection = useCallback((): boolean => {
    if (!poolManager.canGenerate(config)) {
      return false
    }

    const newSelection = poolManager.generateRandomSet(config)
    if (newSelection) {
      setState(prev => ({
        ...prev,
        currentSelection: newSelection
      }))
      return true
    }
    return false
  }, [poolManager, config])

  const excludeCurrentSelection = useCallback(() => {
    if (!state.currentSelection) return

    const selectionToExclude = state.currentSelection

    setState(prev => {
      const newExcludedRed = new Set(prev.excludedRedBalls)
      const newExcludedBlue = new Set(prev.excludedBlueBalls)

      selectionToExclude.redBalls.forEach(num => newExcludedRed.add(num))
      selectionToExclude.blueBalls.forEach(num => newExcludedBlue.add(num))

      return {
        ...prev,
        excludedRedBalls: newExcludedRed,
        excludedBlueBalls: newExcludedBlue,
        history: [selectionToExclude, ...prev.history],
        currentSelection: null
      }
    })
  }, [state.currentSelection])

  const keepCurrentSelection = useCallback((): NumberSelection | null => {
    const selectionToKeep = state.currentSelection
    if (selectionToKeep) {
      setState(prev => ({
        ...prev,
        isActive: false,
        currentSelection: null
      }))
    }
    return selectionToKeep
  }, [state.currentSelection])

  const resetSelection = useCallback(() => {
    setState({
      isActive: false,
      currentSelection: null,
      excludedRedBalls: new Set(),
      excludedBlueBalls: new Set(),
      history: [],
      showNumberPool: false,
      isAnimating: false
    })
  }, [])

  const toggleNumberPool = useCallback(() => {
    setState(prev => ({
      ...prev,
      showNumberPool: !prev.showNumberPool
    }))
  }, [])

  const setIsAnimating = useCallback((isAnimating: boolean) => {
    setState(prev => ({
      ...prev,
      isAnimating
    }))
  }, [])

  const openReverseSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true
    }))
  }, [])

  const closeReverseSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false
    }))
  }, [])

  return {
    state,
    poolManager,
    generateNewSelection,
    excludeCurrentSelection,
    keepCurrentSelection,
    resetSelection,
    toggleNumberPool,
    setIsAnimating,
    openReverseSelection,
    closeReverseSelection
  }
}
