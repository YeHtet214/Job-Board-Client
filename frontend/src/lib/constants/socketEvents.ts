export const SOCKET_EVENTS = {
    // Connection events
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',

    // Presence events
    PRESENCE_UPDATE: 'presence:update',

    // Notification events
    NOTIFICATION_DISPATCH: 'notification:dispatch',
    NOTIFICATION_STATUS_UPDATE: 'notification:update',
    NOTIFICATION_RECEIVED: 'notification:received',
    NOTIFICATION: 'notification',

    // Chat events
    CHAT_NEW: 'chat:new',
    CHAT_SEND: 'chat:send',

    // Room events
    JOIN: 'join',
    LEAVE: 'leave',
} as const

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]
