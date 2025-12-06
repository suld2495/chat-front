// stores/useChatStore.ts
import { create } from 'zustand'

import type {
  ConnectionOptions,
  MessagingClient,
  MessagingPayload,
  Subscription,
} from '@/lib/messaging/clients/types'
import type { Message, SenderMessage } from '@/services/chat/types'

import { StompAdapter } from '@/lib/messaging/clients/stomp.adapter'
import { SockJSTransport } from '@/lib/messaging/transports/sockjs.adapter'

interface ChatState {
  client: MessagingClient | null
  isConnected: boolean
  error: Error | null
  subscriptions: Map<string, Subscription>

  connect: (url: string, options?: ConnectionOptions) => void
  disconnect: () => void
  subscribe: (destination: string, callback: (message: Message) => void) => void
  unsubscribe: (destination: string) => void
  publish: (destination: string, body: SenderMessage) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  client: null,
  isConnected: false,
  error: null,
  subscriptions: new Map(),

  connect: (url, options) => {
    const { client: existingClient } = get()

    if (existingClient)
      return

    const transport = new SockJSTransport()
    const client = new StompAdapter(transport)

    client.onConnect(() => {
      set({ isConnected: true, error: null })
    })

    client.onDisconnect(() => {
      set({ isConnected: false })
    })

    client.onError((error) => {
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
    })
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

  publish: (destination: string, body: SenderMessage) => {
    const { client, isConnected } = get()
    if (!client || !isConnected)
      return

    client.publish(destination, body)
  },
}))
