import {
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import {
  memo,
  useEffect,
  useState,
} from 'react'

import type { Message } from '@/services/chat/types'

import botProfile from '@/assets/bot-profile.png'
import userProfile from '@/assets/user-profile.png'
import { cn } from '@/lib/utils'

import { IconButton } from '../ui/icon-button'
import { Typography } from '../ui/typography'
import {
  FileMessage,
  LoadingMessage,
  TextMessage,
} from './message'

interface ChatMessageProps {
  message: Message
  animate?: boolean
  onAnimationTick?: () => void
  onAnimationEnd?: () => void
  onRetryMessage?: (tempMessageId: string) => void
  searchQuery?: string
  isCurrentMatch?: boolean
  isMatched?: boolean
}

export const ChatMessage = memo(({
  message,
  animate = false,
  onAnimationTick,
  onAnimationEnd,
  onRetryMessage,
  searchQuery = '',
  isCurrentMatch = false,
  isMatched = false,
}: ChatMessageProps) => {
  const isUser = message.senderType === 'USER'
  const isFailed = message.status === 'failed'
  const isPending = message.status === 'pending'
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    if (isCurrentMatch) {
      setIsShaking(true)
      const timer = setTimeout(() => setIsShaking(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isCurrentMatch])

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      id={`message-${message.messageId}`}
      className={cn(
        'flex gap-3 px-4',
        isUser ? 'flex-row-reverse' : 'flex-row',
        isShaking && 'animate-shake',
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
        <div className={cn('w-full relative', isFailed && 'opacity-60')}>
          {(message.messageType === 'TEXT' || message.messageType === 'SYSTEM') && (
            <TextMessage
              isUser={isUser}
              message={message}
              animate={animate}
              onAnimationTick={onAnimationTick}
              onAnimationEnd={onAnimationEnd}
              searchQuery={searchQuery}
              isMatched={isMatched}
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
        </div>

        {/* 메시지 상태 표시 영역 */}
        <div className="flex items-center gap-1.5 mt-1.5 mx-1">
          {/* 전송 실패 표시 및 재전송 버튼 */}
          {isFailed && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 typography-text-error" />
              <Typography
                size="xs"
                className="typography-text-error"
              >
                전송 실패
              </Typography>
              {message.tempMessageId && onRetryMessage && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onRetryMessage(message.tempMessageId!)}
                  className="w-5 h-5 ml-0.5"
                  aria-label="메시지 재전송"
                >
                  <RotateCcw className="w-3 h-3" />
                </IconButton>
              )}
            </div>
          )}

          {/* 전송 중 표시 */}
          {isPending && !isFailed && (
            <Typography
              size="xs"
              className="typography-text-tertiary"
            >
              전송 중...
            </Typography>
          )}

          {/* 시간 표시 (실패/전송중이 아닐 때만) */}
          {!isFailed && !isPending && (
            <Typography
              size="xs"
              className="typography-text-tertiary"
            >
              {formatTime(message.createdAt)}
            </Typography>
          )}
        </div>
      </div>
    </div>
  )
})
