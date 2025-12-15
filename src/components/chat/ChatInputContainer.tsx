import { useRef, useState } from 'react'

import type { FileInfo } from '@/services/chat/types'

import { getUploadErrorMessage, uploadFile } from '@/api/file'

import { Input } from '../ui/input'
import { ChatInput } from './ChatInput'
import { FilePreview } from './FilePreview'
import { useFileUpload } from './hooks/useFileUpload'

interface ChatInputContainerProps {
  onSendMessage: (content: string) => void
  onSendFileSuccess: (fileName: string, fileInfo: FileInfo) => void
  disabled?: boolean
}

export function ChatInputContainer({
  onSendMessage,
  onSendFileSuccess,
  disabled = false,
}: ChatInputContainerProps) {
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(
    undefined,
  )
  const [uploadError, setUploadError] = useState<string | undefined>(undefined)
  const uploadAbortRef = useRef<AbortController | null>(null)

  const {
    currentFile,
    fileError,
    fileInputRef,
    isUploading,
    handleFileClick,
    handleFileChange,
    handleFileRemove,
  } = useFileUpload({ uploadProgress })

  const handleSendFile = async () => {
    if (disabled || !currentFile)
      return

    setUploadProgress(0)
    setUploadError(undefined)
    uploadAbortRef.current = new AbortController()

    try {
      const fileInfo = await uploadFile(currentFile, {
        onProgress: (progress) => {
          setUploadProgress(progress.percent)
        },
        signal: uploadAbortRef.current.signal,
      })

      onSendFileSuccess(currentFile.name, fileInfo)

      handleFileRemove()
      setUploadProgress(undefined)
    }
    catch (err) {
      setUploadError(getUploadErrorMessage(err))
      setUploadProgress(undefined)
    }
    finally {
      uploadAbortRef.current = null
    }
  }

  const handleRemoveFile = () => {
    handleFileRemove()
    setUploadError(undefined)
    setUploadProgress(undefined)
  }

  const renderFilePreview = () => {
    if (!currentFile)
      return undefined

    return (
      <FilePreview
        file={currentFile}
        onRemove={handleRemoveFile}
        uploadProgress={uploadProgress}
        error={uploadError || fileError || undefined}
      />
    )
  }

  return (
    <>
      <ChatInput
        onSendMessage={onSendMessage}
        onSendFile={handleSendFile}
        onFileButtonClick={handleFileClick}
        disabled={disabled}
        isUploading={isUploading}
        filePreview={renderFilePreview()}
      />

      <Input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
      />
    </>
  )
}
