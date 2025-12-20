import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  WIDGET_BOTTOM_OFFSET,
  WIDGET_MAX_SIZE,
  WIDGET_MAX_WIDTH_RATIO,
  WIDGET_MIN_SIZE,
} from '@/lib/const'
import { clamp } from '@/lib/math-utils'

import { useViewport } from './useViewport'

type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left'

interface Size {
  width: number
  height: number
}

interface UseResizableOptions {
  initialSize: Size
  minSize?: Size
  maxSize?: Size
}

interface UseResizableReturn {
  size: Size
  isResizing: boolean
  handleMouseDown: (direction: ResizeDirection) => (e: React.MouseEvent) => void
  activeDirection: ResizeDirection | null
  maxHeight: number
  maxWidth: number
}

export function useResizable({
  initialSize,
  minSize = WIDGET_MIN_SIZE,
  maxSize = WIDGET_MAX_SIZE,
}: UseResizableOptions): UseResizableReturn {
  const [size, setSize] = useState<Size>(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const [activeDirection, setActiveDirection] = useState<ResizeDirection | null>(null)

  const startPosRef = useRef({ x: 0, y: 0 })
  const startSizeRef = useRef<Size>(initialSize)

  const { width: viewportWidth, height: viewportHeight } = useViewport()

  const maxHeight = Math.min(
    maxSize.height,
    viewportHeight > 0 ? viewportHeight - WIDGET_BOTTOM_OFFSET : maxSize.height,
  )
  const maxWidth = Math.min(
    maxSize.width,
    viewportWidth > 0 ? Math.floor(viewportWidth * WIDGET_MAX_WIDTH_RATIO) : maxSize.width,
  )

  const handleMouseDown = useCallback((direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsResizing(true)
    setActiveDirection(direction)

    startPosRef.current = { x: e.clientX, y: e.clientY }
    startSizeRef.current = { ...size }
  }, [size])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !activeDirection)
      return

    const deltaX = e.clientX - startPosRef.current.x
    const deltaY = e.clientY - startPosRef.current.y

    let newWidth = startSizeRef.current.width
    let newHeight = startSizeRef.current.height

    switch (activeDirection) {
      case 'bottom-left':
        // 왼쪽으로만 확장
        newWidth = startSizeRef.current.width - deltaX
        break

      case 'top-left':
        // 왼쪽 + 위로 확장
        newWidth = startSizeRef.current.width - deltaX
        newHeight = startSizeRef.current.height - deltaY
        break

      case 'top-right':
        // 위로만 확장
        newHeight = startSizeRef.current.height - deltaY
        break
    }

    // 최소/최대 크기 제한
    newWidth = clamp(newWidth, minSize.width, maxWidth)
    newHeight = clamp(newHeight, minSize.height, maxHeight)

    setSize({ width: newWidth, height: newHeight })
  }, [isResizing, activeDirection, minSize, maxWidth, maxHeight])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setActiveDirection(null)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = activeDirection === 'bottom-left'
        ? 'sw-resize'
        : activeDirection === 'top-left'
          ? 'nw-resize'
          : 'n-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, activeDirection, handleMouseMove, handleMouseUp])

  return {
    size,
    isResizing,
    handleMouseDown,
    activeDirection,
    maxHeight,
    maxWidth,
  }
}
