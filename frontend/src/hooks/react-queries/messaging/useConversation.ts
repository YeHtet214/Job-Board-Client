import MessagingService from '@/services/messaging.service'
import { Conversation } from '@/types/messaging'
import {
    useInfiniteQuery,
    useQuery,
    useQueryClient,
    UseQueryResult,
} from '@tanstack/react-query'

const messagingKeys = {
    all: ['conversations'] as const,
    details: () => [...messagingKeys.all, 'details'] as const,
    detail: (id: string) => [messagingKeys.details(), id] as const,
    messageByConvId: (convId: string) =>
        [...messagingKeys.all, convId, 'messages'] as const,
}

export function useConversation<T>(): UseQueryResult<T, Error> {
    return useQuery({
        queryKey: messagingKeys.all,
        queryFn: async () => {
            const conversations =
                (await MessagingService.getConversations()) as Conversation[]
            console.log('Returned conversations; ', conversations)
            return conversations
        },
    })
}

export function useConversationMessage<T>(
    convId: string
): UseQueryResult<T, Error> {
    return useQuery({
        queryKey: messagingKeys.messageByConvId(convId),
        queryFn: async () => {
            return await MessagingService.getConversationMessages(convId)
        },
    })
}
