// src/lib/react-query.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dữ liệu được coi là "tươi" trong 1 phút (không fetch lại)
      staleTime: 1000 * 60 * 1,

      // Không tự động fetch lại khi người dùng click ra ngoài cửa sổ rồi quay lại (đỡ phiền lúc dev)
      refetchOnWindowFocus: false,

      // Nếu lỗi, thử lại 1 lần thôi (mặc định là 3)
      retry: 1,
    },
  },
});
