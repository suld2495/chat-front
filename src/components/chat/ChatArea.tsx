import {
  useCallback,
  useEffect,
  useRef,
} from 'react'

import type { Message } from '@/services/chat/types'

import { cn } from '@/lib/utils'

import { Typography } from '../ui/typography'
import { ChatMessage } from './ChatMessage'

interface ChatAreaProps {
  messages: Message[]
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

export function ChatArea({ messages }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

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
                  onAnimationTick={message.animate ? scrollToBottom : undefined}
                />
              ))}
            </div>
          )}
    </div>
  )
}
