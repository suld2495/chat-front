import { cn } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'

interface MessageSkeletonProps {
  isUser?: boolean
  lines?: number
}

function MessageSkeleton({ isUser = false, lines = 2 }: MessageSkeletonProps) {
  return (
    <div
      className={cn(
        'flex gap-3 px-4',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* 프로필 이미지 스켈레톤 */}
      <div className="shrink-0 mt-1">
        <Skeleton
          variant="circular"
          className="w-8 h-8 bg-surface-sunken"
        />
      </div>

      {/* 메시지 버블 스켈레톤 */}
      <div
        className={cn(
          'flex flex-col max-w-[75%] gap-1.5',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-2 px-4 py-3 rounded-2xl',
            isUser
              ? 'bg-chat-bubble-user/50 rounded-br-md'
              : 'bg-chat-bubble-other/50 rounded-bl-md',
          )}
        >
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              className={cn(
                'h-3 bg-surface-sunken',
                index === lines - 1 ? 'w-16' : 'w-40',
              )}
            />
          ))}
        </div>

        {/* 시간 스켈레톤 */}
        <Skeleton
          variant="text"
          className="h-2.5 w-10 mx-1 bg-surface-sunken"
        />
      </div>
    </div>
  )
}

export function ChatAreaSkelton() {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto py-4',
        'bg-chat-widget',
      )}
      role="status"
      aria-busy="true"
      aria-label="채팅 메시지 로딩 중"
    >
      <div className="flex flex-col gap-4">
        {/* 상대방 메시지 (3줄) */}
        <MessageSkeleton lines={3} />

        {/* 사용자 메시지 (1줄) */}
        <MessageSkeleton
          isUser
          lines={1}
        />

        {/* 상대방 메시지 (2줄) */}
        <MessageSkeleton lines={2} />
      </div>
    </div>
  )
}
