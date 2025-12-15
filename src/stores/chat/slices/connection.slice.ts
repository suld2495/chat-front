// stores/chat/slices/connection.slice.ts
import type { StateCreator } from 'zustand'

import { StompAdapter } from '@/lib/messaging/clients/stomp.adapter'
import { SockJSTransport } from '@/lib/messaging/transports/sockjs.adapter'
import { subscriptionManager } from '@/lib/websocket/subscription-manager'

import type { ChatState, ConnectionSlice } from '../types'

export const createConnectionSlice: StateCreator<
  ChatState,
  [],
  [],
  ConnectionSlice
> = (set, get) => ({
  isConnected: false,
  closed: false,
  error: null,
  hasConnectedOnce: false,

  connect: (url, options) => {
    const existingClient = subscriptionManager.getClient()
    if (existingClient) {
      subscriptionManager.dispose()
      existingClient.disconnect()
    }

    set({ error: null, closed: false })

    const transport = new SockJSTransport()
    const client = new StompAdapter(transport)

    client.onConnect(() => {
      set({
        isConnected: true,
        error: null,
        hasConnectedOnce: true,
      })
    })

    client.onDisconnect(() => {
      set({ isConnected: false, closed: true })
    })

    client.onError((error) => {
      console.error('[ChatStore] Error occurred:', error)
      set({ error })
    })

    client.connect(url, options)
    subscriptionManager.setClient(client)
  },

  disconnect: () => {
    const client = subscriptionManager.getClient()

    subscriptionManager.dispose()
    client?.disconnect()

    get().resetConversation()

    set({
      isConnected: false,
      closed: true,
    })
  },
})
