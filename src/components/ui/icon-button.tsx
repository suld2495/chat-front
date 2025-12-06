import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'transition-colors duration-200',
    'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        ghost:
          'bg-transparent hover:bg-hover active:bg-hover/80 text-body',
        outlined:
          'border border-border-default hover:border-border-hover hover:bg-hover text-body',
        filled:
          'bg-action-primary hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary-disabled text-inverse',
      },
      size: {
        sm: 'size-icon-button-sm p-xs',
        md: 'size-icon-button-md p-xs',
        lg: 'size-icon-button-lg p-s',
      },
      shape: {
        circle: 'rounded-round',
        rounded: 'rounded-m',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
      shape: 'rounded',
    },
  },
)

type IconButtonVariants = VariantProps<typeof iconButtonVariants>

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  IconButtonVariants {}

export function IconButton({
  variant,
  size,
  shape,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(iconButtonVariants({
        variant,
        size,
        shape,
      }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
