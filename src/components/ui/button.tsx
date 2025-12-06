import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-m font-medium',
    'transition-colors duration-200',
    'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-action-primary hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary-disabled typography-text-on-primary',
        secondary:
          'bg-action-secondary hover:bg-action-secondary-hover active:bg-action-secondary-active disabled:bg-action-secondary-disabled typography-text-on-secondary',
        ghost:
          'bg-transparent hover:bg-action-ghost-hover active:bg-action-ghost-active typography-text-primary',
        outline:
          'border border-border-default hover:border-border-hover hover:bg-hover typography-text-primary',
        danger:
          'bg-action-destructive hover:bg-action-destructive-hover active:bg-action-destructive-active disabled:bg-action-destructive-disabled typography-text-on-destructive',
      },
      size: {
        sm: 'h-button-sm text-s px-s',
        md: 'h-button-md text-m px-m',
        lg: 'h-button-lg text-l px-l',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

const iconVariants = cva('inline-flex items-center justify-center shrink-0', {
  variants: {
    size: {
      sm: 'size-icon-s',
      md: 'size-icon-m',
      lg: 'size-icon-l',
    },
  },
  defaultVariants: { size: 'md' },
})

const gapVariants = cva('', {
  variants: {
    size: {
      sm: 'gap-xs',
      md: 'gap-s',
      lg: 'gap-s',
    },
  },
  defaultVariants: { size: 'md' },
})

type ButtonVariants = VariantProps<typeof buttonVariants>

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
  ButtonVariants {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
}

export function Button({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  const hasIcon = leftIcon || rightIcon

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          fullWidth,
        }),
        hasIcon && gapVariants({ size }),
        className,
      )}
      {...props}
    >
      {leftIcon && <span className={iconVariants({ size })}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={iconVariants({ size })}>{rightIcon}</span>}
    </button>
  )
}
