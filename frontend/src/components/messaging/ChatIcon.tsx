import { useState } from 'react';
import { Conversation } from '@/types/messaging';
import ConversationList from '@/components/messaging/ConversationList';
import { useConversation } from '@/hooks/react-queries/messaging/useConversation';
import { MessageCircleMore, X } from 'lucide-react';
import { useAuth } from '@/contexts/authContext';
import { useMessaging } from '@/contexts/MessagingContext';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useMessaging();
  const { currentUser } = useAuth();

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
        <div className="absolute bottom-14 text-jb-text right-0 w-2xl min-h-[300px] bg-jb-bg p-4 rounded-lg shadow-lg">
          <button onClick={handleClose} className="absolute top-0 right-0 p-2 cursor-pointer hover:text-jb-danger/50 transition">
            <X />
          </button>
          {socket && (
            <ConversationList
<<<<<<< HEAD
              convs={conversations}
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
=======
              // onConversationClick={(conversation: Conversation) => {
              //   socket.emit(
              //     'chat:join',
              //     { conversationId: conversation.id },
              //     (res: any) => {
              //       if (res.ok) {
              //         console.log('Joined conversation:', res.conversationId);
              //       } else {
              //         console.error('Failed to join conversation:', res.error);
              //       }
              //     }
              //   );
              // }}
>>>>>>> realTime_Messaging
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
