import { useCallback, useEffect, useRef, useState } from 'react'

import type { Message } from '@/services/chat/types'

import { useChatStore } from '@/stores/chat'

const wsEndpoint = import.meta.env.VITE_WS_ENDPOINT || 'http://localhost:8080/ws/widget'

// 사용자 및 에이전트 senderId 상수
const USER_SENDER_ID = 'a151e11d-afaa-41cd-96c6-e86407a7de3d'
const AGENT_SENDER_ID = '0f059a1a-fac5-42b7-bd8d-bf1d2c6a1452'

// LocalStorage 키 상수
const VISITOR_ID_KEY = 'talkcrm_visitor_id'

/**
 * 방문자 ID 가져오기 (없으면 생성)
 */
function getOrCreateVisitorId(): string {
  const stored = localStorage.getItem(VISITOR_ID_KEY)
  if (stored) {
    return stored
  }

  const newId = crypto.randomUUID()
  localStorage.setItem(VISITOR_ID_KEY, newId)
  return newId
}

/**
 * WebSocket 연결 관리 훅
 */
export function useChatConnection() {
  const isConnected = useChatStore(state => state.isConnected)
  const conversationId = useChatStore(state => state.conversationId)
  const error = useChatStore(state => state.error)
  const connect = useChatStore(state => state.connect)
  const disconnect = useChatStore(state => state.disconnect)
  const init = useChatStore(state => state.init)

  useEffect(() => {
    // 이미 연결되어 있으면 재연결하지 않음
    if (!isConnected) {
      connect(wsEndpoint)
    }

    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 빈 배열로 한 번만 실행

  // WebSocket 연결 성공 시 초기화 (conversationId 발급)
  useEffect(() => {
    if (isConnected && !conversationId) {
      // 초기화 메시지 전송
      init(
        'HOSPITAL001', // TODO: 실제 병원 ID로 변경
        getOrCreateVisitorId(), // 방문자 ID (브라우저별 고유 ID, localStorage에 저장)
        {
          name: '방문자',
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        },
        () => {
          // 초기화 완료 후 처리 (필요시 추가)
        },
      )
    }
  }, [isConnected, conversationId, init])

  return {
    isConnected,
    conversationId,
    error,
  }
}

/**
 * 채팅 메시지 관리 훅
 * WebSocket 메시지 수신 및 상태 관리
 */
export function useChatMessages(destination: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const isWaitingForAgentRef = useRef(false)
  const initializedRef = useRef(false)

  const isConnected = useChatStore(state => state.isConnected)
  const conversationId = useChatStore(state => state.conversationId)
  const recentMessages = useChatStore(state => state.recentMessages)
  const welcomeMessage = useChatStore(state => state.welcomeMessage)
  const subscribe = useChatStore(state => state.subscribe)
  const unsubscribe = useChatStore(state => state.unsubscribe)
  const sendMessageStore = useChatStore(state => state.sendMessage)

  // 초기 메시지 로드 (웰컴 메시지 + 최근 메시지)
  useEffect(() => {
    if (
      conversationId &&
      !initializedRef.current &&
      (welcomeMessage || recentMessages.length > 0)
    ) {
      const initialMessages: Message[] = []

      // 웰컴 메시지 추가
      if (welcomeMessage) {
        initialMessages.push({
          messageId: `welcome-${Date.now()}`,
          conversationId,
          content: welcomeMessage,
          senderType: 'AGENT',
          senderId: AGENT_SENDER_ID,
          senderName: 'Agent',
          createdAt: new Date().toISOString(),
          messageType: 'SYSTEM',
        })
      }

      // 최근 메시지 추가
      initialMessages.push(...recentMessages)

      setMessages(initialMessages)
      initializedRef.current = true
    }
  }, [conversationId, welcomeMessage, recentMessages])

  useEffect(() => {
    if (!isConnected) return

    subscribe(destination, message => {
      // 사용자가 메시지를 보낸 경우 (서버로부터 브로드캐스트 수신)
      if (message.senderId === USER_SENDER_ID) {
        // 임시 메시지를 실제 메시지로 교체
        setMessages(prev => {
          // 임시 메시지 찾기
          const tempMessageIndex = prev.findIndex(
            msg => msg.tempMessageId && msg.senderId === USER_SENDER_ID && msg.messageId.startsWith('temp-')
          )

          if (tempMessageIndex !== -1) {
            // 임시 메시지를 실제 메시지로 교체
            const updated = [...prev]
            updated[tempMessageIndex] = {
              ...message,
              tempMessageId: undefined, // 임시 ID 제거
            }
            return updated
          }

          // 임시 메시지가 없으면 일반 추가 (다른 디바이스에서 보낸 경우)
          return [...prev, message]
        })

        // 로딩 메시지 추가 (에이전트 응답 대기)
        const loadingMessage: Message = {
          messageId: `loading-${Date.now()}`,
          content: '',
          senderType: 'AGENT',
          senderId: AGENT_SENDER_ID,
          senderName: 'Agent',
          createdAt: new Date().toISOString(),
          messageType: 'SYSTEM',
          metadata: { isLoading: true },
        }
        isWaitingForAgentRef.current = true
        setMessages(prev => [...prev, loadingMessage])
        return
      }

      // 에이전트가 응답한 경우 → 로딩 메시지 제거 후 실제 메시지 추가 + 애니메이션 플래그
      if (message.senderId === AGENT_SENDER_ID && isWaitingForAgentRef.current) {
        isWaitingForAgentRef.current = false
        const animatedMessage: Message = { ...message, animate: true }
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          // 마지막 메시지가 로딩 메시지인 경우 제거
          if (
            lastMessage &&
            lastMessage.senderId === AGENT_SENDER_ID &&
            lastMessage.metadata?.isLoading
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
    initializedRef.current = false
  }, [])

  /**
   * 낙관적 업데이트를 포함한 메시지 전송 함수
   */
  const sendMessage = useCallback((
    content: string,
    messageType: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT',
    fileInfo?: Message['fileInfo']
  ) => {
    if (!conversationId) {
      console.error('Conversation ID is not set')
      return
    }

    // 1. 낙관적 업데이트: 즉시 UI에 메시지 추가
    const tempMessageId = `temp-${Date.now()}`
    const optimisticMessage: Message = {
      messageId: tempMessageId, // 임시 ID
      tempMessageId, // 나중에 찾기 위한 임시 ID 저장
      conversationId,
      content,
      messageType,
      senderType: 'USER',
      senderId: USER_SENDER_ID,
      senderName: 'User',
      createdAt: new Date().toISOString(),
      fileInfo,
    }

    setMessages(prev => [...prev, optimisticMessage])

    // 2. 실제 메시지 전송
    sendMessageStore(content, messageType, fileInfo)
  }, [conversationId, sendMessageStore])

  return {
    messages,
    clearMessages,
    sendMessage,
  }
}
