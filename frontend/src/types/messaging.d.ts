import { User } from './user'

// ====== Core User & Conversation ======
export type ConversationParticipant = {
    id: string
    name: string
    avatarUrl?: string
    conversationId: string
    user: User
    joinedAt?: Date
    lastReadAt?: Date
}

export type Conversation = {
    id: string
    receipent: {
        name: string
        id: string
        avatar?: string
    }
    updatedAt: Date
    messages: Message[] | []
    lastMessage: Message | null
    createdAt: Date
    unreadCount: number
}

// ====== Messages ======
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export type Message = {
    id: string // server assigned id
    tempId?: string // for optimistic UI before server ack
    conversationId: string
    senderId: string
    body: string
    status: MessageStatus
    createdAt: Date
    readAt?: Date
}

export type NotiType =
    | 'Realtime_Message'
    | 'New_Message'
    | 'Job_Application'
    | 'Application_Status_Update'

export interface BaseNotification {
    id: string
    type: NotiType
    status: 'PENDING' | 'DELIVERED' | 'READ'
    createdAt: Date
}

export interface MessagePayload {
    snippet: string
    senderName: string
    conversationId: string
}

export interface ApplicationPayload {
    title: string
    message?: string
    snippet?: string
    jobId?: string
    applicationId?: string
}

export interface MessageNotification extends BaseNotification {
    type: 'New_Message' | 'Realtime_Message'
    payload: MessagePayload
}

export interface ApplicationNotification extends BaseNotification {
    type: 'Job_Application' | 'Application_Status_Update'
    payload: ApplicationPayload
}

export type Notification = MessageNotification | ApplicationNotification

export interface RealTimeNoti {
    type: NotiType;
    senderName: string;
    snippet: string;
    createdAt: Date;
}

export interface OfflineNotification {
    id: string
    type: string
    sender?: {
        id: string
        name: string
    }
    payload: JSON
    status: string
    createdAt: string
}

export interface SendMessagePayload {
    tempId: string
    receiverId: string
    conversationId: string
    body: string
}

// ====== REST Responses ======
export type ConversationListResponse = {
    conversations: Conversation[]
}

export type MessagesResponse = {
    messages: Message[]
    nextCursor?: string // for pagination
}

// ====== Socket Payloads ======

// Sent by client → server
export type SocketSendMessage = {
    tempId: string // frontend-generated uuid
    conversationId: string
    content: string
}

// Received from server → client
export type SocketMessageAck = {
    tempId: string
    message: Message // includes final server id & timestamps
}

export type SocketPresenceUpdate = {
    userId: string
    isOnline: boolean
}

export type SocketTypingEvent = {
    conversationId: string
    userId: string
    isTyping: boolean
}
