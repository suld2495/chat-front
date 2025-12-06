import SockJS from 'sockjs-client'

import type { Transport } from './types'

export class SockJSTransport implements Transport {
  private socket: WebSocket | null = null

  private connectCallback?: () => void
  private disconnectCallback?: () => void
  private errorCallback?: (error: Error) => void

  connect(url: string): WebSocket {
    this.socket = new SockJS(url)

    this.socket.onopen = () => {
      this.connectCallback?.()
    }

    this.socket.onclose = () => {
      this.disconnectCallback?.()
    }

    this.socket.onerror = () => {
      this.errorCallback?.(new Error('SockJS connection error'))
    }

    return this.socket
  }

  disconnect(): void {
    this.socket?.close()
    this.socket = null
  }

  getConnection(url: string): WebSocket {
    if (this.socket) {
      return this.socket
    }

    return this.connect(url)
  }

  onConnect(callback: () => void): void {
    this.connectCallback = callback
  }

  onDisconnect(callback: () => void): void {
    this.disconnectCallback = callback
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback
  }
}
