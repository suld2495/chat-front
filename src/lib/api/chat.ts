/**
 * HTTP 스트리밍 채팅 API 클라이언트
 */

const API_URL = import.meta.env.VITE_API_URL as string

export interface StreamCallbacks {
  /** 스트리밍 청크가 올 때마다 호출 */
  onChunk: (chunk: string) => void
  /** 스트리밍 완료 시 호출 */
  onComplete: (fullText: string) => void
  /** 에러 발생 시 호출 */
  onError: (error: Error) => void
}

/**
 * 채팅 메시지를 전송하고 스트리밍 응답을 처리
 */
export async function sendChatMessageStream(
  query: string,
  callbacks: StreamCallbacks,
): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    if (!reader) {
      throw new Error('No response body')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break

      const chunk = decoder.decode(value, { stream: true })
      fullText += chunk
      callbacks.onChunk(chunk)
    }

    callbacks.onComplete(fullText)
  }
  catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * 채팅 메시지를 전송하고 전체 응답을 반환 (비스트리밍)
 */
export async function sendChatMessage(query: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.text()
}
