import { Typography } from '@/components/ui/Typography/Typography'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface BottomTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function BottomTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: BottomTabsProps) {
  return (
    <div
      className={cn(
        'flex items-center',
        'border-t border-border-default',
        'bg-surface',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1',
              'flex flex-col items-center justify-center',
              'py-2 px-3',
              'transition-colors duration-200',
              'cursor-pointer',
              'hover:bg-hover',
              'active:bg-hover/80',
            )}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* 아이콘 */}
            <div
              className={cn(
                'w-5 h-5 mb-0.5',
                'flex items-center justify-center',
                'transition-colors duration-200',
                isActive ? 'text-action-primary' : 'text-muted',
              )}
            >
              {tab.icon}
            </div>

            {/* 라벨 */}
            <Typography
              variant="caption"
              className={cn(
                'transition-colors duration-200',
                isActive ? 'text-action-primary font-semibold' : 'text-muted',
              )}
            >
              {tab.label}
            </Typography>
          </button>
        )
      })}
    </div>
  )
}
