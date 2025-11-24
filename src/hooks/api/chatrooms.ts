import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  ChatRoom,
  CreateChatRoomRequest,
  MarkChatRoomReadRequest,
  UnreadCountResponse,
} from '@/api'

import {

  createChatRoom,

  getChatRoom,
  getChatRoomsByUser,
  getChatRoomsWithUnread,
  getUnreadChatRoomCount,
  markChatRoomRead,

} from '@/api'

import { queryKeys } from './queryKeys'

export function useChatRoom(chatRoomId?: string) {
  return useQuery<ChatRoom>({
    queryKey: chatRoomId ? queryKeys.chatrooms.detail(chatRoomId) : queryKeys.chatrooms.detail(''),
    queryFn: () => getChatRoom(chatRoomId!),
    enabled: Boolean(chatRoomId),
  })
}

export function useUserChatRooms(userId?: string) {
  return useQuery<ChatRoom[]>({
    queryKey: userId ? queryKeys.chatrooms.byUser(userId) : queryKeys.chatrooms.byUser(''),
    queryFn: () => getChatRoomsByUser(userId!),
    enabled: Boolean(userId),
  })
}

export function useUserUnreadChatRooms(userId?: string) {
  return useQuery<ChatRoom[]>({
    queryKey: userId ? queryKeys.chatrooms.unread(userId) : queryKeys.chatrooms.unread(''),
    queryFn: () => getChatRoomsWithUnread(userId!),
    enabled: Boolean(userId),
  })
}

export function useUserUnreadChatRoomCount(userId?: string) {
  return useQuery<UnreadCountResponse>({
    queryKey: userId ? queryKeys.chatrooms.unreadCount(userId) : queryKeys.chatrooms.unreadCount(''),
    queryFn: () => getUnreadChatRoomCount(userId!),
    enabled: Boolean(userId),
  })
}

export function useCreateChatRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateChatRoomRequest) => createChatRoom(data),
    onSuccess: (chatRoom, variables) => {
      queryClient.setQueryData(queryKeys.chatrooms.detail(chatRoom.id), chatRoom)
      queryClient.invalidateQueries({ queryKey: queryKeys.chatrooms.byUser(variables.userId), exact: false })
    },
  })
}

export function useMarkChatRoomRead(chatRoomId?: string, userId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MarkChatRoomReadRequest) => markChatRoomRead(chatRoomId!, data),
    onSuccess: (_, variables) => {
      const readerId = variables.userId
      if (!readerId || !chatRoomId)
        return

      queryClient.invalidateQueries({ queryKey: queryKeys.chatrooms.byUser(readerId), exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.chatrooms.unread(readerId), exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.chatrooms.unreadCount(readerId), exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.room(chatRoomId), exact: false })
    },
    meta: { chatRoomId, userId },
  })
}
