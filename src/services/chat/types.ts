import type { FileInfo, MessageType, SenderType } from '@/lib/websocket/types'

/**
 * 메시지 (WebSocket API 명세 기반)
 * MessageReceived 타입과 호환되며 UI 전용 필드 추가
 */
export interface Message {
  messageId: string
  conversationId?: string
  content: string
  messageType: MessageType
  senderType: SenderType
  senderId: string
  senderName: string
  fileInfo?: FileInfo
  templateInfo?: Record<string, unknown>
  read?: boolean
  readAt?: string
  aiGenerated?: boolean
  aiConfidence?: number
  metadata?: Record<string, unknown>
  createdAt: string
  // UI 전용 필드
  avatar?: string
  animate?: boolean
}

/**
 * 메시지 전송 요청
 * MessageSendRequest 타입과 호환
 */
export interface SenderMessage {
  conversationId: string
  content: string
  messageType?: MessageType
  fileInfo?: FileInfo
}
