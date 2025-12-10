// stores/useChatStore.ts
import { create } from 'zustand'

import type {
  ConnectionOptions,
  MessagingClient,
  MessagingPayload,
  Subscription,
} from '@/lib/messaging/clients/types'
import type {
  CloseRequest,
  ConnectedMessage,
  InitRequest,
  MessageType,
  ReadRequest,
  TypingRequest,
  VisitorInfo,
  WebSocketMessage,
} from '@/lib/websocket/types'
import type { Message, SenderMessage } from '@/services/chat/types'

import { StompAdapter } from '@/lib/messaging/clients/stomp.adapter'
import { SockJSTransport } from '@/lib/messaging/transports/sockjs.adapter'
import { CHANNELS, ENDPOINTS } from '@/lib/websocket/types'

interface ChatState {
  client: MessagingClient | null
  isConnected: boolean
  error: Error | null
  subscriptions: Map<string, Subscription>
  conversationId: string | null
  visitorId: string | null
  aiEnabled: boolean
  recentMessages: Message[]
  welcomeMessage: string | null

  connect: (url: string, options?: ConnectionOptions) => void
  disconnect: () => void
  init: (
    hospitalId: string,
    visitorId: string,
    visitorInfo?: VisitorInfo,
    onConnected?: (data: ConnectedMessage) => void,
  ) => void
  subscribe: (destination: string, callback: (message: Message) => void) => void
  unsubscribe: (destination: string) => void
  sendMessage: (
    content: string,
    messageType?: MessageType,
    fileInfo?: SenderMessage['fileInfo'],
  ) => void
  sendTyping: (isTyping: boolean) => void
  markAsRead: (messageId: string) => void
  closeConversation: (reason?: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  client: null,
  isConnected: false,
  error: null,
  subscriptions: new Map(),
  conversationId: null,
  visitorId: null,
  aiEnabled: false,
  recentMessages: [],
  welcomeMessage: null,

  connect: (url, options) => {
    const { client: existingClient } = get()

    if (existingClient) {
      return
    }

    const transport = new SockJSTransport()
    const client = new StompAdapter(transport)

    client.onConnect(() => {
      set({ isConnected: true, error: null })
    })

    client.onDisconnect(() => {
      set({ isConnected: false })
    })

    client.onError((error) => {
      console.error('[ChatStore] Error occurred:', error)
      set({ error })
    })

    client.connect(url, options)
    set({ client })
  },

  disconnect: () => {
    const { client, subscriptions } = get()

    subscriptions.forEach(sub => sub.unsubscribe())
    client?.disconnect()

    set({
      client: null,
      isConnected: false,
      subscriptions: new Map(),
      conversationId: null,
      visitorId: null,
      recentMessages: [],
      welcomeMessage: null,
    })
  },

  /**
   * 초기화 (대화 생성)
   * WebSocket API 명세: /app/widget/init
   */
  init: (hospitalId, visitorId, visitorInfo, onConnected) => {
    const { client, isConnected } = get()

    if (!client || !isConnected) {
      console.error('Client is not connected')
      return
    }

    // 임시 채널 ID 생성
    const tempId = `temp-${Date.now()}`

    // 임시 채널 구독 (초기화 응답 수신용)
    const tempChannel = CHANNELS.TEMP(tempId)
    client.subscribe(tempChannel, (message: MessagingPayload) => {
      const data = message.body as unknown as WebSocketMessage

      if (data.type === 'connected') {
        const connectedData = data as ConnectedMessage

        // conversationId 및 초기 메시지 저장
        set({
          conversationId: connectedData.conversationId,
          visitorId: connectedData.visitorId,
          aiEnabled: connectedData.aiEnabled,
          recentMessages: connectedData.recentMessages as Message[],
          welcomeMessage: connectedData.welcomeMessage,
        })

        // 대화 채널 구독
        const conversationChannel = CHANNELS.CONVERSATION(connectedData.conversationId)
        get().subscribe(conversationChannel, (msg) => {
          // 메시지는 외부에서 처리하도록 콜백 전달
        })

        // 에러 채널 구독
        get().subscribe(CHANNELS.ERROR, (errorMsg) => {
          console.error('Error received:', errorMsg)
        })

        // 초기화 완료 콜백 실행
        onConnected?.(connectedData)
      }
    })

    // 초기화 메시지 전송
    const initRequest: InitRequest = {
      hospitalId,
      visitorId,
      tempId,
      visitorInfo,
    }

    client.publish(ENDPOINTS.INIT, initRequest)
  },

  subscribe: (destination: string, callback: (message: Message) => void) => {
    const {
      client,
      isConnected,
      subscriptions,
    } = get()
    if (!client || !isConnected)
      return

    if (subscriptions.has(destination))
      return

    const subscription = client.subscribe(destination, (message: MessagingPayload) => {
      callback(message.body)
    })

    if (subscription) {
      const newSubscriptions = new Map(subscriptions)
      newSubscriptions.set(destination, subscription)
      set({ subscriptions: newSubscriptions })
    }
  },

  unsubscribe: (destination: string) => {
    const { subscriptions } = get()
    const subscription = subscriptions.get(destination)

    if (subscription) {
      subscription.unsubscribe()
      const newSubscriptions = new Map(subscriptions)
      newSubscriptions.delete(destination)
      set({ subscriptions: newSubscriptions })
    }
  },

  /**
   * 메시지 전송
   * WebSocket API 명세: /app/widget/message
   */
  sendMessage: (content, messageType = 'TEXT', fileInfo) => {
    const {
      client,
      isConnected,
      conversationId,
    } = get()

    if (!client || !isConnected) {
      console.error('Client is not connected')
      return
    }

    if (!conversationId) {
      console.error('Conversation ID is not set. Please initialize first.')
      return
    }

    const message: SenderMessage = {
      conversationId,
      content,
      messageType,
      fileInfo,
    }

    client.publish(ENDPOINTS.MESSAGE, message)
  },

  /**
   * 타이핑 상태 전송
   * WebSocket API 명세: /app/widget/typing
   */
  sendTyping: (isTyping) => {
    const {
      client,
      isConnected,
      conversationId,
    } = get()

    if (!client || !isConnected || !conversationId)
      return

    const typingRequest: TypingRequest = {
      conversationId,
      isTyping,
    }

    client.publish(ENDPOINTS.TYPING, typingRequest)
  },

  /**
   * 읽음 처리
   * WebSocket API 명세: /app/widget/read
   */
  markAsRead: (messageId) => {
    const {
      client,
      isConnected,
      conversationId,
    } = get()

    if (!client || !isConnected || !conversationId)
      return

    const readRequest: ReadRequest = {
      conversationId,
      messageId,
    }

    client.publish(ENDPOINTS.READ, readRequest)
  },

  /**
   * 대화 종료
   * WebSocket API 명세: /app/widget/close
   */
  closeConversation: (reason) => {
    const {
      client,
      isConnected,
      conversationId,
    } = get()

    if (!client || !isConnected || !conversationId)
      return

    const closeRequest: CloseRequest = {
      conversationId,
      closeReason: reason,
    }

    client.publish(ENDPOINTS.CLOSE, closeRequest)

    // 연결 해제
    get().disconnect()
  },
}))
