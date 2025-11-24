import { test as base } from '@playwright/test'

/**
 * Base fixtures with global setup/teardown
 */
export const test = base.extend<{}, {
  /**
   * Auto-cleanup: Clears storage before each test
   */
  clearStorage: void

  /**
   * Auto-logging: Logs network activity on test failure
   */
  networkLogger: void
}>({
  // Clear storage before each test (auto fixture)
  clearStorage: [async ({ context }, use) => {
    await context.clearCookies()
    await context.clearPermissions()
    await use()
  }, { scope: 'test', auto: true }],

  // Log network requests on test failure (auto fixture)
  networkLogger: [async ({ page }, use, testInfo) => {
    const requests: string[] = []
    const responses: string[] = []

    page.on('request', req => {
      requests.push(`→ ${req.method()} ${req.url()}`)
    })

    page.on('response', res => {
      responses.push(`← ${res.status()} ${res.url()}`)
    })

    await use()

    // Attach network log if test failed
    if (testInfo.status !== 'passed') {
      const log = [
        '=== Network Activity ===',
        ...requests,
        '',
        '=== Responses ===',
        ...responses
      ].join('\n')

      testInfo.attach('network-log', {
        body: log,
        contentType: 'text/plain'
      })
    }
  }, { scope: 'test', auto: true }]
})

export { expect } from '@playwright/test'
