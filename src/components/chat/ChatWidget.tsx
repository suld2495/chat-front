import { useState } from 'react'

import {
  useChatConnection,
  useChatMessages,
} from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat'

import { ChatArea } from './ChatArea'
import { ChatHeader } from './ChatHeader'
import { ChatInput } from './ChatInput'
import { ChatWidgetButton } from './ChatWidgetButton'

const destination = import.meta.env.VITE_WS_DESTINATION

export function ChatWidget() {
  useChatConnection()
  const { messages, clearMessages, sendMessage } = useChatMessages(destination)
  const isConnected = useChatStore(state => state.isConnected)
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  const handleSendMessage = (content: string) => {
    if (!isConnected)
      return

    sendMessage(content, 'TEXT')
  }

  const handleSendFile = (file: File) => {
    if (!isConnected)
      return

    sendMessage(file.name, 'FILE', {
      fileId: crypto.randomUUID(),
      fileName: file.name,
      fileUrl: '', // TODO: 파일 업로드 후 URL 설정
      fileSize: file.size,
      mimeType: file.type,
    })
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
        <ChatArea messages={messages} />

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
