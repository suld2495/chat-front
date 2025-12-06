import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type { Message } from '@/services/chat/types'

import { fetchChatMessages } from '@/api/chat'
import { useChatStore } from '@/stores/chat'

const wsEndpoint = import.meta.env.VITE_WS_ENDPOINT || 'http://localhost:8080/ws'

// 사용자 및 에이전트 senderId 상수
const USER_SENDER_ID = 'a151e11d-afaa-41cd-96c6-e86407a7de3d'
const AGENT_SENDER_ID = '0f059a1a-fac5-42b7-bd8d-bf1d2c6a1452'
const LOADING_CHAT_ROOM_ID = '0e67fb87-10d3-4256-a887-443fe8583243'

export function useChatConnection() {
  const isConnected = useChatStore(state => state.isConnected)
  const error = useChatStore(state => state.error)
  const connect = useChatStore(state => state.connect)
  const disconnect = useChatStore(state => state.disconnect)

  useEffect(() => {
    connect(wsEndpoint)

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    error,
  }
}

export function useChatMessages(destination: string) {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const isWaitingForAgentRef = useRef(false)

  const isConnected = useChatStore(state => state.isConnected)
  const subscribe = useChatStore(state => state.subscribe)
  const unsubscribe = useChatStore(state => state.unsubscribe)

  useEffect(() => {
    const getChatMessages = async () => {
      try {
        if (messages.length > 0) {
          setLoading(false)
          return
        }

        const { content } = await fetchChatMessages()

        // HTTP 로드 시 애니메이션 없음 (animate 플래그 없음)
        setMessages(content)
      }
      catch {

      }
      finally {
        setLoading(false)
      }
    }

    getChatMessages()
  }, [])

  useEffect(() => {
    if (!isConnected)
      return

    subscribe(destination, (message) => {
      // 사용자가 메시지를 보낸 경우 → 로딩 메시지 추가
      if (message.senderId === USER_SENDER_ID) {
        const loadingMessage: Message = {
          id: `loading-${Date.now()}`,
          content: '',
          sender: { id: 'agent' },
          senderId: AGENT_SENDER_ID,
          createdAt: new Date().toISOString(),
          messageType: 'LOADING',
        }
        isWaitingForAgentRef.current = true
        setMessages(prev => [...prev, message, loadingMessage])
        return
      }

      // 에이전트가 응답한 경우 → 로딩 메시지 제거 후 실제 메시지 추가 + 애니메이션 플래그
      if (message.senderId === AGENT_SENDER_ID && isWaitingForAgentRef.current) {
        isWaitingForAgentRef.current = false
        const animatedMessage: Message = { ...message, animate: true }
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          // 마지막 메시지가 에이전트의 LOADING 메시지인 경우 제거
          if (
            lastMessage
            && lastMessage.senderId === AGENT_SENDER_ID
            && lastMessage.messageType === 'LOADING'
          ) {
            return [...prev.slice(0, -1), animatedMessage]
          }
          return [...prev, animatedMessage]
        })
        return
      }

      // 그 외의 경우 일반 메시지 추가
      setMessages(prev => [...prev, message])
    })

    return () => {
      unsubscribe(destination)
    }
  }, [isConnected, destination, subscribe, unsubscribe])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    loading,
    messages,
    clearMessages,
  }
}

// 메시지 전송만
export function useChatPublish() {
  const isConnected = useChatStore(state => state.isConnected)
  const publish = useChatStore(state => state.publish)

  return { isConnected, publish }
}
