import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success'
  checked?: boolean
  defaultChecked?: boolean
  label?: string
  labelPosition?: 'left' | 'right'
  onChange?: (checked: boolean) => void
}

export function Toggle({
  size = 'md',
  variant = 'primary',
  checked,
  defaultChecked = false,
  label,
  labelPosition = 'left',
  disabled,
  className,
  onChange,
  ...props
}: ToggleProps) {
  // Controlled vs Uncontrolled
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = checked !== undefined ? checked : internalChecked
  const isControlled = checked !== undefined

  const handleClick = () => {
    if (disabled)
      return

    const newChecked = !isChecked

    if (!isControlled) {
      setInternalChecked(newChecked)
    }

    onChange?.(newChecked)
  }

  // 크기별 스타일
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4', // 32px × 16px
      thumb: 'w-3 h-3', // 12px × 12px
      translate: 'translate-x-4', // 16px 이동
      label: 'text-sm',
      gap: 'gap-2',
    },
    md: {
      track: 'w-11 h-6', // 44px × 24px
      thumb: 'w-5 h-5', // 20px × 20px
      translate: 'translate-x-5', // 20px 이동
      label: 'text-base',
      gap: 'gap-3',
    },
    lg: {
      track: 'w-14 h-7', // 56px × 28px
      thumb: 'w-6 h-6', // 24px × 24px
      translate: 'translate-x-7', // 28px 이동
      label: 'text-lg',
      gap: 'gap-4',
    },
  }

  // variant별 스타일 (checked 상태)
  const variantClasses = {
    primary: 'bg-action-primary disabled:bg-action-primary-disabled',
    secondary: 'bg-action-secondary disabled:bg-action-secondary-disabled',
    success: 'bg-success-bg disabled:opacity-50',
  }

  const trackClass = cn(
    // 기본 스타일
    'relative inline-flex items-center rounded-full transition-colors duration-200',
    sizeClasses[size].track,
    // checked 상태에 따른 배경색
    isChecked
      ? variantClasses[variant]
      : 'bg-surface-sunken disabled:opacity-50',
    // disabled 상태
    disabled && 'cursor-not-allowed',
  )

  const thumbClass = cn(
    // 기본 스타일
    'inline-block rounded-full bg-inverse transition-transform duration-200',
    sizeClasses[size].thumb,
    // checked 상태에 따른 위치
    isChecked ? sizeClasses[size].translate : 'translate-x-0.5',
  )

  const labelClass = cn(
    'select-none',
    sizeClasses[size].label,
    disabled ? 'text-disabled cursor-not-allowed' : 'text-body',
  )

  const toggleElement = (
    <span className={trackClass}>
      <span className={thumbClass} />
    </span>
  )

  const labelElement = label && (
    <span className={labelClass}>{label}</span>
  )

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center',
        sizeClasses[size].gap,
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...props}
    >
      {label && labelPosition === 'left' && labelElement}
      {toggleElement}
      {label && labelPosition === 'right' && labelElement}
    </button>
  )
}
