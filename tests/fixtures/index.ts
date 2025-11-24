/**
 * Centralized fixture exports
 *
 * Usage:
 * - For basic tests: import { test, expect } from '@/tests/fixtures'
 * - For component tests: import { test, expect } from '@/tests/fixtures/component.fixtures'
 */

export { test, expect } from './base.fixtures'
export { test as componentTest, expect as componentExpect } from './component.fixtures'
export type { ThemeMode, ViewportSize, ComponentTestOptions } from './component.fixtures'
