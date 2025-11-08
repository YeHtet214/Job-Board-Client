import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Notification, RealTimeNoti } from '@/types/messaging'
import { SOCKET_EVENTS } from '@/lib/constants/socketEvents'

interface UseNotificationHandlersProps {
    socket: typeof Socket | null
    toast: (options: {
        title: string
        description: string
        variant?: 'default' | 'destructive'
    }) => void
}

/**
 * Handles both batch notifications (on connect) and real-time notifications
 */
export const useNotificationHandlers = ({
    socket,
    toast,
}: UseNotificationHandlersProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        if (!socket) return

        /**
         * Handle batch notifications dispatched on initial connection
         * These are notifications that were sent while the user was offline
         */
        const handleNotificationDispatch = (notis: Notification[]) => {
            console.log('📬 Received batch notifications:', notis.length)
            setNotifications(notis)

            // Show toast for each notification (consider limiting this in production)
            notis.forEach((noti) => {
                toast({
                    title: `${noti.payload.senderName} sent you a message`,
                    description: noti.payload.snippet,
                    variant: 'default',
                })
            })
        }

        /**
         * Handle real-time notifications while user is online
         */
        const handleRealtimeNotification = (noti: RealTimeNoti) => {
            toast({
                title: `${noti.senderName} sent you a message`,
                description: noti.snippet,
                variant: 'default',
            })
        }

        // Register event handlers
        socket.on(
            SOCKET_EVENTS.NOTIFICATION_DISPATCH,
            handleNotificationDispatch
        )
        socket.on(SOCKET_EVENTS.NOTIFICATION, handleRealtimeNotification)

        // Cleanup
        return () => {
            socket.off(
                SOCKET_EVENTS.NOTIFICATION_DISPATCH,
                handleNotificationDispatch
            )
            socket.off(SOCKET_EVENTS.NOTIFICATION, handleRealtimeNotification)
        }
    }, [socket, toast])

    /**
     * Clear all notifications
     */
    const clearNotifications = () => {
        setNotifications([])
    }

    /**
     * Remove a specific notification
     */
    const removeNotification = (notificationId: string) => {
        setNotifications((prev) =>
            prev.filter((noti) => noti.id !== notificationId)
        )
    }

    return {
        notifications,
        clearNotifications,
        removeNotification,
    }
}
