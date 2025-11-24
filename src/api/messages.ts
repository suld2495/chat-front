import { apiClient } from './client'
import { buildQuery } from './utils'

export interface Message {
  id: string
  chatRoomId: string
  sender?: {
    id: string
  }
  senderId?: string
  content: string
  messageType: string
  createdAt?: string
  readAt?: string | null
  [key: string]: unknown
}

export interface SendMessageRequest {
  chatRoomId: string
  senderId: string
  content: string
  messageType: string
}

export interface ListMessagesParams {
  userId: string
  page?: number
  size?: number
}

export interface ListMessagesSinceParams {
  userId: string
  since: string
}

export interface MessageUnreadCountResponse {
  unreadCount: number
  [key: string]: unknown
}

export interface MessagesPage {
  content: Message[]
  totalElements?: number
  totalPages?: number
  number?: number
  size?: number
  first?: boolean
  last?: boolean
  numberOfElements?: number
  empty?: boolean
  [key: string]: unknown
}

export interface ReadMessageRequest {
  userId: string
}

export function sendMessage(data: SendMessageRequest) {
  return apiClient.post<Message>('/api/messages', data)
}

export function getMessages(chatRoomId: string, params: ListMessagesParams) {
  const query = buildQuery(params)
  return apiClient.get<MessagesPage>(`/api/messages/chatroom/${chatRoomId}${query}`)
}

export function getMessagesSince(chatRoomId: string, params: ListMessagesSinceParams) {
  const query = buildQuery(params)
  return apiClient.get<Message[]>(`/api/messages/chatroom/${chatRoomId}/since${query}`)
}

export function getUnreadMessages(chatRoomId: string, params: ReadMessageRequest) {
  const query = buildQuery({ userId: params.userId })
  return apiClient.get<Message[]>(`/api/messages/chatroom/${chatRoomId}/unread${query}`)
}

export function getUnreadMessageCount(chatRoomId: string, params: ReadMessageRequest) {
  const query = buildQuery({ userId: params.userId })
  return apiClient.get<MessageUnreadCountResponse>(`/api/messages/chatroom/${chatRoomId}/unread-count${query}`)
}

export function markMessageRead(messageId: string, data: ReadMessageRequest) {
  return apiClient.patch<void>(`/api/messages/${messageId}/read`, { userId: data.userId })
}

export function markAllMessagesRead(chatRoomId: string, data: ReadMessageRequest) {
  return apiClient.patch<void>(`/api/messages/chatroom/${chatRoomId}/read-all`, { userId: data.userId })
}

export function deleteMessage(messageId: string, params: ReadMessageRequest) {
  const query = buildQuery({ userId: params.userId })
  return apiClient.delete<void>(`/api/messages/${messageId}${query}`)
}
