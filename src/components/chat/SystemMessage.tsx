import { cn } from '@/lib/utils'

import { Typography } from '../ui/typography'

interface SystemMessageProps {
  message: string
  className?: string
}

export function SystemMessage({ message, className }: SystemMessageProps) {
  return (
    <div
      className={cn(
        'flex justify-center px-4 py-2',
        className,
      )}
    >
      <Typography
        variant="label"
        as="span"
        className={cn(
          'px-3 py-1 rounded-full',
          'bg-chat-system-bg typography-text-chat-system',
        )}
      >
        {message}
      </Typography>
    </div>
  )
}
