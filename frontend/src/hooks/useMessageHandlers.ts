// hooks/useMessageHandlers.ts

import { useState, useEffect, useCallback } from 'react'
import { Socket } from 'socket.io-client'
import { QueryClient } from '@tanstack/react-query'
import { Message } from '@/types/messaging'
import { SOCKET_EVENTS } from '@/lib/constants/socketEvents'

interface UseMessageHandlersProps {
  socket: typeof Socket | null
  currentUserId: string | null
  queryClient: QueryClient
}

/**
 * Custom hook to manage message-related socket events and real-time message state
 * Handles incoming messages and syncs with React Query cache
 */
export const useMessageHandlers = ({
  socket,
  currentUserId,
  queryClient,
}: UseMessageHandlersProps) => {
  // Store real-time messages that haven't been persisted to React Query cache yet
  const [realtimeMessages, setRealtimeMessages] = useState<Map<string, Message[]>>(
    new Map()
  )

  useEffect(() => {
    if (!socket || !currentUserId) return

    /**
     * Handle new incoming messages from other users
     */
    const handleNewMessage = (message: Message) => {
      // Ignore messages sent by current user (they're handled optimistically)
      if (currentUserId === message.senderId) return

      // Add to real-time messages store
      setRealtimeMessages((prev) => {
        const updated = new Map(prev)
        const messages = updated.get(message.conversationId) || []
        updated.set(message.conversationId, [...messages, message])
        return updated
      })

      // Invalidate queries to trigger refetch with new data
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      })

      queryClient.invalidateQueries({
        queryKey: ['conversations', message.conversationId, 'messages'],
      })
    }

    // Register event handler
    socket.on(SOCKET_EVENTS.CHAT_NEW, handleNewMessage)

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_NEW, handleNewMessage)
    }
  }, [socket, currentUserId, queryClient])

  /**
   * Add a message to real-time store
   */
  const addMessage = useCallback((conversationId: string, message: Message) => {
    setRealtimeMessages((prev) => {
      const updated = new Map(prev)
      const messages = updated.get(conversationId) || []
      updated.set(conversationId, [...messages, message])
      return updated
    })
  }, [])

  /**
   * Update message status (e.g., from 'sending' to 'sent' or 'failed')
   */
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
              tempId: serverId ? undefined : msg.tempId,
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

  const clearConversationMessages = useCallback((conversationId: string) => {
    setRealtimeMessages((prev) => {
      const updated = new Map(prev)
      updated.delete(conversationId)
      return updated
    })
  }, [])

  return {
    realtimeMessages,
    addMessage,
    updateMessageStatus,
    clearConversationMessages,
  }
}