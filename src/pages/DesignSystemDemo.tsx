import { useEffect, useState } from 'react'

import { Button } from '../components/ui/Button/Button'
import { ChatBubble, TypingIndicator } from '../components/ui/ChatBubble'
import { IconButton } from '../components/ui/IconButton/IconButton'
import { Input } from '../components/ui/Input/Input'
import { Skeleton } from '../components/ui/Skeleton/Skeleton'
import { useToast } from '../components/ui/Toast'
import { Toggle } from '../components/ui/Toggle/Toggle'
import { Typography } from '../components/ui/Typography/Typography'

// 간단한 아이콘 컴포넌트들
function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle
        cx="9"
        cy="9"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M14 14l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M5 10h10m0 0l-4-4m4 4l-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M16 6L7.5 14.5L4 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M5 17h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0012.586 3H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 3v4a1 1 0 001 1h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10 3v10m0 0l-4-4m4 4l4-4M3 17h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10 5v10m-5-5h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 간단한 아바타 컴포넌트
function Avatar({ children, size = 'md' }: { children: React.ReactNode, size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-action-primary text-inverse flex items-center justify-center font-medium shrink-0`}>
      {children}
    </div>
  )
}

// 스켈레톤 전환 데모 컴포넌트
function SkeletonTransitionDemo() {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleToggle = () => {
    setIsLoaded(false)
    setTimeout(() => setIsLoaded(true), 100)
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleToggle}>
        {isLoaded ? '다시 로딩' : '콘텐츠 로드'}
      </Button>

      <div className="space-y-3">
        <Skeleton
          variant="text"
          isLoaded={isLoaded}
        >
          <Typography variant="title">콘텐츠가 로드되었습니다!</Typography>
        </Skeleton>

        <Skeleton
          variant="text"
          isLoaded={isLoaded}
        >
          <Typography variant="body">
            이 텍스트는 스켈레톤에서 부드럽게 아래에서 위로 떠오릅니다.
          </Typography>
        </Skeleton>

        <Skeleton
          variant="button"
          isLoaded={isLoaded}
        >
          <Button variant="primary">액션 버튼</Button>
        </Skeleton>
      </div>
    </div>
  )
}

// 사용자 프로필 카드 데모
function SkeletonProfileDemo() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-start gap-4">
      {/* 아바타 */}
      <Skeleton
        variant="circular"
        isLoaded={isLoaded}
      >
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-inverse font-semibold">
          JD
        </div>
      </Skeleton>

      {/* 정보 */}
      <div className="flex-1 space-y-2">
        <Skeleton
          variant="text"
          className="w-[150px]"
          isLoaded={isLoaded}
        >
          <Typography variant="subtitle">홍길동</Typography>
        </Skeleton>

        <Skeleton
          variant="text"
          className="w-full"
          isLoaded={isLoaded}
        >
          <Typography
            variant="body"
            className="text-muted"
          >
            프론트엔드 개발자 | React 전문가
          </Typography>
        </Skeleton>

        <Skeleton
          variant="text"
          className="w-[80%]"
          isLoaded={isLoaded}
        >
          <Typography
            variant="caption"
            className="text-muted"
          >
            서울, 대한민국
          </Typography>
        </Skeleton>
      </div>

      {/* 액션 버튼 */}
      <Skeleton
        variant="button"
        className="w-20"
        isLoaded={isLoaded}
      >
        <Button
          size="sm"
          variant="outline"
        >
          팔로우
        </Button>
      </Skeleton>
    </div>
  )
}

// 블로그 카드 데모
function SkeletonBlogDemo() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="max-w-md">
      {/* 썸네일 이미지 */}
      <Skeleton
        variant="rectangular"
        className="h-48 rounded-lg"
        isLoaded={isLoaded}
      >
        <div className="h-48 rounded-lg bg-linear-to-br from-primary to-secondary" />
      </Skeleton>

      {/* 콘텐츠 */}
      <div className="mt-4 space-y-3">
        {/* 제목 */}
        <Skeleton
          variant="text"
          className="h-6 w-full"
          isLoaded={isLoaded}
        >
          <Typography
            variant="title"
            size="lg"
          >
            React 19의 새로운 기능들
          </Typography>
        </Skeleton>

        {/* 본문 */}
        <div className="space-y-2">
          <Skeleton
            variant="text"
            isLoaded={isLoaded}
          >
            <Typography variant="body">
              React 19에서는 서버 컴포넌트와 액션이 정식으로
            </Typography>
          </Skeleton>
          <Skeleton
            variant="text"
            isLoaded={isLoaded}
          >
            <Typography variant="body">
              도입되면서 더욱 강력한 성능 최적화가 가능해졌습니다.
            </Typography>
          </Skeleton>
          <Skeleton
            variant="text"
            className="w-[60%]"
            isLoaded={isLoaded}
          >
            <Typography variant="body">
              개발자 경험도 크게 향상되었습니다.
            </Typography>
          </Skeleton>
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-3 pt-2">
          <Skeleton
            variant="circular"
            className="h-8 w-8"
            isLoaded={isLoaded}
          >
            <div className="h-8 w-8 rounded-full bg-secondary" />
          </Skeleton>
          <Skeleton
            variant="text"
            className="h-3 w-[120px]"
            isLoaded={isLoaded}
          >
            <Typography
              variant="caption"
              className="text-muted"
            >
              김개발 · 2일 전
            </Typography>
          </Skeleton>
        </div>
      </div>
    </div>
  )
}

// 채팅 버블 타이핑 전환 데모
function ChatBubbleTypingDemo() {
  const [isTyping, setIsTyping] = useState(true)

  const handleReset = () => {
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 2000)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      <Button
        onClick={handleReset}
        size="sm"
        variant="outline"
      >
        다시 재생
      </Button>

      <div className="space-y-3">
        <ChatBubble
          avatar={<Avatar>AI</Avatar>}
          isTyping={isTyping}
          timestamp={isTyping ? undefined : '오후 3:24'}
        >
          안녕하세요! 무엇을 도와드릴까요?
        </ChatBubble>

        <ChatBubble
          avatar={<Avatar>AI</Avatar>}
          isTyping={isTyping}
          timestamp={isTyping ? undefined : '오후 3:24'}
        >
          디자인 시스템에 대해 궁금한 점이 있으시면 언제든 물어보세요.
        </ChatBubble>
      </div>
    </div>
  )
}

// 채팅 버블 타이프라이터 효과 데모
function ChatBubbleTypewriterDemo() {
  const [isTyping, setIsTyping] = useState(true)
  const [showTypewriter, setShowTypewriter] = useState(false)

  const handleReset = () => {
    setIsTyping(true)
    setShowTypewriter(false)
    setTimeout(() => {
      setIsTyping(false)
      setShowTypewriter(true)
    }, 2000)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false)
      setShowTypewriter(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handleReset}
          size="sm"
          variant="outline"
        >
          다시 재생
        </Button>
        <Typography
          variant="caption"
          className="text-muted flex items-center"
        >
          바운싱 도트 → 타이핑 효과
        </Typography>
      </div>

      <div className="space-y-3">
        <ChatBubble
          avatar={<Avatar>AI</Avatar>}
          isTyping={isTyping}
          typewriterEffect={showTypewriter}
          typingSpeed={50}
          timestamp={isTyping ? undefined : '오후 3:24'}
        >
          안녕하세요! 디자인 시스템에 대해 알려드리겠습니다.
        </ChatBubble>

        <ChatBubble
          avatar={<Avatar>AI</Avatar>}
          isTyping={isTyping}
          typewriterEffect={showTypewriter}
          typingSpeed={30}
          timestamp={isTyping ? undefined : '오후 3:24'}
        >
          이 시스템은 Tailwind CSS 4를 기반으로 하며, 시맨틱 토큰을 사용하여 일관된 UI를 제공합니다.
        </ChatBubble>
      </div>
    </div>
  )
}

export function DesignSystemDemo() {
  const [darkMode, setDarkMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    }
    else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-surface text-body transition-colors">
      {/* Header with Dark Mode Toggle */}
      <header className="border-b border-border-default bg-surface-sunken">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-xs">
          <Typography
            variant="title"
            size="2xl"
          >
            디자인 시스템 데모
          </Typography>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
            {' '}
            {darkMode ? '라이트 모드' : '다크 모드'}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Typography Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Typography
          </Typography>
          <div className="space-y-4 bg-surface-sunken p-6 rounded-lg">
            <Typography variant="display">Display Text</Typography>
            <Typography variant="hero">Hero Text</Typography>
            <Typography variant="title">Title Text</Typography>
            <Typography variant="subtitle">Subtitle Text</Typography>
            <Typography variant="body">Body Text - 이것은 기본 본문 텍스트입니다.</Typography>
            <Typography variant="caption">Caption Text - 작은 설명 텍스트</Typography>
            <Typography variant="label">Label Text</Typography>
          </div>
        </section>

        {/* Button Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Buttons
          </Typography>

          {/* Button Variants */}
          <div className="space-y-4">
            <Typography variant="subtitle">Variants</Typography>
            <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="space-y-4">
            <Typography variant="subtitle">Sizes</Typography>
            <div className="flex flex-wrap items-center gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Button States */}
          <div className="space-y-4">
            <Typography variant="subtitle">States</Typography>
            <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>

          {/* Buttons with Icons */}
          <div className="space-y-4">
            <Typography variant="subtitle">Buttons with Icons</Typography>

            {/* Left Icon */}
            <div className="space-y-2">
              <Typography
                variant="caption"
                className="text-muted"
              >
                Left Icon
              </Typography>
              <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
                <Button leftIcon={<SearchIcon />}>검색</Button>
                <Button
                  variant="secondary"
                  leftIcon={<PlusIcon />}
                >
                  추가
                </Button>
                <Button
                  variant="ghost"
                  leftIcon={<SaveIcon />}
                >
                  저장
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<DownloadIcon />}
                >
                  다운로드
                </Button>
              </div>
            </div>

            {/* Right Icon */}
            <div className="space-y-2">
              <Typography
                variant="caption"
                className="text-muted"
              >
                Right Icon
              </Typography>
              <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
                <Button rightIcon={<ArrowRightIcon />}>다음</Button>
                <Button
                  variant="secondary"
                  rightIcon={<ArrowRightIcon />}
                >
                  계속
                </Button>
                <Button
                  variant="outline"
                  rightIcon={<CheckIcon />}
                >
                  확인
                </Button>
              </div>
            </div>

            {/* Both Icons */}
            <div className="space-y-2">
              <Typography
                variant="caption"
                className="text-muted"
              >
                Both Icons
              </Typography>
              <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
                <Button
                  leftIcon={<SaveIcon />}
                  rightIcon={<CheckIcon />}
                >
                  저장하고 확인
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<SearchIcon />}
                  rightIcon={<ArrowRightIcon />}
                >
                  검색 시작
                </Button>
              </div>
            </div>

            {/* Different Sizes with Icons */}
            <div className="space-y-2">
              <Typography
                variant="caption"
                className="text-muted"
              >
                Icon Sizes (자동 조정)
              </Typography>
              <div className="flex flex-wrap items-center gap-3 bg-surface-sunken p-6 rounded-lg">
                <Button
                  size="sm"
                  leftIcon={<SearchIcon />}
                >
                  Small
                </Button>
                <Button
                  size="md"
                  leftIcon={<SearchIcon />}
                >
                  Medium
                </Button>
                <Button
                  size="lg"
                  leftIcon={<SearchIcon />}
                >
                  Large
                </Button>
              </div>
            </div>

            {/* Different Variants with Icons */}
            <div className="space-y-2">
              <Typography
                variant="caption"
                className="text-muted"
              >
                All Variants with Icons
              </Typography>
              <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
                <Button
                  variant="primary"
                  leftIcon={<CheckIcon />}
                >
                  Primary
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<CheckIcon />}
                >
                  Secondary
                </Button>
                <Button
                  variant="ghost"
                  leftIcon={<CheckIcon />}
                >
                  Ghost
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<CheckIcon />}
                >
                  Outline
                </Button>
                <Button
                  variant="danger"
                  leftIcon={<CheckIcon />}
                >
                  Danger
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Inputs
          </Typography>

          {/* Input Variants */}
          <div className="space-y-4">
            <Typography variant="subtitle">Variants</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-sunken p-6 rounded-lg">
              <Input
                variant="outlined"
                placeholder="Outlined Input"
              />
              <Input
                variant="filled"
                placeholder="Filled Input"
              />
              <Input
                variant="underlined"
                placeholder="Underlined Input"
              />
              <Input
                variant="ghost"
                placeholder="Ghost Input"
              />
            </div>
          </div>

          {/* Input Sizes */}
          <div className="space-y-4">
            <Typography variant="subtitle">Sizes</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-sunken p-6 rounded-lg">
              <Input
                size="xs"
                placeholder="Extra Small"
              />
              <Input
                size="sm"
                placeholder="Small"
              />
              <Input
                size="md"
                placeholder="Medium (Default)"
              />
              <Input
                size="lg"
                placeholder="Large"
              />
            </div>
          </div>

          {/* Input States */}
          <div className="space-y-4">
            <Typography variant="subtitle">States</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-sunken p-6 rounded-lg">
              <Input
                label="Email"
                placeholder="example@email.com"
                helperText="이메일 주소를 입력하세요"
              />
              <Input
                label="Password"
                type="password"
                error
                helperText="비밀번호가 일치하지 않습니다"
              />
              <Input
                label="Username"
                success
                helperText="사용 가능한 아이디입니다"
              />
              <Input
                label="Disabled"
                disabled
                placeholder="Disabled input"
                helperText="비활성화된 입력"
              />
            </div>
          </div>
        </section>

        {/* Toggle Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Toggles
          </Typography>

          {/* Toggle Variants */}
          <div className="space-y-4">
            <Typography variant="subtitle">Variants</Typography>
            <div className="flex flex-col gap-4 bg-surface-sunken p-6 rounded-lg">
              <Toggle
                variant="primary"
                label="Primary Toggle"
              />
              <Toggle
                variant="secondary"
                label="Secondary Toggle"
              />
              <Toggle
                variant="success"
                label="Success Toggle"
              />
            </div>
          </div>

          {/* Toggle Sizes */}
          <div className="space-y-4">
            <Typography variant="subtitle">Sizes</Typography>
            <div className="flex flex-col gap-4 bg-surface-sunken p-6 rounded-lg">
              <Toggle
                size="sm"
                label="Small Toggle"
              />
              <Toggle
                size="md"
                label="Medium Toggle (Default)"
              />
              <Toggle
                size="lg"
                label="Large Toggle"
              />
            </div>
          </div>

          {/* Toggle States */}
          <div className="space-y-4">
            <Typography variant="subtitle">States</Typography>
            <div className="flex flex-col gap-4 bg-surface-sunken p-6 rounded-lg">
              <Toggle label="Normal Toggle" />
              <Toggle
                label="Checked by Default"
                defaultChecked
              />
              <Toggle
                label="Disabled (Off)"
                disabled
              />
              <Toggle
                label="Disabled (On)"
                disabled
                defaultChecked
              />
            </div>
          </div>

          {/* Toggle Label Positions */}
          <div className="space-y-4">
            <Typography variant="subtitle">Label Positions</Typography>
            <div className="flex flex-col gap-4 bg-surface-sunken p-6 rounded-lg">
              <Toggle
                label="Label on Left"
                labelPosition="left"
              />
              <Toggle
                label="Label on Right"
                labelPosition="right"
              />
              <Toggle />
            </div>
          </div>

          {/* Toggle Controlled Example */}
          <div className="space-y-4">
            <Typography variant="subtitle">Controlled Toggle</Typography>
            <div className="bg-surface-sunken p-6 rounded-lg">
              <Toggle
                label={darkMode ? '다크 모드 활성화됨' : '다크 모드 비활성화됨'}
                checked={darkMode}
                onChange={setDarkMode}
              />
            </div>
          </div>
        </section>

        {/* Form Example */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Form Example
          </Typography>
          <div className="bg-surface-sunken p-8 rounded-lg max-w-md space-y-6">
            <Typography
              variant="title"
              size="xl"
            >
              회원가입
            </Typography>
            <Input
              label="이름"
              placeholder="홍길동"
              fullWidth
            />
            <Input
              label="이메일"
              type="email"
              placeholder="email@example.com"
              fullWidth
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="••••••••"
              fullWidth
            />
            <div className="flex gap-3">
              <Button
                variant="primary"
                fullWidth
              >
                가입하기
              </Button>
              <Button
                variant="outline"
                fullWidth
              >
                취소
              </Button>
            </div>
          </div>
        </section>

        {/* IconButton Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Icon Buttons
          </Typography>

          {/* IconButton Sizes */}
          <div className="space-y-4">
            <Typography variant="subtitle">Sizes</Typography>
            <div className="flex items-center gap-3 bg-surface-sunken p-6 rounded-lg">
              <IconButton
                size="sm"
                aria-label="작은 버튼"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
              <IconButton
                size="md"
                aria-label="중간 버튼"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
              <IconButton
                size="lg"
                aria-label="큰 버튼"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
            </div>
          </div>

          {/* IconButton Variants */}
          <div className="space-y-4">
            <Typography variant="subtitle">Variants</Typography>
            <div className="flex items-center gap-3 bg-surface-sunken p-6 rounded-lg">
              <IconButton
                variant="ghost"
                aria-label="Ghost 버튼"
              >
                ❤️
              </IconButton>
              <IconButton
                variant="outlined"
                aria-label="Outlined 버튼"
              >
                ⭐
              </IconButton>
              <IconButton
                variant="filled"
                aria-label="Filled 버튼"
              >
                ✓
              </IconButton>
            </div>
          </div>

          {/* IconButton Shapes */}
          <div className="space-y-4">
            <Typography variant="subtitle">Shapes</Typography>
            <div className="flex items-center gap-3 bg-surface-sunken p-6 rounded-lg">
              <IconButton
                shape="rounded"
                aria-label="둥근 사각형"
              >
                🔥
              </IconButton>
              <IconButton
                shape="circle"
                aria-label="원형"
              >
                🌙
              </IconButton>
            </div>
          </div>

          {/* IconButton States */}
          <div className="space-y-4">
            <Typography variant="subtitle">States</Typography>
            <div className="flex items-center gap-3 bg-surface-sunken p-6 rounded-lg">
              <IconButton aria-label="일반 버튼">
                🎯
              </IconButton>
              <IconButton
                disabled
                aria-label="비활성화 버튼"
              >
                🚫
              </IconButton>
            </div>
          </div>

          {/* IconButton Use Cases */}
          <div className="space-y-4">
            <Typography variant="subtitle">실제 사용 예시</Typography>
            <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
              <IconButton
                variant="ghost"
                aria-label="메뉴"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3 5h14M3 10h14M3 15h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
              <IconButton
                variant="ghost"
                aria-label="검색"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M14 14l4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
              <IconButton
                variant="ghost"
                aria-label="편집"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M14 3l3 3-9 9H5v-3l9-9z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
              <IconButton
                variant="ghost"
                aria-label="삭제"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3 5h14M8 5V3h4v2m-7 0v10a2 2 0 002 2h6a2 2 0 002-2V5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
              <IconButton
                variant="ghost"
                aria-label="더보기"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <circle
                    cx="10"
                    cy="5"
                    r="1.5"
                    fill="currentColor"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="1.5"
                    fill="currentColor"
                  />
                  <circle
                    cx="10"
                    cy="15"
                    r="1.5"
                    fill="currentColor"
                  />
                </svg>
              </IconButton>
            </div>
          </div>
        </section>

        {/* Toast Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Toasts
          </Typography>

          {/* Basic Toast */}
          <div className="space-y-4">
            <Typography variant="subtitle">기본 Toast (메시지만)</Typography>
            <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button onClick={() => toast('기본 메시지입니다')}>
                기본 Toast
              </Button>
              <Button onClick={() => toast({ message: '3초 후 사라집니다', duration: 3000 })}>
                3초 Toast
              </Button>
              <Button onClick={() => toast({ message: '자동으로 사라지지 않습니다', duration: 0 })}>
                영구 Toast
              </Button>
            </div>
          </div>

          {/* Toast Variants */}
          <div className="space-y-4">
            <Typography variant="subtitle">Variants</Typography>
            <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button
                variant="primary"
                onClick={() => toast.success('성공했습니다!')}
              >
                Success
              </Button>
              <Button
                variant="danger"
                onClick={() => toast.error('오류가 발생했습니다!')}
              >
                Error
              </Button>
              <Button onClick={() => toast.warning('주의가 필요합니다!')}>
                Warning
              </Button>
              <Button onClick={() => toast.info('정보를 확인하세요.')}>
                Info
              </Button>
            </div>
          </div>

          {/* Toast Options */}
          <div className="space-y-4">
            <Typography variant="subtitle">옵션</Typography>
            <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button onClick={() => toast({ message: '닫기 버튼이 있습니다', showClose: true })}>
                Close 버튼
              </Button>
              <Button onClick={() => toast({ message: 'Progress bar가 있습니다', showProgress: true })}>
                Progress Bar
              </Button>
              <Button onClick={() => toast({
                message: '모든 옵션',
                showClose: true,
                showProgress: true,
                duration: 5000,
              })}
              >
                All Options
              </Button>
            </div>
          </div>

          {/* Toast Positions */}
          <div className="space-y-4">
            <Typography variant="subtitle">위치</Typography>
            <div className="grid grid-cols-3 gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button onClick={() => toast({ message: 'Top Left', position: 'top-left' })}>
                Top Left
              </Button>
              <Button onClick={() => toast({ message: 'Top Center', position: 'top-center' })}>
                Top Center
              </Button>
              <Button onClick={() => toast({ message: 'Top Right', position: 'top-right' })}>
                Top Right
              </Button>
              <Button onClick={() => toast({ message: 'Bottom Left', position: 'bottom-left' })}>
                Bottom Left
              </Button>
              <Button onClick={() => toast({ message: 'Bottom Center', position: 'bottom-center' })}>
                Bottom Center
              </Button>
              <Button onClick={() => toast({ message: 'Bottom Right', position: 'bottom-right' })}>
                Bottom Right
              </Button>
            </div>
          </div>

          {/* Custom Content */}
          <div className="space-y-4">
            <Typography variant="subtitle">커스텀 콘텐츠</Typography>
            <div className="flex flex-wrap gap-3 bg-surface-sunken p-6 rounded-lg">
              <Button onClick={() => toast({
                children: (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-action-primary flex items-center justify-center text-inverse">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold">파일 업로드 완료</p>
                      <p className="text-sm opacity-80">document.pdf (2.5 MB)</p>
                    </div>
                  </div>
                ),
                showClose: true,
                duration: 5000,
              })}
              >
                커스텀 Toast
              </Button>
            </div>
          </div>
        </section>

        {/* Color Tokens Demo */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Color Tokens
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Primary', class: 'bg-primary' },
              { name: 'Secondary', class: 'bg-secondary' },
              { name: 'Success', class: 'bg-success' },
              { name: 'Error', class: 'bg-error' },
              { name: 'Warning', class: 'bg-warning' },
              { name: 'Info', class: 'bg-info' },
            ].map(color => (
              <div
                key={color.name}
                className="space-y-2"
              >
                <div className={`${color.class} h-20 rounded-lg`} />
                <Typography variant="caption">{color.name}</Typography>
              </div>
            ))}
          </div>
        </section>

        {/* Skeleton Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Skeleton Loading
          </Typography>

          {/* Basic Variants */}
          <div className="space-y-4">
            <Typography variant="subtitle">기본 Variants</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-sunken p-6 rounded-lg">
              {/* Text Variant */}
              <div className="space-y-2">
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  Text (기본)
                </Typography>
                <Skeleton variant="text" />
                <Skeleton
                  variant="text"
                  className="w-[80%]"
                />
                <Skeleton
                  variant="text"
                  className="w-[60%]"
                />
              </div>

              {/* Circular Variant */}
              <div className="space-y-2">
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  Circular (아바타)
                </Typography>
                <Skeleton variant="circular" />
              </div>

              {/* Rectangular Variant */}
              <div className="space-y-2">
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  Rectangular (이미지)
                </Typography>
                <Skeleton variant="rectangular" />
              </div>

              {/* Button Variant */}
              <div className="space-y-2">
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  Button
                </Typography>
                <Skeleton variant="button" />
              </div>
            </div>
          </div>

          {/* Loading Transition Demo */}
          <div className="space-y-4">
            <Typography variant="subtitle">자동 전환 데모 (isLoaded)</Typography>
            <div className="bg-surface-sunken p-6 rounded-lg">
              <SkeletonTransitionDemo />
            </div>
          </div>

          {/* Real Use Cases */}
          <div className="space-y-4">
            <Typography variant="subtitle">실제 사용 예시</Typography>

            {/* User Profile Card */}
            <div className="space-y-3">
              <Typography
                variant="caption"
                className="text-muted"
              >
                사용자 프로필 카드
              </Typography>
              <div className="bg-surface-sunken p-6 rounded-lg">
                <SkeletonProfileDemo />
              </div>
            </div>

            {/* Blog Card */}
            <div className="space-y-3">
              <Typography
                variant="caption"
                className="text-muted"
              >
                블로그 카드
              </Typography>
              <div className="bg-surface-sunken p-6 rounded-lg">
                <SkeletonBlogDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Chat Bubble Section */}
        <section className="space-y-6">
          <Typography
            variant="hero"
            className="text-heading"
          >
            Chat Bubbles
          </Typography>

          {/* Basic Variants */}
          <div className="space-y-4">
            <Typography variant="subtitle">Variants</Typography>
            <div className="space-y-3 bg-surface-sunken p-6 rounded-lg">
              <ChatBubble variant="default">
                안녕하세요! 기본 말풍선입니다.
              </ChatBubble>
              <ChatBubble variant="outlined">
                아웃라인 스타일 말풍선입니다.
              </ChatBubble>
              <ChatBubble variant="minimal">
                미니멀 스타일 말풍선입니다.
              </ChatBubble>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <Typography variant="subtitle">Sizes</Typography>
            <div className="space-y-3 bg-surface-sunken p-6 rounded-lg">
              <ChatBubble size="sm">
                작은 크기 말풍선입니다.
              </ChatBubble>
              <ChatBubble size="md">
                중간 크기 말풍선입니다.
              </ChatBubble>
              <ChatBubble size="lg">
                큰 크기 말풍선입니다.
              </ChatBubble>
            </div>
          </div>

          {/* With Avatar */}
          <div className="space-y-4">
            <Typography variant="subtitle">With Avatar</Typography>
            <div className="space-y-3 bg-surface-sunken p-6 rounded-lg">
              <ChatBubble
                avatar={<Avatar size="sm">AI</Avatar>}
                size="sm"
              >
                아바타가 있는 작은 말풍선입니다.
              </ChatBubble>
              <ChatBubble
                avatar={<Avatar>AI</Avatar>}
              >
                아바타가 있는 기본 말풍선입니다.
              </ChatBubble>
              <ChatBubble
                avatar={<Avatar size="lg">AI</Avatar>}
                size="lg"
              >
                아바타가 있는 큰 말풍선입니다.
              </ChatBubble>
            </div>
          </div>

          {/* With Timestamp */}
          <div className="space-y-4">
            <Typography variant="subtitle">With Timestamp</Typography>
            <div className="space-y-3 bg-surface-sunken p-6 rounded-lg">
              <ChatBubble
                avatar={<Avatar>AI</Avatar>}
                timestamp="오후 2:30"
              >
                타임스탬프가 포함된 말풍선입니다.
              </ChatBubble>
              <ChatBubble
                avatar={<Avatar>AI</Avatar>}
                timestamp="오후 2:31"
                variant="outlined"
              >
                아웃라인 스타일에 타임스탬프가 있습니다.
              </ChatBubble>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="space-y-4">
            <Typography variant="subtitle">Typing Indicator</Typography>

            {/* Standalone Typing Indicators */}
            <div className="space-y-3">
              <Typography
                variant="caption"
                className="text-muted"
              >
                독립 컴포넌트
              </Typography>
              <div className="flex items-center gap-4 bg-surface-sunken p-6 rounded-lg">
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="caption"
                    className="text-muted"
                  >
                    Small
                  </Typography>
                  <TypingIndicator size="sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="caption"
                    className="text-muted"
                  >
                    Medium
                  </Typography>
                  <TypingIndicator size="md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="caption"
                    className="text-muted"
                  >
                    Large
                  </Typography>
                  <TypingIndicator size="lg" />
                </div>
              </div>
            </div>

            {/* In Chat Bubbles */}
            <div className="space-y-3">
              <Typography
                variant="caption"
                className="text-muted"
              >
                말풍선 내 타이핑 인디케이터
              </Typography>
              <div className="space-y-3 bg-surface-sunken p-6 rounded-lg">
                <ChatBubble
                  avatar={<Avatar size="sm">AI</Avatar>}
                  isTyping
                  size="sm"
                />
                <ChatBubble
                  avatar={<Avatar>AI</Avatar>}
                  isTyping
                />
                <ChatBubble
                  avatar={<Avatar size="lg">AI</Avatar>}
                  isTyping
                  size="lg"
                />
              </div>
            </div>

            {/* Typing to Text Transition */}
            <div className="space-y-3">
              <Typography
                variant="caption"
                className="text-muted"
              >
                타이핑 → 텍스트 전환 데모
              </Typography>
              <div className="bg-surface-sunken p-6 rounded-lg">
                <ChatBubbleTypingDemo />
              </div>
            </div>

            {/* Typewriter Effect */}
            <div className="space-y-3">
              <Typography
                variant="caption"
                className="text-muted"
              >
                타이프라이터 효과 (글자 하나씩)
              </Typography>
              <div className="bg-surface-sunken p-6 rounded-lg">
                <ChatBubbleTypewriterDemo />
              </div>
            </div>
          </div>

          {/* Chat Conversation Example */}
          <div className="space-y-4">
            <Typography variant="subtitle">채팅 대화 예시</Typography>
            <div className="bg-surface-sunken p-6 rounded-lg max-w-2xl">
              <div className="space-y-4">
                <ChatBubble
                  avatar={<Avatar>AI</Avatar>}
                  timestamp="오후 2:30"
                >
                  안녕하세요! 무엇을 도와드릴까요?
                </ChatBubble>

                <div className="flex justify-end">
                  <ChatBubble
                    variant="outlined"
                    timestamp="오후 2:31"
                  >
                    디자인 시스템에 대해 알고 싶어요.
                  </ChatBubble>
                </div>

                <ChatBubble
                  avatar={<Avatar>AI</Avatar>}
                  timestamp="오후 2:31"
                >
                  좋습니다! 우리 디자인 시스템은 Tailwind CSS 4를 기반으로 하며,
                  시맨틱 토큰을 사용하여 일관된 UI를 제공합니다.
                </ChatBubble>

                <ChatBubble
                  avatar={<Avatar>AI</Avatar>}
                  isTyping
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-default bg-surface-sunken mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <Typography
            variant="body"
            className="text-muted"
          >
            Tailwind CSS 4 + React + TypeScript 디자인 시스템
          </Typography>
        </div>
      </footer>
    </div>
  )
}
