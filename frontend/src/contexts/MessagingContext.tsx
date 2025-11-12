import React, { createContext, useContext, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Socket } from 'socket.io-client'
import {
    Message,
    Conversation,
    SendMessagePayload,
    Notification,
} from '@/types/messaging'
import { useAuth } from './authContext'

import { useSocketConnection } from '@/hooks/useSocketConnection'
import { useNotificationHandlers } from '@/hooks/useNotificationHandlers'
import { useMessageHandlers } from '@/hooks/useMessageHandlers'
import { usePresenceHandlers } from '@/hooks/usePresenceHandlers'
import { useMessagingOperations } from '@/hooks/useMessagingOperations'
import { useToast } from '@/components/ui/use-toast'

type MessagingContextType = {
    // Socket connection
    socket: typeof Socket | null
    isConnected: boolean

    // Real-time state
    realtimeMessages: Map<string, Message[]>
    notifications: Notification[]

    // Conversation state
    openConversation: Conversation | null
    setOpenConversation: React.Dispatch<React.SetStateAction<Conversation | null>>

    // Messaging operations
    sendMessage: (payload: SendMessagePayload) => Promise<void>
    addMessage: (conversationId: string, message: Message) => void
    addOptimisticMessage: (conversationId: string, message: Message) => void
    updateMessageStatus: (
        conversationId: string,
        tempId: string,
        status: Message['status'],
        serverId?: string
    ) => void
    updateConversation: (
        conversationId: string,
        updater: (conv: Conversation) => Conversation
    ) => void
    getMergedConversation: (conversation: Conversation) => Conversation

    // Notification operations
    clearNotifications: () => void
    removeNotification: (notificationId: string) => void

    // Presence operations
    getUserPresence: (userId: string) => any
    isUserOnline: (userId: string) => boolean
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { accessToken, currentUser } = useAuth()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const [openConversation, setOpenConversation] = useState<Conversation | null>(null)

    // Socket connection management
    const { socket, isConnected } = useSocketConnection(
        accessToken,
        currentUser?.id || null
    )

    // Notification handling
    // Pass our sonner-based toast into notification handlers
    const { notifications, clearNotifications, removeNotification } =
        useNotificationHandlers({ socket, toast })

    // Message handling
    const { realtimeMessages, addMessage, updateMessageStatus, clearConversationMessages } = useMessageHandlers({
        socket,
        currentUserId: currentUser?.id || null,
        queryClient,
    })

    // Presence handling
    const { getUserPresence, isUserOnline } = usePresenceHandlers(socket)

    // Messaging operations
    const { sendMessage, addOptimisticMessage, updateConversation, getMergedConversation: getMergedConversationBase } = useMessagingOperations({
        socket,
        queryClient,
        updateMessageStatus,
        addMessage,
        toast,
    })

    // Wrapper to inject realtimeMessages into getMergedConversation
    const getMergedConversation = (conversation: Conversation): Conversation => {
        return getMergedConversationBase(conversation, realtimeMessages)
    }

    const contextValue: MessagingContextType = {
        // Socket connection
        socket,
        isConnected,

        // Real-time state
        realtimeMessages,
        notifications,

        // Conversation state
        openConversation,
        setOpenConversation,

        // Messaging operations
        sendMessage,
        addMessage,
        addOptimisticMessage,
        updateMessageStatus,
        updateConversation,
        getMergedConversation,

        // Notification operations
        clearNotifications,
        removeNotification,

        // Presence operations
        getUserPresence,
        isUserOnline,
    }

    return (
        <MessagingContext.Provider value={contextValue}>
            {children}
        </MessagingContext.Provider>
    )
}

/**
 * Custom hook to use messaging context
 * @throws Error if used outside MessagingProvider
 */
export const useMessaging = () => {
    const context = useContext(MessagingContext)

    if (!context) {
        throw new Error('useMessaging must be used within a MessagingProvider')
    }

    return context
}