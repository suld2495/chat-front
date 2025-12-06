import { useMemo } from 'react'

import type { ToastOptions } from './types'

import { useToastContext } from './toast-context'

interface ToastFunction {
  (options: ToastOptions | string): string
  success: (options: ToastOptions | string) => string
  error: (options: ToastOptions | string) => string
  warning: (options: ToastOptions | string) => string
  info: (options: ToastOptions | string) => string
}

export interface UseToastReturn {
  toast: ToastFunction
  success: (options: ToastOptions | string) => string
  error: (options: ToastOptions | string) => string
  warning: (options: ToastOptions | string) => string
  info: (options: ToastOptions | string) => string
  dismiss: (id: string) => void
}

export function useToast(): UseToastReturn {
  const { addToast, removeToast } = useToastContext()

  return useMemo(() => {
    const toastFn = (options: ToastOptions | string): string => {
      if (typeof options === 'string') {
        return addToast({ message: options })
      }
      return addToast(options)
    }

    const successFn = (options: ToastOptions | string): string => {
      if (typeof options === 'string') {
        return addToast({
          message: options,
          variant: 'success',
        })
      }
      return addToast({
        ...options,
        variant: 'success',
      })
    }

    const errorFn = (options: ToastOptions | string): string => {
      if (typeof options === 'string') {
        return addToast({
          message: options,
          variant: 'error',
        })
      }
      return addToast({
        ...options,
        variant: 'error',
      })
    }

    const warningFn = (options: ToastOptions | string): string => {
      if (typeof options === 'string') {
        return addToast({
          message: options,
          variant: 'warning',
        })
      }
      return addToast({
        ...options,
        variant: 'warning',
      })
    }

    const infoFn = (options: ToastOptions | string): string => {
      if (typeof options === 'string') {
        return addToast({
          message: options,
          variant: 'info',
        })
      }
      return addToast({
        ...options,
        variant: 'info',
      })
    }

    const toast = Object.assign(toastFn, {
      success: successFn,
      error: errorFn,
      warning: warningFn,
      info: infoFn,
    }) as ToastFunction

    return {
      toast,
      success: successFn,
      error: errorFn,
      warning: warningFn,
      info: infoFn,
      dismiss: removeToast,
    }
  }, [addToast, removeToast])
}
