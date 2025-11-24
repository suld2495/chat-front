import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TypingIndicator } from './TypingIndicator'

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 말풍선 스타일 variant
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'minimal'

  /**
   * 말풍선 크기
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 타이핑 인디케이터 표시 여부
   * true일 경우 children 대신 TypingIndicator를 표시
   * @default false
   */
  isTyping?: boolean

  /**
   * 타이프라이터 효과 (글자 하나씩 출력)
   * @default false
   */
  typewriterEffect?: boolean

  /**
   * 타이프라이터 효과 속도 (ms)
   * @default 50
   */
  typingSpeed?: number

  /**
   * 아바타 요소 (선택사항)
   */
  avatar?: React.ReactNode

  /**
   * 타임스탬프 텍스트 (선택사항)
   */
  timestamp?: string

  /**
   * 말풍선 내용
   */
  children?: React.ReactNode
}

export function ChatBubble({
  variant = 'default',
  size = 'md',
  isTyping = false,
  typewriterEffect = false,
  typingSpeed = 50,
  avatar,
  timestamp,
  className,
  children,
  ...props
}: ChatBubbleProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // children이 변경되면 인덱스 초기화
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect, react-hooks-extra/no-direct-set-state-in-use-effect */
    setCurrentIndex(0)
    setDisplayedText('')
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks-extra/no-direct-set-state-in-use-effect */
  }, [children])

  // 타이프라이터 효과 구현
  useEffect(() => {
    // 타이프라이터 효과가 비활성화되어 있거나 타이핑 중이면 실행하지 않음
    if (!typewriterEffect || isTyping) {
      return
    }

    // children이 문자열인 경우만 타이프라이터 효과 적용
    if (typeof children !== 'string') {
      return
    }

    // 모든 글자를 다 출력했으면 종료
    if (currentIndex >= children.length) {
      return
    }

    const timer = setTimeout(() => {
      setDisplayedText(children.slice(0, currentIndex + 1))
      setCurrentIndex(prev => prev + 1)
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [typewriterEffect, isTyping, children, currentIndex, typingSpeed])

  // Variant별 스타일
  const variantClasses = {
    default: 'bg-surface-raised text-body',
    outlined: 'bg-transparent border border-border-default text-body',
    minimal: 'bg-surface text-body',
  }

  // Size별 패딩 및 텍스트 크기
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm', // 12px/8px, 14px
    md: 'px-4 py-2.5 text-base', // 16px/10px, 16px
    lg: 'px-5 py-3 text-lg', // 20px/12px, 18px
  }

  // 타이핑 인디케이터 크기 매칭
  const typingIndicatorSize = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  }

  // 표시할 내용 결정
  const content = typewriterEffect && !isTyping && typeof children === 'string'
    ? displayedText
    : children

  return (
    <div
      className={cn('flex items-start gap-2', className)}
      {...props}
    >
      {/* 아바타 (선택사항) */}
      {avatar && (
        <div className="shrink-0">
          {avatar}
        </div>
      )}

      {/* 말풍선 컨텐츠 */}
      <div className="flex flex-col gap-1 min-w-0">
        <div
          className={cn(
            'rounded-2xl w-fit max-w-prose',
            variantClasses[variant],
            sizeClasses[size],
          )}
          role="article"
          aria-live={isTyping ? 'polite' : undefined}
        >
          {isTyping
            ? (
                <TypingIndicator size={typingIndicatorSize[size]} />
              )
            : (
                content
              )}
        </div>

        {/* 타임스탬프 (선택사항) */}
        {timestamp && (
          <span className="text-xs text-muted px-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  )
}
