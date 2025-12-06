import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const textareaVariants = cva(
  [
    'typography-text-primary',
    'transition-colors outline-none text-body placeholder:text-placeholder',
    'resize-vertical',
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
        xs: 'text-s px-s py-xs',
        sm: 'text-s px-s py-s',
        md: 'text-m px-m py-s',
        lg: 'text-l px-m py-m',
      },
      fullWidth: { true: 'w-full' },
      error: { true: 'border-border-error focus:border-border-error' },
      success: { true: 'border-border-success focus:border-border-success' },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      size: 'md',
      resize: 'vertical',
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

type TextareaVariants = VariantProps<typeof textareaVariants>

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
  Omit<TextareaVariants, 'error' | 'success'> {
  error?: boolean
  success?: boolean
  helperText?: string
  label?: string
  ref?: React.Ref<HTMLTextAreaElement>
}

export function Textarea({
  variant,
  size,
  fullWidth,
  error,
  success,
  resize,
  helperText,
  label,
  className,
  disabled,
  rows = 3,
  ref,
  ...props
}: TextareaProps) {
  const helperState = error ? 'error' : success ? 'success' : 'default'

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-body">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          textareaVariants({
            variant,
            size,
            fullWidth,
            error,
            success,
            resize,
          }),
          disabled && 'opacity-50 cursor-not-allowed bg-disabled-bg',
          className,
        )}
        disabled={disabled}
        rows={rows}
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
