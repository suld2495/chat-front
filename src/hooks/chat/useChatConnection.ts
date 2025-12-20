import { useEffect } from 'react'

import { useChatStore } from '@/stores/chat'

export function useChatConnection() {
  const isInitialized = useChatStore(state => state.isInitialized)
  const conversationId = useChatStore(state => state.conversationId)
  const error = useChatStore(state => state.error)
  const init = useChatStore(state => state.init)
  useEffect(() => {
    if (!isInitialized) {
      init()
    }
  }, [init, isInitialized])

  return {
    isInitialized,
    conversationId,
    error,
  }
}
