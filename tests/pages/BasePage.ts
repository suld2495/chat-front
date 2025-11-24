import { Page, Locator } from '@playwright/test'

/**
 * Base Page Object with common functionality
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific path
   */
  async goto(path: string = '/') {
    await this.page.goto(path)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, options?: { timeout?: number }) {
    await this.page.waitForSelector(selector, { state: 'visible', ...options })
  }

  /**
   * Take a screenshot
   */
  async screenshot(name: string) {
    return await this.page.screenshot({ path: `test-results/${name}.png` })
  }

  /**
   * Check if element exists
   */
  async hasElement(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0
  }
}
