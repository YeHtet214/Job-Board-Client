// API endpoints
export const API_URL = 'http://localhost:3000/api'

// Theme constants
export const JOB_BOARD_COLORS = {
    purple: '#6366F1',
    lightBlue: '#EFF6FF',
    darkBlue: '#1E3A8A',
    green: '#10B981',
    red: '#EF4444',
    yellow: '#F59E0B',
}

// Pagination
export const ITEMS_PER_PAGE = 10

// Toast durations
export const TOAST_DURATION = 5000 // 5 seconds

// Socket events
export const SOCKET_EVENTS = {
    CONNECTION: 'connect',
    DISCONNECTION: 'disconnect',
    NEW_MESSAGE: 'chat:new',
    PRESECENCE_UPDATE: 'presence:update',
    NOTIFICATION: 'notification',
    NOTIFICATION_DISPATCH: 'notification:dispatch',
}
