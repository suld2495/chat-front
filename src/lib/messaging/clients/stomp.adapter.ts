import type { IMessage, StompSubscription } from '@stomp/stompjs'

import { Client } from '@stomp/stompjs'

import type { Message } from '@/services/chat/types'

import type { Transport } from '../transports/types'
import type {
  ConnectionOptions,
  MessagingClient,
  MessagingPayload,
  Subscription,
} from './types'

export class StompAdapter implements MessagingClient {
  private client: Client | null = null
  private subscriptions: Map<string, StompSubscription> = new Map()
  private transport: Transport

  private connectCallback?: () => void
  private errorCallback?: (error: Error) => void
  private disconnectCallback?: () => void

  constructor(transport: Transport) {
    this.transport = transport
  }

  connect(url: string, options: ConnectionOptions = {}): void {
    // SockJS Transport의 에러를 STOMP 에러 콜백으로 전달
    this.transport.onError((error) => {
      console.error('[STOMP] Transport error:', error)
      this.errorCallback?.(error)
    })

    this.client = new Client({
      webSocketFactory: () => this.transport.getConnection(url) as WebSocket,

      connectHeaders: options.headers,

      // 재연결 설정 (개발 중에는 0으로 설정하여 자동 재연결 비활성화 가능)
      reconnectDelay: options.reconnect?.delay ?? 5000,

      heartbeatIncoming: options.heartbeat?.incoming ?? 10000,
      heartbeatOutgoing: options.heartbeat?.outgoing ?? 10000,

      onConnect: () => {
        this.connectCallback?.()
      },

      onStompError: (frame) => {
        console.error('[STOMP] STOMP protocol error:', frame.headers.message)
        this.errorCallback?.(new Error(frame.headers.message || 'STOMP Error'))
      },

      onDisconnect: () => {
        this.disconnectCallback?.()
      },

      onWebSocketError: (event) => {
        console.error('[STOMP] WebSocket error:', event)
        this.errorCallback?.(new Error('WebSocket Error'))
      },
    })

    this.client?.activate()
  }

  disconnect(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.subscriptions.clear()
    this.client?.deactivate()
    this.transport?.disconnect()
  }

  subscribe(
    destination: string,
    callback: (message: MessagingPayload) => void,
  ): Subscription {
    if (!this.client?.connected) {
      throw new Error('Client is not connected')
    }

    const stompSubscription = this.client.subscribe(destination, (frame: IMessage) => {
      const message = this.convertToMessage(frame)
      callback(message)
    })

    this.subscriptions.set(stompSubscription.id, stompSubscription)

    return {
      id: stompSubscription.id,
      destination,
      unsubscribe: () => {
        stompSubscription.unsubscribe()
        this.subscriptions.delete(stompSubscription.id)
      },
    }
  }

  publish(destination: string, body: unknown): void {
    if (!this.client?.connected) {
      throw new Error('Client is not connected')
    }

    this.client.publish({
      destination,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  }

  onConnect(callback: () => void): void {
    this.connectCallback = callback
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback
  }

  onDisconnect(callback: () => void): void {
    this.disconnectCallback = callback
  }

  /**
   * STOMP 메시지를 공통 Message 타입으로 변환
   * WebSocket API 명세의 MessageReceived → Message 변환
   */
  private convertToMessage(frame: IMessage): MessagingPayload {
    let body: Message

    try {
      // WebSocket API 명세에 따른 메시지 파싱
      const parsed = JSON.parse(frame.body)

      // MessageReceived 타입의 경우 Message로 변환
      if (parsed.type === 'message') {
        body = {
          messageId: parsed.messageId,
          conversationId: parsed.conversationId,
          content: parsed.content,
          messageType: parsed.messageType,
          senderType: parsed.senderType,
          senderId: parsed.senderId,
          senderName: parsed.senderName,
          fileInfo: parsed.fileInfo,
          templateInfo: parsed.templateInfo,
          read: parsed.read,
          readAt: parsed.readAt,
          aiGenerated: parsed.aiGenerated,
          aiConfidence: parsed.aiConfidence,
          metadata: parsed.metadata,
          createdAt: parsed.createdAt,
        }
      }
      // ConnectedMessage의 recentMessages 배열도 처리
      else if (Array.isArray(parsed)) {
        body = parsed[0] || this.createDefaultMessage(frame.body)
      }
      // 기타 메시지는 그대로 사용 (타입 체크 우회)
      else {
        body = parsed as Message
      }
    }
    catch {
      // 파싱 실패 시 기본 메시지 생성
      body = this.createDefaultMessage(frame.body)
    }

    return {
      id: frame.headers['message-id'] || crypto.randomUUID(),
      destination: frame.headers.destination || '',
      headers: frame.headers as Record<string, string>,
      body,
      timestamp: Date.now(),
    }
  }

  /**
   * 기본 메시지 생성 (파싱 실패 시)
   */
  private createDefaultMessage(content: string): Message {
    return {
      messageId: crypto.randomUUID(),
      content,
      messageType: 'TEXT',
      senderType: 'SYSTEM',
      senderId: 'system',
      senderName: 'System',
      createdAt: new Date().toISOString(),
    }
  }
}
