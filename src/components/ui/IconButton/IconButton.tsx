import { cn } from '@/lib/utils'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outlined' | 'filled'
  shape?: 'circle' | 'rounded'
}

export function IconButton({
  size = 'md',
  variant = 'ghost',
  shape = 'rounded',
  className,
  children,
  ...props
}: IconButtonProps) {
  // 크기별 스타일
  const sizeClasses = {
    sm: 'w-6 h-6 p-1', // 24×24
    md: 'w-8 h-8 p-1.5', // 32×32
    lg: 'w-10 h-10 p-2', // 40×40
  }

  // Variant별 스타일
  const variantClasses = {
    ghost: 'bg-transparent hover:bg-hover active:bg-hover/80 text-body',
    outlined: 'border border-border-default hover:border-border-hover hover:bg-hover text-body',
    filled: 'bg-action-primary hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary-disabled text-inverse',
  }

  // Shape별 스타일
  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-md',
  }

  return (
    <button
      type="button"
      className={cn(
        // 기본 스타일
        'inline-flex items-center justify-center',
        'transition-colors duration-200',
        'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        // 크기
        sizeClasses[size],
        // Variant
        variantClasses[variant],
        // Shape
        shapeClasses[shape],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
