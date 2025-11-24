import type { User } from './api'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { searchUsers } from './api'
import { ChatWidget } from './components/chat/ChatWidget'
import { Typography } from './components/ui/Typography/Typography'
import { queryKeys, useCreateUser } from './hooks/api'

function App() {
  const defaultNickname = useMemo(
    () => import.meta.env.VITE_DEMO_NICKNAME || '',
    [],
  )

  const [nickname, setNickname] = useState(defaultNickname)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const trimmedNickname = nickname.trim()

  const {
    refetch: searchUserRefetch,
    isFetching: isSearching,
  } = useQuery({
    queryKey: queryKeys.users.search(trimmedNickname || 'pending'),
    queryFn: () => searchUsers(trimmedNickname),
    enabled: false,
    retry: 0,
  })

  const {
    mutateAsync: createUser,
    isPending: isCreating,
  } = useCreateUser()

  const handleStartChat = async () => {
    setError(null)
    if (!trimmedNickname) {
      setError('닉네임을 입력해 주세요.')
      return
    }

    try {
      // 1) 닉네임으로 사용자 조회
      const searchResult = await searchUserRefetch()
      const matched = searchResult.data?.find(user => user.nickname === trimmedNickname)
        ?? searchResult.data?.[0]

      if (matched) {
        setCurrentUser(matched)
        return
      }

      // 2) 없으면 사용자 생성
      const created = await createUser({ nickname: trimmedNickname })
      setCurrentUser(created)
    }
    catch (err) {
      const message = err instanceof Error ? err.message : '사용자 생성/조회 중 오류가 발생했습니다.'
      setError(message)
    }
  }

  const isLoadingUser = isSearching || isCreating
  const canStart = Boolean(trimmedNickname) && !isLoadingUser
  const currentUserId = currentUser?.id ?? ''

  return (
    <div className="min-h-screen bg-surface text-body flex items-center justify-center">
      <div className="text-center space-y-6">
        <Typography
          variant="hero"
          className="text-heading"
        >
          Chat Application
        </Typography>
        <Typography
          variant="body"
          className="text-muted"
        >
          채팅 앱이 여기에 구현될 예정입니다.
        </Typography>
        <Typography
          variant="caption"
          className="text-muted"
        >
          디자인 시스템 데모는
          {' '}
          <a
            href="/design-system.html"
            className="text-link hover:underline"
          >
            여기
          </a>
          에서 확인하세요.
        </Typography>

        <div className="max-w-md mx-auto mt-6 text-left space-y-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-heading">
              사용자 닉네임
            </span>
            <input
              type="text"
              value={nickname}
              onChange={event => setNickname(event.target.value)}
              placeholder="닉네임을 입력하면 사용자 조회 후 없으면 생성합니다."
              className="w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-body focus:border-border-focus focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartChat}
              disabled={!canStart}
              className="px-4 py-2 rounded-lg bg-action-primary text-inverse font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoadingUser ? '처리 중...' : '채팅 시작'}
            </button>
            {currentUser && (
              <span className="text-sm text-muted">
                사용자 ID:
                {' '}
                {currentUser.id}
              </span>
            )}
          </div>
          {error && (
            <div className="text-sm text-danger">
              {error}
            </div>
          )}
          {!currentUser && (
            <p className="text-xs text-muted">
              배포 환경에서도 닉네임 기반으로 사용자 조회 후 필요 시 자동 생성합니다.
            </p>
          )}
        </div>
      </div>
      <ChatWidget currentUserId={currentUserId} />
    </div>
  )
}

export default App
