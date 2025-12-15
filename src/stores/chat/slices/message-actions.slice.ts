import type { StateCreator } from 'zustand'

import type {
  CloseRequest,
  ReadRequest,
  TypingRequest,
} from '@/services/chat/types'

import { ENDPOINTS } from '@/lib/websocket/const'
import { subscriptionManager } from '@/lib/websocket/subscription-manager'

import type { ChatState, MessageActionsSlice } from '../types'

export const createMessageActionsSlice: StateCreator<
  ChatState,
  [],
  [],
  MessageActionsSlice
> = (_, get) => ({
  /**
   * 메시지 전송
   * WebSocket API 명세: /app/widget/message
   */
  sendMessage: (content, messageType = 'TEXT', fileInfo, tempMessageId) => {
    const { isConnected, conversationId } = get()
    const client = subscriptionManager.getClient()

    if (!client || !isConnected) {
      console.error('Client is not connected')
      return
    }

    if (!conversationId) {
      console.error('Conversation ID is not set. Please initialize first.')
      return
    }

    client.publish(ENDPOINTS.MESSAGE, {
      conversationId,
      content,
      messageType,
      fileInfo,
      tempMessageId,
    })
  },

  /**
   * 타이핑 상태 전송
   * WebSocket API 명세: /app/widget/typing
   */
  sendTyping: (isTyping) => {
    const { isConnected, conversationId } = get()
    const client = subscriptionManager.getClient()

    if (!client || !isConnected || !conversationId)
      return

    const typingRequest: TypingRequest = {
      conversationId,
      isTyping,
    }

    client.publish(ENDPOINTS.TYPING, typingRequest)
  },

  /**
   * 읽음 처리
   * WebSocket API 명세: /app/widget/read
   */
  markAsRead: (messageId) => {
    const { isConnected, conversationId } = get()
    const client = subscriptionManager.getClient()

    if (!client || !isConnected || !conversationId)
      return

    const readRequest: ReadRequest = {
      conversationId,
      messageId,
    }

    client.publish(ENDPOINTS.READ, readRequest)
  },

  /**
   * 대화 종료
   * WebSocket API 명세: /app/widget/close
   */
  closeConversation: (reason) => {
    const { isConnected, conversationId } = get()
    const client = subscriptionManager.getClient()

    if (!client || !isConnected || !conversationId)
      return

    const closeRequest: CloseRequest = {
      conversationId,
      closeReason: reason,
    }

    client.publish(ENDPOINTS.CLOSE, closeRequest)

    get().disconnect()
  },
})
