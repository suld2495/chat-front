import {
  AlertCircle,
  Download,
  FileText,
  Loader2,
  RotateCcw,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import type { Message } from '@/services/chat/types'

import { downloadFile } from '@/api/file'
import botProfile from '@/assets/bot-profile.png'
import userProfile from '@/assets/user-profile.png'
import { apiUrl, hospitalId } from '@/lib/const'
import { getFileExtension } from '@/lib/file-utils'
import { cn } from '@/lib/utils'

import { IconButton } from '../ui/icon-button'
import { Typography } from '../ui/typography'

interface TextMessageProps {
  isUser: boolean
  message: Pick<Message, 'content' | 'messageType'>
  animate?: boolean
  onAnimationTick?: () => void
  onAnimationEnd?: () => void
}

function TextMessage({
  isUser,
  message,
  animate = false,
  onAnimationTick,
  onAnimationEnd,
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
  message: Pick<Message, 'fileInfo'>
}

function FileMessage({ isUser, message }: FileMessageProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (isDownloading || !message.fileInfo?.fileName)
      return

    const { fileId, fileName } = message.fileInfo
    setIsDownloading(true)
    setError(null)

    const url = `${apiUrl}/api/widget/files/download/${hospitalId}/${fileId}.${getFileExtension(fileName)}`
    const result = await downloadFile(url, fileName)

    setIsDownloading(false)

    if (!result.success) {
      setError(result.error ?? '다운로드에 실패했습니다.')
      // 3초 후 에러 메시지 숨김
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-2xl chat-bubble-shadow max-w-full',
          'transition-colors duration-200 overflow-hidden',
          isUser
            ? 'bg-chat-bubble-user text-chat-bubble-user-fg rounded-br-md'
            : 'bg-chat-bubble-other text-chat-bubble-other-fg rounded-bl-md',
        )}
      >
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
            isUser ? 'bg-chat-bubble-user-fg/20' : 'bg-muted-foreground/50',
          )}
        >
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <Typography
            size="sm"
            className={cn(
              'block font-medium truncate',
              !isUser && 'typography-text-primary',
            )}
          >
            {message.fileInfo?.fileName || 'File'}
          </Typography>
        </div>
        <IconButton
          size="sm"
          variant="ghost"
          onClick={handleDownload}
          disabled={isDownloading}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label="파일 다운로드"
        >
          {isDownloading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Download className="w-4 h-4" />}
        </IconButton>
      </div>
      {error && (
        <Typography
          size="xs"
          className="typography-text-error px-1"
        >
          {error}
        </Typography>
      )}
    </div>
  )
}

interface ChatMessageProps {
  message: Message
  animate?: boolean
  onAnimationTick?: () => void
  onAnimationEnd?: () => void
  onRetry?: () => void
}

export function ChatMessage({
  message,
  animate = false,
  onAnimationTick,
  onAnimationEnd,
  onRetry,
}: ChatMessageProps) {
  const isUser = message.senderType === 'USER'
  const isFailed = message.status === 'failed'
  const isPending = message.status === 'pending'

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
        <div className={cn('w-full relative', isFailed && 'opacity-60')}>
          {(message.messageType === 'TEXT' || message.messageType === 'SYSTEM') && (
            <TextMessage
              isUser={isUser}
              message={message}
              animate={animate}
              onAnimationTick={onAnimationTick}
              onAnimationEnd={onAnimationEnd}
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
              {onRetry && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  onClick={onRetry}
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
}
