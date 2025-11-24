import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { IconButton } from '@/components/ui/IconButton/IconButton'
import { Typography } from '@/components/ui/Typography/Typography'
import { cn } from '@/lib/utils'

import type { ToastProps } from './types'

export function Toast({
  message,
  children,
  duration = 3000,
  showClose = false,
  showProgress = false,
  variant = 'default',
  onClose,
  className,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Fade-in 애니메이션
  const handleClose = useCallback(() => {
    setIsVisible(false)
    // 애니메이션 완료 후 onClose 호출
    setTimeout(() => {
      onClose?.()
    }, 200) // transition duration과 일치
  }, [onClose])

  useEffect(() => {
    // 마운트 직후 visible 설정 (애니메이션 트리거)
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  // Auto-dismiss 타이머
  useEffect(() => {
    if (duration <= 0)
      return

    const dismissTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(dismissTimer)
  }, [duration, handleClose])

  // Variant별 스타일
  const variantClasses = {
    success: 'bg-success-bg border-success-border text-success-text',
    error: 'bg-error-bg border-error-border text-error-text',
    warning: 'bg-warning-bg border-warning-border text-warning-text',
    info: 'bg-info-bg border-info-border text-info-text',
    default: 'bg-surface-raised border-border-default text-body',
  }

  return (
    <div
      className={cn(
        // 기본 스타일
        'relative min-w-[300px] max-w-[500px] rounded-lg border shadow-lg',
        'transition-opacity duration-200',
        // Variant 스타일
        variantClasses[variant],
        // 애니메이션
        isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {/* 메인 콘텐츠 */}
      <div className="p-4 pr-10">
        {children || (
          <Typography
            variant="body"
            className="text-sm"
          >
            {message}
          </Typography>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current"
            style={{ animation: duration > 0 ? `shrink ${duration}ms linear forwards` : 'none' }}
          />
        </div>
      )}

      {/* Close 버튼 */}
      {showClose && (
        <IconButton
          size="sm"
          variant="ghost"
          onClick={handleClose}
          className="absolute top-2 right-2"
          aria-label="닫기"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-current"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </IconButton>
      )}
    </div>
  )
}
