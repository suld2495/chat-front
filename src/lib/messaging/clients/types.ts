import type {
  InitRequest,
  Message,
  SenderMessage,
} from '@/services/chat/types'

export interface ConnectionOptions {
  headers?: Record<string, string>

  // 재연결 설정
  reconnect?: {
    enabled: boolean
    maxAttempts?: number // 최대 재시도 횟수
    delay?: number // 재시도 간격 (ms)
    backoffMultiplier?: number // 재시도마다 delay 증가 배수
  }

  // 타임아웃
  connectTimeout?: number

  // 하트비트 (연결 유지 확인)
  heartbeat?: {
    outgoing: number // 클라이언트 → 서버 (ms)
    incoming: number // 서버 → 클라이언트 (ms)
  }
}

export interface Subscription {
  id: string
  destination: string
  unsubscribe: () => void
}

export interface MessagingClient {
  connect: (url: string, options?: ConnectionOptions) => void
  disconnect: () => void
  subscribe: (destination: string, callback: (message: MessagingPayload) => void) => Subscription
  publish: (destination: string, body: SenderMessage | InitRequest) => void
  onConnect: (callback: () => void) => void
  onError: (callback: (error: Error) => void) => void
}

export interface MessagingPayload {
  id: string
  destination: string
  headers: Record<string, string>
  body: Message
  timestamp: number
}
