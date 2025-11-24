import { test, expect } from '../fixtures'

test.describe('App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Check if the page title is set
    await expect(page).toHaveTitle(/chat/)
  })

  test('should have proper viewport', async ({ page }) => {
    await page.goto('/')

    const viewportSize = page.viewportSize()
    expect(viewportSize).toBeDefined()
  })

  test('network logging works on failure', async ({ page }) => {
    await page.goto('/')

    // This will trigger network logger if it fails
    // The network log will be automatically attached
  })
})
