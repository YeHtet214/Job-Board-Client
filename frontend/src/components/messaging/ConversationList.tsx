import { Conversation } from "@/types/messaging";
import { useAuth } from '@/contexts/authContext';
import { useState } from "react";
import ConversationDialog from "./ConversationDialog";
import { useConversation } from "@/hooks/react-queries/messaging/useConversation";

interface ConversationCardType {
  conv: Conversation,
  isCurrentOpen: boolean,
  selectConv: (conv: Conversation) => void
}

const ConversationCard = ({ conv, isCurrentOpen, selectConv }: ConversationCardType) => {
  const { currentUser } = useAuth();

  return (
    <li key={conv.id} className={`flex ${isCurrentOpen && 'bg-jb-bg'} items-center px-4 py-3 hover:bg-jb-bg transition cursor-pointer`} onClick={() => selectConv(conv)}>
      <img
        src={conv.receipent?.avatar}
        alt={conv.receipent?.id === currentUser?.id ? currentUser?.firstName : conv.receipent?.name}
        className="w-10 h-10 rounded-full object-cover mr-4 border"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium text-jb-text opacity-90 truncate">{conv.receipent?.name}</span>
        </div>
        <p className="text-sm text-jb-text-muted truncate">{conv.lastMessage?.body}</p>
      </div>
    </li>
  )
}

const ConversationList = () => {
  const [openConversation, setOpenConversation] = useState<Conversation | null>(null);
  const [toggleConversation, setToggleConversation] = useState(false);
  const { data: conversations } = useConversation<Conversation[]>();

  const handleConversationClick = (conv: any) => {
    // Handle conversation click
    setToggleConversation((prev) => {
      // if (conv.id === openConversation?.id || openConversation) return false;
      // return !prev;
      if (prev === true) return true;

      return !prev;
    });

    if (conv && conv.id !== openConversation?.id) {
      setOpenConversation(conv);
    }
  };

  return (
    <div className="w-full min-h-[300px] mx-auto grid grid-cols-3 bg-jb-surface rounded-lg shadow-md overflow-hidden">
      <ul className={`divide-y transition ${toggleConversation ? 'w-auto border-r-1' : 'w-100'} divide-jb-sruface-200`}>
        {conversations ? conversations.map((conv: Conversation) => (
          <ConversationCard key={conv.id} conv={conv} isCurrentOpen={openConversation?.id === conv.id} selectConv={handleConversationClick} />
        )) : (
          <>No conversations found!</>
        )}
      </ul>

      {openConversation && (
        <div className={`transition w-100 overflow-hidden ${toggleConversation ? 'translate-x-0' : 'translate-x-[200%]'}`}>
          <ConversationDialog conv={openConversation} />
        </div>
      )}
    </div>
  );
}

export default ConversationList;
