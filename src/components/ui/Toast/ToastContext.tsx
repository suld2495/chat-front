import type { ReactNode } from 'react'

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
} from 'react'

import type {
  ToastOptions,
  ToastPosition,
  ToastProps,
} from './types'

import { ToastContainer } from './ToastContainer'

interface ToastContextValue {
  toasts: ToastProps[]
  addToast: (options: ToastOptions) => string
  removeToast: (id: string) => void
  defaultPosition: ToastPosition
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
  defaultPosition?: ToastPosition
  defaultDuration?: number
}

export function ToastProvider({
  children,
  defaultPosition = 'top-center',
  defaultDuration = 3000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      const toast: ToastProps = {
        id,
        message: options.message,
        children: options.children,
        duration: options.duration ?? defaultDuration,
        showClose: options.showClose ?? false,
        showProgress: options.showProgress ?? false,
        position: options.position ?? defaultPosition,
        variant: options.variant ?? 'default',
        onClose: () => removeToast(id),
      }

      setToasts(prev => [...prev, toast])
      return id
    },
    [defaultPosition, defaultDuration, removeToast],
  )

  const contextValue = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      defaultPosition,
    }),
    [toasts, addToast, removeToast, defaultPosition],
  )

  return (
    <ToastContext value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={defaultPosition}
      />
    </ToastContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToastContext() {
  const context = use(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}
