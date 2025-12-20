import {
  useCallback,
  useEffect,
  useRef,
} from 'react'

import type { Message } from '@/services/chat/types'

import { useMessageSearch } from '@/hooks/useMessageSearch'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat'

import { Typography } from '../ui/typography'
import { ChatMessage } from './ChatMessage'
import { ChatMessageList } from './ChatMessageList'
import { SystemMessage } from './message'
import { MessageSearchBar } from './MessageSearchBar'

const content = `
안녕하세요.
저는 AI봇 밝음이 입니다.
검사, 수술, 예약 등 궁금하신 내용을 입력해 주세요.`.trim()

const emptyMessage: Message = {
  messageId: '0',
  content,
  senderType: 'AGENT',
  senderId: 'agent',
  senderName: 'Agent',
  createdAt: '2022-04-05 10:00:00',
  messageType: 'TEXT',
}

function InitialMessage() {
  return (
    <div className="flex flex-col gap-4">
      <ChatMessage message={emptyMessage} />
      <div className="px-5 mt-3">
        <div className="flex flex-col gap-1 px-5 py-3 rounded-md text-center border border-border-default">
          <Typography className="font-bold">[상담 안내 및 유의 사항]</Typography>
          <Typography>AI 상담은 기본 정보 제공용입니다.</Typography>
          <Typography
            color="inherit"
            className="typography-action-destructive"
          >
            정확한 진료 상담 및 비용, 수술 가능 여부는 반드시 병원에 직접 문의해주세요.
          </Typography>
        </div>
      </div>
    </div>
  )
}

interface ChatAreaProps {
  isNetworkDisconnected?: boolean
  onRetryMessage?: (tempMessageId: string) => void
}

export function ChatArea({
  isNetworkDisconnected,
  onRetryMessage,
}: ChatAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTimeRef = useRef<number>(0)
  const scrollRafRef = useRef<number | null>(null)

  const messages = useChatStore(s => s.messages)
  const search = useMessageSearch(messages)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        search.openSearch()
      }
    },
    [search],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container)
      return

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const scrollToBottom = useCallback((options: { smooth?: boolean, force?: boolean } = {}) => {
    const { smooth = false, force = false } = options

    if (!scrollRef.current)
      return

    if (!smooth) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'instant',
      })
      return
    }

    if (!force) {
      const now = Date.now()
      if (now - lastScrollTimeRef.current < 100)
        return
      lastScrollTimeRef.current = now
    }

    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current)
    }

    scrollRafRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
  }, [])

  const scrollToMessage = useCallback((messageId: string) => {
    const element = document.getElementById(`message-${messageId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const handleAnimationTick = useCallback(() => {
    scrollToBottom({ smooth: true })
  }, [scrollToBottom])

  const handleAnimationEnd = useCallback(() => {
    scrollToBottom({ smooth: true, force: true })
  }, [scrollToBottom])

  useEffect(() => {
    if (search.currentMatchId) {
      scrollToMessage(search.currentMatchId)
    }
  }, [search.currentMatchId, scrollToMessage])

  useEffect(() => {
    scrollToBottom({ smooth: true })
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isNetworkDisconnected) {
      scrollToBottom({ smooth: true })
    }
  }, [isNetworkDisconnected, scrollToBottom])

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-hidden outline-none"
      tabIndex={-1}
    >
      {search.isSearchOpen && <MessageSearchBar search={search} />}

      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden py-4',
          'bg-chat-widget',
        )}
      >
        {messages.length === 0
          ? <InitialMessage />
          : (
              <ChatMessageList
                messages={messages}
                isSearchOpen={search.isSearchOpen}
                executedQuery={search.executedQuery}
                currentMatchId={search.currentMatchId}
                matchedMessageIdSet={search.matchedMessageIdSet}
                onAnimationTick={handleAnimationTick}
                onAnimationEnd={handleAnimationEnd}
                onRetryMessage={onRetryMessage}
              />
            )}
        {isNetworkDisconnected && (
          <SystemMessage message="네트워크 연결이 해제되었습니다" />
        )}
      </div>
    </div>
  )
}
