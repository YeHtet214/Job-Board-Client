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
		receipent: conv.participants.map((summ) => {
			if (summ.user.id === currentUserId) return null;
			return {
				name: summ.user.firstName + " " + summ.user.lastName,
				id: summ.user.id,
			};
		})[0],
    updatedAt: conv.updatedAt,
    lastMessage: conv.lastMessage?.content ?? "",
    createdAt: conv.createdAt,
    unreadCount: conv.unreadCount,
	}));
}
