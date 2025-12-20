import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
} from 'react'

import type { UseMessageSearchReturn } from '@/hooks/useMessageSearch'

import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

interface MessageSearchBarProps {
  search: UseMessageSearchReturn
}

export function MessageSearchBar({ search }: MessageSearchBarProps) {
  const {
    isSearchOpen,
    searchQuery,
    currentMatchIndex,
    totalMatches,
    canNavigatePrev,
    canNavigateNext,
    setSearchQuery,
    executeSearch,
    navigatePrev,
    navigateNext,
    closeSearch,
  } = search

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        executeSearch()
      }
      else if (e.key === 'Escape') {
        e.preventDefault()
        closeSearch()
      }
    },
    [executeSearch, closeSearch],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    },
    [setSearchQuery],
  )

  const displayIndex = totalMatches > 0 ? currentMatchIndex + 1 : 0

  if (!isSearchOpen) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2',
        'bg-[--color-search-bar-bg] border-b border-border-default',
        'animate-in slide-in-from-top-2 duration-200',
      )}
      role="search"
      aria-label="메시지 검색"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Search className="w-4 h-4 text-text-tertiary shrink-0" />
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지 검색..."
          variant="ghost"
          size="sm"
          fullWidth
          className="bg-transparent rounded-sm"
          aria-label="검색어 입력"
        />
      </div>

      <Typography
        size="xs"
        className="typography-text-tertiary shrink-0 min-w-[48px] text-center"
      >
        {displayIndex}
        {' '}
        /
        {totalMatches}
      </Typography>

      <div className="flex items-center gap-0.5 shrink-0">
        <IconButton
          size="sm"
          variant="ghost"
          onClick={navigatePrev}
          disabled={!canNavigatePrev}
          aria-label="이전 검색 결과"
        >
          <ChevronUp className="w-4 h-4" />
        </IconButton>
        <IconButton
          size="sm"
          variant="ghost"
          onClick={navigateNext}
          disabled={!canNavigateNext}
          aria-label="다음 검색 결과"
        >
          <ChevronDown className="w-4 h-4" />
        </IconButton>
      </div>

      <IconButton
        size="sm"
        variant="ghost"
        onClick={closeSearch}
        aria-label="검색창 닫기"
      >
        <X className="w-4 h-4" />
      </IconButton>
    </div>
  )
}
