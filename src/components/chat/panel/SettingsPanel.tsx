import { Typography } from '@/components/ui/Typography/Typography'

export function SettingsPanel() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 패널 타이틀 */}
      <div className="p-4 border-b border-border-default">
        <Typography
          variant="subtitle"
          className="text-heading font-semibold"
        >
          설정
        </Typography>
      </div>
      <div className="flex items-center justify-center h-full">
        <Typography
          variant="body"
          className="text-muted"
        >
          설정 화면이 여기에 표시됩니다
        </Typography>
      </div>
    </div>
  )
}
