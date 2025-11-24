export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default'

export type ToastPosition
  = | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'

export interface ToastProps {
  id: string
  message?: string
  children?: React.ReactNode
  duration?: number
  showClose?: boolean
  showProgress?: boolean
  position?: ToastPosition
  variant?: ToastVariant
  onClose?: () => void
  className?: string
}

export interface ToastOptions {
  message?: string
  children?: React.ReactNode
  duration?: number
  showClose?: boolean
  showProgress?: boolean
  position?: ToastPosition
  variant?: ToastVariant
}
