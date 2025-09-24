import { useSocket } from "@/contexts/SocketContext"
import { useMessaging } from "@/contexts/MessagingContext"
import { NormalizedConversation, Message } from "@/types/messaging"
import { SendHorizontal } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

const ReceipentMessage = ({ conv, message }: { conv: NormalizedConversation, message: any }) => {
  return (
    <div className="flex items-center my-2 text-left">
      <img src={conv.receipent?.avatar} alt="profile image" className={`w-10 h-10 object-cover rounded-full`} />
      <div className="ml-2">
        <p className="text-jb-text">{message.body}</p>
      </div>
    </div>
  )
}

const ConversationDialog = ({ conv }: { conv: NormalizedConversation }) => {
  const [input, setInput] = useState<string>('');
  const { socket } = useSocket();
  const { getMergedConversation, addOptimisticMessage, updateMessageStatus } = useMessaging();
  
  // Get conversation with real-time updates
  const mergedConv = getMergedConversation(conv);

  useEffect(() => {
    const pressEnterSendMessage = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    }

    document.addEventListener('keydown', pressEnterSendMessage);

    return () => {
      document.removeEventListener('keydown', pressEnterSendMessage);
    }
  }, []);

  const handleSubmit = (e?: FormEvent | null) => {
    if (e) e.preventDefault();
    if (!socket || !input.trim()) return;
    
    const tempId = uuidv4();
    const optimisticMessage: Message = {
      id: tempId,
      tempId,
      conversationId: conv.id,
      senderId: 'current-user', // This should come from auth context
      body: input,
      status: 'sending',
      createdAt: new Date().toISOString()
    };
    
    // Add optimistic message immediately
    addOptimisticMessage(conv.id, optimisticMessage);
    setInput('');
    
    try {
      socket.emit("chat:send", { 
        receiverId: conv.receipent?.id || null, 
        conversationId: conv.id || null, 
        text: input 
      }, (res: any) => {
        if (res.ok)  {
          console.log("Message sent:", res.messageId);
          // Update message status with server ID
          updateMessageStatus(conv.id, tempId, 'sent', res.messageId);
        } else {
          console.error("Send failed:", res.error);
          // Update message status to failed
          updateMessageStatus(conv.id, tempId, 'failed');
        }
      });
    } catch (error) {
      console.error(error);
      updateMessageStatus(conv.id, tempId, 'failed');
    }
  }

  return (
    <div className={`bg-jb-bg w-full h-full p-2 border-b-1 flex flex-col justify-between`} >
      <div className={`border-b-1 py-2 border-jb-surface`}>
        <h6 className="float-end text-jb-text-muted text-xs">{conv.updatedAt || 'A few sec ago'}</h6>
        <img src={conv.receipent?.avatar} alt="profile image" className={`w-10 h-10 object-cover rounded-full`} />
      </div>

      {mergedConv.messages && mergedConv.messages.map((message: any) => (
        <div className="flex items-start my-2" key={message.tempId || message.id}>
          {message.senderId === conv.receipent?.id ? (
            <ReceipentMessage conv={conv} message={message} />
          ) : (
            <div className="w-full flex justify-end">
              <div className="flex flex-col items-end">
                <p className="text-jb-text bg-jb-primary/10 rounded-lg px-3 py-2">{message.body}</p>
                {message.status === 'sending' && (
                  <span className="text-xs text-jb-text-muted mt-1">Sending...</span>
                )}
                {message.status === 'failed' && (
                  <span className="text-xs text-red-500 mt-1">Failed to send</span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* // Send Message INPUT Form */}
      <form className="w-full relative bg-jb-surface shadow-2xl border-1 rounded-3xl px-4 h-10  outline-none" onSubmit={handleSubmit}>
        <input type="text" className=" w-[95%] h-full bg-transparent outline-none" autoFocus value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" className="absolute top-1/2 right-2 text-jb-primary transform -translate-y-1/2 cursor-pointer hover:text-jb-primary/75">
          <SendHorizontal size={15} />
        </button>
      </form>
    </div>
  )
}

export default ConversationDialog;