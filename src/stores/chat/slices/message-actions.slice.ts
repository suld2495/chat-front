import type { StateCreator } from 'zustand'

import { sendChatMessageStream } from '@/lib/api/chat'

import type { ChatState, MessageActionsSlice } from '../types'

export const createMessageActionsSlice: StateCreator<
  ChatState,
  [],
  [],
  MessageActionsSlice
> = (set, get) => ({
  isStreaming: false,

  /**
   * 메시지 전송 (HTTP 스트리밍)
   */
  sendMessage: (content, callbacks) => {
    const { isInitialized, isStreaming } = get()

    if (!isInitialized) {
      callbacks.onError(new Error('Chat is not initialized'))
      return
    }

    if (isStreaming) {
      callbacks.onError(new Error('Already streaming'))
      return
    }

    set({ isStreaming: true })

    sendChatMessageStream(content, {
      onChunk: callbacks.onChunk,
      onComplete: (fullText) => {
        set({ isStreaming: false })
        callbacks.onComplete(fullText)
      },
      onError: (error) => {
        set({ isStreaming: false, error })
        callbacks.onError(error)
      },
    })
  },
})
