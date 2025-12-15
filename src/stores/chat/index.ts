import { create } from 'zustand'

import type { ChatState } from './types'

import {
  createConnectionSlice,
  createConversationSlice,
  createMessageActionsSlice,
  createSubscriptionSlice,
} from './slices'

/**
 * - ConnectionSlice: 웹소켓 연결 상태 관리
 * - ConversationSlice: 대화 상태 및 초기화
 * - MessageActionsSlice: 메시지 전송 액션들
 * - SubscriptionSlice: 채널 구독 관리
 */
export const useChatStore = create<ChatState>()((...args) => ({
  ...createConnectionSlice(...args),
  ...createConversationSlice(...args),
  ...createMessageActionsSlice(...args),
  ...createSubscriptionSlice(...args),
}))

export type {
  ChatState,
  ConnectionSlice,
  ConversationSlice,
  MessageActionsSlice,
  SubscriptionSlice,
  Unsubscriber,
} from './types'
