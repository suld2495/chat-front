import type { ChangeEvent, KeyboardEvent } from 'react'

import { Paperclip, Send } from 'lucide-react'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { IconButton } from '../ui/icon-button'
import { Textarea } from '../ui/textarea'

interface ChatInputProps {
  onSendMessage: (content: string) => void
  onSendFile: (file: File) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  onSendFile,
  disabled = false,
  placeholder = '밝음이에게 무엇이든 물어보세요.',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const trimmed = message.trim()
    if (trimmed && !disabled) {
      onSendMessage(trimmed)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onSendFile(file)
      e.target.value = ''
    }
  }

  const hasContent = message.trim().length > 0

  return (
    <div className="px-4 py-3 bg-chat-input border-t border-border-default">
      <div className="flex items-end gap-2">
        <IconButton
          onClick={handleFileClick}
          disabled={disabled}
          className={cn(
            'mb-2.5',
            'typography-text-tertiary',
          )}
          aria-label="Upload file"
        >
          <Paperclip className="w-5 h-5" />
        </IconButton>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="*/*"
        />

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            resize="none"
            className={cn(
              'overflow-hidden',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            style={{ maxHeight: '120px' }}
            fullWidth
          />
        </div>

        <IconButton
          size="md"
          onClick={handleSubmit}
          disabled={disabled || !hasContent}
          className={cn(
            'mb-2',
            hasContent
              ? 'bg-primary typography-white hover:bg-primary-hover'
              : 'typography-text-tertiary cursor-not-allowed',
          )}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </IconButton>
      </div>
    </div>
  )
}
