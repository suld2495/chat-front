import { create } from 'zustand'

import type { ChatState } from './types'

import {
  createConversationSlice,
  createMessageActionsSlice,
} from './slices'

/**
 * Chat Store
 * - ConversationSlice: 대화 상태 및 초기화
 * - MessageActionsSlice: 메시지 전송 (HTTP 스트리밍)
 */
export const useChatStore = create<ChatState>()((...args) => ({
  ...createConversationSlice(...args),
  ...createMessageActionsSlice(...args),
}))

export type {
  ChatState,
  ConversationSlice,
  MessageActionsSlice,
} from './types'
