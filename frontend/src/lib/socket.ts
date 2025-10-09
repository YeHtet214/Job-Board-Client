import { io, Socket } from "socket.io-client";

const SOCKET_URL =  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const createSocket = (token?: string): typeof Socket => {
  return io(SOCKET_URL, {
    auth: { token: token ? `Bearer ${token}` : undefined },
    transports: ["websocket"],
    autoConnect: false,
  });
};
