import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    size: {
      'xs': 'text-xs',
      'sm': 'text-s',
      'base': 'text-m',
      'lg': 'text-l',
      'xl': 'text-xl',
      '2xl': 'text-xxl',
      '3xl': 'text-title',
      '4xl': 'text-display',
      '5xl': 'text-hero',
      '6xl': 'text-giant',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      primary: 'typography-text-primary',
      secondary: 'typography-text-secondary',
      muted: 'typography-text-muted',
      error: 'typography-text-error',
      success: 'typography-text-success',
      inherit: 'typography-inherit',
      inverse: 'typography-text-inverse',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'inverse',
  },
})

const variantConfig = {
  display: {
    size: '6xl',
    tag: 'h1',
    weight: 'bold',
  },
  hero: {
    size: '5xl',
    tag: 'h1',
    weight: 'bold',
  },
  title: {
    size: '4xl',
    tag: 'h2',
    weight: 'bold',
  },
  subtitle: {
    size: '2xl',
    tag: 'h3',
    weight: 'semibold',
  },
  body: {
    size: 'base',
    tag: 'p',
    weight: 'normal',
  },
  caption: {
    size: 'sm',
    tag: 'span',
    weight: 'normal',
  },
  label: {
    size: 'xs',
    tag: 'label',
    weight: 'medium',
  },
} as const

type TypographyVariants = VariantProps<typeof typographyVariants>
type SemanticVariant = keyof typeof variantConfig
type TagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label'

interface TypographyProps extends Omit<TypographyVariants, 'weight'> {
  variant?: SemanticVariant
  as?: TagType
  className?: string
  children: React.ReactNode
  color?: TypographyVariants['color']
}

export function Typography({
  variant = 'body',
  size,
  color,
  as,
  className,
  children,
}: TypographyProps) {
  const config = variantConfig[variant]
  const Tag = as || config.tag
  const finalSize = size || config.size
  const finalWeight = config.weight

  return (
    <Tag
      className={cn(
        typographyVariants({
          size: finalSize as TypographyVariants['size'],
          weight: finalWeight as TypographyVariants['weight'],
          color,
        }),
        className,
      )}
    >
      {children}
    </Tag>
  )
}
