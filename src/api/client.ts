/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(
    status: number,
    message: string,
    code?: string,
    details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  isNetworkError(): boolean {
    return this.status === 0
  }

  isServerError(): boolean {
    return this.status >= 500
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }
}

/**
 * API Client 설정
 */
interface ApiClientConfig {
  baseURL: string
  timeout: number
  headers?: Record<string, string>
}

/**
 * API Client 클래스
 */
class ApiClient {
  private config: ApiClientConfig

  constructor(config: ApiClientConfig) {
    this.config = config
  }

  /**
   * 요청 헤더 생성
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    }

    return headers
  }

  /**
   * 타임아웃이 적용된 fetch
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
  ): Promise<Response> {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
    }, this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      return response
    }
    catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(0, 'Request timeout')
      }
      throw error
    }
    finally {
      clearTimeout(timeout)
    }
  }

  /**
   * 응답 처리
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      if (response.status === 204) {
        return undefined as T
      }
      return response.json()
    }

    let errorMessage = 'Unknown error occurred'
    let errorCode: string | undefined
    let errorDetails: unknown

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      errorCode = errorData.code
      errorDetails = errorData.details
    }
    catch {
      errorMessage = response.statusText || errorMessage
    }

    throw new ApiError(response.status, errorMessage, errorCode, errorDetails)
  }

  /**
   * 요청 URL 생성
   */
  private buildUrl(url: string): string {
    return this.config.baseURL ? `${this.config.baseURL}${url}` : url
  }

  /**
   * 공통 요청 처리
   */
  private async send<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    data?: unknown,
  ): Promise<T> {
    try {
      const requestUrl = this.buildUrl(url)

      const response = await this.fetchWithTimeout(requestUrl, {
        method,
        headers: this.getHeaders(),
        body: data && method !== 'GET' ? JSON.stringify(data) : undefined,
      })
      return this.handleResponse<T>(response)
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(0, 'Network error: Unable to connect to server')
    }
  }

  /**
   * GET 요청
   */
  async get<T>(url: string): Promise<T> {
    return this.send<T>('GET', url)
  }

  /**
   * POST 요청
   */
  async post<T>(url: string, data?: unknown): Promise<T> {
    return this.send<T>('POST', url, data)
  }

  /**
   * PATCH 요청
   */
  async patch<T>(url: string, data?: unknown): Promise<T> {
    return this.send<T>('PATCH', url, data)
  }

  /**
   * DELETE 요청
   */
  async delete<T>(url: string, data?: unknown): Promise<T> {
    return this.send<T>('DELETE', url, data)
  }
}

export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000, // 30초
})
