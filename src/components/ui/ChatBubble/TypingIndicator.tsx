import { cn } from '@/lib/utils'

interface TypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 도트 크기
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
}

export function TypingIndicator({
  size = 'md',
  className,
  ...props
}: TypingIndicatorProps) {
  // 도트 크기별 클래스
  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5', // 6px
    md: 'w-2 h-2', // 8px
    lg: 'w-2.5 h-2.5', // 10px
  }

  // 도트 간격
  const gapClasses = {
    sm: 'gap-1', // 4px
    md: 'gap-1.5', // 6px
    lg: 'gap-2', // 8px
  }

  return (
    <div
      className={cn(
        'inline-flex items-center',
        gapClasses[size],
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="메시지 입력 중"
      {...props}
    >
      {[0, 1, 2].map(index => (
        <span
          key={index}
          className={cn(
            'rounded-full bg-muted animate-bounce',
            dotSizeClasses[size],
          )}
          style={{
            animationDuration: '1.4s',
            animationDelay: `${index * 0.2}s`,
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  )
}
