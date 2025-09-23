import MessagingService from "@/services/messaging.service";
import { Conversation } from "@/types/messaging";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const messagingKeys  = {
  all: ['conversations'] as const,
  details: () => [...messagingKeys.all, 'details'] as const,
  detail: (id: string) => [messagingKeys.details(), id] as const,
  conversationMessages: () => [...messagingKeys.all, 'conversationMessages'] as const,
  messageById: (id: string) => [messagingKeys.conversationMessages(), id] as const,
};

export function useConversation<T>(): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: messagingKeys.all,
    queryFn: async () => {
      const conversations = await MessagingService.getConversations() as Conversation[];
      return conversations;
    },
  })
}

export function useConversationMessag<T>(conId: string): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: messagingKeys.conversationMessages(),
    queryFn: async () => {
      return await MessagingService.getConversationMessages(conId);
    },
  })
}