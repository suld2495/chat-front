import {
  FileText,
  Image,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { formatFileSize, isImageFile } from '@/api/file'
import { cn } from '@/lib/utils'

import { IconButton } from '../ui/icon-button'
import { Typography } from '../ui/typography'

interface FilePreviewProps {
  file: File
  onRemove: () => void
  uploadProgress?: number
  error?: string
}

export function FilePreview({
  file,
  onRemove,
  uploadProgress,
  error,
}: FilePreviewProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const isImage = isImageFile(file)
  const isUploading = uploadProgress !== undefined && uploadProgress < 100

  useEffect(() => {
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      return () => {
        reader.abort()
      }
    }
  }, [file, isImage])

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 p-3 rounded-lg',
        'bg-surface border border-border-default',
        error && 'border-error',
      )}
    >
      {/* 파일 아이콘/썸네일 */}
      <div
        className={cn(
          'shrink-0 w-12 h-12 rounded-md overflow-hidden',
          'flex items-center justify-center',
          'bg-hover',
        )}
      >
        {isImage && imagePreview
          ? (
              <img
                src={imagePreview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            )
          : (
              <div className="typography-text-tertiary">
                {isImage ? <Image className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
              </div>
            )}
      </div>

      {/* 파일 정보 */}
      <div className="flex-1 min-w-0">
        <Typography
          size="sm"
          color="primary"
          className="font-medium truncate"
        >
          {file.name}
        </Typography>
        <Typography
          size="xs"
          className="typography-text-tertiary"
        >
          {formatFileSize(file.size)}
        </Typography>

        {/* 업로드 진행률 */}
        {isUploading && (
          <div className="mt-1.5">
            <div className="h-1 bg-hover rounded-full overflow-hidden">
              <div
                className="h-full bg-action-primary transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <Typography
            className="typography-text-error mt-1"
            size="xs"
          >
            {error}
          </Typography>
        )}
      </div>

      {/* 삭제 버튼 */}
      <IconButton
        size="sm"
        onClick={onRemove}
        disabled={isUploading}
        className="shrink-0 typography-text-tertiary hover:typography-text-primary"
        aria-label="Remove file"
      >
        <X className="w-4 h-4" />
      </IconButton>
    </div>
  )
}
