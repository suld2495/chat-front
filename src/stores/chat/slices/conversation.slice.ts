// stores/chat/slices/conversation.slice.ts
import type { StateCreator } from 'zustand'

import type {
  ConnectedMessage,
  Message,
  WebSocketMessage,
} from '@/services/chat/types'

import { CHANNELS, ENDPOINTS } from '@/lib/websocket/const'
import { subscriptionManager } from '@/lib/websocket/subscription-manager'
import { useVisitorStore } from '@/stores/visitor'

import type { ChatState, ConversationSlice } from '../types'

export const createConversationSlice: StateCreator<
  ChatState,
  [],
  [],
  ConversationSlice
> = (set, get) => ({
  conversationId: null,
  aiEnabled: false,
  recentMessages: [],
  welcomeMessage: null,

  /**
   * 초기화 (대화 생성)
   */
  init: (hospitalId, visitorInfo, onConnected) => {
    const { isConnected } = get()
    const client = subscriptionManager.getClient()

    if (!client || !isConnected) {
      console.error('Client is not connected')
      return
    }

    const visitorId = useVisitorStore.getState().visitorId

    // 임시 채널 ID 생성
    const tempId = `temp-${Date.now()}`
    const tempChannel = CHANNELS.TEMP(tempId)

    // 임시 채널 일회성 구독 (초기화 응답 수신 후 자동 해제)
    subscriptionManager.subscribeOnce<WebSocketMessage>(tempChannel, (data) => {
      if (data.type === 'connected') {
        const connectedData = data as ConnectedMessage

        useVisitorStore.getState().setVisitorId(connectedData.visitorId)

        set({
          conversationId: connectedData.conversationId,
          aiEnabled: connectedData.aiEnabled,
          recentMessages: connectedData.recentMessages as Message[],
          welcomeMessage: connectedData.welcomeMessage,
        })

        // 에러 채널 구독
        subscriptionManager.subscribe(CHANNELS.ERROR, (errorMsg) => {
          console.error('Error received:', errorMsg)
        })

        // 초기화 완료 콜백 실행
        onConnected?.(connectedData)
      }
    }).catch((error) => {
      console.error('[ChatStore] Init timeout:', error)
      set({ error: error instanceof Error ? error : new Error(String(error)) })
    })

    // 초기화 메시지 전송
    client.publish(ENDPOINTS.INIT, {
      hospitalId,
      visitorId,
      tempId,
      visitorInfo,
    })
  },

  resetConversation: () => {
    set({
      conversationId: null,
      recentMessages: [],
      welcomeMessage: null,
    })
  },
})
