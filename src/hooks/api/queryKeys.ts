export const queryKeys = {
  users: {
    all: () => ['users'] as const,
    detail: (userId: string) => ['users', 'detail', userId] as const,
    email: (email: string) => ['users', 'email', email] as const,
    search: (keyword: string) => ['users', 'search', keyword] as const,
  },
  chatrooms: {
    all: () => ['chatrooms'] as const,
    detail: (chatRoomId: string) => ['chatrooms', 'detail', chatRoomId] as const,
    byUser: (userId: string) => ['chatrooms', 'user', userId] as const,
    unread: (userId: string) => ['chatrooms', 'user', userId, 'unread'] as const,
    unreadCount: (userId: string) => ['chatrooms', 'user', userId, 'unread-count'] as const,
  },
  messages: {
    room: (chatRoomId: string) => ['messages', 'chatroom', chatRoomId] as const,
    list: (
      chatRoomId: string,
      params: { userId: string, page?: number, size?: number },
    ) => ['messages', 'chatroom', chatRoomId, 'list', { ...params }] as const,
    since: (
      chatRoomId: string,
      params: { userId: string, since: string },
    ) => ['messages', 'chatroom', chatRoomId, 'since', { ...params }] as const,
    unread: (
      chatRoomId: string,
      params: { userId: string },
    ) => ['messages', 'chatroom', chatRoomId, 'unread', { ...params }] as const,
    unreadCount: (
      chatRoomId: string,
      params: { userId: string },
    ) => ['messages', 'chatroom', chatRoomId, 'unread-count', { ...params }] as const,
  },
}
