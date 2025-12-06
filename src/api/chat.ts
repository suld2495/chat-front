import type { ChatRoom } from '@/services/chat/types'

import { apiClient } from './client'

// TODO
export function fetchChatMessages(chatRoomId: string = '0e67fb87-10d3-4256-a887-443fe8583243') {
  return apiClient.get<ChatRoom>(`/api/messages/chatroom/${chatRoomId}?userId=a151e11d-afaa-41cd-96c6-e86407a7de3d`)
}
