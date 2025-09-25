import { useState } from 'react';
import { Conversation } from '@/types/messaging';
import ConversationList from '@/components/messaging/ConversationList';
import { useConversation } from '@/hooks/react-queries/messaging/useConversation';
import {  MessageCircleMore } from 'lucide-react';
import { useAuth } from '@/contexts/authContext';
import { normalizeConversation } from '@/lib/utils';
import { useMessaging } from '@/contexts/MessagingContext';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useMessaging();
  const { currentUser } = useAuth();
  const { data: conversations } = useConversation<Conversation[]>();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-6 right-6 text-jb-text z-100">

      {isOpen ? (
        <div className="absolute bottom-14 text-jb-text right-0 w-2xl bg-jb-bg p-4 rounded-lg shadow-lg">
          <button onClick={handleClose} className="absolute top-0 right-0 p-2 cursor-pointer -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-jb-text-muted hover:text-jb-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {socket && conversations && (
            <ConversationList
              convs={normalizeConversation(conversations, currentUser.id)}
              onConversationClick={(conversation: Conversation) => {
                socket.emit(
                  'chat:join',
                  { conversationId: conversation.id },
                  (res: any) => {
                    if (res.ok) {
                      console.log('Joined conversation:', res.conversationId);
                    } else {
                      console.error('Failed to join conversation:', res.error);
                    }
                  }
                );
              }}
            />
          )}
        </div>
      ) : (
        <button onClick={handleOpen} className="bg-jb-surface p-2 rounded-full shadow-lg cursor-pointer hover:bg-jb-bg">
          <MessageCircleMore size={60} className='text-jb-primary bg-jb-surface border-1 p-2 rounded-full shadow-lg' />
        </button>
      )}
    </div>
  );
}
