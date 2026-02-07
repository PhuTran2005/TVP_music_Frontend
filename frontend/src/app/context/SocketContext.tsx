import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";

// Định nghĩa kiểu dữ liệu cho Context
interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
}

// Tạo Context
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);

// Custom Hook để sử dụng Socket (Đặt ở đây là hợp lý nhất)
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
