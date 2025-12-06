import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge<'typography'>({ extend: { classGroups: { typography: [{ typography: [(value: string) => value.startsWith('text-')] }] } } })

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
