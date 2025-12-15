// hooks/chat/useChatConnection.ts
import { useEffect, useRef } from 'react'

import { apiUrl, hospitalId } from '@/lib/const'
import { WS_ENDPOINT } from '@/lib/websocket/const'
import { useChatStore } from '@/stores/chat'

const wsEndpoint = apiUrl + WS_ENDPOINT

export interface ChatConnectionOptions {
  /**
   * 네트워크 재연결 성공 시 호출되는 콜백
   * - 소실된 메시지 복구 등의 처리에 사용
   * - TODO: 백엔드와 협의 후 구현 필요
   */
  onReconnect?: () => void
}

/**
 * 채팅 연결 관리 훅
 * - WebSocket 연결/해제
 * - 대화 초기화
 * - 연결 상태 제공
 * - 재연결 감지
 */
export function useChatConnection(options: ChatConnectionOptions = {}) {
  const { onReconnect } = options

  const isConnected = useChatStore(state => state.isConnected)
  const closed = useChatStore(state => state.closed)
  const conversationId = useChatStore(state => state.conversationId)
  const error = useChatStore(state => state.error)
  const hasConnectedOnce = useChatStore(state => state.hasConnectedOnce)
  const connect = useChatStore(state => state.connect)
  const disconnect = useChatStore(state => state.disconnect)
  const init = useChatStore(state => state.init)

  // 이전 연결 상태 추적 (재연결 감지용)
  const wasDisconnectedRef = useRef(false)

  // WebSocket 연결 관리
  useEffect(() => {
    if (!closed && !isConnected) {
      connect(wsEndpoint)
    }

    return () => {
      if (isConnected) {
        disconnect()
      }
    }
  }, [closed, connect, disconnect, isConnected])

  // 재연결 감지
  useEffect(() => {
    // 연결이 끊어진 상태 기록
    if (hasConnectedOnce && !isConnected && error) {
      wasDisconnectedRef.current = true
    }

    // 재연결 성공 감지: 이전에 끊어졌었고, 지금 연결됨
    if (wasDisconnectedRef.current && isConnected && !error) {
      wasDisconnectedRef.current = false
      onReconnect?.()
    }
  }, [isConnected, error, hasConnectedOnce, onReconnect])

  // 초기 대화 로드
  useEffect(() => {
    if (!closed && isConnected && !conversationId) {
      init(
        hospitalId,
        {
          name: '방문자',
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        },
      )
    }
  }, [isConnected, conversationId, init, closed])

  return {
    isConnected,
    conversationId,
    error,
    hasConnectedOnce,
  }
}
