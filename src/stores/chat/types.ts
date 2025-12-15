import type { ConnectionOptions } from '@/lib/messaging/clients/types'
import type {
  ConnectedMessage,
  Message,
  MessageType,
  SenderMessage,
  VisitorInfo,
} from '@/services/chat/types'

export type Unsubscriber = () => void

/**
 * 연결 상태 슬라이스
 */
export interface ConnectionSlice {
  isConnected: boolean
  closed: boolean
  error: Error | null
  hasConnectedOnce: boolean

  connect: (url: string, options?: ConnectionOptions) => void
  disconnect: () => void
}

/**
 * 대화 상태 슬라이스
 */
export interface ConversationSlice {
  conversationId: string | null
  aiEnabled: boolean
  recentMessages: Message[]
  welcomeMessage: string | null

  init: (
    hospitalId: string,
    visitorInfo?: VisitorInfo,
    onConnected?: (data: ConnectedMessage) => void,
  ) => void
  resetConversation: () => void
}

/**
 * 메시지 액션 슬라이스
 */
export interface MessageActionsSlice {
  sendMessage: (
    content: string,
    messageType?: MessageType,
    fileInfo?: SenderMessage['fileInfo'],
    tempMessageId?: string,
  ) => void
  sendTyping: (isTyping: boolean) => void
  markAsRead: (messageId: string) => void
  closeConversation: (reason?: string) => void
}

/**
 * 구독 관리 슬라이스
 */
export interface SubscriptionSlice {
  subscribe: (destination: string, callback: (message: Message) => void) => Unsubscriber
  unsubscribe: (destination: string) => void
}

/**
 * 전체 Chat Store 타입
 */
export type ChatState = ConnectionSlice & ConversationSlice & MessageActionsSlice & SubscriptionSlice
