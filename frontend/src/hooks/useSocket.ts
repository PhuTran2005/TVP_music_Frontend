// src/hooks/useSocket.ts
import { useContext } from "react";
import { SocketContext } from "@/app/context/SocketContext"; // Đường dẫn tuỳ chỉnh

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
