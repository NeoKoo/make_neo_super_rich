/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, memo } from 'react'

interface GlobalLoadingContextType {
  isLoading: boolean
  text: string
  show: (text?: string) => void
  hide: () => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined)

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext)
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider')
  }
  return context
}

interface GlobalLoadingProviderProps {
  children: ReactNode
}

export const GlobalLoadingProvider = memo(function GlobalLoadingProvider({ children }: GlobalLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('加载中...')

  const show = (loadingText?: string) => {
    setText(loadingText || '加载中...')
    setIsLoading(true)
  }

  const hide = () => {
    setIsLoading(false)
  }

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, text, show, hide }}>
      {children}
      <GlobalLoadingBar isLoading={isLoading} text={text} />
    </GlobalLoadingContext.Provider>
  )
})

interface GlobalLoadingBarProps {
  isLoading: boolean
  text: string
}

function GlobalLoadingBar({ isLoading, text }: GlobalLoadingBarProps) {
  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* 顶部进度条 */}
      <div className="h-1 bg-background-primary overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary via-primary-light to-primary animate-[loadingProgress_1.5s_ease-in-out_infinite]" />
      </div>

      {/* 加载提示 */}
      <div className="bg-background-primary/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-center gap-3 py-3 px-4">
          <svg
            className="animate-spin w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-medium text-text-primary">{text}</span>
        </div>
      </div>
    </div>
  )
}

// 全屏加载遮罩（用于重要操作）
interface FullScreenLoadingProps {
  isLoading: boolean
  text?: string
}

export function FullScreenLoading({ isLoading, text = '加载中...' }: FullScreenLoadingProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background-primary/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-background-secondary rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
        <svg
          className="animate-spin w-12 h-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-lg font-medium text-text-primary">{text}</span>
      </div>
    </div>
  )
}
