import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'typography-text-primary',
    'transition-colors outline-none text-body placeholder:text-placeholder',
  ],
  {
    variants: {
      variant: {
        outlined:
          'border border-border-default bg-surface rounded-m focus:border-border-focus hover:border-border-hover',
        filled:
          'border-0 bg-surface-sunken rounded-t-m hover:bg-hover focus:bg-surface',
        underlined:
          'border-0 border-b border-border-default rounded-none bg-transparent focus:border-border-focus hover:border-border-hover',
        ghost: 'border-0 bg-transparent focus:bg-hover',
      },
      size: {
        xs: 'h-input-xs text-s px-s',
        sm: 'h-input-sm text-s px-s',
        md: 'h-input-md text-m px-m',
        lg: 'h-input-lg text-l px-m',
      },
      fullWidth: { true: 'w-full' },
      error: { true: 'border-border-error focus:border-border-error' },
      success: { true: 'border-border-success focus:border-border-success' },
    },
    defaultVariants: {
      variant: 'outlined',
      size: 'md',
    },
  },
)

const helperTextVariants = cva('text-xs mt-1', {
  variants: {
    state: {
      default: 'typography-text-secondary',
      error: 'typography-text-error',
      success: 'typography-text-success',
    },
  },
  defaultVariants: { state: 'default' },
})

type InputVariants = VariantProps<typeof inputVariants>

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  Omit<InputVariants, 'error' | 'success'> {
  error?: boolean
  success?: boolean
  helperText?: string
  label?: string
}

export function Input({
  variant,
  size,
  fullWidth,
  error,
  success,
  helperText,
  label,
  className,
  disabled,
  ...props
}: InputProps) {
  const helperState = error ? 'error' : success ? 'success' : 'default'

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-body">
          {label}
        </label>
      )}
      <input
        className={cn(
          inputVariants({
            variant,
            size,
            fullWidth,
            error,
            success,
          }),
          disabled && 'opacity-50 cursor-not-allowed bg-disabled-bg',
          className,
        )}
        disabled={disabled}
        {...props}
      />
      {helperText && (
        <p className={helperTextVariants({ state: helperState })}>
          {helperText}
        </p>
      )}
    </div>
  )
}
