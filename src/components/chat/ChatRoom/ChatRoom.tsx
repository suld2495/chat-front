import { useEffect, useMemo } from 'react'

import type { Message as MessageEntity } from '@/api'

import { ChatInput } from '@/components/chat/ChatInput'
import { Button } from '@/components/ui/Button/Button'
import { IconButton } from '@/components/ui/IconButton/IconButton'
import { Typography } from '@/components/ui/Typography/Typography'
import {
  useChatRoomMessages,
  useMarkAllMessagesRead,
  useSendMessage,
} from '@/hooks/api'
import { cn } from '@/lib/utils'

interface ChatRoomProps {
  roomId: string
  roomName: string
  currentUserId: string
  onBack?: () => void
}

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface MessageBubbleProps {
  message: MessageEntity
  isMine: boolean
}

function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const timestamp = message.createdAt
    ? (() => {
        const date = new Date(message.createdAt)
        return Number.isNaN(date.getTime()) ? message.createdAt : date.toLocaleString()
      })()
    : ''

  return (
    <div
      className={cn(
        'flex mb-4',
        isMine ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'max-w-[70%] px-4 py-2 rounded-2xl',
          isMine
            ? 'bg-action-primary text-inverse rounded-br-sm'
            : 'bg-surface-raised text-body rounded-bl-sm',
        )}
      >
        <Typography
          variant="body"
          className={isMine ? 'text-inverse' : 'text-body'}
        >
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          className={cn(
            'mt-1',
            isMine ? 'text-inverse/70' : 'text-muted',
          )}
        >
          {timestamp}
        </Typography>
      </div>
    </div>
  )
}

export function ChatRoom({
  roomId,
  roomName,
  currentUserId,
  onBack,
}: ChatRoomProps) {
  const hasUser = Boolean(currentUserId)

  const {
    data: messagesPage,
    isLoading,
    isError,
    refetch,
  } = useChatRoomMessages(roomId, {
    userId: currentUserId,
    page: 0,
    size: 50,
  })

  const messages = useMemo(() => messagesPage?.content ?? [], [messagesPage])

  const { mutate: sendMessage, isPending: isSending } = useSendMessage()
  const { mutate: markAllRead } = useMarkAllMessagesRead(roomId)

  useEffect(() => {
    if (!hasUser || messages.length === 0)
      return
    markAllRead({ userId: currentUserId })
  }, [currentUserId, hasUser, markAllRead, messages.length])

  const handleSend = (content: string) => {
    if (!content || !currentUserId)
      return

    sendMessage({
      chatRoomId: roomId,
      senderId: currentUserId,
      content,
      messageType: 'TEXT',
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2 p-4 border-b border-border-default">
        <IconButton
          variant="ghost"
          size="sm"
          shape="circle"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          <BackIcon />
        </IconButton>
        <Typography
          variant="subtitle"
          className="text-heading font-semibold"
        >
          {roomName}
        </Typography>
      </div>

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4">
        {!hasUser && (
          <div className="text-center text-muted">
            사용자 ID를 입력하면 메시지를 불러올 수 있습니다.
          </div>
        )}
        {isLoading && (
          <div className="text-center text-muted">메시지를 불러오는 중...</div>
        )}
        {isError && (
          <div className="text-center text-muted space-y-2">
            <div>메시지를 불러오지 못했습니다.</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-link px-3"
            >
              다시 시도
            </Button>
          </div>
        )}
        {!isLoading && !isError && messages.length === 0 && (
          <div className="text-center text-muted">메시지가 없습니다. 대화를 시작해 보세요.</div>
        )}
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.sender.id === currentUserId}
          />
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="p-4">
        <div className="flex items-end gap-2 bg-active rounded-xl">
          <div className="flex-1 px-4 py-2">
            <ChatInput
              placeholder="메시지를 입력하세요."
              maxHeight={120}
              onSubmit={handleSend}
              disabled={isSending || !hasUser}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
