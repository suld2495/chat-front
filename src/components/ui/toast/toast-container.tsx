import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

import type { ToastPosition, ToastProps } from './types'

import { Toast } from './toast'

interface ToastContainerProps {
  toasts: ToastProps[]
  position?: ToastPosition
}

export function ToastContainer({
  toasts,
  position = 'top-center',
}: ToastContainerProps) {
  const positionClasses: Record<ToastPosition, string> = {
    'top-left': 'top-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'top-right': 'top-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
  }

  const toastsByPosition = toasts.reduce((acc, toast) => {
    const pos = toast.position || position
    if (!acc[pos]) {
      acc[pos] = []
    }
    acc[pos].push(toast)
    return acc
  }, {} as Record<ToastPosition, ToastProps[]>)

  return createPortal(
    <>
      {Object.entries(toastsByPosition).map(([pos, positionToasts]) => (
        <div
          key={pos}
          className={cn(
            'fixed z-50 flex flex-col gap-2 pointer-events-none',
            positionClasses[pos as ToastPosition],
          )}
        >
          {positionToasts.map(toast => (
            <div
              key={toast.id}
              className="pointer-events-auto"
            >
              <Toast {...toast} />
            </div>
          ))}
        </div>
      ))}
    </>,
    document.body,
  )
}
