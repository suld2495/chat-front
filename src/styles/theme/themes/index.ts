/**
 * Themes Index
 *
 * Type definitions and theme name registry.
 * All actual theme values are managed in CSS files:
 * - skins/light.css
 * - skins/dark.css
 */

// ============================================
// Types
// ============================================

export type ThemeDensity = 'compact' | 'comfortable' | 'spacious'
export type ThemeRadiusStyle = 'sharp' | 'rounded' | 'pill'

/**
 * Available skin names (must match CSS files in skins/)
 */
export type ThemeName = 'light' | 'dark'

// ============================================
// Constants
// ============================================

/**
 * Available theme names
 */
export const themeNames: ThemeName[] = ['light', 'dark']

/**
 * Default theme name
 */
export const DEFAULT_THEME_NAME: ThemeName = 'light'

/**
 * Check if a string is a valid theme name
 */
export function isValidThemeName(name: string): name is ThemeName {
  return themeNames.includes(name as ThemeName)
}
