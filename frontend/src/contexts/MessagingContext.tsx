import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Message, Conversation, MessageStatus, SendMessagePayload, Notification, NotiType, RealTimeNoti } from '@/types/messaging'
import { useAuth } from './authContext'
import { createSocket } from '@/lib/socket'
import { Socket } from 'socket.io-client'
import { useToast } from '@/components/ui/use-toast'

type MessagingContextType = {
    socket: typeof Socket | null
    realtimeMessages: Map<string, Message[]>
    notifications: Notification[]
    isConnected: boolean
    openConversation: Conversation | null
    setOpenConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
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
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { accessToken, currentUser } = useAuth()
    const queryClient = useQueryClient()
    const { toast } = useToast();

    const [socket, setSocket] = useState<typeof Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [openConversation, setOpenConversation] =
        useState<Conversation | null>(null)
    // Map to store real-time messages that haven't been persisted to React Query cache yet
    const [realtimeMessages, setRealtimeMessages] = useState<
        Map<string, Message[]>
    >(new Map())

    useEffect(() => {
        if (!accessToken || !currentUser) {
            setNotifications([])
            return
        }

        //create socket with access token
        const s = createSocket(accessToken)
        setSocket(s)

        s.connect()



        // listeners
        s.on('connection', () => {
            setIsConnected(true)
        })

        s.on('disconnect', () => {
            setIsConnected(false)
        })

        s.on('presence:update', (data: any) => {
            console.log('📡 Presence update:', data)
        })

        // Event handler at the first page load to get all notifications while offline
        s.on('notification:dispatch', (notis: Notification[]) => {

            console.log("ALL Noti: ", notis);

            // Real time notifications has no id with type === "Realtime_Message"
            setNotifications(notis);

            notis.map((noti: Notification) => {
                toast({
                    title: `${noti.payload.senderName} sent you a message`,
                    description: noti.payload.snippet,
                    variant: 'default',
                })
            })
        })

        // Event handler to get notifications while online
        s.on('notification', (noti: RealTimeNoti) => {
            console.log('🔔 Notification:', noti)

            toast({
                title: `${noti.senderName} sent you a message`,
                description: noti.snippet,
                variant: 'default',
            })
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
    }, [accessToken, currentUser])

    const sendMessage = async ({
        tempId,
        receiverId,
        conversationId,
        body,
    }: SendMessagePayload) => {
        socket?.emit(
            'chat:send',
            {
                receiverId,
                conversationId,
                body,
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

    return (
        <MessagingContext.Provider value={{
            socket,
            realtimeMessages,
            notifications,
            isConnected,
            openConversation,
            setOpenConversation,
            sendMessage,
            addMessage,
            updateConversation,
            getMergedConversation,
            addOptimisticMessage,
            updateMessageStatus,
        }}>
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
