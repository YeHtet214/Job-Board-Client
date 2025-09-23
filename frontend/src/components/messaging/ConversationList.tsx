import { Conversation, NormalizedConversation } from "@/types/messaging";
import { useAuth } from '@/contexts/authContext';
import { useState } from "react";
import ConversationDialog from "./ConversationDialog";

type ConversationListProps = {
  convs: NormalizedConversation[],
  onConversationClick: (conversation: Conversation) => void
}

const ConversationList = ({ convs, onConversationClick }: ConversationListProps) => {
  const [openConversation, setOpenConversation] = useState<NormalizedConversation | null>(null);
  const { currentUser } = useAuth();

  console.log("Fetched convs: ", convs);

  const handleConversationClick = (conv: any) => {
    // Handle conversation click
    if (conv && conv.id !== openConversation?.id) {
      setOpenConversation(conv);
    }
  };

  return (
    <div className="w-full min-h-[300px] mx-auto grid grid-cols-3 bg-jb-surface rounded-lg shadow-md overflow-hidden">
      <ul className={`divide-y ${openConversation ? 'col-span-1' : 'col-span-2'} divide-jb-sruface-200`}>
        {convs ? convs.map((conv: NormalizedConversation) => (
          <li key={conv.id} className={`flex ${openConversation?.id === conv.id ? 'bg-jb-bg' : ''} items-center px-4 py-3 hover:bg-jb-bg transition cursor-pointer`} onClick={() => handleConversationClick(conv)}>
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

      { openConversation && (
        <div className="col-span-2 border-l-1">
          <ConversationDialog conv={openConversation} />
        </div>
      )}
    </div>
  );
}

export default ConversationList;
