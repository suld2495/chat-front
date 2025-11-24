import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  size = 'md',
  variant = 'primary',
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  // Tailwind 유틸리티 직접 사용
  const sizeClasses = {
    sm: 'h-8 text-sm px-3', // 32px, 14px, 12px
    md: 'h-10 text-base px-4', // 40px, 16px, 16px
    lg: 'h-12 text-lg px-6', // 48px, 18px, 24px
  }

  const variantClasses = {
    primary: 'bg-action-primary hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary-disabled text-inverse',
    secondary: 'bg-action-secondary hover:bg-action-secondary-hover active:bg-action-secondary-active disabled:bg-action-secondary-disabled text-inverse',
    ghost: 'bg-transparent hover:bg-action-ghost-hover active:bg-action-ghost-active text-body',
    outline: 'border border-border-default hover:border-border-hover text-body hover:bg-hover',
    danger: 'bg-action-destructive hover:bg-action-destructive-hover active:bg-action-destructive-active disabled:bg-action-destructive-disabled text-inverse',
  }

  // 아이콘 크기 및 간격 스타일
  const iconSizeClasses = {
    sm: 'w-4 h-4', // 16px
    md: 'w-5 h-5', // 20px
    lg: 'w-6 h-6', // 24px
  }

  const iconGapClasses = {
    sm: 'gap-1.5', // 6px
    md: 'gap-2', // 8px
    lg: 'gap-2.5', // 10px
  }

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-lg font-medium',
        'transition-colors duration-200',
        'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        (leftIcon || rightIcon) && iconGapClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon && (
        <span className={cn('inline-flex items-center justify-center shrink-0', iconSizeClasses[size])}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className={cn('inline-flex items-center justify-center shrink-0', iconSizeClasses[size])}>
          {rightIcon}
        </span>
      )}
    </button>
  )
}
