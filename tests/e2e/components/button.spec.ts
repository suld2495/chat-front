import { test, expect } from '../../fixtures/component.fixtures'

/**
 * Button component E2E tests with default settings
 */
test.describe('Button Component - Default (Light Desktop)', () => {
  test('renders correctly', async ({ componentPage, page }) => {
    const button = page.locator('button').first()

    if (await button.count() > 0) {
      await expect(button).toBeVisible()
    }
  })
})

/**
 * Dark mode mobile tests
 */
test.describe('Button Component - Dark Mobile', () => {
  // Set options OUTSIDE the test
  test.use({ theme: 'dark', viewportPreset: 'mobile' })

  test('renders correctly in dark mode on mobile', async ({ componentPage, page }) => {
    const button = page.locator('button').first()

    if (await button.count() > 0) {
      await expect(button).toBeVisible()
    }
  })
})
