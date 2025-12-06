import { Download, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { Message } from '@/services/chat/types'

import botProfile from '@/assets/bot-profile.png'
import userProfile from '@/assets/user-profile.png'
import { cn } from '@/lib/utils'

import { Typography } from '../ui/typography'

interface TextMessageProps {
  isUser: boolean
  message: Pick<Message, 'content' | 'messageType'>
  animate?: boolean
  onAnimationTick?: () => void
}

function TextMessage({
  isUser,
  message,
  animate = false,
  onAnimationTick,
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
      }
    }, 30)

    return () => clearInterval(intervalId)
  }, [animate, message.content, onAnimationTick])

  return (
    <div
      className={cn(
        'px-4 py-2.5 rounded-2xl chat-bubble-shadow',
        isUser
          ? 'bg-chat-bubble-user text-chat-bubble-user-fg rounded-br-md'
          : 'bg-chat-bubble-other text-chat-bubble-other-fg rounded-bl-md',
      )}
    >
      <Typography className={cn('text-sm leading-relaxed whitespace-pre-wrap wrap-break-word', !isUser && 'typography-text-primary')}>
        {displayedText}
        {isAnimating && <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />}
      </Typography>
    </div>
  )
}

function LoadingMessage() {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-2xl chat-bubble-shadow',
        'bg-chat-bubble-other text-chat-bubble-other-fg rounded-bl-md',
      )}
    >
      <div className="flex items-center gap-1">
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '600ms' }}
        />
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '600ms' }}
        />
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '600ms' }}
        />
      </div>
    </div>
  )
}

interface FileMessageProps {
  isUser: boolean
  message: Pick<Message, 'fileName'>
}

function FileMessage({ isUser, message }: FileMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl chat-bubble-shadow cursor-pointer',
        'transition-colors duration-200',
        isUser
          ? 'bg-chat-bubble-user text-chat-bubble-user-fg rounded-br-md hover:bg-primary-hover'
          : 'bg-chat-bubble-other text-chat-bubble-other-fg rounded-bl-md hover:bg-muted',
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          isUser ? 'bg-chat-bubble-user-fg/20' : 'bg-muted-foreground/10',
        )}
      >
        <FileText className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <Typography className="text-sm font-medium truncate">
          {message.fileName || 'File'}
        </Typography>
        <Typography
          className={cn(
            'text-xs',
            isUser ? 'text-chat-bubble-user-fg/70' : 'text-muted-foreground',
          )}
        >
          Click to download
        </Typography>
      </div>
      <Download className="w-4 h-4 shrink-0 opacity-60" />
    </div>
  )
}

interface ChatMessageProps {
  message: Message
  animate?: boolean
  onAnimationTick?: () => void
}

export function ChatMessage({
  message,
  animate = false,
  onAnimationTick,
}: ChatMessageProps) {
  // TODO
  const isUser = (message?.sender?.id || message?.senderId) === 'a151e11d-afaa-41cd-96c6-e86407a7de3d'

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      className={cn(
        'flex gap-3 px-4',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div className="shrink-0 mt-1">
        <div
          className={cn(
            'w-8 h-8 rounded-full overflow-hidden flex items-center justify-center',
          )}
        >
          <img src={isUser ? userProfile : botProfile} />
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col max-w-[75%]',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        {message.messageType === 'TEXT' && (
          <TextMessage
            isUser={isUser}
            message={message}
            animate={animate}
            onAnimationTick={onAnimationTick}
          />
        )}

        {message.messageType === 'FILE' && (
          <FileMessage
            isUser={isUser}
            message={message}
          />
        )}

        {message.messageType === 'LOADING' && (
          <LoadingMessage />
        )}

        <span className="text-xs text-chat-timestamp mt-1.5 mx-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
