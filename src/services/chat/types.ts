export interface ChatRoom {
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

// TODO
export interface Message {
  id: string
  content: string
  sender: {
    id: 'user' | 'agent' | 'a151e11d-afaa-41cd-96c6-e86407a7de3d'
  }
  senderId: string
  createdAt: string
  messageType: 'TEXT' | 'FILE' | 'LOADING'
  fileName?: string
  avatar?: string
  senderName?: string
  animate?: boolean
}

export interface SenderMessage {
  messageId?: string
  id?: string
  chatRoomId: string
  senderId: string
  senderNickname?: string
  content: string
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM' | 'LOADING'
  chatMessageType?: 'CHAT' | string
  createdAt?: string
  timestamp?: string
}
