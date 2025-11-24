import { useEffect, useState } from 'react'

import { IconButton } from '@/components/ui/IconButton/IconButton'
import { cn } from '@/lib/utils'

import { ChatIcon } from './ChatIcon'
import { ChatWidgetPanel } from './ChatWidgetPanel'

interface ChatWidgetProps {
  className?: string
  currentUserId: string
}

export function ChatWidget({ className, currentUserId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect, react-hooks-extra/no-direct-set-state-in-use-effect */
    if (isOpen) {
      // 마운트 먼저, 그 다음 애니메이션 시작
      setShouldRender(true)
      // 다음 프레임에서 애니메이션 시작
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    }
    else {
      // 애니메이션 종료 먼저
      setIsAnimating(false)
      // 애니메이션 완료 후 언마운트
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // 애니메이션 duration과 동일
      return () => clearTimeout(timer)
    }
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks-extra/no-direct-set-state-in-use-effect */
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Chat Panel */}
      {shouldRender && (
        <ChatWidgetPanel
          onClose={handleClose}
          isAnimating={isAnimating}
          currentUserId={currentUserId}
        />
      )}

      {/* Chat Widget Button */}
      <div className={cn('fixed bottom-6 right-20 z-50', className)}>
        <IconButton
          variant="filled"
          size="lg"
          shape="circle"
          className="shadow-lg"
          onClick={handleToggle}
          aria-label={isOpen ? '채팅 닫기' : '채팅 열기'}
        >
          <ChatIcon className="text-inverse" />
        </IconButton>
      </div>
    </>
  )
}
