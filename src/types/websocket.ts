/**
 * WebSocket 메시지 타입 정의
 */

export interface WebSocketMessage {
  messageId?: string
  id?: string
  chatRoomId: string
  senderId: string
  senderNickname?: string
  content: string
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
  chatMessageType?: 'CHAT' | string
  createdAt?: string
  timestamp?: string
}

export interface TypingEvent {
  chatRoomId: string
  userId: string
  isTyping: boolean
}

export interface ReadReceiptEvent {
  chatRoomId: string
  userId: string
  messageId: string
  readAt: string
}

export const WebSocketConnectionStatus = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
} as const

export type WebSocketConnectionStatusValue = typeof WebSocketConnectionStatus[keyof typeof WebSocketConnectionStatus]
