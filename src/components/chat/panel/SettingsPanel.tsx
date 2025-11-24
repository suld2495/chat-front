import { useState } from 'react'

import { Button } from '@/components/ui/Button/Button'
import { Toggle } from '@/components/ui/Toggle/Toggle'
import { Typography } from '@/components/ui/Typography/Typography'

interface SettingsState {
  pushAlert: boolean
  alertSound: boolean
  readReceipts: boolean
  typingIndicator: boolean
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsState>({
    pushAlert: true,
    alertSound: true,
    readReceipts: true,
    typingIndicator: true,
  })
  const [savedLabel, setSavedLabel] = useState<string>('')

  const updateSetting = <Key extends keyof SettingsState>(key: Key, value: SettingsState[Key]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSavedLabel('')
  }

  const handleSave = () => {
    setSavedLabel('저장되었습니다.')
  }

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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl border border-border-default bg-surface p-4 space-y-3">
          <Typography
            variant="body"
            className="text-heading font-semibold"
          >
            알림
          </Typography>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-border-default bg-surface-sunken p-3">
              <div className="space-y-1">
                <Typography
                  variant="body"
                  className="text-heading font-semibold"
                >
                  새 메시지 알림
                </Typography>
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  새 메시지를 배너로 알려줍니다.
                </Typography>
              </div>
              <Toggle
                checked={settings.pushAlert}
                onChange={value => updateSetting('pushAlert', value)}
                aria-label="새 메시지 알림"
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-lg border border-border-default bg-surface-sunken p-3">
              <div className="space-y-1">
                <Typography
                  variant="body"
                  className="text-heading font-semibold"
                >
                  알림 사운드
                </Typography>
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  알림이 올 때 소리를 재생합니다.
                </Typography>
              </div>
              <Toggle
                checked={settings.alertSound}
                onChange={value => updateSetting('alertSound', value)}
                aria-label="알림 사운드"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border-default bg-surface p-4 space-y-3">
          <Typography
            variant="body"
            className="text-heading font-semibold"
          >
            메시지
          </Typography>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-border-default bg-surface-sunken p-3">
              <div className="space-y-1">
                <Typography
                  variant="body"
                  className="text-heading font-semibold"
                >
                  읽음 표시 보내기
                </Typography>
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  읽은 메시지를 상대에게 알려줍니다.
                </Typography>
              </div>
              <Toggle
                checked={settings.readReceipts}
                onChange={value => updateSetting('readReceipts', value)}
                aria-label="읽음 표시 보내기"
              />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-lg border border-border-default bg-surface-sunken p-3">
              <div className="space-y-1">
                <Typography
                  variant="body"
                  className="text-heading font-semibold"
                >
                  입력 중 표시 공유
                </Typography>
                <Typography
                  variant="caption"
                  className="text-muted"
                >
                  입력 중일 때 상대에게 상태를 보여줍니다.
                </Typography>
              </div>
              <Toggle
                checked={settings.typingIndicator}
                onChange={value => updateSetting('typingIndicator', value)}
                aria-label="입력 중 표시 공유"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border-default bg-surface flex items-center gap-3">
        <div className="flex-1">
          {savedLabel && (
            <Typography
              variant="caption"
              className="text-success-text"
            >
              {savedLabel}
            </Typography>
          )}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          className="rounded-full px-4"
        >
          설정 저장
        </Button>
      </div>
    </div>
  )
}
