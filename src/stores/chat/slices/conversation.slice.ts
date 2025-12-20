import type { StateCreator } from 'zustand'

import type { Message } from '@/services/chat/types'

import type { ChatState, ConversationSlice } from '../types'

export const createConversationSlice: StateCreator<
  ChatState,
  [],
  [],
  ConversationSlice
> = (set, get) => ({
  conversationId: null,
  welcomeMessage: null,
  error: null,
  isInitialized: false,
  messages: [],

  /**
   * 대화 초기화
   */
  init: () => {
    const conversationId = `conv-${Date.now()}`
    const welcomeMessage = '안녕하세요! 무엇을 도와드릴까요?'

    const welcomeMsg: Message = {
      messageId: `welcome-${Date.now()}`,
      content: welcomeMessage,
      senderType: 'AI',
      senderId: 'ai',
      senderName: 'AI',
      createdAt: new Date().toISOString(),
      messageType: 'TEXT',
    }

    set({
      conversationId,
      welcomeMessage,
      isInitialized: true,
      error: null,
      messages: [welcomeMsg],
    })
  },

  /**
   * 대화 상태 리셋
   */
  resetConversation: () => {
    set({
      conversationId: null,
      welcomeMessage: null,
      isInitialized: false,
      error: null,
      messages: [],
    })
  },

  /**
   * 메시지 추가
   */
  addMessage: (message) => {
    set(state => ({ messages: [...state.messages, message] }))
  },

  /**
   * 메시지 목록 초기화
   */
  clearMessages: () => {
    const { welcomeMessage } = get()

    if (welcomeMessage) {
      const welcomeMsg: Message = {
        messageId: `welcome-${Date.now()}`,
        content: welcomeMessage,
        senderType: 'AI',
        senderId: 'ai',
        senderName: 'AI',
        createdAt: new Date().toISOString(),
        messageType: 'TEXT',
      }
      set({ messages: [welcomeMsg] })
    }
    else {
      set({ messages: [] })
    }
  },

  /**
   * 스트리밍 메시지 업데이트
   */
  updateStreamingMessage: (messageId, content) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.messageId === messageId
          ? {
              ...msg,
              content,
              messageType: 'TEXT' as const,
              animate: false,
            }
          : msg,
      ),
    }))
  },

  /**
   * 스트리밍 메시지 완료
   */
  completeStreamingMessage: (messageId) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.messageId === messageId
          ? {
              ...msg,
              messageType: 'TEXT' as const,
              animate: false,
            }
          : msg,
      ),
    }))
  },
})
