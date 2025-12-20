import {
  Download,
  FileText,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'

import type { Message } from '@/services/chat/types'

import { downloadFile } from '@/api/file'
import { apiUrl, hospitalId } from '@/lib/const'
import { getFileExtension } from '@/lib/file-utils'
import { cn } from '@/lib/utils'

import { IconButton } from '../../ui/icon-button'
import { Typography } from '../../ui/typography'

interface FileMessageProps {
  isUser: boolean
  message: Pick<Message, 'fileInfo'>
}

export function FileMessage({ isUser, message }: FileMessageProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (isDownloading || !message.fileInfo?.fileName)
      return

    const { fileId, fileName } = message.fileInfo
    setIsDownloading(true)
    setError(null)

    const url = `${apiUrl}/api/widget/files/download/${hospitalId}/${fileId}.${getFileExtension(fileName)}`
    const result = await downloadFile(url, fileName)

    setIsDownloading(false)

    if (!result.success) {
      setError(result.error ?? '다운로드에 실패했습니다.')
      // 3초 후 에러 메시지 숨김
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-2xl chat-bubble-shadow max-w-full',
          'transition-colors duration-200 overflow-hidden',
          isUser
            ? 'bg-chat-bubble-user text-chat-bubble-user-fg rounded-br-md'
            : 'bg-chat-bubble-other text-chat-bubble-other-fg rounded-bl-md',
        )}
      >
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
            isUser ? 'bg-chat-bubble-user-fg/20' : 'bg-muted-foreground/50',
          )}
        >
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <Typography
            size="sm"
            className={cn(
              'block font-medium truncate',
              !isUser && 'typography-text-primary',
            )}
          >
            {message.fileInfo?.fileName || 'File'}
          </Typography>
        </div>
        <IconButton
          size="sm"
          variant="ghost"
          onClick={handleDownload}
          disabled={isDownloading}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label="파일 다운로드"
        >
          {isDownloading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Download className="w-4 h-4" />}
        </IconButton>
      </div>
      {error && (
        <Typography
          size="xs"
          className="typography-text-error px-1"
        >
          {error}
        </Typography>
      )}
    </div>
  )
}
