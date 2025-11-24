import { test, expect } from '@playwright/test'

/**
 * Design System Visual Regression Tests
 *
 * 이 테스트는 디자인 시스템의 모든 컴포넌트에 대한 스냅샷을 생성합니다.
 * 라이트/다크 모드, 다양한 뷰포트에서 테스트합니다.
 */

test.describe('Design System - Light Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system.html')
    await page.waitForLoadState('networkidle')
    // Wait for components to render
    await page.waitForTimeout(1000)
  })

  test('captures typography section', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Typography' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('typography-light-desktop.png', { timeout: 10000 })
  })

  test('captures button variants', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Buttons' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('buttons-light-desktop.png', { timeout: 10000 })
  })

  test('captures input variants', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Inputs' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('inputs-light-desktop.png', { timeout: 10000 })
  })

  test('captures toggle variants', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Toggles' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('toggles-light-desktop.png', { timeout: 10000 })
  })

  test('captures icon button variants', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Icon Buttons' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('icon-buttons-light-desktop.png', { timeout: 10000 })
  })

  test('captures skeleton loading', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Skeleton Loading' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('skeleton-light-desktop.png', { timeout: 10000 })
  })

  test('captures chat bubbles', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Chat Bubbles' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('chat-bubbles-light-desktop.png', { timeout: 10000 })
  })
})

test.describe('Design System - Dark Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system.html')
    await page.waitForLoadState('networkidle')

    // Enable dark mode via the toggle button
    await page.click('button:has-text("다크 모드")')
    await page.waitForTimeout(500) // Wait for transition
  })

  test('captures button variants in dark mode', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Buttons' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('buttons-dark-desktop.png', { timeout: 10000 })
  })

  test('captures input variants in dark mode', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Inputs' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('inputs-dark-desktop.png', { timeout: 10000 })
  })
})

test.describe('Design System - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 },
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system.html')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  test('captures button section on mobile', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Buttons' }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('buttons-light-mobile.png', { timeout: 10000 })
  })
})

test.describe('Design System - Tablet', () => {
  test.use({
    viewport: { width: 768, height: 1024 },
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system.html')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })
})
