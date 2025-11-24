import { useState } from 'react'

import type { ChatRoomListItem } from '@/components/chat/ChatRoomList'

import { ChatRoom as ChatRoomView } from '@/components/chat/ChatRoom'
import { ChatRoomList } from '@/components/chat/ChatRoomList'
import { Typography } from '@/components/ui/Typography/Typography'

interface ChatPanelProps {
  currentUserId: string
}

export function ChatPanel({ currentUserId }: ChatPanelProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomListItem | null>(null)

  const handleRoomClick = (room: ChatRoomListItem) => {
    setSelectedRoom(room)
  }

  const handleBackToList = () => {
    setSelectedRoom(null)
  }

  // 채팅방이 선택된 경우 채팅방 화면 표시
  if (selectedRoom) {
    return (
      <ChatRoomView
        roomId={selectedRoom.id}
        roomName={typeof selectedRoom.name === 'string' ? selectedRoom.name : selectedRoom.id}
        currentUserId={currentUserId}
        onBack={handleBackToList}
      />
    )
  }

  // 채팅방 목록 표시
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 패널 타이틀 */}
      <div className="p-4 border-b border-border-default">
        <Typography
          variant="subtitle"
          className="text-heading font-semibold"
        >
          채팅
        </Typography>
      </div>

      {/* 채팅방 리스트 */}
      <ChatRoomList
        currentUserId={currentUserId}
        onRoomClick={handleRoomClick}
      />
    </div>
  )
}
