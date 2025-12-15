import type { ChangeEvent } from 'react'

import { useRef, useState } from 'react'

import {
  formatFileSize,
  isValidFileSize,
  MAX_FILE_SIZE,
} from '@/api/file'

interface UseFileUploadOptions {
  selectedFile?: File | null
  onFileSelect?: (file: File | null) => void
  uploadProgress?: number
}

interface UseFileUploadReturn {
  currentFile: File | null
  fileError: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isUploading: boolean
  handleFileClick: () => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleFileRemove: () => void
}

export function useFileUpload({
  selectedFile,
  onFileSelect,
  uploadProgress,
}: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [localFile, setLocalFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentFile = selectedFile !== undefined ? selectedFile : localFile
  const setCurrentFile = onFileSelect || setLocalFile

  const isUploading = uploadProgress !== undefined && uploadProgress < 100

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      e.target.value = ''
      return
    }

    if (!isValidFileSize(file)) {
      setFileError(`파일 크기는 ${formatFileSize(MAX_FILE_SIZE)} 이하여야 합니다.`)
      e.target.value = ''
      return
    }

    setFileError(null)
    setCurrentFile(file)
    e.target.value = ''
  }

  const handleFileRemove = () => {
    setCurrentFile(null)
    setFileError(null)
  }

  return {
    currentFile,
    fileError,
    fileInputRef,
    isUploading,
    handleFileClick,
    handleFileChange,
    handleFileRemove,
  }
}
