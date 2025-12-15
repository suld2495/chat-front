import {
  useCallback,
  useEffect,
  useRef,
} from 'react'

import type { Message } from '@/services/chat/types'

import { cn } from '@/lib/utils'

import { Typography } from '../ui/typography'
import { ChatMessage } from './ChatMessage'
import { SystemMessage } from './SystemMessage'

interface ChatAreaProps {
  messages: Message[]
  isNetworkDisconnected?: boolean
  onRetryMessage?: (tempMessageId: string) => void
}

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

export function ChatArea({
  messages,
  isNetworkDisconnected,
  onRetryMessage,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrollTimeRef = useRef<number>(0)
  const scrollRafRef = useRef<number | null>(null)

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
      ref={scrollRef}
      className={cn(
        'flex-1 overflow-y-auto py-4',
        'bg-chat-widget',
      )}
    >
      {messages.length === 0
        ? (
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
        : (
            <div className="flex flex-col gap-4">
              {messages.map(message => (
                <ChatMessage
                  key={message.messageId}
                  message={message}
                  animate={message.animate}
                  onAnimationTick={message.animate ? () => scrollToBottom({ smooth: true }) : undefined}
                  onAnimationEnd={message.animate ? () => scrollToBottom({ smooth: true, force: true }) : undefined}
                  onRetry={message.tempMessageId && onRetryMessage
                    ? () => onRetryMessage(message.tempMessageId!)
                    : undefined}
                />
              ))}
            </div>
          )}
      {isNetworkDisconnected && (
        <SystemMessage message="네트워크 연결이 해제되었습니다" />
      )}
    </div>
  )
}
