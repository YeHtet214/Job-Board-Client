// hooks/useSocketConnection.ts

import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { createSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/lib/constants/socketEvents'

/**
 * Custom hook to manage socket connection lifecycle
 * Handles connection, disconnection, and connection state
 */
export const useSocketConnection = (
  accessToken: string | null,
  userId: string | null
) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Don't create socket if no auth token or user
    if (!accessToken || !userId) {
      setSocket(null)
      setIsConnected(false)
      return
    }

    // Create and connect socket
    const socketInstance = createSocket(accessToken)
    setSocket(socketInstance)
    socketInstance.connect()

    // Connection event handlers
    const handleConnection = () => {
      console.log('✅ Socket connected')
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log('❌ Socket disconnected')
      setIsConnected(false)
    }

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    }

    // Register event handlers
    socketInstance.on(SOCKET_EVENTS.CONNECTION, handleConnection)
    socketInstance.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect)
    socketInstance.on('connect_error', handleConnectError)

    // Cleanup function
    return () => {
      socketInstance.off(SOCKET_EVENTS.CONNECTION, handleConnection)
      socketInstance.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect)
      socketInstance.off('connect_error', handleConnectError)
      socketInstance.disconnect()
      setIsConnected(false)
    }
  }, [accessToken, userId])

  return { socket, isConnected }
}