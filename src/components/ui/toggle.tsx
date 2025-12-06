import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Typography } from './typography'

const trackVariants = cva(
  'relative inline-flex items-center rounded-full transition-colors duration-200',
  {
    variants: {
      size: {
        sm: 'w-toggle-track-w-sm h-toggle-track-h-sm',
        md: 'w-toggle-track-w-md h-toggle-track-h-md',
        lg: 'w-toggle-track-w-lg h-toggle-track-h-lg',
      },
      variant: {
        primary: '',
        secondary: '',
        success: '',
      },
      checked: {
        true: '',
        false: 'bg-surface-sunken disabled:opacity-50',
      },
      disabled: { true: 'cursor-not-allowed' },
    },
    compoundVariants: [
      {
        checked: true,
        variant: 'primary',
        className: 'bg-action-primary disabled:bg-action-primary-disabled',
      },
      {
        checked: true,
        variant: 'secondary',
        className: 'bg-action-secondary disabled:bg-action-secondary-disabled',
      },
      {
        checked: true,
        variant: 'success',
        className: 'bg-bg-success disabled:opacity-50',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      checked: false,
    },
  },
)

const thumbVariants = cva(
  'inline-block rounded-full bg-inverse transition-transform duration-200',
  {
    variants: {
      size: {
        sm: 'size-toggle-thumb-sm',
        md: 'size-toggle-thumb-md',
        lg: 'size-toggle-thumb-lg',
      },
      checked: {
        true: '',
        false: 'translate-x-0.5',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        checked: true,
        className: 'translate-x-toggle-track-h-sm',
      },
      {
        size: 'md',
        checked: true,
        className: 'translate-x-toggle-thumb-md',
      },
      {
        size: 'lg',
        checked: true,
        className: 'translate-x-toggle-track-h-lg',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  },
)

const containerVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-s',
      md: 'gap-s',
      lg: 'gap-m',
    },
    disabled: {
      true: 'cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
})

const labelVariants = cva('typography-text-primary select-none', {
  variants: {
    size: {
      sm: 'text-s',
      md: 'text-m',
      lg: 'text-l',
    },
    disabled: {
      true: 'text-disabled cursor-not-allowed',
      false: 'text-body',
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
})

type ToggleVariants = VariantProps<typeof trackVariants>

interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
  Pick<ToggleVariants, 'size' | 'variant'> {
  checked?: boolean
  defaultChecked?: boolean
  label?: string
  labelPosition?: 'left' | 'right'
  onChange?: (checked: boolean) => void
}

export function Toggle({
  size,
  variant,
  checked,
  defaultChecked = false,
  label,
  labelPosition = 'left',
  disabled,
  className,
  onChange,
  ...props
}: ToggleProps) {
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

  const toggleElement = (
    <span className={trackVariants({
      size,
      variant,
      checked: isChecked,
      disabled,
    })}
    >
      <span className={thumbVariants({ size, checked: isChecked })} />
    </span>
  )

  const labelElement = label && (
    <Typography className={labelVariants({ size, disabled })}>{label}</Typography>
  )

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(containerVariants({ size, disabled }), className)}
      {...props}
    >
      {label && labelPosition === 'left' && labelElement}
      {toggleElement}
      {label && labelPosition === 'right' && labelElement}
    </button>
  )
}

export { thumbVariants, trackVariants }
