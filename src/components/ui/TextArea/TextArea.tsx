import { cn } from '@/lib/utils'

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled' | 'underlined' | 'ghost'
  error?: boolean
  success?: boolean
  fullWidth?: boolean
  helperText?: string
  label?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export function TextArea({
  size = 'md',
  variant = 'outlined',
  error,
  success,
  fullWidth,
  helperText,
  label,
  resize = 'vertical',
  className,
  rows = 3,
  ...props
}: TextAreaProps) {
  // Tailwind 유틸리티 직접 사용
  const sizeClasses = {
    xs: 'min-h-[56px] text-xs px-2 py-1.5', // 12px text, 8px padding
    sm: 'min-h-[64px] text-sm px-3 py-2', // 14px text, 12px padding
    md: 'min-h-[80px] text-base px-4 py-2.5', // 16px text, 16px padding
    lg: 'min-h-[96px] text-lg px-5 py-3', // 18px text, 20px padding
  }

  const variantClasses = {
    outlined: 'border border-border-default bg-surface rounded-lg focus:border-border-focus hover:border-border-hover',
    filled: 'border-0 bg-surface-sunken rounded-t-lg hover:bg-hover focus:bg-surface',
    underlined: 'border-0 border-b border-border-default rounded-none bg-transparent focus:border-border-focus hover:border-border-hover',
    ghost: 'border-0 bg-transparent focus:bg-hover',
  }

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  }

  const stateClasses = cn(
    error && 'border-border-error focus:border-border-error',
    success && 'border-border-success focus:border-border-success',
  )

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-body">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'transition-colors outline-none text-body placeholder:text-placeholder',
          sizeClasses[size],
          variantClasses[variant],
          resizeClasses[resize],
          stateClasses,
          props.disabled && 'opacity-50 cursor-not-allowed bg-disabled-bg',
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          'text-xs mt-1',
          error && 'text-error-text',
          success && 'text-success-text',
          !error && !success && 'text-muted',
        )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}
