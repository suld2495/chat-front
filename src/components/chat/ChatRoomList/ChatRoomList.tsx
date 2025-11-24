import { useState } from 'react'

import type { ChatRoom as ChatRoomEntity } from '@/api'

import { Button } from '@/components/ui/Button/Button'
import { Typography } from '@/components/ui/Typography/Typography'
import { useCreateChatRoom, useUserChatRooms } from '@/hooks/api'
import { cn } from '@/lib/utils'

export type ChatRoomListItem = ChatRoomEntity

interface LastMessageShape {
  content?: string
  createdAt?: string
}

function isLastMessageShape(value: unknown): value is LastMessageShape {
  return Boolean(value && typeof value === 'object')
}

function getLastMessage(room: ChatRoomListItem): { text: string, timestamp?: string } {
  const last = room.lastMessage

  if (typeof last === 'string') {
    return { text: last }
  }

  if (isLastMessageShape(last)) {
    return {
      text: last.content ?? '',
      timestamp: last.createdAt,
    }
  }

  return { text: '' }
}

interface ChatRoomItemProps {
  room: ChatRoomListItem
  onClick?: () => void
}

function ChatRoomItem({ room, onClick }: ChatRoomItemProps) {
  const name = typeof room.name === 'string' && room.name.length > 0 ? room.name : room.id

  const { text: lastMessage, timestamp: lastTimestamp } = getLastMessage(room)

  const timestamp = (() => {
    const createdAt = lastTimestamp ?? room.updatedAt ?? room.createdAt

    if (!createdAt)
      return ''
    const date = new Date(createdAt)
    return Number.isNaN(date.getTime()) ? createdAt : date.toLocaleString()
  })()

  return (
    <Button
      variant="ghost"
      fullWidth
      onClick={onClick}
      className={cn(
        'h-auto p-4 text-left',
        'flex items-start gap-3',
        'hover:bg-hover',
        'transition-colors duration-200',
        'border-b border-border-default rounded-none',
        'cursor-pointer',
      )}
    >
      {/* 아바타 */}
      <div className="w-12 h-12 rounded-full bg-action-primary flex items-center justify-center flex-shrink-0">
        <Typography
          variant="body"
          className="text-inverse font-semibold"
        >
          {name.charAt(0)}
        </Typography>
      </div>

      {/* 채팅방 정보 */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <Typography
            variant="body"
            className="text-heading font-semibold truncate"
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            className="text-muted flex-shrink-0 ml-2"
          >
            {timestamp}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography
            variant="body"
            className="text-muted truncate"
          >
            {lastMessage || '메시지가 없습니다'}
          </Typography>
          {room.unreadCount && room.unreadCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-action-primary flex items-center justify-center flex-shrink-0 ml-2">
              <Typography
                variant="caption"
                className="text-inverse text-xs font-semibold"
              >
                {room.unreadCount}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Button>
  )
}

interface ChatRoomListProps {
  currentUserId: string
  onRoomClick: (room: ChatRoomListItem) => void
}

export function ChatRoomList({ currentUserId, onRoomClick }: ChatRoomListProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useUserChatRooms(currentUserId)
  const {
    mutateAsync: createChatRoom,
    isPending: isCreating,
  } = useCreateChatRoom()
  const [createError, setCreateError] = useState<string | null>(null)
  const rooms = data ?? []

  const handleCreateRoom = async () => {
    setCreateError(null)
    if (!currentUserId)
      return

    try {
      const room = await createChatRoom({ userId: currentUserId })
      onRoomClick(room)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : '채팅방 생성에 실패했습니다.'
      setCreateError(message)
    }
  }

  if (!currentUserId) {
    return (
      <div className="p-4 text-center text-muted">
        현재 사용자 ID가 없습니다. 상단 입력란에 ID를 입력하세요.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted">
        채팅방을 불러오는 중...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-muted space-y-2">
        <div>채팅방을 불러오지 못했습니다.</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="text-link px-3"
        >
          다시 시도
        </Button>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="relative flex-1 flex items-center justify-center text-muted">
        <div className="text-center space-y-2">
          <div>채팅방이 없습니다. 대화를 시작해 보세요.</div>
          {createError && (
            <div className="text-danger text-sm">{createError}</div>
          )}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateRoom}
          disabled={isCreating}
          className="absolute bottom-4 right-4 rounded-full shadow-lg px-4"
        >
          {isCreating ? '생성 중...' : '채팅방 생성'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {rooms.map(room => (
        <ChatRoomItem
          key={room.id}
          room={room}
          onClick={() => onRoomClick(room)}
        />
      ))}
    </div>
  )
}
