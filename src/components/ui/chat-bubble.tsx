import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { TypingIndicator } from './typing-indicator'
import { Typography } from './typography'

const chatBubbleVariants = cva('rounded-l w-fit max-w-prose', {
  variants: {
    variant: {
      default: 'bg-surface-raised text-body',
      outlined: 'bg-transparent border border-border-default text-body',
      minimal: 'bg-surface text-body',
    },
    size: {
      sm: 'px-s py-s text-s',
      md: 'px-m py-s text-m',
      lg: 'px-m py-s text-l',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type ChatBubbleVariants = VariantProps<typeof chatBubbleVariants>

interface ChatBubbleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
  ChatBubbleVariants {
  isTyping?: boolean
  typewriterEffect?: boolean
  typingSpeed?: number
  avatar?: React.ReactNode
  timestamp?: string
  children?: React.ReactNode
}

export function ChatBubble({
  variant,
  size,
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

  useEffect(() => {
    if (!typewriterEffect || isTyping)
      return
    if (typeof children !== 'string')
      return
    if (currentIndex >= children.length)
      return

    const timer = setTimeout(() => {
      setDisplayedText(children.slice(0, currentIndex + 1))
      setCurrentIndex(prev => prev + 1)
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [typewriterEffect, isTyping, children, currentIndex, typingSpeed])

  const content
    = typewriterEffect && !isTyping && typeof children === 'string'
      ? displayedText
      : children

  const typingSize = size ?? 'md'

  return (
    <div
      className={cn('flex items-start gap-s', className)}
      {...props}
    >
      {avatar && <div className="shrink-0">{avatar}</div>}

      <div className="flex flex-col gap-1 min-w-0">
        <div
          className={chatBubbleVariants({ variant, size })}
          role="article"
          aria-live={isTyping ? 'polite' : undefined}
        >
          {isTyping
            ? (
                <TypingIndicator size={typingSize} />
              )
            : (
                <Typography className="typography-text-primary">{content}</Typography>
              )}
        </div>

        {timestamp && (
          <span className="text-xs text-muted px-1">{timestamp}</span>
        )}
      </div>
    </div>
  )
}
