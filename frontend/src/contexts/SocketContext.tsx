// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { createSocket } from "@/lib/socket";
import { useAuth } from "@/contexts/authContext"; // assumes you have auth context/hook

type SocketContextType = {
  socket: typeof Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken } = useAuth(); // get current user & JWT
  // const socketRef = useRef<typeof Socket | null>(null);
  const [ socket, setSocket ] = useState<typeof Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    // create socket with auth token
    const s = createSocket(accessToken);
    console.log(s);
    setSocket(s);

    // connect
    s.connect();

    // listeners
    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
      setIsConnected(true);
    });

    s.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    s.on("presence:update", (data) => {
      console.log("📡 Presence update:", data);
    });

    s.on("notification", (notif) => {
      console.log("🔔 Notification:", notif);
    });

    s.on("chat:new", (msg) => {
      console.log("💬 New message:", msg);
    });

    return () => {
      s.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
