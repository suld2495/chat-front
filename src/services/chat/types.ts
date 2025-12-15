/**
 * 메시지 타입
 */
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'TEMPLATE' | 'SYSTEM' | 'LOADING'

/**
 * 발신자 타입
 */
export type SenderType = 'USER' | 'AGENT' | 'AI' | 'SYSTEM'

/**
 * WebSocket 메시지 타입 (서버 → 클라이언트)
 */
export type WebSocketMessageType
  = | 'connected'
    | 'message'
    | 'typing'
    | 'conversation_closed'
    | 'error'

/**
 * 파일 정보
 */
export interface FileInfo {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
}

/**
 * 방문자 정보
 */
export interface VisitorInfo {
  name?: string
  email?: string
  phone?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  location?: string
}

/**
 * 메시지 전송 상태
 */
export type MessageStatus = 'pending' | 'sent' | 'failed'

/**
 * 메시지
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
  read?: boolean
  createdAt: string
  // UI 전용 필드
  avatar?: string
  animate?: boolean
  tempMessageId?: string // 낙관적 업데이트를 위한 임시 메시지 ID
  status?: MessageStatus // 메시지 전송 상태 (사용자 메시지에만 적용)
}

/**
 * 메시지 전송 요청
 */
export interface SenderMessage {
  conversationId?: string
  content?: string
  messageType?: MessageType
  fileInfo?: FileInfo
  tempMessageId?: string // 낙관적 업데이트를 위한 임시 메시지 ID
}

// ============================================
// 요청 메시지 (클라이언트 → 서버)
// ============================================

/**
 * 초기화 요청
 * 엔드포인트: /app/widget/init
 */
export interface InitRequest {
  hospitalId: string
  visitorId: string | null
  tempId?: string
  visitorInfo?: VisitorInfo
}

/**
 * 메시지 전송 요청
 * 엔드포인트: /app/widget/message
 */
export interface MessageSendRequest {
  conversationId: string
  content: string
  messageType?: MessageType
  fileInfo?: FileInfo
}

/**
 * 타이핑 상태 전송
 * 엔드포인트: /app/widget/typing
 */
export interface TypingRequest {
  conversationId: string
  isTyping: boolean
}

/**
 * 읽음 처리
 * 엔드포인트: /app/widget/read
 */
export interface ReadRequest {
  conversationId: string
  messageId: string
}

/**
 * 대화 종료
 * 엔드포인트: /app/widget/close
 */
export interface CloseRequest {
  conversationId: string
  closeReason?: string
}

// ============================================
// 응답 메시지 (서버 → 클라이언트)
// ============================================

/**
 * 메시지 수신
 * type: 'message'
 */
export interface MessageReceived {
  type: 'message'
  messageId: string
  conversationId: string
  content: string
  messageType: MessageType
  senderType: SenderType
  senderId: string
  senderName: string
  fileInfo?: FileInfo
  read?: boolean
  createdAt: string
}

/**
 * 초기화 완료 (연결 성공)
 * type: 'connected'
 */
export interface ConnectedMessage {
  type: 'connected'
  conversationId: string
  visitorId: string
  welcomeMessage: string
  recentMessages: MessageReceived[]
  aiEnabled: boolean
}

/**
 * 타이핑 상태
 * type: 'typing'
 */
export interface TypingStatus {
  type: 'typing'
  conversationId: string
  senderType: SenderType
  senderName: string
  isTyping: boolean
}

/**
 * 대화 종료
 * type: 'conversation_closed'
 */
export interface ConversationClosed {
  type: 'conversation_closed'
  conversationId: string
  closedBy: string
  closeReason?: string
  message: string
}

/**
 * 에러 응답
 * type: 'error'
 */
export interface ErrorResponse {
  type: 'error'
  code: string
  message: string
}

/**
 * WebSocket 메시지 통합 타입
 */
export type WebSocketMessage
  = | ConnectedMessage
    | MessageReceived
    | TypingStatus
    | ConversationClosed
    | ErrorResponse
