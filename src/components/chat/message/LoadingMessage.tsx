import { cn } from '@/lib/utils'

export function LoadingMessage() {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-2xl chat-bubble-shadow',
        'bg-chat-bubble-other text-chat-bubble-other-fg rounded-bl-md',
      )}
    >
      <div className="flex items-center gap-1">
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '600ms' }}
        />
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '600ms' }}
        />
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '600ms' }}
        />
      </div>
    </div>
  )
}
