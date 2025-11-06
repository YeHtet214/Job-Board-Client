// hooks/useMessagingOperations.ts

import { useCallback } from 'react'
import { Socket } from 'socket.io-client'
import { QueryClient } from '@tanstack/react-query'
import { Message, Conversation, SendMessagePayload } from '@/types/messaging'
import { SOCKET_EVENTS } from '@/lib/constants/socketEvents'
import { ChatSendResponse } from '@/types/socket'

interface UseMessagingOperationsProps {
    socket: typeof Socket | null
    queryClient: QueryClient
    updateMessageStatus: (
        conversationId: string,
        tempId: string,
        status: Message['status'],
        serverId?: string
    ) => void
    addMessage: (conversationId: string, message: Message) => void
    toast: (options: {
        title: string
        description: string
        variant?: 'default' | 'destructive'
    }) => void
}

/**
 * Custom hook for messaging operations (send, update, etc.)
 * Handles message sending with optimistic updates and error handling
 */
export const useMessagingOperations = ({
    socket,
    queryClient,
    updateMessageStatus,
    addMessage,
    toast,
}: UseMessagingOperationsProps) => {
    const sendMessage = useCallback(
        async ({
            tempId,
            receiverId,
            conversationId,
            body,
        }: SendMessagePayload) => {
            if (!socket) {
                console.error('Cannot send message: Socket not connected')
                updateMessageStatus(conversationId, tempId, 'failed')
                toast({
                    title: 'Connection Error',
                    description:
                        'Not connected to server. Please check your connection.',
                    variant: 'destructive',
                })
                return
            }

            if (!body.trim()) {
                console.warn('Cannot send empty message')
                return
            }

            socket.emit(
                SOCKET_EVENTS.CHAT_SEND,
                {
                    receiverId,
                    conversationId,
                    body: body.trim(),
                },
                (res: ChatSendResponse) => {
                    if (res.ok && res.messageId) {
                        console.log(
                            '✅ Message sent successfully:',
                            res.messageId
                        )
                        updateMessageStatus(
                            conversationId,
                            tempId,
                            'sent',
                            res.messageId
                        )
                    } else {
                        console.error('❌ Send failed:', res.error)
                        updateMessageStatus(conversationId, tempId, 'failed')
                        toast({
                            title: 'Failed to send message',
                            description: res.error || 'Please try again',
                            variant: 'destructive',
                        })
                    }
                }
            )
        },
        [socket, updateMessageStatus, toast]
    )

    /**
     * Add optimistic message (for immediate UI update when sending)
     */
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
        [queryClient, addMessage]
    )

    /**
     * Update a conversation in the cache
     */
    const updateConversation = useCallback(
        (
            conversationId: string,
            updater: (conv: Conversation) => Conversation
        ) => {
            queryClient.setQueryData<Conversation[]>(
                ['conversations'],
                (old) => {
                    if (!old) return old

                    return old.map((conv) => {
                        if (conv.id === conversationId) {
                            return updater(conv)
                        }
                        return conv
                    })
                }
            )
        },
        [queryClient]
    )

    /**
     * Get merged conversation with real-time updates
     */
    const getMergedConversation = useCallback(
        (
            conversation: Conversation,
            realtimeMessages: Map<string, Message[]>
        ): Conversation => {
            const rtMessages = realtimeMessages.get(conversation.id)

            if (!rtMessages || rtMessages.length === 0) {
                return conversation
            }

            // Use Set for O(1) lookup to avoid duplicates
            const existingIds = new Set(conversation.messages.map((m) => m.id))
            const newMessages = rtMessages.filter((m) => !existingIds.has(m.id))

            if (newMessages.length === 0) {
                return conversation
            }

            // Merge and sort messages by creation time
            const allMessages = [...conversation.messages, ...newMessages].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            )

            const lastMessage = allMessages[allMessages.length - 1]

            return {
                ...conversation,
                messages: allMessages,
                lastMessage,
                updatedAt: lastMessage.createdAt,
            }
        },
        []
    )

    return {
        sendMessage,
        addOptimisticMessage,
        updateConversation,
        getMergedConversation,
    }
}
