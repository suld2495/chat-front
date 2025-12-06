import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { ThemeName } from '@/styles/theme/themes'

import { DEFAULT_THEME_NAME } from '@/styles/theme/themes'

interface ThemeState {
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      themeName: DEFAULT_THEME_NAME,
      setTheme: name => set({ themeName: name }),
    }),
    {
      name: 'app-theme',
      partialize: state => ({ themeName: state.themeName }),
    },
  ),
)

export function useTheme() {
  const themeName = useThemeStore(state => state.themeName)
  const setTheme = useThemeStore(state => state.setTheme)

  return { themeName, setTheme }
}

export function applyThemeToDocument(themeName: ThemeName) {
  if (themeName === 'dark') {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}

useThemeStore.subscribe((state) => {
  applyThemeToDocument(state.themeName)
})

if (typeof window !== 'undefined') {
  applyThemeToDocument(useThemeStore.getState().themeName)
}
