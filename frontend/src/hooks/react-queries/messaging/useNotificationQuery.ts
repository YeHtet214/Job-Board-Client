import messagingService from "@/services/messaging.service"
import { useMutation } from "@tanstack/react-query"

export const updateNotificationStatusQuery = async () => {
  return useMutation({
    mutationKey: ['notifications'],
    mutationFn: async (ids: string[]) => await messagingService.batchUpdateNotificationsStatus(ids),
    onError: (error) => {
      console.error('Error updating notifications stats:', error)
    },
  })
}