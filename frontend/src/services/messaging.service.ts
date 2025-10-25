import { Conversation, Message, Notification } from '@/types/messaging'
import { ApiService } from './api.service'

class MessagingService extends ApiService {
    private endpoints = {
        ALL: '/conversations',
        CONVERSATION: (id: string) => `/conversations/${id}`,
        CONVERSATION_MESSAGES: (id: string) => `/conversations/${id}/messages`,
        NOTIFICATIONS: '/notifications',
    }

    public async getConversations(): Promise<Conversation[]> {
        const response = await this.get<Conversation[]>(this.endpoints.ALL)
        return response.data.data
    }

    public async getConversationById(id: string): Promise<Conversation> {
        const response = await this.get<Conversation>(
            this.endpoints.CONVERSATION(id)
        )
        return response.data.data
    }

    public async getConversationMessages(id: string): Promise<Message[]> {
        const response = await this.get<Message[]>(
            this.endpoints.CONVERSATION_MESSAGES(id)
        )
        return response.data.data
    }

    public async batchUpdateNotificationsStatus(
        ids: string[],
    ): Promise<Notification[]> {
        const response = await this.put<Notification[]>(
            this.endpoints.NOTIFICATIONS,
            ids
        )

        return response.data.data;
    }
}

export default new MessagingService()
