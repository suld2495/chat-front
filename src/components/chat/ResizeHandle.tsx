import { cn } from '@/lib/utils'

type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left'

interface ResizeHandleProps {
  direction: ResizeDirection
  onMouseDown: (e: React.MouseEvent) => void
  isActive?: boolean
}

const directionConfig: Record<ResizeDirection, {
  position: string
  cursor: string
  indicator: string
}> = {
  'top-left': {
    position: 'top-0 left-0',
    cursor: 'cursor-nw-resize',
    indicator: '-top-1 -left-1 border-r-0 border-b-0 rounded-tl-2xl',
  },
  'top-right': {
    position: 'top-0 right-0',
    cursor: 'cursor-n-resize',
    indicator: '-top-1 -right-1 border-l-0 border-b-0 rounded-tr-2xl',
  },
  'bottom-left': {
    position: 'bottom-0 left-0',
    cursor: 'cursor-sw-resize',
    indicator: '-bottom-1 -left-1 border-r-0 border-t-0 rounded-bl-2xl',
  },
}

export function ResizeHandle({
  direction,
  onMouseDown,
  isActive,
}: ResizeHandleProps) {
  const config = directionConfig[direction]

  return (
    <div
      className={cn(
        'absolute z-10 w-6 h-6 group',
        config.position,
        config.cursor,
      )}
      onMouseDown={onMouseDown}
    >
      <div
        className={cn(
          'absolute w-4 h-4',
          'border-2 border-text-tertiary',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          isActive && 'opacity-100',
          config.indicator,
        )}
      />
    </div>
  )
}
