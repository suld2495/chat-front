import { memo } from 'react'

import type { Message } from '@/services/chat/types'

import { ChatMessage } from './ChatMessage'

interface ChatMessageListProps {
  messages: Message[]
  isSearchOpen: boolean
  executedQuery: string
  currentMatchId: string | null
  matchedMessageIdSet: Set<string>
  onAnimationTick?: () => void
  onAnimationEnd?: () => void
  onRetryMessage?: (tempMessageId: string) => void
}

export const ChatMessageList = memo(({
  messages,
  isSearchOpen,
  executedQuery,
  currentMatchId,
  matchedMessageIdSet,
  onAnimationTick,
  onAnimationEnd,
  onRetryMessage,
}: ChatMessageListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map(message => (
        <ChatMessage
          key={message.messageId}
          message={message}
          animate={message.animate}
          onAnimationTick={message.animate ? onAnimationTick : undefined}
          onAnimationEnd={message.animate ? onAnimationEnd : undefined}
          onRetryMessage={onRetryMessage}
          searchQuery={isSearchOpen ? executedQuery : ''}
          isCurrentMatch={currentMatchId === message.messageId}
          isMatched={matchedMessageIdSet.has(message.messageId)}
        />
      ))}
    </div>
  )
})

ChatMessageList.displayName = 'ChatMessageList'
