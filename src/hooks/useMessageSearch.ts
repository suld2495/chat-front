import {
  useCallback,
  useMemo,
  useState,
} from 'react'

import type { Message } from '@/services/chat/types'

export interface SearchState {
  isSearchOpen: boolean
  searchQuery: string
  executedQuery: string
  matchedMessageIds: string[]
  currentMatchIndex: number
}

export interface UseMessageSearchReturn extends SearchState {
  currentMatchId: string | null
  totalMatches: number
  canNavigatePrev: boolean
  canNavigateNext: boolean
  matchedMessageIdSet: Set<string>

  openSearch: () => void
  closeSearch: () => void
  setSearchQuery: (query: string) => void
  executeSearch: () => void
  navigatePrev: () => void
  navigateNext: () => void
}

export function useMessageSearch(messages: Message[]): UseMessageSearchReturn {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [executedQuery, setExecutedQuery] = useState('')
  const [matchedMessageIds, setMatchedMessageIds] = useState<string[]>([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)

  const executeSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim()

    if (!trimmedQuery) {
      setExecutedQuery('')
      setMatchedMessageIds([])
      setCurrentMatchIndex(0)
      return
    }

    const query = trimmedQuery.toLowerCase()

    const matched = messages
      .filter(
        m =>
          (m.messageType === 'TEXT' || m.messageType === 'SYSTEM')
          && m.content.toLowerCase().includes(query),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map(m => m.messageId)

    setExecutedQuery(trimmedQuery)
    setMatchedMessageIds(matched)
    setCurrentMatchIndex(0)
  }, [messages, searchQuery])

  const openSearch = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
    setSearchQuery('')
    setExecutedQuery('')
    setMatchedMessageIds([])
    setCurrentMatchIndex(0)
  }, [])

  const navigatePrev = useCallback(() => {
    if (matchedMessageIds.length === 0)
      return
    if (currentMatchIndex >= matchedMessageIds.length - 1)
      return

    setCurrentMatchIndex(prev => prev + 1)
  }, [matchedMessageIds.length, currentMatchIndex])

  const navigateNext = useCallback(() => {
    if (matchedMessageIds.length === 0)
      return
    if (currentMatchIndex <= 0)
      return

    setCurrentMatchIndex(prev => prev - 1)
  }, [matchedMessageIds.length, currentMatchIndex])

  const currentMatchId = useMemo(
    () => matchedMessageIds[currentMatchIndex] ?? null,
    [matchedMessageIds, currentMatchIndex],
  )

  const totalMatches = matchedMessageIds.length

  const canNavigatePrev = useMemo(
    () => totalMatches > 0 && currentMatchIndex < totalMatches - 1,
    [totalMatches, currentMatchIndex],
  )

  const canNavigateNext = useMemo(
    () => totalMatches > 0 && currentMatchIndex > 0,
    [totalMatches, currentMatchIndex],
  )

  const matchedMessageIdSet = useMemo(
    () => new Set(matchedMessageIds),
    [matchedMessageIds],
  )

  return useMemo(() => ({
    isSearchOpen,
    searchQuery,
    executedQuery,
    matchedMessageIds,
    currentMatchIndex,

    currentMatchId,
    totalMatches,
    canNavigatePrev,
    canNavigateNext,
    matchedMessageIdSet,

    openSearch,
    closeSearch,
    setSearchQuery,
    executeSearch,
    navigatePrev,
    navigateNext,
  }), [
    isSearchOpen,
    searchQuery,
    executedQuery,
    matchedMessageIds,
    currentMatchIndex,
    currentMatchId,
    totalMatches,
    canNavigatePrev,
    canNavigateNext,
    matchedMessageIdSet,
    openSearch,
    closeSearch,
    setSearchQuery,
    executeSearch,
    navigatePrev,
    navigateNext,
  ])
}
