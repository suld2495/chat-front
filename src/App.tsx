import { useTheme } from '@/stores/theme'
import { themeNames } from '@/styles/theme/themes'

import { ChatWidget } from './components/chat'
import { Button } from './components/ui/button'

function ThemeSelector() {
  const { themeName, setTheme } = useTheme()

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      {themeNames.map(name => (
        <Button
          key={name}
          variant={themeName === name ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setTheme(name)}
        >
          {name}
        </Button>
      ))}
    </div>
  )
}

function App() {
  return (
    <div className="h-dvh max-h-dvh bg-background-base text-text-primary flex items-center justify-center overflow-hidden">
      <ThemeSelector />
      <ChatWidget />
    </div>
  )
}

export default App
