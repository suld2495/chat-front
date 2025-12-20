import type { StreamCallbacks } from '@/lib/api/chat'
import type { Message } from '@/services/chat/types'

/**
 * 대화 상태 슬라이스
 */
export interface ConversationSlice {
  /** 현재 대화 ID */
  conversationId: string | null
  /** 환영 메시지 */
  welcomeMessage: string | null
  /** 에러 상태 */
  error: Error | null
  /** 초기화 여부 */
  isInitialized: boolean
  /** 메시지 목록 */
  messages: Message[]

  /** 대화 초기화 */
  init: () => void
  /** 대화 상태 리셋 */
  resetConversation: () => void
  /** 메시지 추가 */
  addMessage: (message: Message) => void
  /** 메시지 목록 초기화 */
  clearMessages: () => void
  /** 스트리밍 메시지 업데이트 */
  updateStreamingMessage: (messageId: string, content: string) => void
  /** 스트리밍 메시지 완료 */
  completeStreamingMessage: (messageId: string) => void
}

/**
 * 메시지 액션 슬라이스
 */
export interface MessageActionsSlice {
  /** 스트리밍 중 여부 */
  isStreaming: boolean

  /**
   * 메시지 전송 (스트리밍 응답)
   * @param content - 메시지 내용
   * @param callbacks - 스트리밍 콜백
   */
  sendMessage: (
    content: string,
    callbacks: StreamCallbacks,
  ) => void
}

/**
 * 전체 Chat Store 타입
 */
export type ChatState = ConversationSlice & MessageActionsSlice
