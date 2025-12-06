import { RefreshCwIcon, X } from 'lucide-react'

import { IconButton } from '../ui/icon-button'

interface ChatHeaderProps {
  title: string
  onClose: () => void
  onClear: () => void
}

export function ChatHeader({
  title,
  onClose,
  onClear,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-chat-header rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="typography-chat-header-fg font-semibold text-base leading-tight">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <IconButton
          onClick={onClear}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-chat-header-fg/80 hover:bg-chat-header-fg/10 transition-colors duration-200"
          aria-label="Clear chat"
        >
          <RefreshCwIcon className="w-5 h-5" />
        </IconButton>
        <IconButton
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-chat-header-fg/80 hover:bg-chat-header-fg/10 transition-colors duration-200"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </IconButton>
      </div>
    </header>
  )
}
