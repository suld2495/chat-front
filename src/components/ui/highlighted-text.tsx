import { useMemo } from 'react'

import { cn } from '@/lib/utils'

interface HighlightedTextProps {
  text: string
  highlight: string
  isUser?: boolean
  highlightClassName?: string
}

export function HighlightedText({
  text,
  highlight,
  isUser = false,
  highlightClassName,
}: HighlightedTextProps) {
  const parts = useMemo(() => {
    if (!highlight.trim()) {
      return [{ text, isHighlight: false }]
    }

    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedHighlight})`, 'gi')

    const splitParts = text.split(regex)

    return splitParts
      .filter(part => part !== '')
      .map(part => ({
        text: part,
        isHighlight: part.toLowerCase() === highlight.toLowerCase(),
      }))
  }, [text, highlight])

  return (
    <>
      {parts.map((part, index) =>
        part.isHighlight
          ? (
              <mark
                key={index}
                className={cn(
                  isUser
                    ? 'bg-highlight-user typography-highlight-user-fg'
                    : 'bg-highlight text-inherit',
                  highlightClassName,
                )}
              >
                {part.text}
              </mark>
            )
          : part.text,
      )}
    </>
  )
}
