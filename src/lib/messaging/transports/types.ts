export interface Transport {
  connect: (url: string) => void
  disconnect: () => void
  onConnect: (callback: () => void) => void
  onDisconnect: (callback: () => void) => void
  onError: (callback: (error: Error) => void) => void
  getConnection: (url: string) => WebSocket
}
