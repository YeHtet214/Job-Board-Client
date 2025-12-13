export interface PresenceUpdate {
  userId: string
  status: 'online' | 'offline'
  lastSeen: string
}

export interface ChatSendResponse {
  ok: boolean
  messageId?: string
  error?: string
}

export interface JoinConversationResponse {
  ok: boolean
  conversationId?: string
  notis?: [] // You can further type this based on your notification structure
  error?: string
}

export interface SocketEmitCallback<T> {
  (response: T): void
}