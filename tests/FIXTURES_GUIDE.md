# Playwright Fixtures 활용 가이드

## 📚 목차

1. [Fixtures란?](#fixtures란)
2. [프로젝트 구조](#프로젝트-구조)
3. [사용 방법](#사용-방법)
4. [고급 패턴](#고급-패턴)
5. [확장 가이드](#확장-가이드)

## Fixtures란?

Fixtures는 테스트 환경을 준비하고 정리하는 **재사용 가능한 빌딩 블록**입니다.

### 핵심 개념

```typescript
// ❌ 기존 방식: Setup/teardown을 반복
test('example', async ({ page }) => {
  // 로그인
  await page.goto('/login')
  await page.fill('#email', 'test@test.com')
  await page.click('button')

  // 테스트 로직
  await page.click('[data-test="action"]')

  // 검증
  await expect(page).toHaveURL('/dashboard')
})

// ✅ Fixtures 활용: 선언적으로 환경 요청
test('example', async ({ authenticatedPage, dashboardPage }) => {
  // 이미 로그인된 상태
  await dashboardPage.performAction()
  await dashboardPage.verifyResult()
})
```

### 장점

1. **재사용성**: 한 번 정의하면 모든 테스트에서 사용
2. **격리**: 각 테스트가 독립적인 환경
3. **조합성**: 작은 fixtures를 조합해서 복잡한 시나리오 구성
4. **가독성**: 테스트 의도가 명확해짐
5. **유지보수**: 로직 변경 시 fixture만 수정

## 프로젝트 구조

```
tests/
├── fixtures/
│   ├── index.ts                    # 통합 export
│   ├── base.fixtures.ts            # 기본 fixtures (auto cleanup, logging)
│   ├── component.fixtures.ts       # 컴포넌트 테스팅 (theme, viewport)
│   ├── auth.fixtures.ts            # 인증 관련 (TODO)
│   └── chat.fixtures.ts            # 채팅 도메인 (TODO)
├── pages/
│   └── BasePage.ts                 # Page Object 베이스
└── e2e/
    ├── app.spec.ts                 # 앱 기본 테스트
    └── components/
        └── button.spec.ts          # 컴포넌트 테스트 예시
```

## 사용 방법

### 1. 기본 Fixtures

모든 테스트에 자동 적용되는 fixtures:

```typescript
import { test, expect } from '../fixtures'

test('my test', async ({ page }) => {
  // ✅ 자동으로 스토리지 정리됨 (clearStorage fixture)
  // ✅ 실패 시 네트워크 로그 자동 첨부 (networkLogger fixture)

  await page.goto('/')
  // 테스트 로직...
})
```

### 2. 컴포넌트 Testing Fixtures

디자인 시스템 컴포넌트 테스트:

```typescript
import { componentTest as test, componentExpect as expect } from '../../fixtures/component.fixtures'

test.describe('Button Component', () => {
  // 기본값: light mode + desktop viewport
  test('renders correctly', async ({ componentPage, page }) => {
    const button = page.locator('button')
    await expect(button).toBeVisible()
  })

  // 옵션 오버라이드: dark mode + mobile viewport
  test('dark mode mobile', async ({ componentPage, page }) => {
    test.use({ theme: 'dark', viewport: 'mobile' })

    await expect(page).toHaveScreenshot('button-dark-mobile.png')
  })
})
```

### 3. 모든 조합 테스트

```typescript
const themes = ['light', 'dark'] as const
const viewports = ['mobile', 'tablet', 'desktop'] as const

for (const theme of themes) {
  for (const viewport of viewports) {
    test(`${theme} on ${viewport}`, async ({ componentPage, page }) => {
      test.use({ theme, viewport })

      // 6가지 조합 자동 테스트
      await expect(page).toHaveScreenshot()
    })
  }
}
```

## 고급 패턴

### Worker-scoped Fixtures

테스트 파일 전체에서 공유되는 리소스:

```typescript
export const test = base.extend<{}, {
  mockApiServer: MSWServer
}>({
  mockApiServer: [async ({}, use) => {
    // 한 번만 시작
    const server = await setupMSW()
    await use(server)
    // 마지막에 정리
    await server.close()
  }, { scope: 'worker' }]
})
```

**사용 시나리오:**
- API Mock 서버 (MSW)
- 데이터베이스 연결
- 테스트 서버 시작

### Auto Fixtures

테스트에서 명시하지 않아도 자동 실행:

```typescript
export const test = base.extend<{
  autoCleanup: void
}>({
  autoCleanup: [async ({}, use) => {
    // beforeEach
    await cleanup()
    await use()
    // afterEach
  }, { auto: true }]
})
```

### Fixture 의존성

Fixtures는 다른 fixtures에 의존할 수 있습니다:

```typescript
// Level 1
authenticatedPage: async ({ page }, use) => {
  await login(page)
  await use(page)
}

// Level 2: authenticatedPage에 의존
dashboardPage: async ({ authenticatedPage, page }, use) => {
  await page.goto('/dashboard')
  await use(new DashboardPage(page))
}

// Level 3: dashboardPage에 의존
messagesPage: async ({ dashboardPage, page }, use) => {
  await dashboardPage.openMessages()
  await use(new MessagesPage(page))
}
```

## 확장 가이드

### 1. 인증 Fixtures 추가

```typescript
// tests/fixtures/auth.fixtures.ts
import { test as base } from './base.fixtures'

export const test = base.extend<{
  authenticatedPage: Page
  guestPage: Page
}>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login')
    await page.fill('#email', 'test@example.com')
    await page.fill('#password', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await use(page)
  },

  guestPage: async ({ page }, use) => {
    await page.goto('/')
    await use(page)
  }
})
```

### 2. Page Objects와 통합

```typescript
// tests/pages/LoginPage.ts
import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  async login(email: string, password: string) {
    await this.page.fill('#email', email)
    await this.page.fill('#password', password)
    await this.page.click('button[type="submit"]')
  }
}

// tests/fixtures/pages.fixtures.ts
export const test = base.extend<{
  loginPage: LoginPage
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto('/login')
    await use(loginPage)
  }
})
```

### 3. 데이터 Fixtures

```typescript
export const test = base.extend<{
  testUser: User
  testChatRoom: ChatRoom
}>({
  testUser: async ({}, use) => {
    const user = await createTestUser()
    await use(user)
    await deleteTestUser(user.id)
  },

  testChatRoom: async ({ testUser }, use) => {
    const room = await createChatRoom(testUser.id)
    await use(room)
    await deleteChatRoom(room.id)
  }
})
```

## Best Practices

### ✅ DO

1. **작고 집중된 Fixtures**: 하나의 관심사만 담당
2. **명시적 의존성**: 필요한 fixture를 명확히 선언
3. **일관된 네이밍**: `authenticatedPage`, `chatRoomPage` 등
4. **Cleanup 보장**: teardown에서 항상 정리
5. **타입 안전성**: TypeScript 타입 정의

### ❌ DON'T

1. **거대한 Fixtures**: 너무 많은 것을 한 fixture에서 처리
2. **암묵적 의존성**: 전역 상태에 의존
3. **부작용 방치**: teardown 누락
4. **과도한 추상화**: 간단한 것을 복잡하게 만들지 마세요

## 참고 자료

- [Playwright Fixtures 공식 문서](https://playwright.dev/docs/test-fixtures)
- [프로젝트 디자인 시스템 가이드](../DESIGN_SYSTEM_GUIDE.md)
