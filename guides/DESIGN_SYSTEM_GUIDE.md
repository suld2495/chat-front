# 디자인 시스템 구현 가이드

> React 19 + Vite + TypeScript + Tailwind CSS 4 기반 디자인 시스템

---

## 📋 목차

1. [기본 원칙](#기본-원칙)
2. [파일 구조](#파일-구조)
3. [토큰 시스템](#토큰-시스템)
4. [컴포넌트 스펙](#컴포넌트-스펙)
5. [다크 모드](#다크-모드)
6. [구현 예시](#구현-예시)

---

## 기본 원칙

### 1. Tailwind Raw 시스템 활용
- ✅ Tailwind의 기본 컬러, 스페이싱, 타이포그래피 사용
- ❌ 중복 정의 불필요 (gray-50~950, spacing 등)
- 필요한 추상화만 추가

### 2. 2-Layer Token 구조
```
Tailwind Raw (기본 제공: --color-blue-*, --color-gray-*)
    ↓
Semantic Tokens (의미 기반: action-primary, surface, heading 등)
```

### 3. 캡슐화 원칙
- **토큰**: 컴포넌트 내부에서만 사용
- **Props**: 외부 API로 노출
- 개발자는 Props만 사용, 토큰은 직접 접근 불가

```tsx
// ❌ 잘못된 사용
<button className="bg-action-primary">Wrong</button>

// ✅ 올바른 사용
<Button variant="primary">Correct</Button>
```

---

## 파일 구조

```
src/
├── styles/
│   ├── theme/
│   │   └── semantic.css       # 시맨틱 토큰 (모든 토큰 정의)
│   └── index.css               # 진입점 (Tailwind + 토큰 import)
└── components/
    └── ui/
        ├── Button/
        │   └── Button.tsx
        ├── Input/
        │   └── Input.tsx
        ├── Typography/
        │   └── Typography.tsx
        ├── Toast/
        │   ├── Toast.tsx
        │   ├── ToastContainer.tsx
        │   └── ToastContext.tsx
        ├── Toggle/
        │   └── Toggle.tsx
        ├── IconButton/
        │   └── IconButton.tsx
        ├── Skeleton/
        │   └── Skeleton.tsx
        └── ChatBubble/
            ├── ChatBubble.tsx
            └── TypingIndicator.tsx
```

---

## 토큰 시스템

### Semantic Tokens (`styles/theme/semantic.css`)

#### 1. Brand Colors (주 컬러 및 변형)
```css
@theme {
  --color-brand-50: var(--color-blue-50);
  --color-brand-100: var(--color-blue-100);
  /* ... 100 ~ 900 */
  --color-brand-900: var(--color-blue-900);
}
```

#### 2. Action Colors (버튼/링크 액션)
```css
/* Primary Actions (저장, 확인, 제출) */
--color-action-primary: var(--color-blue-600);
--color-action-primary-hover: var(--color-blue-700);
--color-action-primary-active: var(--color-blue-800);
--color-action-primary-disabled: var(--color-blue-300);

/* Secondary Actions (취소, 닫기) */
--color-action-secondary: var(--color-gray-600);
--color-action-secondary-hover: var(--color-gray-700);

/* Destructive Actions (삭제, 제거) */
--color-action-destructive: var(--color-red-600);
--color-action-destructive-hover: var(--color-red-700);

/* Ghost Actions (투명 버튼) */
--color-action-ghost-hover: var(--color-gray-100);
```

**사용 예시**:
```tsx
className="bg-action-primary hover:bg-action-primary-hover"
```

#### 3. Content Colors (텍스트)
```css
/* Text Hierarchy */
--color-heading: var(--color-gray-900);
--color-title: var(--color-gray-800);
--color-subtitle: var(--color-gray-700);

/* Body Text */
--color-body: var(--color-gray-700);
--color-body-secondary: var(--color-gray-600);
--color-body-tertiary: var(--color-gray-500);

/* Special Text */
--color-muted: var(--color-gray-500);
--color-disabled: var(--color-gray-400);
--color-placeholder: var(--color-gray-400);
--color-link: var(--color-blue-600);
--color-link-hover: var(--color-blue-700);
--color-inverse: var(--color-white);
```

**사용 예시**:
```tsx
className="text-heading"
className="text-body"
className="text-link hover:text-link-hover"
```

#### 4. Surface Colors (배경)
```css
/* Surface Levels */
--color-surface: var(--color-white);
--color-surface-raised: var(--color-white);
--color-surface-sunken: var(--color-gray-50);
--color-surface-overlay: var(--color-white);

/* Interactive Backgrounds */
--color-hover: var(--color-gray-100);
--color-active: var(--color-gray-200);
--color-selected: var(--color-blue-50);
--color-disabled-bg: var(--color-gray-100);
```

**사용 예시**:
```tsx
className="bg-surface"
className="bg-surface-raised"
className="hover:bg-hover"
```

#### 5. Border Colors (경계선)
```css
/* Border Variants */
--color-border-default: var(--color-gray-200);
--color-border-subtle: var(--color-gray-100);
--color-border-emphasis: var(--color-gray-300);
--color-border-strong: var(--color-gray-400);

/* Interactive Borders */
--color-border-hover: var(--color-gray-300);
--color-border-focus: var(--color-blue-600);
--color-border-error: var(--color-red-600);
--color-border-success: var(--color-green-600);

/* Dividers */
--color-divider: var(--color-gray-100);
--color-divider-emphasis: var(--color-gray-200);
```

**사용 예시**:
```tsx
className="border border-border-default focus:border-border-focus"
```

#### 6. Feedback Colors (피드백/상태)
```css
/* Success */
--color-success-bg: var(--color-green-50);
--color-success-border: var(--color-green-200);
--color-success-text: var(--color-green-800);
--color-success-icon: var(--color-green-600);

/* Error */
--color-error-bg: var(--color-red-50);
--color-error-border: var(--color-red-200);
--color-error-text: var(--color-red-800);
--color-error-icon: var(--color-red-600);

/* Warning */
--color-warning-bg: var(--color-amber-50);
--color-warning-border: var(--color-amber-200);
--color-warning-text: var(--color-amber-800);
--color-warning-icon: var(--color-amber-600);

/* Info */
--color-info-bg: var(--color-sky-50);
--color-info-border: var(--color-sky-200);
--color-info-text: var(--color-sky-800);
--color-info-icon: var(--color-sky-600);
```

**사용 예시**:
```tsx
className="bg-success-bg border-success-border text-success-text"
```

---

## 컴포넌트 스펙

### 1. Button

#### Props
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

#### Size 옵션
- `sm`: 작은 버튼 (32px, 14px font)
- `md`: 기본 버튼 (40px, 16px font) - 기본값
- `lg`: 큰 버튼 (48px, 18px font)

#### Variant 옵션
- `primary`: 주요 액션 (파란색 배경)
- `secondary`: 보조 액션 (회색 배경)
- `ghost`: 투명 배경
- `outline`: 테두리만
- `danger`: 위험 액션 (빨간색)

#### 사용 예시
```tsx
<Button size="md" variant="primary">저장</Button>
<Button size="sm" variant="secondary">취소</Button>
<Button size="lg" variant="danger">삭제</Button>
<Button variant="ghost" leftIcon={<Icon />}>더보기</Button>
```

---

### 2. Input

#### Props
```tsx
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled' | 'underlined' | 'ghost'
  error?: boolean
  success?: boolean
  fullWidth?: boolean
  label?: string
  helperText?: string
}
```

#### Size 옵션
- `xs`: 매우 작음 (28px) - 인라인, 필터
- `sm`: 작음 (32px) - 컴팩트 폼
- `md`: 기본 (40px) - 기본값
- `lg`: 큼 (48px) - 랜딩 페이지, CTA

#### Variant 옵션
- `outlined`: 전체 테두리 (기본)
- `filled`: 배경색, 테두리 없음
- `underlined`: 아래 테두리만
- `ghost`: 투명, 미니멀

#### State 옵션
- `error`: 에러 상태 (빨간색 테두리)
- `success`: 성공 상태 (초록색 테두리)
- `disabled`: 비활성화

#### 사용 예시
```tsx
<Input size="md" variant="outlined" placeholder="이메일" />
<Input size="md" variant="filled" placeholder="비밀번호" />
<Input size="sm" variant="underlined" placeholder="검색" />
<Input size="md" variant="outlined" error helperText="필수 항목입니다" />
<Input size="lg" variant="filled" success />
```

---

### 3. Typography

#### Props
```tsx
interface TypographyProps {
  variant?: 'display' | 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'label'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label'
  className?: string
  children: React.ReactNode
}
```

#### Variant 기본 설정
```tsx
const variantConfig = {
  display: { size: '6xl', tag: 'h1', weight: 'bold' },
  hero: { size: '5xl', tag: 'h1', weight: 'bold' },
  title: { size: '4xl', tag: 'h2', weight: 'bold' },
  subtitle: { size: '2xl', tag: 'h3', weight: 'semibold' },
  body: { size: 'base', tag: 'p', weight: 'normal' },
  caption: { size: 'sm', tag: 'span', weight: 'normal' },
  label: { size: 'xs', tag: 'label', weight: 'medium' },
}
```

#### 사용 예시
```tsx
// 기본 사용
<Typography variant="title">페이지 제목</Typography>
<Typography variant="body">본문 텍스트</Typography>

// Size 오버라이드
<Typography variant="title" size="6xl">큰 제목</Typography>

// Tag 오버라이드 (SEO)
<Typography variant="title" as="h1">메인 제목</Typography>
```

---

### 4. Toast

#### Props
```tsx
interface ToastProps {
  message?: string
  children?: React.ReactNode
  duration?: number           // Auto-dismiss 시간 (ms), 기본: 3000
  showClose?: boolean         // 닫기 버튼 표시, 기본: false
  showProgress?: boolean      // Progress bar 표시, 기본: false
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
  className?: string
}
```

#### Variant 옵션
- `default`: 기본 스타일 (흰색 배경)
- `success`: 성공 메시지 (초록색)
- `error`: 에러 메시지 (빨간색)
- `warning`: 경고 메시지 (주황색)
- `info`: 정보 메시지 (파란색)

#### 사용 예시
```tsx
<Toast variant="success" message="저장되었습니다" duration={3000} />
<Toast variant="error" showClose>에러가 발생했습니다</Toast>
<Toast variant="info" showProgress duration={5000}>
  업로드 중입니다...
</Toast>
```

---

### 5. Toggle

#### Props
```tsx
interface ToggleProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success'
  checked?: boolean           // Controlled mode
  defaultChecked?: boolean    // Uncontrolled mode
  label?: string
  labelPosition?: 'left' | 'right'
  disabled?: boolean
  onChange?: (checked: boolean) => void
}
```

#### Size 옵션
- `sm`: 작은 토글 (32×16px)
- `md`: 기본 토글 (44×24px) - 기본값
- `lg`: 큰 토글 (56×28px)

#### Variant 옵션
- `primary`: 파란색 (기본)
- `secondary`: 회색
- `success`: 초록색

#### 사용 예시
```tsx
// Uncontrolled
<Toggle defaultChecked label="알림 받기" />

// Controlled
<Toggle
  checked={isEnabled}
  onChange={setIsEnabled}
  label="다크 모드"
  labelPosition="right"
/>
```

---

### 6. IconButton

#### Props
```tsx
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outlined' | 'filled'
  shape?: 'circle' | 'rounded'
}
```

#### Size 옵션
- `sm`: 24×24px
- `md`: 32×32px (기본)
- `lg`: 40×40px

#### Variant 옵션
- `ghost`: 투명 배경, hover 시 배경색
- `outlined`: 테두리
- `filled`: 채워진 배경

#### Shape 옵션
- `circle`: 원형
- `rounded`: 둥근 모서리 (기본)

#### 사용 예시
```tsx
<IconButton variant="ghost" shape="circle">
  <SearchIcon />
</IconButton>

<IconButton variant="filled" size="lg">
  <DeleteIcon />
</IconButton>
```

---

### 7. Skeleton

#### Props
```tsx
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'button'
  isLoaded?: boolean          // 로딩 완료 여부
  fadeDuration?: number       // Fade-in 지속시간 (ms), 기본: 600
  children?: React.ReactNode  // 로딩 완료 후 표시할 내용
}
```

#### Variant 옵션
- `text`: 텍스트 줄 (기본)
- `circular`: 원형 (아바타)
- `rectangular`: 직사각형 (카드 이미지)
- `button`: 버튼 형태

#### 사용 예시
```tsx
// 로딩 중
<Skeleton variant="text" />
<Skeleton variant="circular" />

// 로딩 완료 후 fade-in
<Skeleton isLoaded={isDataLoaded}>
  <UserProfile data={userData} />
</Skeleton>
```

---

### 8. ChatBubble

#### Props
```tsx
interface ChatBubbleProps {
  variant?: 'default' | 'outlined' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  isTyping?: boolean          // 타이핑 인디케이터 표시
  typewriterEffect?: boolean  // 타이프라이터 효과
  typingSpeed?: number        // 타이프라이터 속도 (ms), 기본: 50
  avatar?: React.ReactNode
  timestamp?: string
  children?: React.ReactNode
}
```

#### Variant 옵션
- `default`: 기본 배경색
- `outlined`: 테두리만
- `minimal`: 최소 스타일

#### Size 옵션
- `sm`: 작은 말풍선 (12px/8px padding, 14px font)
- `md`: 기본 말풍선 (16px/10px padding, 16px font)
- `lg`: 큰 말풍선 (20px/12px padding, 18px font)

#### 사용 예시
```tsx
// 타이핑 중
<ChatBubble isTyping avatar={<Avatar />} />

// 타이프라이터 효과
<ChatBubble typewriterEffect typingSpeed={50}>
  안녕하세요!
</ChatBubble>

// 타임스탬프 포함
<ChatBubble
  variant="outlined"
  avatar={<Avatar />}
  timestamp="오후 3:24"
>
  메시지 내용
</ChatBubble>
```

---

## 다크 모드

### 설정 (`styles/index.css`)

```css
@import "tailwindcss";

/* 다크 모드 variant 정의 */
@custom-variant dark (&:where(.dark, .dark *));

/* 토큰 imports */
@import "./theme/semantic.css";
```

### 다크 모드 토큰 (`styles/theme/semantic.css`)

```css
@layer theme {
  .dark {
    /* Action Colors */
    --color-action-primary: var(--color-blue-500);
    --color-action-primary-hover: var(--color-blue-400);

    /* Content Colors */
    --color-heading: var(--color-gray-50);
    --color-body: var(--color-gray-300);

    /* Surface Colors */
    --color-surface: var(--color-gray-900);
    --color-surface-raised: var(--color-gray-800);

    /* Border Colors */
    --color-border-default: var(--color-gray-700);
    --color-border-focus: var(--color-blue-500);

    /* Feedback Colors */
    --color-success-bg: var(--color-green-950);
    --color-error-bg: var(--color-red-950);
  }
}
```

### 다크 모드 토글

```tsx
// App.tsx 또는 Layout.tsx
const [darkMode, setDarkMode] = useState(false)

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, [darkMode])

<Toggle
  checked={darkMode}
  onChange={setDarkMode}
  label={darkMode ? '🌙' : '☀️'}
/>
```

---

## 구현 예시

### Button 컴포넌트 구현

```tsx
// components/ui/Button/Button.tsx
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  size = 'md',
  variant = 'primary',
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg px-6',
  }

  const variantClasses = {
    primary: 'bg-action-primary hover:bg-action-primary-hover text-inverse',
    secondary: 'bg-action-secondary hover:bg-action-secondary-hover text-inverse',
    ghost: 'bg-transparent hover:bg-action-ghost-hover text-body',
    outline: 'border border-border-default hover:border-border-hover text-body',
    danger: 'bg-action-destructive hover:bg-action-destructive-hover text-inverse',
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-lg font-medium',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon && (
        <span className={cn('inline-flex', iconSizeClasses[size])}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className={cn('inline-flex', iconSizeClasses[size])}>
          {rightIcon}
        </span>
      )}
    </button>
  )
}
```

### Input 컴포넌트 구현

```tsx
// components/ui/Input/Input.tsx
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled' | 'underlined' | 'ghost'
  error?: boolean
  success?: boolean
  fullWidth?: boolean
  helperText?: string
  label?: string
}

export const Input = ({
  size = 'md',
  variant = 'outlined',
  error,
  success,
  fullWidth,
  helperText,
  label,
  className,
  ...props
}: InputProps) => {
  const sizeClasses = {
    xs: "h-7 text-xs px-2",
    sm: "h-8 text-sm px-3",
    md: "h-10 text-base px-4",
    lg: "h-12 text-lg px-5",
  }

  const variantClasses = {
    outlined: "border border-border-default bg-surface rounded-lg focus:border-border-focus",
    filled: "border-0 bg-surface-sunken rounded-t-lg hover:bg-hover",
    underlined: "border-0 border-b border-border-default rounded-none bg-transparent",
    ghost: "border-0 bg-transparent focus:bg-hover",
  }

  const stateClasses = cn(
    error && "border-border-error focus:border-border-error",
    success && "border-border-success focus:border-border-success",
  )

  return (
    <div className={cn(fullWidth && "w-full")}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-body">
          {label}
        </label>
      )}
      <input
        className={cn(
          "transition-colors outline-none text-body placeholder:text-placeholder",
          sizeClasses[size],
          variantClasses[variant],
          stateClasses,
          props.disabled && "opacity-50 cursor-not-allowed",
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          "text-xs mt-1",
          error && "text-error-text",
          success && "text-success-text",
          !error && !success && "text-muted"
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
}
```

---

## 참고 자료

- [Tailwind CSS Theme](https://tailwindcss.com/docs/theme)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Semantic Color Tokens](https://www.epicweb.dev/tutorials/tailwind-color-tokens)
- [Material UI vs Chakra vs Ant Design](https://www.locofy.ai/blog/material-vs-chakra-vs-bootstrap-vs-ant-design)

---

## 구현 완료 현황

✅ **완료된 컴포넌트**:
1. ✅ Button (leftIcon, rightIcon 지원)
2. ✅ Input (4가지 variant, 상태 관리)
3. ✅ Typography (variant 기반 텍스트)
4. ✅ Toast (variant, progress, auto-dismiss)
5. ✅ Toggle (controlled/uncontrolled, labelPosition)
6. ✅ IconButton (shape, variant)
7. ✅ Skeleton (fade-in, variant)
8. ✅ ChatBubble (typewriter, typing indicator, avatar)

✅ **완료된 시스템**:
- ✅ Semantic Token System (Action, Content, Surface, Border, Feedback)
- ✅ Dark Mode 지원 (모든 토큰)
- ✅ Tailwind CSS 4 기반 구조
- ✅ TypeScript 타입 안전성
