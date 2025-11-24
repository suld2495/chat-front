import { cn } from '@/lib/utils'

interface TypographyProps {
  variant?: 'display' | 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'label'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label'
  className?: string
  children: React.ReactNode
}

const variantConfig = {
  display: {
    size: '6xl' as const,
    tag: 'h1' as const,
    weight: 'bold',
  },
  hero: {
    size: '5xl' as const,
    tag: 'h1' as const,
    weight: 'bold',
  },
  title: {
    size: '4xl' as const,
    tag: 'h2' as const,
    weight: 'bold',
  },
  subtitle: {
    size: '2xl' as const,
    tag: 'h3' as const,
    weight: 'semibold',
  },
  body: {
    size: 'base' as const,
    tag: 'p' as const,
    weight: 'normal',
  },
  caption: {
    size: 'sm' as const,
    tag: 'span' as const,
    weight: 'normal',
  },
  label: {
    size: 'xs' as const,
    tag: 'label' as const,
    weight: 'medium',
  },
}

export function Typography({
  variant = 'body',
  size,
  as,
  className,
  children,
}: TypographyProps) {
  const config = variantConfig[variant]
  const Tag = as || config.tag
  const finalSize = size || config.size

  const sizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return (
    <Tag className={cn(
      sizeClasses[finalSize],
      weightClasses[config.weight as keyof typeof weightClasses],
      className,
    )}
    >
      {children}
    </Tag>
  )
}
