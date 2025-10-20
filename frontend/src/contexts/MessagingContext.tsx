import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Message, Conversation, MessageStatus } from '@/types/messaging'
import { useAuth } from './authContext'
import { createSocket } from '@/lib/socket'
import { Socket } from 'socket.io-client'

type MessagingContextType = {
    realtimeMessages: Map<string, Message[]>
    socket: typeof Socket | null
    isConnected: boolean
    sendMessage: ({
        tempId,
        receiverId,
        conversationId,
        body,
    }: {
        tempId: string
        receiverId: string
        conversationId: string
        body: string
    }) => void
    addMessage: (conversationId: string, message: Message) => void
    updateConversation: (
        conversationId: string,
        updater: (conv: Conversation) => Conversation
    ) => void

    // Get merged conversation with real-time updates
    getMergedConversation: (conversation: Conversation) => Conversation

    // Optimistic updates
    addOptimisticMessage: (conversationId: string, message: Message) => void
    updateMessageStatus: (
        conversationId: string,
        tempId: string,
        status: Message['status'],
        serverId?: string
    ) => void
    notis: Notification[]
}

const MessagingContext = createContext<MessagingContextType | undefined>(
    undefined
)

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socket, setSocket] = useState<typeof Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [notis, setNotis] = useState<Notification[]>([])
    const { accessToken, currentUser } = useAuth()
    const queryClient = useQueryClient()

    // Map to store real-time messages that haven't been persisted to React Query cache yet
    const [realtimeMessages, setRealtimeMessages] = useState<
        Map<string, Message[]>
    >(new Map())

    useEffect(() => {
        console
        if (!accessToken) return

        //create socket with access token
        const s = createSocket(accessToken)
        setSocket(s)

        s.connect()

        // listeners
        s.on('connection', () => {
            console.log('✅ Socket connected:', s.id)
            setIsConnected(true)
        })

        s.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason)
            setIsConnected(false)
        })

        s.on('presence:update', (data) => {
            console.log('📡 Presence update:', data)
        })

        s.on('notification', (notif) => {
            console.log('🔔 Notification:', notif)

            setNotis((prev) => [...prev, notif])
        })

        const handleNewMessage = (message: Message) => {
            if (currentUser?.id === message.senderId) return

            // Add to real-time messages
            setRealtimeMessages((prev) => {
                const updated = new Map(prev)
                const messages = updated.get(message.conversationId) || []
                updated.set(message.conversationId, [...messages, message])
                return updated
            })

            // Invalidate and refetch the conversations list to update last message
            queryClient.invalidateQueries({ queryKey: ['conversations'] })

            // Invalidate specific conversation messages if they're being viewed
            queryClient.invalidateQueries({
                queryKey: ['conversations', message.conversationId, 'messages'],
            })
        }

        s.on('chat:new', handleNewMessage)

        return () => {
            s.disconnect()
            setIsConnected(false)
        }
    }, [accessToken])

    const sendMessage = async ({
        tempId,
        receiverId,
        conversationId,
        body,
    }: {
        tempId: string
        receiverId: string
        conversationId: string
        body: string
    }) => {
        socket?.emit(
            'chat:send',
            {
                receiverId,
                conversationId,
                text: body,
            },
            (res: any) => {
                if (res.ok) {
                    setRealtimeMessages((prev) => {
                        const updated = new Map(prev)
                        const messages = updated.get(conversationId) || []
                        const newMessages = messages.map((m) => {
                            if (m.tempId === tempId) {
                                return {
                                    ...m,
                                    status: 'sent' as MessageStatus,
                                    id: res.messageId,
                                }
                            }
                            return m
                        })
                        updated.set(conversationId, newMessages)
                        return updated
                    })
                    // updateMessageStatus(conversationId, tempId, 'sent', res.messageId);
                } else {
                    console.error('Send failed:', res.error)
                    updateMessageStatus(conversationId, tempId, 'failed')
                }
            }
        )
    }

    // Add a message to real-time store
    const addMessage = useCallback(
        (conversationId: string, message: Message) => {
            setRealtimeMessages((prev) => {
                const updated = new Map(prev)
                const messages = updated.get(conversationId) || []
                updated.set(conversationId, [...messages, message])

                console.log('Realtime messages updated:', updated)
                return updated
            })
        },
        []
    )

    // Add optimistic message (for immediate UI update when sending)
    const addOptimisticMessage = useCallback(
        (conversationId: string, message: Message) => {
            // Add to real-time messages immediately
            addMessage(conversationId, message)

            // Optimistically update the React Query cache
            queryClient.setQueryData<Conversation[]>(
                ['conversations'],
                (old) => {
                    if (!old) return old

                    return old.map((conv) => {
                        if (conv.id === conversationId) {
                            return {
                                ...conv,
                                lastMessage: message,
                                messages: [...(conv.messages || []), message],
                                updatedAt: new Date().toISOString(),
                            }
                        }
                        return conv
                    })
                }
            )
        },
        [queryClient]
    )

    // Update message status (e.g., from 'sending' to 'sent')
    const updateMessageStatus = useCallback(
        (
            conversationId: string,
            tempId: string,
            status: Message['status'],
            serverId?: string
        ) => {
            setRealtimeMessages((prev) => {
                const updated = new Map(prev)
                const messages = updated.get(conversationId) || []

                const updatedMessages = messages.map((msg) => {
                    if (msg.tempId === tempId) {
                        return {
                            ...msg,
                            id: serverId || msg.id,
                            status,
                            tempId: serverId ? undefined : msg.tempId, // Remove tempId once we have server id
                        }
                    }
                    return msg
                })

                updated.set(conversationId, updatedMessages)
                return updated
            })
        },
        []
    )

    // Update a conversation in the cache
    const updateConversation = useCallback(
        (
            conversationId: string,
            udpated: (conv: Conversation) => Conversation
        ) => {
            queryClient.setQueryData<Conversation[]>(
                ['conversations'],
                (old) => {
                    if (!old) return old

                    return old.map((conv) => {
                        if (conv.id === conversationId) {
                            return udpated(conv)
                        }
                        return conv
                    })
                }
            )
        },
        [queryClient]
    )

    // Get merged conversation with real-time updates
    const getMergedConversation = useCallback(
        (conversation: Conversation): Conversation => {
            const rtMessages = realtimeMessages.get(conversation.id) || []

            // Merge messages, avoiding duplicates
            const existingIds = new Set(conversation.messages.map((m) => m.id))
            const newMessages = rtMessages.filter((m) => !existingIds.has(m.id))

            if (newMessages.length === 0) {
                return conversation
            }

            const allMessages = [...conversation.messages, ...newMessages].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            )

            const lastMessage = allMessages[allMessages.length - 1]

            return {
                ...conversation,
                messages: allMessages,
                lastMessage: lastMessage || conversation.lastMessage,
                updatedAt: lastMessage?.createdAt || conversation.updatedAt,
            }
        },
        [realtimeMessages]
    )

    const value = useMemo(
        () => ({
            realtimeMessages,
            isConnected,
            sendMessage,
            addMessage,
            updateConversation,
            getMergedConversation,
            addOptimisticMessage,
            updateMessageStatus,
            notis,
            socket,
        }),
        [
            realtimeMessages,
            isConnected,
            sendMessage,
            addMessage,
            updateConversation,
            getMergedConversation,
            addOptimisticMessage,
            updateMessageStatus,
            notis,
            socket,
        ]
    )

    return (
        <MessagingContext.Provider value={value}>
            {children}
        </MessagingContext.Provider>
    )
}

export const useMessaging = () => {
    const context = useContext(MessagingContext)
    if (!context) {
        throw new Error('useMessaging must be used within a MessagingProvider')
    }
    return context
}
