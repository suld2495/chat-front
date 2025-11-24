import { apiClient } from './client'

export interface ChatRoom {
  id: string
  userId?: string
  lastMessage?: unknown
  unreadCount?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export interface CreateChatRoomRequest {
  userId: string
}

export interface MarkChatRoomReadRequest {
  userId: string
}

export interface UnreadCountResponse {
  unreadCount: number
  [key: string]: unknown
}

export function createChatRoom(data: CreateChatRoomRequest) {
  return apiClient.post<ChatRoom>('/api/chatrooms', data)
}

export function getChatRoom(chatRoomId: string) {
  return apiClient.get<ChatRoom>(`/api/chatrooms/${chatRoomId}`)
}

export function getChatRoomsByUser(userId: string) {
  return apiClient.get<ChatRoom[]>(`/api/chatrooms/user/${userId}`)
}

export function getChatRoomsWithUnread(userId: string) {
  return apiClient.get<ChatRoom[]>(`/api/chatrooms/user/${userId}/unread`)
}

export function getUnreadChatRoomCount(userId: string) {
  return apiClient.get<UnreadCountResponse>(`/api/chatrooms/user/${userId}/unread-count`)
}

export function markChatRoomRead(chatRoomId: string, data: MarkChatRoomReadRequest) {
  return apiClient.patch<void>(`/api/chatrooms/${chatRoomId}/read`, data)
}
