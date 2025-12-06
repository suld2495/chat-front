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
    this.client = new Client({
      webSocketFactory: () => this.transport.getConnection(url) as WebSocket,

      connectHeaders: options.headers,

      reconnectDelay: options.reconnect?.delay ?? 5000,

      heartbeatIncoming: options.heartbeat?.incoming ?? 10000,
      heartbeatOutgoing: options.heartbeat?.outgoing ?? 10000,

      onConnect: () => {
        this.connectCallback?.()
      },

      onStompError: (frame) => {
        this.errorCallback?.(new Error(frame.headers.message || 'STOMP Error'))
      },

      onDisconnect: () => {
        this.disconnectCallback?.()
      },

      onWebSocketError: () => {
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

  // STOMP 메시지를 공통 Message 타입으로 변환
  private convertToMessage(frame: IMessage): MessagingPayload {
    let body: Message

    try {
      body = JSON.parse(frame.body) as Message
    }
    catch {
      body = {
        id: crypto.randomUUID(),
        content: frame.body,
        sender: { id: 'agent' },
        createdAt: '',
        messageType: 'TEXT',
        senderId: '',
      }
    }

    return {
      id: frame.headers['message-id'] || crypto.randomUUID(),
      destination: frame.headers.destination || '',
      headers: frame.headers as Record<string, string>,
      body,
      timestamp: Date.now(),
    }
  }
}
