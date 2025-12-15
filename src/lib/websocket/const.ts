/**
 * WebSocket 연결 엔드포인트
 */
export const WS_ENDPOINT = '/ws/widget'

/**
 * 메시지 발신 엔드포인트 (클라이언트 → 서버)
 */
export const ENDPOINTS = {
  INIT: '/app/widget/init',
  MESSAGE: '/app/widget/message',
  TYPING: '/app/widget/typing',
  READ: '/app/widget/read',
  CLOSE: '/app/widget/close',
} as const

/**
 * 구독 채널 (서버 → 클라이언트)
 */
export const CHANNELS = {
  /** 임시 채널 (초기화 응답용) */
  TEMP: (tempId: string) => `/topic/widget/temp/${tempId}`,
  /** 대화 채널 */
  CONVERSATION: (conversationId: string) => `/topic/conversation/${conversationId}`,
  /** 개인 에러 채널 */
  ERROR: '/user/queue/reply',
} as const
