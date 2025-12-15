import axios, { AxiosError, isCancel } from 'axios'

import type { FileInfo } from '@/services/chat/types'

import { apiUrl, hospitalId } from '@/lib/const'

import { ApiError } from './client'

/**
 * 파일 다운로드 에러 메시지 매핑
 */
const downloadErrorMessages: Record<number, string> = {
  400: '잘못된 요청입니다.',
  401: '로그인이 필요합니다.',
  403: '파일 다운로드 권한이 없습니다.',
  404: '파일을 찾을 수 없습니다.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다.',
  502: '서버에 연결할 수 없습니다.',
  503: '서버가 일시적으로 사용 불가합니다.',
}

/**
 * 파일 업로드 응답
 */
export interface FileUploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
}

/**
 * 파일 업로드 진행 상태
 */
export interface UploadProgress {
  loaded: number
  total: number
  percent: number
}

/**
 * 파일 업로드 옵션
 */
interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void
  signal?: AbortSignal
}

/**
 * 파일 업로드
 */
export async function uploadFile(
  file: File,
  options?: UploadOptions,
): Promise<FileInfo> {
  const baseURL = apiUrl || ''

  const formData = new FormData()
  formData.append('file', file)
  formData.append('hospitalId', hospitalId)

  try {
    const response = await axios.post<{ data: FileUploadResponse }>(
      `${baseURL}/api/widget/files/upload`,
      formData,
      {
        signal: options?.signal,
        onUploadProgress: (event) => {
          if (event.total && options?.onProgress) {
            options.onProgress({
              loaded: event.loaded,
              total: event.total,
              percent: Math.round((event.loaded / event.total) * 100),
            })
          }
        },
      },
    )

    const file = response.data.data

    return {
      fileId: file.fileId,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      width: file.width,
      height: file.height,
    }
  }
  catch (error) {
    if (isCancel(error)) {
      throw new ApiError(0, 'Upload cancelled')
    }

    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 0
      const message = error.response?.data?.message
        ?? error.message
        ?? 'Upload failed'
      throw new ApiError(status, message)
    }

    throw new ApiError(0, 'Network error during upload')
  }
}

/**
 * 파일 크기 포맷팅
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

/**
 * 파일 타입 검증
 */
export function isValidFileType(file: File, acceptedTypes: string[]): boolean {
  if (acceptedTypes.includes('*/*'))
    return true

  return acceptedTypes.some((type) => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0]
      return file.type.startsWith(`${category}/`)
    }
    return file.type === type
  })
}

/**
 * 이미지 파일 여부 확인
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 최대 파일 크기 (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * 파일 크기 검증
 */
export function isValidFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize
}

/**
 * 파일 업로드 에러 메시지 매핑
 */
const uploadErrorMessages: Record<number, string> = {
  400: '잘못된 요청입니다.',
  401: '로그인이 필요합니다.',
  403: '파일 업로드 권한이 없습니다.',
  404: '업로드 서버를 찾을 수 없습니다.',
  413: '파일 크기가 너무 큽니다.',
  415: '지원하지 않는 파일 형식입니다.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다.',
  502: '서버에 연결할 수 없습니다.',
  503: '서버가 일시적으로 사용 불가합니다.',
  0: '네트워크 연결을 확인해주세요.',
}

export function getUploadErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return uploadErrorMessages[error.status] ?? '파일 업로드에 실패했습니다.'
  }

  if (error instanceof Error) {
    if (error.message === 'Upload cancelled') {
      return '업로드가 취소되었습니다.'
    }
  }

  return '파일 업로드에 실패했습니다.'
}

/**
 * 파일 다운로드 결과
 */
export interface DownloadResult {
  success: boolean
  error?: string
}

export async function downloadFile(
  url: string,
  filename: string,
): Promise<DownloadResult> {
  try {
    const response = await axios.get(url, { responseType: 'blob' })

    const blob = response.data
    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(blobUrl)

    return { success: true }
  }
  catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 0
      return {
        success: false,
        error: downloadErrorMessages[status] ?? '다운로드에 실패했습니다.',
      }
    }

    return {
      success: false,
      error: '네트워크 연결을 확인해주세요.',
    }
  }
}
