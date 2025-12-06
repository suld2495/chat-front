import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { IconButton } from '@/components/ui/icon-button'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

import type { ToastProps } from './types'

const toastVariants = cva(
  [
    'relative min-w-[300px] max-w-[500px] rounded-lg border shadow-lg',
    'transition-opacity duration-200',
  ],
  {
    variants: {
      variant: {
        success: 'bg-bg-success border-border-success typography-text-success',
        error: 'bg-bg-error border-border-error typography-text-error',
        warning: 'bg-bg-warning border-border-warning typography-text-warning',
        info: 'bg-bg-info border-border-info typography-text-info',
        default: 'bg-surface-raised border-border-default typography-text-primary',
      },
      visible: {
        true: 'opacity-100',
        false: 'opacity-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      visible: false,
    },
  },
)

export type ToastVariants = VariantProps<typeof toastVariants>

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

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 200)
  }, [onClose])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (duration <= 0)
      return

    const dismissTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(dismissTimer)
  }, [duration, handleClose])

  return (
    <div className={cn(toastVariants({ variant, visible: isVisible }), className)}>
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

      {showProgress && (
        <div className="h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current"
            style={{ animation: duration > 0 ? `shrink ${duration}ms linear forwards` : 'none' }}
          />
        </div>
      )}

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
