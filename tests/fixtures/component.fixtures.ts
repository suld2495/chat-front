import { test as base } from './base.fixtures'

export type ThemeMode = 'light' | 'dark'
export type ViewportSize = 'mobile' | 'tablet' | 'desktop'

export interface ComponentTestOptions {
  theme: ThemeMode
  viewportPreset: ViewportSize
}

/**
 * Component testing fixtures with theme and viewport support
 */
export const test = base.extend<ComponentTestOptions & {
  /**
   * Navigate to component test page with theme and viewport applied
   */
  componentPage: void
}>({
  // Options: Can be overridden with test.use()
  theme: ['light', { option: true }],
  viewportPreset: ['desktop', { option: true }],

  // Apply theme and viewport settings
  componentPage: async ({ page, theme, viewportPreset }, use) => {
    // Viewport configuration
    const viewports: Record<ViewportSize, { width: number; height: number }> = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 }
    }

    // Use default if option not provided
    const selectedTheme: ThemeMode = theme || 'light'
    const selectedViewport: ViewportSize = viewportPreset || 'desktop'

    // Set viewport size
    await page.setViewportSize(viewports[selectedViewport])

    // Navigate to app
    await page.goto('/')

    // Apply theme
    if (selectedTheme === 'dark') {
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
    } else {
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark')
      })
    }

    // Wait for hydration
    await page.waitForLoadState('networkidle')

    await use()
  }
})

export { expect } from '@playwright/test'
