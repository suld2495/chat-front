import type {
  Message,
  MessagesPage,
  ReadMessageRequest,
  SendMessageRequest,
  UnreadCountResponse,
} from '@/api'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  deleteMessage,
  getMessages,
  getMessagesSince,
  getUnreadMessageCount,
  getUnreadMessages,
  markAllMessagesRead,
  markMessageRead,

  sendMessage,

} from '@/api'
import { queryKeys } from './queryKeys'

interface MessageListParams extends ReadMessageRequest {
  page?: number
  size?: number
}

interface SinceParams extends ReadMessageRequest {
  since: string
}

interface MarkMessageReadVariables extends ReadMessageRequest {
  messageId: string
  chatRoomId: string
}

interface DeleteMessageVariables extends ReadMessageRequest {
  messageId: string
  chatRoomId: string
}

export function useChatRoomMessages(
  chatRoomId?: string,
  params?: MessageListParams,
) {
  const normalized = {
    page: params?.page ?? 0,
    size: params?.size ?? 20,
    userId: params?.userId ?? '',
  }

  return useQuery<MessagesPage>({
    queryKey: chatRoomId
      ? queryKeys.messages.list(chatRoomId, normalized)
      : queryKeys.messages.list('', normalized),
    queryFn: () => getMessages(chatRoomId!, normalized),
    enabled: Boolean(chatRoomId && normalized.userId),
    placeholderData: keepPreviousData,
  })
}

export function useChatRoomMessagesSince(
  chatRoomId?: string,
  params?: SinceParams,
) {
  const normalized = {
    userId: params?.userId ?? '',
    since: params?.since ?? '',
  }

  return useQuery<Message[]>({
    queryKey: chatRoomId
      ? queryKeys.messages.since(chatRoomId, normalized)
      : queryKeys.messages.since('', normalized),
    queryFn: () => getMessagesSince(chatRoomId!, normalized),
    enabled: Boolean(chatRoomId && normalized.userId && normalized.since),
  })
}

export function useUnreadMessages(chatRoomId?: string, params?: ReadMessageRequest) {
  const normalized = { userId: params?.userId ?? '' }

  return useQuery<Message[]>({
    queryKey: chatRoomId
      ? queryKeys.messages.unread(chatRoomId, normalized)
      : queryKeys.messages.unread('', normalized),
    queryFn: () => getUnreadMessages(chatRoomId!, normalized),
    enabled: Boolean(chatRoomId && normalized.userId),
  })
}

export function useUnreadMessageCount(chatRoomId?: string, params?: ReadMessageRequest) {
  const normalized = { userId: params?.userId ?? '' }

  return useQuery<UnreadCountResponse>({
    queryKey: chatRoomId
      ? queryKeys.messages.unreadCount(chatRoomId, normalized)
      : queryKeys.messages.unreadCount('', normalized),
    queryFn: () => getUnreadMessageCount(chatRoomId!, normalized),
    enabled: Boolean(chatRoomId && normalized.userId),
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendMessageRequest) => sendMessage(data),
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.room(message.chatRoomId),
        exact: false,
      })
    },
  })
}

export function useMarkMessageRead(chatRoomId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: MarkMessageReadVariables) => markMessageRead(variables.messageId, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.room(variables.chatRoomId),
        exact: false,
      })
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chatrooms.byUser(variables.userId),
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.chatrooms.unread(variables.userId),
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.chatrooms.unreadCount(variables.userId),
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.unreadCount(variables.chatRoomId, { userId: variables.userId }),
          exact: false,
        })
      }
    },
    meta: { chatRoomId },
  })
}

export function useMarkAllMessagesRead(chatRoomId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: ReadMessageRequest) => markAllMessagesRead(chatRoomId!, variables),
    onSuccess: (_, variables) => {
      if (!chatRoomId)
        return
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.room(chatRoomId),
        exact: false,
      })
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chatrooms.byUser(variables.userId),
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.chatrooms.unread(variables.userId),
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.chatrooms.unreadCount(variables.userId),
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.unreadCount(chatRoomId, { userId: variables.userId }),
          exact: false,
        })
      }
    },
    meta: { chatRoomId },
  })
}

export function useDeleteMessage(chatRoomId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: DeleteMessageVariables) => deleteMessage(variables.messageId, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.room(variables.chatRoomId),
        exact: false,
      })
    },
    meta: { chatRoomId },
  })
}
