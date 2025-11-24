import type { IMessage } from '@stomp/stompjs'

import {
  use,
  useEffect,
  useRef,
} from 'react'

import type { TypingEvent, WebSocketMessage } from '@/types/websocket'

import { WebSocketContext } from '@/contexts/WebSocketContext'

/**
 * WebSocket Hook
 *
 * WebSocket 연결, 구독, 메시지 전송을 위한 커스텀 훅
 */
export function useWebSocket() {
  const context = use(WebSocketContext)

  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }

  return context
}

/**
 * 채팅방 메시지 구독 Hook
 *
 * @param chatRoomId - 구독할 채팅방 ID
 * @param onMessage - 메시지 수신 시 콜백 함수
 */
export function useSubscribeToChatRoom(
  chatRoomId: string | null,
  onMessage: (message: WebSocketMessage) => void,
) {
  const { subscribe, isConnected } = useWebSocket()
  const onMessageRef = useRef(onMessage)

  // 최신 onMessage 콜백 유지
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!isConnected || !chatRoomId) {
      return
    }

    const destination = `/topic/chatroom/${chatRoomId}`

    const unsubscribe = subscribe(destination, (stompMessage: IMessage) => {
      try {
        const message = JSON.parse(stompMessage.body) as WebSocketMessage
        onMessageRef.current(message)
      }
      catch (error) {
        console.error('[WebSocket] Failed to parse message:', error)
      }
    })

    return unsubscribe
  }, [chatRoomId, isConnected, subscribe])
}

/**
 * 타이핑 이벤트 구독 Hook
 *
 * @param chatRoomId - 구독할 채팅방 ID
 * @param onTyping - 타이핑 이벤트 수신 시 콜백 함수
 */
export function useSubscribeToTyping(
  chatRoomId: string | null,
  onTyping: (event: TypingEvent) => void,
) {
  const { subscribe, isConnected } = useWebSocket()
  const onTypingRef = useRef(onTyping)

  useEffect(() => {
    onTypingRef.current = onTyping
  }, [onTyping])

  useEffect(() => {
    if (!isConnected || !chatRoomId) {
      return
    }

    const destination = `/topic/chatroom/${chatRoomId}/typing`

    const unsubscribe = subscribe(destination, (stompMessage: IMessage) => {
      try {
        const event = JSON.parse(stompMessage.body) as TypingEvent
        onTypingRef.current(event)
      }
      catch (error) {
        console.error('[WebSocket] Failed to parse typing event:', error)
      }
    })

    return unsubscribe
  }, [chatRoomId, isConnected, subscribe])
}

/**
 * 사용자별 메시지 구독 Hook (개인 메시지)
 *
 * @param userId - 현재 사용자 ID
 * @param onMessage - 메시지 수신 시 콜백 함수
 */
export function useSubscribeToUserMessages(
  userId: string | null,
  onMessage: (message: WebSocketMessage) => void,
) {
  const { subscribe, isConnected } = useWebSocket()
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!isConnected || !userId) {
      return
    }

    const destination = `/user/${userId}/queue/messages`

    const unsubscribe = subscribe(destination, (stompMessage: IMessage) => {
      try {
        const message = JSON.parse(stompMessage.body) as WebSocketMessage
        onMessageRef.current(message)
      }
      catch (error) {
        console.error('[WebSocket] Failed to parse user message:', error)
      }
    })

    return unsubscribe
  }, [userId, isConnected, subscribe])
}
