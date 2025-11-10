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

            if (notis.length < 0 || !notis) return
            setNotifications(notis)
           
            // Show toast for each notification
            notis.forEach((noti) => {
                if (noti.status !== 'DELIVERED') {
                    toast({
                        title: `${noti.payload.senderName} sent you a message`,
                        description: noti.payload.snippet,
                        variant: 'default',
                    })
                }
            })

             updateNotificationsStatus(
                notis.map((noti) => noti.id),
                'DELIVERED'
            )
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
        updateNotificationsStatus(
            notifications.map((noti) => noti.id),
            'READ'
        )
    }

    /**
     * Remove a specific notification
     */
    const removeNotification = (notificationId: string) => {
        setNotifications((prev) =>
            prev.filter((noti) => noti.id !== notificationId)
        )

        updateNotificationsStatus([notificationId], 'READ')
    }

    const updateNotificationsStatus = (
        ids: string[],
        status: Notification['status']
    ) => {
        const updateNotis = new Map()
        ids.forEach((id) => updateNotis.set(id, status))
        setNotifications((prev) =>
            prev.map((noti) => {
                if (updateNotis.has(noti.id)) {
                    return {
                        ...noti,
                        status: status,
                    }
                }
                return noti
            })
        )

        socket?.emit(SOCKET_EVENTS.NOTIFICATION_STATUS_UPDATE, { ids, status })
    }

    return {
        notifications,
        clearNotifications,
        removeNotification,
    }
}
