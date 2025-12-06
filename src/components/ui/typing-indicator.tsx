import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const typingIndicatorVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
    },
  },
  defaultVariants: { size: 'md' },
})

const dotVariants = cva('rounded-full bg-muted animate-bounce', {
  variants: {
    size: {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    },
  },
  defaultVariants: { size: 'md' },
})

type TypingIndicatorVariants = VariantProps<typeof typingIndicatorVariants>

interface TypingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
  TypingIndicatorVariants {}

export function TypingIndicator({
  size,
  className,
  ...props
}: TypingIndicatorProps) {
  return (
    <div
      className={cn(typingIndicatorVariants({ size }), className)}
      role="status"
      aria-live="polite"
      aria-label="메시지 입력 중"
      {...props}
    >
      {[0, 1, 2].map(index => (
        <span
          key={index}
          className={dotVariants({ size })}
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
