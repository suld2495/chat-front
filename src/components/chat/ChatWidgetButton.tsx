import { MessageCircle, X } from 'lucide-react'

import { cn } from '@/lib/utils'

import { IconButton } from '../ui/icon-button'

interface ChatTriggerProps {
  isOpen: boolean
  onClick: () => void
}

export function ChatWidgetButton({ isOpen, onClick }: ChatTriggerProps) {
  return (
    <IconButton
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-14 h-14 rounded-round',
        'bg-primary text-white',
        'flex items-center justify-center',
        'shadow-2xl',
        'transition-all duration-300 ease-out',
        'hover:scale-105 hover:bg-primary-hover',
        'active:scale-95',
        isOpen && 'outline-none ring-2 ring-primary ring-offset-2 ring-offset-background shadow-2xl',
        !isOpen && 'trigger-pulse',
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <div className="relative w-6 h-6">
        <MessageCircle
          className={cn(
            'absolute inset-0 w-6 h-6 transition-all duration-300',
            isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100',
          )}
        />
        <X
          className={cn(
            'absolute inset-0 w-6 h-6 transition-all duration-300',
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0',
          )}
        />
      </div>
    </IconButton>
  )
}
