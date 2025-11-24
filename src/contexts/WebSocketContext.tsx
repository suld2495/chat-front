import type { IMessage } from '@stomp/stompjs'
import type { ReactNode } from 'react'

import { Client } from '@stomp/stompjs'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import SockJS from 'sockjs-client'

import type {
  TypingEvent,
  WebSocketConnectionStatusValue,
  WebSocketMessage,
} from '@/types/websocket'

import { WebSocketConnectionStatus } from '@/types/websocket'

interface WebSocketContextValue {
  status: WebSocketConnectionStatusValue
  isConnected: boolean
  connect: (userId: string) => void
  disconnect: () => void
  subscribe: (
    destination: string,
    callback: (message: IMessage) => void,
  ) => () => void
  sendMessage: (message: WebSocketMessage) => void
  sendTypingEvent: (event: TypingEvent) => void
}

export const WebSocketContext = createContext<WebSocketContextValue | null>(null)

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [status, setStatus] = useState<WebSocketConnectionStatusValue>(
    WebSocketConnectionStatus.DISCONNECTED,
  )
  const clientRef = useRef<Client | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  const wsEndpoint = import.meta.env.VITE_WS_ENDPOINT || 'http://localhost:8080/ws'

  // 연결 함수
  const connect = useCallback(
    (userId: string) => {
      if (clientRef.current?.connected) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[WebSocket] Already connected')
        }
        return
      }

      setCurrentUserId(userId)
      setStatus(WebSocketConnectionStatus.CONNECTING)

      const client = new Client({
        webSocketFactory: () => new SockJS(wsEndpoint),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[STOMP Debug]', str)
          }
        },
        onConnect: () => {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[WebSocket] Connected')
          }
          setStatus(WebSocketConnectionStatus.CONNECTED)
        },
        onStompError: (frame) => {
          console.error('[WebSocket] STOMP Error:', frame)
          setStatus(WebSocketConnectionStatus.ERROR)
        },
        onWebSocketClose: () => {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('[WebSocket] Connection closed')
          }
          setStatus(WebSocketConnectionStatus.DISCONNECTED)
        },
        onWebSocketError: (event) => {
          console.error('[WebSocket] Error:', event)
          setStatus(WebSocketConnectionStatus.ERROR)
        },
      })

      client.activate()
      clientRef.current = client
    },
    [wsEndpoint],
  )

  // 연결 해제 함수
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (clientRef.current) {
      clientRef.current.deactivate()
      clientRef.current = null
      setStatus(WebSocketConnectionStatus.DISCONNECTED)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[WebSocket] Disconnected')
      }
    }
  }, [])

  // 구독 함수
  const subscribe = useCallback(
    (destination: string, callback: (message: IMessage) => void) => {
      if (!clientRef.current?.connected) {
        if (import.meta.env.DEV) {
          console.warn('[WebSocket] Cannot subscribe: not connected')
        }
        return () => {}
      }

      const subscription = clientRef.current.subscribe(destination, callback)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(`[WebSocket] Subscribed to ${destination}`)
      }

      return () => {
        subscription.unsubscribe()
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log(`[WebSocket] Unsubscribed from ${destination}`)
        }
      }
    },
    [],
  )

  // 메시지 전송 함수
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (!clientRef.current?.connected) {
      console.error('[WebSocket] Cannot send message: not connected')
      return
    }

    clientRef.current.publish({
      destination: `/app/chat/${message.chatRoomId}`,
      body: JSON.stringify(message),
    })

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[WebSocket] Message sent:', message)
    }
  }, [])

  // 타이핑 이벤트 전송 함수
  const sendTypingEvent = useCallback((event: TypingEvent) => {
    if (!clientRef.current?.connected) {
      return
    }

    clientRef.current.publish({
      destination: `/app/typing/${event.chatRoomId}`,
      body: JSON.stringify(event),
    })

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[WebSocket] Typing event sent:', event)
    }
  }, [])

  // 자동 재연결 로직
  useEffect(() => {
    if (status === WebSocketConnectionStatus.ERROR && currentUserId) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[WebSocket] Attempting to reconnect in 5 seconds...')
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        connect(currentUserId)
      }, 5000)
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [status, currentUserId, connect])

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  const isConnected = status === WebSocketConnectionStatus.CONNECTED

  const value = useMemo(
    () => ({
      status,
      isConnected,
      connect,
      disconnect,
      subscribe,
      sendMessage,
      sendTypingEvent,
    }),
    [status, isConnected, connect, disconnect, subscribe, sendMessage, sendTypingEvent],
  )

  return (
    <WebSocketContext value={value}>{children}</WebSocketContext>
  )
}
