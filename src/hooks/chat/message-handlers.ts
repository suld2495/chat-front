import type { Message, SenderType } from '@/services/chat/types'

export interface MessageHandlerContext {
  processedIds: Set<string>
  pendingMessages: Map<string, string>
  pendingTimeouts: Map<string, NodeJS.Timeout>
}

export type MessageUpdater = (updater: (prev: Message[]) => Message[]) => void

export interface MessageHandler {
  canHandle: (message: Message) => boolean
  handle: (
    message: Message,
    setMessages: MessageUpdater,
    context: MessageHandlerContext,
  ) => void
}

export const userMessageHandler: MessageHandler = {
  canHandle: message => message.senderType === 'USER',

  handle: (message, setMessages, context) => {
    setMessages((prev) => {
      // 서버 응답에 tempMessageId가 있으면 해당 메시지와 매칭
      if (message.tempMessageId && context.pendingMessages.has(message.tempMessageId)) {
        // 타임아웃 취소
        const timeoutId = context.pendingTimeouts.get(message.tempMessageId)
        if (timeoutId) {
          clearTimeout(timeoutId)
          context.pendingTimeouts.delete(message.tempMessageId)
        }

        context.pendingMessages.delete(message.tempMessageId)
        context.processedIds.add(message.messageId)

        return prev.map(msg =>
          msg.tempMessageId === message.tempMessageId
            ? {
                ...message,
                tempMessageId: undefined,
                status: 'sent',
              }
            : msg,
        )
      }

      // tempMessageId가 없거나 매칭 안 되면 새 메시지로 추가
      context.processedIds.add(message.messageId)
      return [...prev, { ...message, status: 'sent' }]
    })
  },
}

/**
 * LOADING 메시지 핸들러
 * - 중복 LOADING 방지
 */
export const loadingMessageHandler: MessageHandler = {
  canHandle: message => message.messageType === 'LOADING',

  handle: (message, setMessages) => {
    setMessages((prev) => {
      // 이미 LOADING 메시지가 있으면 추가하지 않음
      const hasLoading = prev.some(msg => msg.messageType === 'LOADING')
      if (hasLoading)
        return prev
      return [...prev, message]
    })
  },
}

/**
 * AGENT/AI 응답 메시지 핸들러
 * - LOADING 메시지 교체
 * - 애니메이션 플래그 추가
 */
const agentSenderTypes: SenderType[] = ['AGENT', 'AI']

export const agentMessageHandler: MessageHandler = {
  canHandle: message => agentSenderTypes.includes(message.senderType),

  handle: (message, setMessages, context) => {
    context.processedIds.add(message.messageId)
    const animatedMessage: Message = { ...message, animate: true }

    setMessages((prev) => {
      const withoutAnimation = prev.map(msg =>
        msg.animate ? { ...msg, animate: false } : msg,
      )

      // LOADING 메시지가 있으면 교체
      const loadingIndex = withoutAnimation.findIndex(msg => msg.messageType === 'LOADING')

      if (loadingIndex !== -1) {
        const updated = [...withoutAnimation]
        updated[loadingIndex] = animatedMessage
        return updated
      }

      return [...withoutAnimation, animatedMessage]
    })
  },
}

/**
 * 기본 메시지 핸들러
 * - SYSTEM 등 기타 메시지
 */
export const defaultMessageHandler: MessageHandler = {
  canHandle: () => true,

  handle: (message, setMessages, context) => {
    context.processedIds.add(message.messageId)
    setMessages(prev => [...prev, message])
  },
}

/**
 * 메시지 핸들러 체인
 * 순서대로 canHandle 체크 후 첫 번째 매칭 핸들러가 처리
 */
const handlers: MessageHandler[] = [
  userMessageHandler,
  loadingMessageHandler,
  agentMessageHandler,
  defaultMessageHandler, // 폴백 (항상 마지막)
]

/**
 * 메시지 처리 함수
 * 중복 체크 후 적절한 핸들러에 위임
 */
export function handleMessage(
  message: Message,
  setMessages: MessageUpdater,
  context: MessageHandlerContext,
): void {
  if (message.messageType !== 'LOADING' && context.processedIds.has(message.messageId)) {
    return
  }

  for (const handler of handlers) {
    if (handler.canHandle(message)) {
      handler.handle(message, setMessages, context)
      return
    }
  }
}

/**
 * 커스텀 핸들러 추가
 * 새로운 메시지 타입 처리가 필요할 때 사용
 */
export function createMessageHandlerChain(customHandlers: MessageHandler[] = []): typeof handleMessage {
  const allHandlers = [...customHandlers, ...handlers]

  return (message, setMessages, context) => {
    if (message.messageType !== 'LOADING' && context.processedIds.has(message.messageId)) {
      return
    }

    for (const handler of allHandlers) {
      if (handler.canHandle(message)) {
        handler.handle(message, setMessages, context)
        return
      }
    }
  }
}
