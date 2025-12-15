import { AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Typography } from '../ui/typography'

interface ConnectionErrorProps {
  error: Error | null
  onRetry?: () => void
  className?: string
}

export function ConnectionError({
  onRetry,
  className,
}: ConnectionErrorProps) {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col items-center justify-center',
        'bg-chat-widget px-6 py-8',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Error Icon */}
      <div
        className={cn(
          'flex items-center justify-center',
          'w-16 h-16 mb-4 rounded-full',
          'bg-bg-error',
        )}
      >
        <AlertTriangle
          className="w-8 h-8 text-icon-error"
          aria-hidden="true"
        />
      </div>

      {/* Error Title */}
      <Typography
        variant="subtitle"
        color="primary"
        className="mb-2 text-center"
      >
        연결 오류
      </Typography>

      {/* Error Details (optional) */}
      <div
        className={cn(
          'w-full max-w-[300px] mb-6 p-3 rounded-lg',
          'bg-bg-error border border-border-error',
        )}
      >
        <Typography
          variant="caption"
          className="typography-text-error text-center block break-keep"
        >
          네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
        </Typography>
      </div>

      {/* Retry Button */}
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
        >
          다시 연결하기
        </Button>
      )}
    </div>
  )
}
