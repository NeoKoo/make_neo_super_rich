import { useState, useEffect, useCallback } from 'react'
import { LotteryConfig, NumberSelection } from '../../types/lottery'
import { useReverseSelection } from '../../hooks/useReverseSelection'
import { Button } from '../common/Button'
import { NumberBall } from '../lottery/NumberBall'
import { X, RefreshCw, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { soundManager } from '../../utils/soundManager'

interface ReverseSelectionModalProps {
  isOpen: boolean
  config: LotteryConfig
  lotteryType: string
  onClose: () => void
  onKeep: (selection: NumberSelection) => void
}

export function ReverseSelectionModal({
  isOpen,
  config,
  lotteryType,
  onClose,
  onKeep
}: ReverseSelectionModalProps) {
  const {
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
  } = useReverseSelection(config)

  const [isSpinning, setIsSpinning] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const isLastSet = !poolManager.canGenerate(config) && state.currentSelection !== null

  useEffect(() => {
    if (isOpen && !state.isActive) {
      resetSelection()
      openReverseSelection()
      handleGenerate()
    }
  }, [isOpen])

  const handleGenerate = useCallback(() => {
    setIsSpinning(true)
    setIsAnimating(true)
    soundManager.playStrategySelect()

    setTimeout(() => {
      const success = generateNewSelection()
      setIsSpinning(false)
      setIsAnimating(false)

      if (!success) {
        alert('号码池已不足，请重新开始')
      }
    }, 300)
  }, [generateNewSelection, setIsAnimating])

  const handleExclude = useCallback(() => {
    if (!state.currentSelection) return

    setIsAnimating(true)
    soundManager.playNumberClear()

    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50])
    }

    excludeCurrentSelection()

    setTimeout(() => {
      setIsAnimating(false)
      handleGenerate()
    }, 300)
  }, [state.currentSelection, excludeCurrentSelection, handleGenerate, setIsAnimating])

  const handleKeep = useCallback(() => {
    if (!state.currentSelection) return

    soundManager.playSaveSuccess()

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100])
    }

    const selection = keepCurrentSelection()
    if (selection) {
      onKeep(selection)
    }
  }, [state.currentSelection, keepCurrentSelection, onKeep])

  const handleClose = useCallback(() => {
    if (state.history.length > 0) {
      if (confirm('确定要退出反选模式吗？已剔除的号码将被清空。')) {
        resetSelection()
        closeReverseSelection()
        onClose()
      }
    } else {
      resetSelection()
      closeReverseSelection()
      onClose()
    }
  }, [state.history.length, resetSelection, closeReverseSelection, onClose])

  const handleReset = useCallback(() => {
    resetSelection()
    handleGenerate()
  }, [resetSelection, handleGenerate])

  if (!isOpen) return null

  const redLabel = lotteryType === '双色球' ? '红球' : '前区'
  const blueLabel = lotteryType === '双色球' ? '蓝球' : '后区'
  const redRemaining = poolManager.availableRedBalls.length
  const blueRemaining = poolManager.availableBlueBalls.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-2xl mx-4 bg-background-primary rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {isLastSet ? '这是最后一组号码！' : '反选选号'}
            </h2>
            {isLastSet && (
              <p className="text-sm text-yellow-400 mt-1">剩余号码已不足生成新组，这是您的最后选择</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-4 bg-background-secondary/50">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>剩余{redLabel}: {redRemaining}/{poolManager.totalRedCount}</span>
            <span>剩余{blueLabel}: {blueRemaining}/{poolManager.totalBlueCount}</span>
          </div>
          <div className="mt-2 h-2 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${(redRemaining / poolManager.totalRedCount) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isSpinning ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 border-4 border-primary/50 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                <div className="absolute inset-4 border-4 border-primary/70 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🎱</span>
                </div>
              </div>
            </div>
          ) : state.currentSelection ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-text-secondary mb-3">当前号码组</div>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {state.currentSelection.redBalls.map(num => (
                    <NumberBall
                      key={`current-red-${num}`}
                      number={num}
                      selected={true}
                      color="red"
                      onClick={() => {}}
                      size="md"
                    />
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {state.currentSelection.blueBalls.map(num => (
                    <NumberBall
                      key={`current-blue-${num}`}
                      number={num}
                      selected={true}
                      color="blue"
                      onClick={() => {}}
                      size="md"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={toggleNumberPool}
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {state.showNumberPool ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {state.showNumberPool ? '隐藏号码池' : '显示号码池'}
                </button>
              </div>

              {state.showNumberPool && (
                <div className="space-y-4 p-4 bg-background-secondary/50 rounded-lg">
                  <div>
                    <div className="text-sm text-text-secondary mb-2">{redLabel}区</div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: config.redBalls.max - config.redBalls.min + 1 }, (_, i) => config.redBalls.min + i).map(num => {
                        const isExcluded = state.excludedRedBalls.has(num)
                        return (
                          <div
                            key={`pool-red-${num}`}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              isExcluded
                                ? 'bg-gray-500/30 text-gray-400 line-through'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {num.toString().padStart(2, '0')}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-text-secondary mb-2">{blueLabel}区</div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: config.blueBalls.max - config.blueBalls.min + 1 }, (_, i) => config.blueBalls.min + i).map(num => {
                        const isExcluded = state.excludedBlueBalls.has(num)
                        return (
                          <div
                            key={`pool-blue-${num}`}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              isExcluded
                                ? 'bg-gray-500/30 text-gray-400 line-through'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {num.toString().padStart(2, '0')}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {state.history.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center justify-between w-full p-3 bg-background-secondary/50 rounded-lg hover:bg-background-secondary transition-colors"
                  >
                    <span className="text-sm text-text-secondary">已剔除历史 ({state.history.length}组)</span>
                    {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showHistory && (
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {state.history.slice(0, 50).map((selection, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-background-tertiary/50 rounded-lg">
                          <span className="text-xs text-text-secondary w-6">{index + 1}.</span>
                          <div className="flex flex-wrap gap-1 flex-1">
                            {selection.redBalls.map(num => (
                              <span key={`hist-red-${index}-${num}`} className="text-xs text-red-400">{num.toString().padStart(2, '0')}</span>
                            ))}
                            <span className="text-xs text-text-secondary mx-1">+</span>
                            {selection.blueBalls.map(num => (
                              <span key={`hist-blue-${index}-${num}`} className="text-xs text-blue-400">{num.toString().padStart(2, '0')}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {state.history.length > 50 && (
                        <div className="text-center text-sm text-text-secondary">...还有 {state.history.length - 50} 组</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : !poolManager.canGenerate(config) ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚠️</div>
              <div className="text-lg font-bold mb-2">号码池已不足</div>
              <div className="text-sm text-text-secondary mb-4">
                可选{redLabel}: {redRemaining}/{poolManager.totalRedCount}<br/>
                可选{blueLabel}: {blueRemaining}/{poolManager.totalBlueCount}
              </div>
              <Button onClick={handleReset} variant="primary">
                <RefreshCw className="w-4 h-4 mr-1" />
                重新开始
              </Button>
            </div>
          ) : null}
        </div>

        {state.currentSelection && (
          <div className="p-4 border-t border-white/10 bg-background-secondary/50">
            <div className="flex gap-2">
              {!isLastSet && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={state.isAnimating || !poolManager.canGenerate(config)}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    生成新组
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleExclude}
                    disabled={state.isAnimating || !state.currentSelection}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    剔除这组
                  </Button>
                </>
              )}

              <Button
                variant="primary"
                size={isLastSet ? 'lg' : 'sm'}
                onClick={handleKeep}
                disabled={state.isAnimating || !state.currentSelection}
                className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 ${
                  isLastSet ? 'text-lg font-bold py-3 animate-pulse' : ''
                }`}
              >
                <Check className="w-4 h-4 mr-1" />
                {isLastSet ? '保留这最后一组' : '保留这组'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
