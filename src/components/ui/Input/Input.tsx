import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled' | 'underlined' | 'ghost'
  error?: boolean
  success?: boolean
  fullWidth?: boolean
  helperText?: string
  label?: string
}

export function Input({
  size = 'md',
  variant = 'outlined',
  error,
  success,
  fullWidth,
  helperText,
  label,
  className,
  ...props
}: InputProps) {
  // Tailwind 유틸리티 직접 사용
  const sizeClasses = {
    xs: 'h-7 text-xs px-2', // 28px, 12px, 8px
    sm: 'h-8 text-sm px-3', // 32px, 14px, 12px
    md: 'h-10 text-base px-4', // 40px, 16px, 16px
    lg: 'h-12 text-lg px-5', // 48px, 18px, 20px
  }

  const variantClasses = {
    outlined: 'border border-border-default bg-surface rounded-lg focus:border-border-focus hover:border-border-hover',
    filled: 'border-0 bg-surface-sunken rounded-t-lg hover:bg-hover focus:bg-surface',
    underlined: 'border-0 border-b border-border-default rounded-none bg-transparent focus:border-border-focus hover:border-border-hover',
    ghost: 'border-0 bg-transparent focus:bg-hover',
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
      <input
        className={cn(
          'transition-colors outline-none text-body placeholder:text-placeholder',
          sizeClasses[size],
          variantClasses[variant],
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
