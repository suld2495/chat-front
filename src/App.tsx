import { useTheme } from '@/stores/theme'
import { themeNames } from '@/styles/theme/themes'

import { ChatWidget } from './components/chat'
import { Button } from './components/ui/button'
import { Typography } from './components/ui/typography'

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
    <div className="min-h-screen bg-background-base text-text-primary flex items-center justify-center">
      <ThemeSelector />
      <div className="text-center space-y-6">
        <Typography
          variant="hero"
          className="text-text-primary"
        >
          Chat Application
        </Typography>
        <Typography
          variant="body"
          className="text-text-secondary"
        >
          채팅 앱이 여기에 구현될 예정입니다.
        </Typography>
        <Typography
          variant="caption"
          className="text-text-secondary"
        >
          디자인 시스템 데모는
          {' '}
          <a
            href="/design-system.html"
            className="text-text-link hover:underline"
          >
            여기
          </a>
          에서 확인하세요.
        </Typography>
      </div>
      <ChatWidget />
    </div>
  )
}

export default App
