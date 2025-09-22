import { User } from "./user";

// ====== Core User & Conversation ======
export type ConversationParticipant = {
  id: string;
  name: string;
  avatarUrl?: string;
  conversationId: string;
  user: User;
  joinedAt?: Date 
  lastReadAt?: Date
};

export type Conversation = {
  id: string;
  participants: ConversationParticipant[]; // usually 2, but keep array for group chat support
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
};

export type NormalizedConversation = {
  id: string;
  receipent: {
    name: string;
    id: string;
  } | null;
  updatedAt: string;
  lastMessage: string;
  createdAt: string;
  unreadCount: number;
}

// ====== Messages ======
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type Message = {
  id: string;               // server assigned id
  tempId?: string;          // for optimistic UI before server ack
  conversationId: string;
  senderId: string;
  content: string;
  status: MessageStatus;
  createdAt: string;       
  updatedAt?: string;
};

// ====== REST Responses ======
export type ConversationListResponse = {
  conversations: Conversation[];
};

export type MessagesResponse = {
  messages: Message[];
  nextCursor?: string; // for pagination
};

// ====== Socket Payloads ======

// Sent by client → server
export type SocketSendMessage = {
  tempId: string;           // frontend-generated uuid
  conversationId: string;
  content: string;
};

// Received from server → client
export type SocketMessageAck = {
  tempId: string;
  message: Message; // includes final server id & timestamps
};

export type SocketNewMessage = {
  message: Message;
};

export type SocketPresenceUpdate = {
  userId: string;
  isOnline: boolean;
};

export type SocketTypingEvent = {
  conversationId: string;
  userId: string;
  isTyping: boolean;
};
