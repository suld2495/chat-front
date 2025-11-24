import { useQueryClient } from '@tanstack/react-query'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { Message as MessageEntity } from '@/api'
import type { TypingEvent, WebSocketMessage } from '@/types/websocket'

import { ChatInput } from '@/components/chat/ChatInput'
import { Button } from '@/components/ui/Button/Button'
import { TypingIndicator } from '@/components/ui/ChatBubble/TypingIndicator'
import { IconButton } from '@/components/ui/IconButton/IconButton'
import { Typography } from '@/components/ui/Typography/Typography'
import {
  queryKeys,
  useChatRoomMessages,
  useMarkAllMessagesRead,
} from '@/hooks/api'
import {
  useSubscribeToChatRoom,
  useSubscribeToTyping,
  useSubscribeToUserMessages,
  useWebSocket,
} from '@/hooks/useWebSocket'
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
          'max-w-[90%] px-4 py-2 rounded-2xl',
          isMine
            ? 'bg-action-primary text-inverse rounded-br-sm'
            : 'bg-surface-raised text-body rounded-bl-sm',
        )}
      >
        <Typography
          variant="body"
          size="sm"
          className={isMine ? 'text-inverse' : 'text-body'}
        >
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          size="xs"
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
  const queryClient = useQueryClient()
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const listKey = useMemo(
    () => queryKeys.messages.list(roomId, {
      userId: currentUserId,
      page: 0,
      size: 50,
    }),
    [roomId, currentUserId],
  )

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
  const orderedMessages = useMemo(() => {
    const parseTimestamp = (value?: string) => {
      if (!value)
        return 0

      const time = new Date(value).getTime()
      return Number.isNaN(time) ? 0 : time
    }

    return [...messages].sort((a, b) => parseTimestamp(a.createdAt) - parseTimestamp(b.createdAt))
  }, [messages])

  const { mutate: markAllRead } = useMarkAllMessagesRead(roomId)

  // WebSocket 연결 및 구독
  const {
    connect,
    isConnected,
    sendMessage,
    sendTypingEvent,
  } = useWebSocket()

  // WebSocket 연결
  useEffect(() => {
    if (currentUserId) {
      connect(currentUserId)
    }
  }, [currentUserId, connect])

  // 실시간 메시지 수신 처리
  const handleNewMessage = useCallback(
    (wsMessage: WebSocketMessage) => {
      // WebSocket 수신 메시지를 React Query 캐시에 반영
      if (wsMessage.chatMessageType && wsMessage.chatMessageType !== 'CHAT') {
        return
      }

      const messageId = wsMessage.id || wsMessage.messageId || `temp-${Date.now()}`
      const createdAt = wsMessage.createdAt || wsMessage.timestamp || new Date().toISOString()
      const messageType = wsMessage.messageType || 'TEXT'
      const senderId = wsMessage.senderId

      queryClient.setQueryData(
        listKey,
        (oldData: typeof messagesPage) => {
          const prevContent = oldData?.content ?? []

          const newMessage: MessageEntity = {
            id: messageId,
            chatRoomId: wsMessage.chatRoomId,
            senderId,
            sender: { id: senderId },
            content: wsMessage.content,
            messageType,
            createdAt,
            readAt: null,
          }

          // 중복 메시지 방지 (서버 ID 기준)
          const isDuplicate = prevContent.some(msg => msg.id === messageId)
          if (isDuplicate)
            return oldData

          const nextContent = [...prevContent, newMessage]
          return {
            ...oldData,
            content: nextContent,
            totalElements: (oldData?.totalElements ?? nextContent.length),
            numberOfElements: (oldData?.numberOfElements ?? nextContent.length),
            empty: false,
          }
        },
      )
    },
    [queryClient, listKey],
  )

  // 타이핑 이벤트 수신 처리
  const handleTypingEvent = useCallback(
    (event: TypingEvent) => {
      // 다른 사용자의 타이핑만 표시
      if (event.userId !== currentUserId) {
        setIsOtherUserTyping(event.isTyping)

        // 타이핑 표시를 3초 후 자동으로 숨김
        if (event.isTyping) {
          const timeout = setTimeout(() => {
            setIsOtherUserTyping(false)
          }, 3000)
          return () => clearTimeout(timeout)
        }
      }
    },
    [currentUserId],
  )

  // 채팅방 메시지 구독
  useSubscribeToChatRoom(roomId, handleNewMessage)

  // 타이핑 이벤트 구독
  useSubscribeToTyping(roomId, handleTypingEvent)
  // 사용자 개인 큐 구독 (서버가 개인 큐로만 브로드캐스트할 때 대비)
  useSubscribeToUserMessages(currentUserId, (message) => {
    if (message.chatRoomId === roomId) {
      handleNewMessage(message)
    }
  })

  useEffect(() => {
    if (!hasUser || messages.length === 0)
      return
    markAllRead({ userId: currentUserId })
  }, [currentUserId, hasUser, markAllRead, messages.length])

  const handleSend = (content: string) => {
    if (!content || !currentUserId || !isConnected)
      return

    sendMessage({
      chatRoomId: roomId,
      senderId: currentUserId,
      content,
      messageType: 'TEXT',
      chatMessageType: 'CHAT',
    })
  }

  // 타이핑 이벤트 전송
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!currentUserId || !isConnected)
        return

      sendTypingEvent({
        chatRoomId: roomId,
        userId: currentUserId,
        isTyping,
      })
    },
    [currentUserId, roomId, isConnected, sendTypingEvent],
  )

  // 메시지 변경 시 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [orderedMessages])

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
          {roomName || '채팅방'}
        </Typography>
      </div>

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* WebSocket 연결 상태 표시 (개발 모드) */}
        {import.meta.env.DEV && (
          <div className="mb-4 text-center">
            <Typography
              variant="caption"
              className="text-muted"
            >
              WebSocket:
              {' '}
              {isConnected ? '🟢 연결됨' : '🔴 연결 안됨'}
            </Typography>
          </div>
        )}

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
        {orderedMessages.map((message) => {
          const senderId = message.sender?.id ?? message.senderId ?? ''
          const isMine = senderId === currentUserId

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isMine={isMine}
            />
          )
        })}

        {/* 타이핑 인디케이터 */}
        {isOtherUserTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-surface-raised rounded-bl-sm">
              <TypingIndicator size="md" />
            </div>
          </div>
        )}

        {/* 스크롤 앵커 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4">
        <div className="flex items-end gap-2 bg-active rounded-xl">
          <div className="flex-1 px-4 py-2">
            <ChatInput
              placeholder="메시지를 입력하세요."
              maxHeight={120}
              onSubmit={handleSend}
              onTyping={handleTyping}
              disabled={!isConnected || !hasUser}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
