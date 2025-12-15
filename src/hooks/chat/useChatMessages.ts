import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react'

import type { Message } from '@/services/chat/types'

import { CHANNELS } from '@/lib/websocket/const'
import { useChatStore } from '@/stores/chat'

import type { MessageHandlerContext } from './message-handlers'

import { handleMessage } from './message-handlers'

// 메시지 전송 타임아웃 (10초)
const MESSAGE_TIMEOUT_MS = 10000

interface MessageStore {
  messages: Message[]
  loading: boolean
  initialized: boolean
  context: MessageHandlerContext
}

function createMessageStore() {
  let state: MessageStore = {
    messages: [],
    loading: true,
    initialized: false,
    context: {
      processedIds: new Set(),
      pendingMessages: new Map(),
      pendingTimeouts: new Map(),
    },
  }

  const listeners = new Set<() => void>()

  const notify = () => listeners.forEach(listener => listener())

  return {
    getState: () => state,

    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    setMessages: (updater: (prev: Message[]) => Message[]) => {
      state = { ...state, messages: updater(state.messages) }
      notify()
    },

    initialize: (initialMessages: Message[]) => {
      if (state.initialized)
        return

      initialMessages.forEach(msg => state.context.processedIds.add(msg.messageId))
      state = {
        ...state,
        messages: initialMessages,
        loading: false,
        initialized: true,
      }
      notify()
    },

    setLoading: (loading: boolean) => {
      state = { ...state, loading }
      notify()
    },

    clear: () => {
      // 모든 타임아웃 취소
      state.context.pendingTimeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId)
      })

      state = {
        messages: [],
        loading: true,
        initialized: false,
        context: {
          processedIds: new Set(),
          pendingMessages: new Map(),
          pendingTimeouts: new Map(),
        },
      }
      notify()
    },
  }
}

export function useChatMessages() {
  const [store] = useState(() => createMessageStore())

  const state = useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getState,
  )

  const isConnected = useChatStore(s => s.isConnected)
  const conversationId = useChatStore(s => s.conversationId)
  const recentMessages = useChatStore(s => s.recentMessages)
  const welcomeMessage = useChatStore(s => s.welcomeMessage)
  const error = useChatStore(s => s.error)
  const subscribe = useChatStore(s => s.subscribe)
  const sendMessageStore = useChatStore(s => s.sendMessage)

  useEffect(() => {
    if (error === null && !isConnected && state.initialized) {
      store.clear()
    }
  }, [error, isConnected, state.initialized, store])

  // 초기 메시지 설정 (store 외부 데이터 동기화)
  useEffect(() => {
    if (!conversationId || state.initialized)
      return

    if (!welcomeMessage && recentMessages.length === 0)
      return

    const initialMessages: Message[] = []

    if (welcomeMessage) {
      initialMessages.push({
        messageId: `welcome-${Date.now()}`,
        conversationId,
        content: welcomeMessage,
        senderType: 'AGENT',
        senderId: '',
        senderName: 'Agent',
        createdAt: new Date().toISOString(),
        messageType: 'SYSTEM',
      })
    }

    initialMessages.push(...recentMessages)
    store.initialize(initialMessages)
  }, [conversationId, welcomeMessage, recentMessages, state.initialized, store])

  // conversationId 있고 초기화 완료 시 loading 해제
  useEffect(() => {
    if (conversationId && state.initialized && state.loading) {
      store.setLoading(false)
    }
  }, [conversationId, state.initialized, state.loading, store])

  // 메시지 구독
  useEffect(() => {
    if (!isConnected || !conversationId)
      return

    const destination = CHANNELS.CONVERSATION(conversationId)

    const unsubscriber = subscribe(destination, (message) => {
      handleMessage(message, store.setMessages, store.getState().context)
    })

    return unsubscriber
  }, [conversationId, isConnected, subscribe, store])

  const clearMessages = useCallback(() => {
    store.clear()
  }, [store])

  // 실패한 메시지의 상태를 failed로 변경하는 함수
  const markMessageAsFailed = useCallback((tempMessageId: string) => {
    const { context } = store.getState()

    // 이미 처리된 경우 (서버 응답이 온 경우) 무시
    if (!context.pendingMessages.has(tempMessageId))
      return

    context.pendingMessages.delete(tempMessageId)
    context.pendingTimeouts.delete(tempMessageId)

    store.setMessages(prev =>
      prev.map(msg =>
        msg.tempMessageId === tempMessageId
          ? { ...msg, status: 'failed' }
          : msg,
      ),
    )
  }, [store])

  const sendMessage = useCallback((
    content: string,
    messageType: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT',
    fileInfo?: Message['fileInfo'],
  ) => {
    if (!conversationId) {
      console.error('Conversation ID is not set')
      return
    }

    const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const optimisticMessage: Message = {
      messageId: tempMessageId,
      tempMessageId,
      conversationId,
      content,
      messageType,
      senderType: 'USER',
      senderId: '',
      senderName: 'User',
      createdAt: new Date().toISOString(),
      fileInfo,
      status: 'pending',
    }

    const { context } = store.getState()
    context.pendingMessages.set(tempMessageId, tempMessageId)

    // 타임아웃 설정
    const timeoutId = setTimeout(() => {
      // 메시지별 전송 여부 확인은 미루기
      // markMessageAsFailed(tempMessageId)
    }, MESSAGE_TIMEOUT_MS)
    context.pendingTimeouts.set(tempMessageId, timeoutId)

    store.setMessages(prev => [...prev, optimisticMessage])

    sendMessageStore(content, messageType, fileInfo, tempMessageId)
  }, [conversationId, sendMessageStore, store])

  // 실패한 메시지 재전송
  const retryMessage = useCallback((tempMessageId: string) => {
    const message = state.messages.find(msg => msg.tempMessageId === tempMessageId)
    if (!message || message.status !== 'failed')
      return

    const { context } = store.getState()

    store.setMessages(prev =>
      prev.map(msg =>
        msg.tempMessageId === tempMessageId
          ? { ...msg, status: 'pending' }
          : msg,
      ),
    )

    context.pendingMessages.set(tempMessageId, tempMessageId)

    // 타임아웃 설정
    const timeoutId = setTimeout(() => {
      markMessageAsFailed(tempMessageId)
    }, MESSAGE_TIMEOUT_MS)
    context.pendingTimeouts.set(tempMessageId, timeoutId)

    // 메시지 재전송
    sendMessageStore(message.content, message.messageType as 'TEXT' | 'IMAGE' | 'FILE', message.fileInfo, tempMessageId)
  }, [state.messages, sendMessageStore, store, markMessageAsFailed])

  return {
    loading: state.loading,
    messages: state.messages,
    clearMessages,
    sendMessage,
    retryMessage,
  }
}
