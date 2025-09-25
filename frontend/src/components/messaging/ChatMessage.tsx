import { useMessaging } from "@/contexts/MessagingContext";
import { useState } from "react";

const ConversationDialog = ({ send, close }: { send: (msg: string) => void, close: () => void }) => {
  const [text, setText] = useState<string>("");

    return (
      <div className="bg-black text-white p-6 position-abbsolute top-[50vh] right-[50vw] -transform-x-1/2 opacity-100 min-w-3xl min-h-4xl">
        <p>Conversation ID: {}</p>
        <p>Receiver ID: {}</p>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex items-stretch">
          <button onClick={() => send(text)}>Send</button>
          <button onClick={close}>Close</button>
        </div>
      </div>
    );
  };

export default function ChatMessage({ receiverId, conversationId }: { receiverId?: string, conversationId?: string }) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { socket, isConnected } = useMessaging();

  const sendMessage = (text: string) => {
    if (!socket) return;
    socket.emit("chat:send", { receiverId: receiverId || null, conversationId: conversationId || null, text }, (res: any) => {
      if (res.ok) console.log("Message sent:", res.messageId);
      else console.error("Send failed:", res.error);
    });
  };

  return (
    <div>
      {/* <p>Socket status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p> */}
      <button onClick={() => setOpenDialog(true)}>Message</button>
      {openDialog && <ConversationDialog send={sendMessage} close={() => setOpenDialog(false)} />}
    </div>
  );
}
