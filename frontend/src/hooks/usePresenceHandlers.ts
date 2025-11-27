// hooks/usePresenceHandlers.ts

import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { SOCKET_EVENTS } from '@/lib/constants/socketEvents'
import { PresenceUpdate } from '@/types/socket'

/**
 * Custom hook to manage user presence status
 * Tracks online/offline status of users
 */
export const usePresenceHandlers = (socket: typeof Socket | null) => {
  const [presenceMap, setPresenceMap] = useState<Map<string, PresenceUpdate>>(
    new Map()
  )

  useEffect(() => {
    if (!socket) return

    const handlePresenceUpdate = (data: PresenceUpdate) => {
      setPresenceMap((prev) => {
        const updated = new Map(prev)
        updated.set(data.userId, data)
        return updated
      })
    }

    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate)

    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate)
    }
  }, [socket])

  const getUserPresence = (userId: string): PresenceUpdate | undefined => {
    return presenceMap.get(userId)
  }

  /** Check if a user is online **/
  const isUserOnline = (userId: string): boolean => {
    const presence = presenceMap.get(userId)
    return presence?.status === 'online'
  }

  return {
    presenceMap,
    getUserPresence,
    isUserOnline,
  }
}