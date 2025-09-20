import { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Conversation } from '@/types/messaging';
import ConversationList from '@/components/messaging/ConversationList';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useSocket();

  console.log("Socket in chat: ", socket);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6">
      <button onClick={handleOpen} className="bg-jb-primary-foreground p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white p-4 rounded-lg shadow-lg">
          <button onClick={handleClose} className="absolute top-0 right-0 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
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
          {/* {socket && (
            // <ConversationList
            //   conversations={socket.data.conversations}
            //   onConversationClick={(conversation: Conversation) => {
            //     socket.emit(
            //       'chat:join',
            //       { conversationId: conversation.id },
            //       (res: any) => {
            //         if (res.ok) {
            //           console.log('Joined conversation:', res.conversationId);
            //         } else {
            //           console.error('Failed to join conversation:', res.error);
            //         }
            //       }
            //     );
            //   }}
            // />
          )} */}
        </div>
      )}
    </div>
  );
}
