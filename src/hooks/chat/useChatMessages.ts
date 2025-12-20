import { useCallback } from 'react'

import type { Message } from '@/services/chat/types'

import { useChatStore } from '@/stores/chat'

export function useChatActions() {
  const isStreaming = useChatStore(s => s.isStreaming)
  const isInitialized = useChatStore(s => s.isInitialized)

  const addMessage = useChatStore(s => s.addMessage)
  const clearMessagesStore = useChatStore(s => s.clearMessages)
  const updateStreamingMessage = useChatStore(s => s.updateStreamingMessage)
  const completeStreamingMessage = useChatStore(s => s.completeStreamingMessage)
  const sendMessageStore = useChatStore(s => s.sendMessage)

  const clearMessages = useCallback(() => {
    clearMessagesStore()
  }, [clearMessagesStore])

  const sendMessage = useCallback((content: string) => {
    if (!isInitialized) {
      console.error('Chat is not initialized')
      return
    }

    const userMessage: Message = {
      messageId: `user-${Date.now()}`,
      content,
      messageType: 'TEXT',
      senderType: 'USER',
      senderId: 'user',
      senderName: 'User',
      createdAt: new Date().toISOString(),
      status: 'sent',
    }
    addMessage(userMessage)

    const aiMessageId = `ai-${Date.now()}`
    const aiMessage: Message = {
      messageId: aiMessageId,
      content: '',
      messageType: 'LOADING',
      senderType: 'AI',
      senderId: 'ai',
      senderName: 'AI',
      createdAt: new Date().toISOString(),
      animate: true,
    }
    addMessage(aiMessage)

    let streamedContent = ''

    sendMessageStore(content, {
      onChunk: (chunk) => {
        streamedContent += chunk
        updateStreamingMessage(aiMessageId, streamedContent)
      },
      onComplete: () => {
        completeStreamingMessage(aiMessageId)
      },
      onError: (error) => {
        console.error('Message send error:', error)
        updateStreamingMessage(aiMessageId, '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.')
        completeStreamingMessage(aiMessageId)
      },
    })
  }, [
    isInitialized,
    addMessage,
    sendMessageStore,
    updateStreamingMessage,
    completeStreamingMessage,
  ])

  const sendFileMessage = useCallback((fileName: string, fileInfo: Message['fileInfo']) => {
    if (!isInitialized) {
      console.error('Chat is not initialized')
      return
    }

    const fileMessage: Message = {
      messageId: `file-${Date.now()}`,
      content: fileName,
      messageType: 'FILE',
      senderType: 'USER',
      senderId: 'user',
      senderName: 'User',
      createdAt: new Date().toISOString(),
      fileInfo,
      status: 'sent',
    }
    addMessage(fileMessage)
  }, [isInitialized, addMessage])

  return {
    isStreaming,
    clearMessages,
    sendMessage,
    sendFileMessage,
  }
}
