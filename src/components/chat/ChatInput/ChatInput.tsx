import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/utils'

function SendIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface ChatInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  onSubmit?: (value: string) => void
  onTyping?: (isTyping: boolean) => void // Typing event callback
  maxHeight?: number // Maximum height in pixels before scrolling
  minHeight?: number // Minimum height in pixels
  fullWidth?: boolean
}

export function ChatInput({
  onSubmit,
  onTyping,
  maxHeight = 200,
  minHeight = 40,
  fullWidth = true,
  className,
  value: controlledValue,
  onChange,
  ...props
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [internalValue, setInternalValue] = useState('')
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const isControlled = controlledValue !== undefined

  // Auto-resize textarea based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea)
      return

    // Reset height to measure scrollHeight accurately
    textarea.style.height = `${minHeight}px`

    const scrollHeight = textarea.scrollHeight

    // Set height based on content, capped at maxHeight
    if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`
      textarea.style.overflowY = 'hidden'
    }
    else {
      textarea.style.height = `${maxHeight}px`
      textarea.style.overflowY = 'auto'
    }
  }, [maxHeight, minHeight])

  // Adjust height when value changes
  useEffect(() => {
    adjustHeight()
  }, [adjustHeight, value])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)

    // Typing event handling
    if (onTyping) {
      // Send typing start event
      onTyping(true)

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Send typing stop event after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
      }, 1000)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift + Enter: Allow default behavior (new line)
    if (e.key === 'Enter' && e.shiftKey) {
      return
    }

    // Enter without Shift: Submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      const currentValue = typeof value === 'string' ? value : ''
      const trimmedValue = currentValue.trim()

      if (trimmedValue && onSubmit) {
        onSubmit(trimmedValue)

        // Clear input after submit (only if uncontrolled)
        if (!isControlled) {
          setInternalValue('')
        }
      }
    }

    // Call original onKeyDown if provided
    props.onKeyDown?.(e)
  }

  const handleSend = (message?: string) => {
    if (props.disabled)
      return
    const messageToSend = message ?? value
    if (!onSubmit)
      return

    if (typeof messageToSend === 'string') {
      const trimmed = messageToSend.trim()
      if (!trimmed)
        return
      onSubmit(trimmed)
      if (!isControlled) {
        setInternalValue('')
      }
    }
  }

  const canSend = typeof value === 'string' && value.trim().length > 0 && !props.disabled

  return (
    <div className="relative flex flex-col items-end">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'resize-none transition-colors outline-none',
          'text-body placeholder:text-placeholder',
          'focus:border-border-focus hover:border-border-hover',
          'py-2.5 text-base',
          props.disabled && 'opacity-50 cursor-not-allowed bg-disabled-bg',
          fullWidth && 'w-full',
          className,
        )}
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
        }}
        {...props}
      />
      <IconButton
        variant="filled"
        size="lg"
        shape="rounded"
        onClick={() => handleSend()}
        disabled={!canSend}
        aria-label="전송"
        className="mb-[1px]"
      >
        <SendIcon />
      </IconButton>
    </div>
  )
}
