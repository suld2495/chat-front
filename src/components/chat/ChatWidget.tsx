import { useCallback, useState } from 'react'

import type { FileInfo } from '@/services/chat/types'

import { useChatConnection, useChatMessages } from '@/hooks/chat'
import { apiUrl } from '@/lib/const'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat'

import { ChatArea } from './ChatArea'
import { ChatAreaSkelton } from './ChatAreaSkelton'
import { ChatHeader } from './ChatHeader'
import { ChatInputContainer } from './ChatInputContainer'
import { ChatWidgetButton } from './ChatWidgetButton'
import { ConnectionError } from './ConnectionError'

export function ChatWidget() {
  const { error } = useChatConnection()
  const {
    loading,
    messages,
    sendMessage,
    clearMessages,
    retryMessage,
  } = useChatMessages()
  const isConnected = useChatStore(state => state.isConnected)
  const hasConnectedOnce = useChatStore(state => state.hasConnectedOnce)
  const connect = useChatStore(state => state.connect)
  const [isOpen, setIsOpen] = useState(false)
  const isNetworkDisconnected = hasConnectedOnce && error !== null

  const handleRetry = useCallback(() => {
    const wsEndpoint = `${apiUrl}/ws`
    connect(wsEndpoint)
  }, [connect])

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  const handleSendMessage = (content: string) => {
    if (!isConnected)
      return
    sendMessage(content, 'TEXT')
  }

  const handleSendFileSuccess = (fileName: string, fileInfo: FileInfo) => {
    sendMessage(fileName, 'FILE', fileInfo)
  }

  const renderChatContent = () => {
    if (error && !hasConnectedOnce) {
      return (
        <ConnectionError
          error={error}
          onRetry={handleRetry}
        />
      )
    }

    if (loading) {
      return <ChatAreaSkelton />
    }

    return (
      <ChatArea
        messages={messages}
        isNetworkDisconnected={isNetworkDisconnected}
        onRetryMessage={retryMessage}
      />
    )
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
        {renderChatContent()}

        <ChatInputContainer
          onSendMessage={handleSendMessage}
          onSendFileSuccess={handleSendFileSuccess}
          disabled={!isConnected || isNetworkDisconnected}
        />
      </div>

      <ChatWidgetButton
        isOpen={isOpen}
        onClick={handleToggle}
      />
    </>
  )
}
