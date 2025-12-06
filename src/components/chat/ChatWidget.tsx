import { useState } from 'react'

import type { SenderMessage } from '@/services/chat/types'

import {
  useChatConnection,
  useChatMessages,
  useChatPublish,
} from '@/hooks/useChat'
import { cn } from '@/lib/utils'

import { ChatArea } from './ChatArea'
import { ChatAreaSkelton } from './ChatAreaSkelton'
import { ChatHeader } from './ChatHeader'
import { ChatInput } from './ChatInput'
import { ChatWidgetButton } from './ChatWidgetButton'

const destination = import.meta.env.VITE_WS_DESTINATION
const publishDestination = import.meta.env.VITE_WS_PUBLISH_DESTINATION

export function ChatWidget() {
  useChatConnection()
  const {
    loading,
    messages,
    clearMessages,
  } = useChatMessages(destination)
  const { isConnected, publish } = useChatPublish()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  const handleSendMessage = (content: string) => {
    if (!isConnected)
      return

    const newMessage: SenderMessage = {
      chatRoomId: '0e67fb87-10d3-4256-a887-443fe8583243', // TODO: 실제 채팅방 ID로 교체
      senderId: 'a151e11d-afaa-41cd-96c6-e86407a7de3d',
      content,
      messageType: 'TEXT',
      chatMessageType: 'CHAT',
    }

    publish(publishDestination, newMessage)
  }

  const handleSendFile = (file: File) => {
    if (!isConnected)
      return

    const newMessage: SenderMessage = {
      id: crypto.randomUUID(),
      chatRoomId: '0e67fb87-10d3-4256-a887-443fe8583243', // TODO: 실제 채팅방 ID로 교체
      senderId: 'a151e11d-afaa-41cd-96c6-e86407a7de3d',
      content: file.name,
      messageType: 'FILE',
      chatMessageType: 'CHAT',
      createdAt: new Date().toISOString(),
    }

    publish(publishDestination, newMessage)
  }

  return (
    <>
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50',
          'w-[380px] h-[580px] max-h-[calc(100vh-120px)]',
          'flex flex-col',
          'bg-chat-widget rounded-2xl overflow-hidden',
          'shadow-xl',
          'transition-all duration-300 ease-out',
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto slide-up-enter'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none',
        )}
      >
        <ChatHeader
          title="성민데모(TalkCRM)"
          onClose={handleToggle}
          onClear={clearMessages}
        />
        {loading ? <ChatAreaSkelton /> : <ChatArea messages={messages} />}

        <ChatInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
        />
      </div>

      <ChatWidgetButton
        isOpen={isOpen}
        onClick={handleToggle}
      />
    </>
  )
}
