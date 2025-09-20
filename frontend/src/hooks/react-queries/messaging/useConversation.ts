import { MessagingService } from "@/services/messaging.service";
import { useQuery } from "@tanstack/react-query";

const messagingKeys  = {
  all: ['conversations'] as const,
  details: () => [...messagingKeys.all, 'details'] as const,
  detail: (id: string) => [messagingKeys.details(), id] as const,
  message: () => [...messagingKeys.all, 'message'] as const,
  conv_message: (id: string) => [messagingKeys.message(), id] as const,
};

export const useConversation = async () => {
  return useQuery({
    queryKey: messagingKeys.all,
    queryFn: async () => {
      const conversations = await MessagingService.getAllConversations();
      return conversations
    },
  })
}

export const useMessage = async () => {
  return useQuery({
    queryKey: ,
    queryFn: async () => {
      const conversations = await MessagingService.getAllConversations();
      return conversations
    },
  })
}