import { useState } from 'react'

import { useChatConnection } from '@/hooks/chat'
import { useResizable } from '@/hooks/useResizable'
import { useViewport } from '@/hooks/useViewport'
import { MOBILE_WIDGET_PADDING, WIDGET_INITIAL_SIZE } from '@/lib/const'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat'

import { ChatArea } from './ChatArea'
import { ChatAreaSkelton } from './ChatAreaSkelton'
import { ChatHeader } from './ChatHeader'
import { ChatInputContainer } from './ChatInputContainer'
import { ChatWidgetButton } from './ChatWidgetButton'
import { ConnectionError } from './ConnectionError'
import { ResizeHandle } from './ResizeHandle'

interface ResizableContainerProps {
  isOpen: boolean
  children: React.ReactNode
}

function ResizableContainer({ isOpen, children }: ResizableContainerProps) {
  const {
    isMobile,
    width: viewportWidth,
    height: viewportHeight,
  } = useViewport()

  const {
    size,
    isResizing,
    handleMouseDown,
    activeDirection,
    maxHeight,
  } = useResizable({ initialSize: WIDGET_INITIAL_SIZE })

  // 모바일 풀스크린 모드 크기 계산
  const mobileWidth = viewportWidth - (MOBILE_WIDGET_PADDING * 2)
  const mobileHeight = viewportHeight - (MOBILE_WIDGET_PADDING * 2)

  const widgetStyle = isMobile
    ? {
        width: `${mobileWidth}px`,
        height: `${mobileHeight}px`,
        top: `${MOBILE_WIDGET_PADDING}px`,
        left: `${MOBILE_WIDGET_PADDING}px`,
        right: `${MOBILE_WIDGET_PADDING}px`,
        bottom: `${MOBILE_WIDGET_PADDING}px`,
      }
    : {
        width: `${size.width}px`,
        height: `${size.height}px`,
        maxHeight: `${maxHeight}px`,
        right: '24px',
        bottom: '96px',
      }

  return (
    <div
      className={cn(
        'fixed z-50',
        'flex flex-col',
        'bg-chat-widget overflow-visible',
        'shadow-xl',
        isMobile ? 'rounded-xl' : 'rounded-2xl',
        !isResizing && 'transition-all duration-300 ease-out',
        isOpen
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto slide-up-enter'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none',
      )}
      style={widgetStyle}
    >
      {!isMobile && (
        <>
          <ResizeHandle
            direction="top-left"
            onMouseDown={handleMouseDown('top-left')}
            isActive={activeDirection === 'top-left'}
          />
          <ResizeHandle
            direction="top-right"
            onMouseDown={handleMouseDown('top-right')}
            isActive={activeDirection === 'top-right'}
          />
          <ResizeHandle
            direction="bottom-left"
            onMouseDown={handleMouseDown('bottom-left')}
            isActive={activeDirection === 'bottom-left'}
          />
        </>
      )}

      <div className={cn(
        'flex flex-col flex-1 overflow-hidden',
        isMobile ? 'rounded-xl' : 'rounded-2xl',
      )}
      >
        {children}
      </div>
    </div>
  )
}

function ChatWidgetContent() {
  const { error, isInitialized } = useChatConnection()
  const init = useChatStore(state => state.init)

  const handleRetry = () => {
    init()
  }

  if (error && !isInitialized) {
    return (
      <ConnectionError
        error={error}
        onRetry={handleRetry}
      />
    )
  }

  if (!isInitialized) {
    return <ChatAreaSkelton />
  }

  return (
    <>
      <ChatArea />
      <ChatInputContainer />
    </>
  )
}

interface WidgetButtonProps {
  isOpen: boolean
  onToggle: () => void
}

function WidgetButton({ isOpen, onToggle }: WidgetButtonProps) {
  const { isMobile } = useViewport()

  // 모바일에서 위젯이 열려있으면 버튼 숨김
  if (isMobile && isOpen) {
    return null
  }

  return (
    <ChatWidgetButton
      isOpen={isOpen}
      onClick={onToggle}
    />
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <>
      <ResizableContainer isOpen={isOpen}>
        <ChatHeader
          title="성민데모(TalkCRM)"
          onClose={handleToggle}
        />
        <ChatWidgetContent />
      </ResizableContainer>

      <WidgetButton
        isOpen={isOpen}
        onToggle={handleToggle}
      />
    </>
  )
}
