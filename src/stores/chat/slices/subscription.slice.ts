// stores/chat/slices/subscription.slice.ts
import type { StateCreator } from 'zustand'

import { subscriptionManager } from '@/lib/websocket/subscription-manager'

import type { ChatState, SubscriptionSlice } from '../types'

export const createSubscriptionSlice: StateCreator<
  ChatState,
  [],
  [],
  SubscriptionSlice
> = (_set, get) => ({
  subscribe: (destination, callback) => {
    const { isConnected } = get()

    if (!isConnected) {
      return () => {}
    }

    return subscriptionManager.subscribe(destination, callback)
  },

  unsubscribe: (destination) => {
    subscriptionManager.unsubscribe(destination)
  },
})
