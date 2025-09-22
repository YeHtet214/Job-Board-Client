import { Conversation, NormalizedConversation } from "@/types/messaging";
import { useAuth } from '@/contexts/authContext';

type ConversationListProps = {
  convs: NormalizedConversation[],
  onConversationClick: (conversation: Conversation) => void
}
const ConversationList = ({ convs, onConversationClick }: ConversationListProps) => {
  const { currentUser } = useAuth();

  const handleConversationClick = (con: any) => {
    // Handle conversation click
  };

  return (
    <div className="w-full mx-auto bg-jb-surface rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-jb-sruface-200">
        {convs ? convs.map((conv: NormalizedConversation) => (
          <li key={conv.id} className="flex items-center px-4 py-3 hover:bg-jb-bg transition cursor-pointer" onClick={() => handleConversationClick(conv)}>
            <img
              src={'https://i.pravatar.cc/40?img=1'}
              alt={conv.receipent?.id === currentUser?.id ? currentUser?.firstName : conv.receipent?.name}
              className="w-10 h-10 rounded-full object-cover mr-4 border"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-jb-text opacity-90 truncate">{conv.receipent?.name}</span>
              </div>
              <p className="text-sm text-jb-text-muted truncate">{conv.lastMessage} last message</p>
            </div>
          </li>
        )): (
          <>No conversations found!</>
        )}
      </ul>
    </div>
  );
}

export default ConversationList;
