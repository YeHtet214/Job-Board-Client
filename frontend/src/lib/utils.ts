import { Conversation, NormalizedConversation } from "@/types/messaging";
import { clsx, type ClassValue } from "clsx";
import { read } from "fs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function normalizeConversation(
	convs: Conversation[],
	currentUserId: string
): NormalizedConversation[] | [] {
  if (!convs) return [];

	return convs.map((conv) => ({
		id: conv.id,
		receipent: conv.participants.map((participant) => {
			const receipent = participant.user;
			if (receipent.id === currentUserId) return null;
			return {
				name: receipent.firstName + " " + receipent.lastName,
				id: receipent.id,
				avatar: receipent.profileImageURL ? receipent.profileImageURL : receipent.logo,
			};
		}).filter(Boolean)[0],
    updatedAt: conv.updatedAt,
		messages: conv.messages,
    lastMessage: conv.lastMessage?.content ?? "",
    createdAt: conv.createdAt,
    unreadCount: conv.unreadCount,
	}));
}
