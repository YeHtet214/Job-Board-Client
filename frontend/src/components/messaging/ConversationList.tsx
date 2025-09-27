import { Conversation } from "@/types/messaging";
import { useAuth } from '@/contexts/authContext';
import { useState } from "react";
import ConversationDialog from "./ConversationDialog";

type ConversationListProps = {
  convs: Conversation[],
  onConversationClick: (conversation: Conversation) => void
}

const ConversationList = ({ convs, onConversationClick }: ConversationListProps) => {
  const [openConversation, setOpenConversation] = useState<Conversation | null>(null);
  const [toggleConversation, setToggleConversation] = useState(false);
  const { currentUser } = useAuth();

  const handleConversationClick = (conv: any) => {
    // Handle conversation click
    setToggleConversation(!toggleConversation);

    if (conv && conv.id !== openConversation?.id) {
      setOpenConversation(conv);
    }
  };

  return (
    <div className="w-full min-h-[300px] mx-auto grid grid-cols-3 bg-jb-surface rounded-lg shadow-md overflow-auto">
      <ul className={`divide-y transition ${toggleConversation ? 'w-auto border-r-1' : 'w-100'} divide-jb-sruface-200`}>
        {convs ? convs.map((conv: Conversation) => (
          <li key={conv.id} className={`flex ${openConversation?.id === conv.id ? 'bg-jb-bg' : ''} items-center px-4 py-3 hover:bg-jb-bg transition cursor-pointer`} onClick={() => handleConversationClick(conv)}>
            <img
              src={conv.receipent.avatar ? conv.receipent.avatar : ''}
              alt={conv.receipent.id === currentUser?.id ? currentUser?.firstName : conv.receipent?.name}
              className="w-10 h-10 rounded-full object-cover mr-4 border"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-jb-text opacity-90 truncate">{conv.receipent.name}</span>
              </div>
              <p className="text-sm text-jb-text-muted truncate">{conv.lastMessage?.body}</p>
            </div>
          </li>
        )) : (
          <>No conversations found!</>
        )}
      </ul>

      {openConversation && (
        <div className={`transition w-100 max-h-[75vh] overflow-auto ${toggleConversation ? 'translate-x-0' : 'translate-x-[200%]'}`}>
          <ConversationDialog conv={openConversation} />
        </div>
      )}
    </div>
  );
}

export default ConversationList;
