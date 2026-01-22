interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className = '',
  ...props
}: SkeletonProps) {
  const variantStyles: Record<string, string> = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    rounded: 'rounded-xl'
  }

  const animationStyles: Record<string, string> = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_2s_infinite]',
    none: ''
  }

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || '100%',
    ...props.style
  }

  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
      {...props}
    />
  )
}

// 预定义的骨架屏组件
export function SkeletonCard() {
  return (
    <div className="bg-background-secondary/50 rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="90%" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-background-secondary/30 rounded-xl">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonNumberGrid({ ballCount = 7 }: { ballCount?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" width="30%" height={24} />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: ballCount }).map((_, i) => (
          <Skeleton key={i} variant="circular" width={40} height={40} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-background-secondary/50 rounded-xl p-4 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={32} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonAnalysis() {
  return (
    <div className="space-y-6">
      <SkeletonStats />
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" height={28} />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="100%" height={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonFortune() {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={56} height={56} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="50%" height={24} />
          <Skeleton variant="text" width="70%" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="85%" />
      </div>
    </div>
  )
}
