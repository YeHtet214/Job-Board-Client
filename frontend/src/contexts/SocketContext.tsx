// // src/context/SocketContext.tsx
// import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// import { Socket } from "socket.io-client";
// import { createSocket } from "@/lib/socket";
// import { useAuth } from "@/contexts/authContext"; // assumes you have auth context/hook
// import { Message, NormalizedConversation } from "@/types/messaging";

// type MessagingContextType = {
//   socket: typeof Socket | null;
//   isConnected: boolean;
//   conversations: Map<string, NormalizedConversation[]>;
// };

// const MessagingContext = createContext<MessagingContextType>({
//   socket: null,
//   isConnected: false,
//   conversations : new Map<string, NormalizedConversation[]>(),
// });

// export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { accessToken } = useAuth(); // get current user & JWT
//   const [ socket, setSocket ] = useState<typeof Socket | null>(null);
//   const [ , setIsConnected] = useState(false);
//     const [conversations, setConversations] = useState<Map<string, NormalizedConversation[]>>(new Map());

//   useEffect(() => {
//     if (!accessToken) return;

//     // create socket with auth token
//     const s = createSocket(accessToken);
//     console.log(s);
//     setSocket(s);

//     // connect
//     s.connect();

//     // listeners
//     s.on("connect", () => {
//       console.log("✅ Socket connected:", s.id);
//       setIsConnected(true);
//     });

//     s.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//       setIsConnected(false);
//     });

//     s.on("presence:update", (data) => {
//       console.log("📡 Presence update:", data);
//     });

//     s.on("notification", (notif) => {
//       console.log("🔔 Notification:", notif);
//     });

//     const handleNewMessage = (message: Message) => {
//       setConversations(prev => {
//         const updated = new Map(prev);
//         const conversation = updated.get(message.conversationId);
        
//         if (conversation) {
//           conversation.messages.push(message);
//           updated.set(message.conversationId, conversation);
//           conversation.updatedAt = message.createdAt;
//           return updated;
//         }
        
//       })
//     };

//     s.on("chat:new", (msg) => {
//       console.log("💬 New message:", msg);
//       handleNewMessage(msg);
//     });

//     return () => {
//       s.disconnect();
//       setSocket(null);
//       setIsConnected(false);
//     };
//   }, [accessToken]);

//   return (
//     <MessagingContext.Provider value={{ socket, isConnected, conversations }}>
//       {children}
//     </MessagingContext.Provider>
//   );
// };

// export const useSocket = () => useContext(MessagingContext);
