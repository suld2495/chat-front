import { useEffect, useState } from 'react'

import type { Message } from '@/services/chat/types'

import { cn } from '@/lib/utils'

import { HighlightedText } from '../../ui/highlighted-text'
import { Typography } from '../../ui/typography'

interface TextMessageProps {
  isUser: boolean
  message: Pick<Message, 'content' | 'messageType'>
  animate?: boolean
  onAnimationTick?: () => void
  onAnimationEnd?: () => void
  searchQuery?: string
  isMatched?: boolean
}

export function TextMessage({
  isUser,
  message,
  animate = false,
  onAnimationTick,
  onAnimationEnd,
  searchQuery = '',
  isMatched = false,
}: TextMessageProps) {
  const [displayedText, setDisplayedText] = useState(animate ? '' : message.content)
  const [isAnimating, setIsAnimating] = useState(animate)

  useEffect(() => {
    if (!animate || !message.content) {
      setDisplayedText(message.content)
      setIsAnimating(false)
      return
    }

    setDisplayedText('')
    setIsAnimating(true)

    let currentIndex = 0
    const text = message.content

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
        onAnimationTick?.()
      }
      else {
        clearInterval(intervalId)
        setIsAnimating(false)
        onAnimationEnd?.()
      }
    }, 30)

    return () => clearInterval(intervalId)
  }, [animate, message.content, onAnimationTick, onAnimationEnd])

  const shouldHighlight = isMatched && searchQuery.trim() !== ''

  return (
    <div
      className={cn(
        'px-4 py-2.5 rounded-2xl chat-bubble-shadow',
        isUser
          ? 'bg-chat-bubble-user text-chat-bubble-user-fg rounded-br-md'
          : 'bg-chat-bubble-other text-chat-bubble-other-fg rounded-bl-md',
      )}
    >
      <Typography
        size="sm"
        className={cn('leading-relaxed whitespace-pre-wrap wrap-break-word', !isUser && 'typography-text-primary')}
      >
        {shouldHighlight
          ? (
              <HighlightedText
                text={displayedText}
                highlight={searchQuery}
                isUser={isUser}
              />
            )
          : displayedText}
        {isAnimating && <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />}
      </Typography>
    </div>
  )
}
