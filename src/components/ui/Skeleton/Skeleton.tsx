import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 스켈레톤의 variant 타입
   * @default 'text'
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'button'

  /**
   * 콘텐츠 로딩 완료 여부
   * true일 경우 children을 fade-in으로 표시
   * @default false
   */
  isLoaded?: boolean

  /**
   * Fade-in 애니메이션 지속 시간 (ms)
   * @default 600
   */
  fadeDuration?: number

  /**
   * isLoaded가 true일 때 표시할 실제 콘텐츠
   */
  children?: React.ReactNode
}

export function Skeleton({
  variant = 'text',
  isLoaded = false,
  fadeDuration = 600,
  className,
  children,
  ...props
}: SkeletonProps) {
  // Variant별 기본 크기 및 모양
  const variantClasses = {
    text: 'h-4 w-full rounded-md', // 텍스트 줄 (기본)
    circular: 'h-12 w-12 rounded-full', // 아바타
    rectangular: 'h-32 w-full rounded-md', // 카드 이미지
    button: 'h-10 w-24 rounded-lg', // 버튼
  }

  // 콘텐츠가 로드되면 children을 fade-in으로 표시
  if (isLoaded && children) {
    return (
      <div
        className={cn('animate-fadeInUp', className)}
        style={{
          animationDuration: `${fadeDuration}ms`,
          animationTimingFunction: 'ease-out',
          animationFillMode: 'both',
        }}
        {...props}
      >
        {children}
      </div>
    )
  }

  // 로딩 중일 때 스켈레톤 표시
  return (
    <div
      className={cn(
        'bg-surface-raised animate-pulse',
        variantClasses[variant],
        className,
      )}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="콘텐츠 로딩 중"
      {...props}
    />
  )
}
