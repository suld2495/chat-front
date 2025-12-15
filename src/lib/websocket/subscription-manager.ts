import type {
  MessagingClient,
  MessagingPayload,
  Subscription,
} from '@/lib/messaging/clients/types'

type MessageCallback<T = unknown> = (message: T) => void
type Unsubscriber = () => void

interface SubscriptionEntry {
  subscription: Subscription
  callbacks: Set<MessageCallback>
}

export class SubscriptionManager {
  private subscriptions = new Map<string, SubscriptionEntry>()
  private client: MessagingClient | null = null

  /**
   * 클라이언트 설정
   */
  setClient(client: MessagingClient | null) {
    this.client = client
  }

  /**
   * 클라이언트 가져오기
   */
  getClient(): MessagingClient | null {
    return this.client
  }

  /**
   * 구독 추가
   * - 같은 destination에 이미 구독이 있으면 callback만 추가
   * - 반환된 함수를 호출하면 해당 callback만 제거
   */
  subscribe<T = unknown>(destination: string, callback: MessageCallback<T>): Unsubscriber {
    if (!this.client) {
      console.error('[SubscriptionManager] Client not set')
      return () => {}
    }

    const existing = this.subscriptions.get(destination)

    if (existing) {
      existing.callbacks.add(callback as MessageCallback)
      return () => this.removeCallback(destination, callback as MessageCallback)
    }

    const callbacks = new Set<MessageCallback>([callback as MessageCallback])

    try {
      const subscription = this.client.subscribe(destination, (payload: MessagingPayload) => {
        const entry = this.subscriptions.get(destination)
        entry?.callbacks.forEach(cb => cb(payload.body))
      })

      this.subscriptions.set(destination, {
        subscription,
        callbacks,
      })

      return () => this.removeCallback(destination, callback as MessageCallback)
    }
    catch (error) {
      console.error('[SubscriptionManager] Subscribe failed:', error)
      return () => {}
    }
  }

  subscribeOnce<T = unknown>(
    destination: string,
    callback: MessageCallback<T>,
    timeout = 30000,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let unsubscribe: Unsubscriber = () => {}

      const timer = setTimeout(() => {
        unsubscribe()
        reject(new Error(`Timeout waiting for message on ${destination}`))
      }, timeout)

      unsubscribe = this.subscribe<T>(destination, (message) => {
        clearTimeout(timer)
        unsubscribe()
        callback(message)
        resolve(message)
      })
    })
  }

  private removeCallback(destination: string, callback: MessageCallback) {
    const entry = this.subscriptions.get(destination)
    if (!entry)
      return

    entry.callbacks.delete(callback)

    if (entry.callbacks.size === 0) {
      this.unsubscribe(destination)
    }
  }

  unsubscribe(destination: string) {
    const entry = this.subscriptions.get(destination)
    if (entry) {
      entry.subscription.unsubscribe()
      this.subscriptions.delete(destination)
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((entry) => {
      entry.subscription.unsubscribe()
    })
    this.subscriptions.clear()
  }

  /**
   * 특정 채널 구독 여부 확인
   */
  hasSubscription(destination: string): boolean {
    return this.subscriptions.has(destination)
  }

  /**
   * 활성 구독 목록
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys())
  }

  /**
   * 리소스 정리
   */
  dispose() {
    this.unsubscribeAll()
    this.client = null
  }
}

// 싱글톤 인스턴스
export const subscriptionManager = new SubscriptionManager()
