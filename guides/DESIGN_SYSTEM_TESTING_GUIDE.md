# 디자인 시스템 테스트 가이드

## 📋 목차

1. [테스트 전략 개요](#테스트-전략-개요)
2. [테스트 유형별 가이드](#테스트-유형별-가이드)
3. [컴포넌트별 테스트 체크리스트](#컴포넌트별-테스트-체크리스트)
4. [실전 예시](#실전-예시)
5. [Best Practices](#best-practices)

## 테스트 전략 개요

### 왜 디자인 시스템을 테스트하는가?

1. **일관성 보장**: 모든 컴포넌트가 디자인 명세를 따르는지 확인
2. **회귀 방지**: 변경 사항이 다른 컴포넌트에 영향을 주지 않는지 검증
3. **접근성 준수**: 모든 사용자가 사용할 수 있는지 확인
4. **신뢰성**: 프로덕션 환경에서 안정적으로 작동하는지 보장

### 테스트 피라미드

```
        ┌──────────────┐
        │  시각적 회귀  │  < 10%
        │  (E2E)       │
        ├──────────────┤
        │  인터랙션     │  < 30%
        │  (Integration)│
        ├──────────────┤
        │  구조/단위    │  > 60%
        │  (Unit)      │
        └──────────────┘
```

## 테스트 유형별 가이드

### 1. 구조 테스트 (Vitest + RTL)

**목적**: 컴포넌트가 올바르게 렌더링되고 props를 받는지 검증

#### 체크리스트

- ✅ 기본 렌더링
- ✅ Props 반영 (variant, size, disabled 등)
- ✅ Children 렌더링
- ✅ className 병합
- ✅ 기본값 적용
- ✅ 조건부 렌더링
- ✅ ARIA 속성 존재

#### 예시: Button 컴포넌트

```typescript
describe('Button - Structure', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-action-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-action-secondary')
  })

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('rounded-lg') // 기본 클래스도 유지
  })

  it('applies fullWidth correctly', () => {
    render(<Button fullWidth>Full</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})
```

### 2. 인터랙션 테스트 (Vitest + RTL + User Event)

**목적**: 사용자 상호작용이 올바르게 작동하는지 검증

#### 체크리스트

- ✅ 클릭 이벤트
- ✅ 입력 이벤트
- ✅ 포커스/블러
- ✅ 키보드 네비게이션
- ✅ Disabled 상태
- ✅ Loading 상태
- ✅ 에러 상태

#### 예시: Input 컴포넌트

```typescript
describe('Input - Interaction', () => {
  it('handles text input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText('Enter text')
    await user.type(input, 'Hello World')

    expect(input).toHaveValue('Hello World')
  })

  it('calls onChange handler', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('cannot be interacted when disabled', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input disabled onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(input).toHaveValue('')
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('shows error state', () => {
    render(<Input error helperText="Error message" />)
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
```

### 3. 접근성 테스트 (Vitest + jest-axe)

**목적**: 웹 접근성 기준(WCAG) 준수 검증

#### 체크리스트

- ✅ ARIA 속성 (role, label, describedby 등)
- ✅ 키보드 접근성 (Tab, Enter, Space, Arrow 키)
- ✅ 색상 대비
- ✅ 포커스 관리
- ✅ 스크린 리더 지원

#### 설치

```bash
pnpm add -D jest-axe
```

#### 예시

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Button - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('is keyboard accessible', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button')
    button.focus()

    expect(button).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalled()
  })

  it('has proper aria-label when icon only', () => {
    render(<IconButton aria-label="Close" icon={<CloseIcon />} />)
    expect(screen.getByRole('button')).toHaveAccessibleName('Close')
  })
})
```

### 4. 시각적 회귀 테스트 (Playwright)

**목적**: UI가 의도대로 표시되는지 스크린샷으로 검증

#### 체크리스트

- ✅ 기본 렌더링
- ✅ 모든 variants
- ✅ 모든 sizes
- ✅ 모든 states (default, hover, focus, disabled)
- ✅ 다크모드
- ✅ 반응형 (mobile, tablet, desktop)

#### 예시

```typescript
// tests/e2e/visual/button.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Button - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system/button')
  })

  // 모든 variants
  for (const variant of ['primary', 'secondary', 'ghost', 'outline', 'danger']) {
    test(`variant: ${variant}`, async ({ page }) => {
      const button = page.locator(`[data-variant="${variant}"]`)
      await expect(button).toHaveScreenshot(`button-${variant}.png`)
    })
  }

  // 다크모드
  test('dark mode', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })

    await expect(page.locator('.button-showcase')).toHaveScreenshot('button-dark-mode.png')
  })

  // States
  test('states', async ({ page }) => {
    const button = page.locator('button').first()

    // Default
    await expect(button).toHaveScreenshot('button-default.png')

    // Hover
    await button.hover()
    await expect(button).toHaveScreenshot('button-hover.png')

    // Focus
    await button.focus()
    await expect(button).toHaveScreenshot('button-focus.png')
  })
})
```

### 5. 스타일/토큰 테스트

**목적**: 디자인 토큰이 올바르게 적용되는지 검증

#### 체크리스트

- ✅ 시맨틱 토큰 사용
- ✅ 다크모드 토큰
- ✅ 일관된 spacing
- ✅ 일관된 typography

#### 예시

```typescript
describe('Typography - Style Tokens', () => {
  it('uses semantic color tokens', () => {
    render(<Typography variant="body">Text</Typography>)
    const element = screen.getByText('Text')

    // Tailwind 클래스 확인
    expect(element).toHaveClass('text-body')
  })

  it('applies correct text sizes', () => {
    const variants = {
      display: 'text-6xl',
      hero: 'text-5xl',
      title: 'text-4xl',
      subtitle: 'text-2xl',
      body: 'text-base',
      caption: 'text-sm',
      label: 'text-xs'
    }

    Object.entries(variants).forEach(([variant, expectedClass]) => {
      const { unmount } = render(
        <Typography variant={variant as any}>{variant}</Typography>
      )
      expect(screen.getByText(variant)).toHaveClass(expectedClass)
      unmount()
    })
  })
})
```

## 컴포넌트별 테스트 체크리스트

### Button

| 테스트 영역 | 항목 | 우선순위 |
|------------|------|---------|
| **구조** | 기본 렌더링 | 🔴 필수 |
| | variant 적용 (primary, secondary, ghost, outline, danger) | 🔴 필수 |
| | size 적용 (sm, md, lg) | 🔴 필수 |
| | fullWidth 적용 | 🟡 중요 |
| | disabled 상태 | 🔴 필수 |
| **인터랙션** | onClick 핸들러 | 🔴 필수 |
| | disabled 시 클릭 불가 | 🔴 필수 |
| | 키보드 접근 (Enter, Space) | 🟡 중요 |
| **접근성** | role="button" | 🔴 필수 |
| | 포커스 가능 | 🔴 필수 |
| | aria-disabled | 🟡 중요 |
| **시각적** | 모든 variant 스크린샷 | 🟢 권장 |
| | 다크모드 스크린샷 | 🟢 권장 |
| | hover/focus 상태 | 🟢 권장 |

### Input

| 테스트 영역 | 항목 | 우선순위 |
|------------|------|---------|
| **구조** | 기본 렌더링 | 🔴 필수 |
| | variant 적용 | 🔴 필수 |
| | size 적용 | 🔴 필수 |
| | label 표시 | 🟡 중요 |
| | helperText 표시 | 🟡 중요 |
| | error 상태 | 🔴 필수 |
| **인터랙션** | 텍스트 입력 | 🔴 필수 |
| | onChange 핸들러 | 🔴 필수 |
| | 포커스/블러 | 🟡 중요 |
| | disabled 시 입력 불가 | 🔴 필수 |
| **접근성** | label과 input 연결 | 🔴 필수 |
| | aria-describedby (helperText) | 🟡 중요 |
| | aria-invalid (error) | 🔴 필수 |
| **시각적** | 모든 state 스크린샷 | 🟢 권장 |

### Typography

| 테스트 영역 | 항목 | 우선순위 |
|------------|------|---------|
| **구조** | variant 적용 | 🔴 필수 |
| | as prop (HTML 태그) | 🟡 중요 |
| | children 렌더링 | 🔴 필수 |
| **스타일** | 시맨틱 토큰 사용 | 🟡 중요 |
| | 다크모드 색상 | 🟡 중요 |
| **시각적** | 모든 variant 스크린샷 | 🟢 권장 |

## 실전 예시

### 완전한 Button 테스트 스위트

```typescript
// src/components/ui/Button/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '../Button'

expect.extend(toHaveNoViolations)

describe('Button', () => {
  describe('Structure', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('applies all variants correctly', () => {
      const variants = ['primary', 'secondary', 'ghost', 'outline', 'danger'] as const

      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>)
        const button = screen.getByRole('button')

        // 각 variant에 맞는 클래스 확인
        const expectedClass = variant === 'primary' ? 'bg-action-primary' :
                             variant === 'secondary' ? 'bg-action-secondary' :
                             variant === 'danger' ? 'bg-destructive' :
                             variant === 'ghost' ? 'bg-transparent' :
                             'border'

        expect(button).toHaveClass(expectedClass)
        unmount()
      })
    })

    it('applies all sizes correctly', () => {
      const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-12' }

      Object.entries(sizes).forEach(([size, expectedClass]) => {
        const { unmount } = render(<Button size={size as any}>{size}</Button>)
        expect(screen.getByRole('button')).toHaveClass(expectedClass)
        unmount()
      })
    })

    it('applies fullWidth', () => {
      render(<Button fullWidth>Full Width</Button>)
      expect(screen.getByRole('button')).toHaveClass('w-full')
    })

    it('merges custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('rounded-lg')
    })
  })

  describe('Interaction', () => {
    it('calls onClick handler', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click me</Button>)
      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button disabled onClick={handleClick}>Disabled</Button>)
      await user.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('is keyboard accessible', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Button</Button>)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has proper role', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('is disabled correctly', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('can be focused', () => {
      render(<Button>Focus me</Button>)
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })
  })
})
```

## Best Practices

### 1. 테스트 작성 우선순위

```
🔴 필수 (Must Have)
├─ 기본 렌더링
├─ Props 적용
├─ 핵심 인터랙션
└─ 접근성 (role, aria)

🟡 중요 (Should Have)
├─ 모든 variants/sizes
├─ Edge cases
├─ 키보드 접근성
└─ 에러 상태

🟢 권장 (Nice to Have)
├─ 시각적 회귀
├─ 다크모드
└─ 반응형
```

### 2. 테스트 네이밍 컨벤션

```typescript
// ✅ Good
it('renders with primary variant')
it('calls onClick when button is clicked')
it('shows error message when error prop is true')

// ❌ Bad
it('works')
it('test button')
it('should do something')
```

### 3. AAA 패턴 (Arrange-Act-Assert)

```typescript
it('calls onChange handler', async () => {
  // Arrange - 준비
  const handleChange = vi.fn()
  const user = userEvent.setup()
  render(<Input onChange={handleChange} />)

  // Act - 실행
  const input = screen.getByRole('textbox')
  await user.type(input, 'test')

  // Assert - 검증
  expect(handleChange).toHaveBeenCalled()
})
```

### 4. 테스트 격리

```typescript
// ✅ Good - 각 테스트가 독립적
it('test 1', () => {
  render(<Button>Test 1</Button>)
  // ...
})

it('test 2', () => {
  render(<Button>Test 2</Button>)
  // ...
})

// ❌ Bad - 테스트 간 의존성
let button: HTMLElement

it('renders button', () => {
  button = screen.getByRole('button')
})

it('button is clickable', () => {
  // button 변수에 의존
  fireEvent.click(button)
})
```

### 5. 시각적 테스트 안정성

```typescript
// Playwright에서 애니메이션 비활성화
test.beforeEach(async ({ page }) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `
  })
})

// 특정 요소 대기
await page.waitForSelector('[data-testid="button"]')
await expect(element).toHaveScreenshot()
```

### 6. 테스트 커버리지 목표

```
구조 테스트: > 80%
인터랙션 테스트: > 70%
접근성 테스트: > 60%
시각적 테스트: 주요 컴포넌트만
```

## 다음 단계

1. **jest-axe 설치 및 설정**
2. **Button 컴포넌트 전체 테스트 작성**
3. **Input 컴포넌트 테스트 작성**
4. **Typography 테스트 작성**
5. **Playwright 시각적 회귀 테스트 설정**
6. **CI/CD에 테스트 통합**

## 참고 자료

- [Testing Library Best Practices](https://testing-library.com/docs/queries/about/#priority)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
