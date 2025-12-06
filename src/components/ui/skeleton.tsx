import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const skeletonVariants = cva('bg-surface-raised animate-pulse', {
  variants: {
    variant: {
      text: 'h-4 w-full rounded-md',
      circular: 'h-12 w-12 rounded-full',
      rectangular: 'h-32 w-full rounded-md',
      button: 'h-10 w-24 rounded-lg',
    },
  },
  defaultVariants: { variant: 'text' },
})

type SkeletonVariants = VariantProps<typeof skeletonVariants>

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
  SkeletonVariants {
  isLoaded?: boolean
  fadeDuration?: number
  children?: React.ReactNode
}

export function Skeleton({
  variant,
  isLoaded = false,
  fadeDuration = 600,
  className,
  children,
  ...props
}: SkeletonProps) {
  if (isLoaded && children) {
    return (
      <div
        className={cn('animate-fadeInUp', className)}
        style={{
          animationDuration: `${fadeDuration}ms`,
          animationTimingFunction: 'ease-out',
          animationFillMode: 'both',
        }}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="콘텐츠 로딩 중"
      {...props}
    />
  )
}
