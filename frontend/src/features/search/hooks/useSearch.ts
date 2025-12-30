// src/features/search/hooks/useSearch.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchApi } from "../api/searchApi";
import { useDebounce } from "@/hooks/useDebounce"; // Import hook trên

export const useSearch = (query: string) => {
  // Delay 500ms: Chỉ gọi API khi user ngừng gõ 0.5s
  const debouncedQuery = useDebounce(query, 500);

  return useQuery({
    // Cache key phụ thuộc vào debouncedQuery.
    // Key đổi -> React Query tự fetch lại.
    queryKey: ["search", debouncedQuery],

    queryFn: () => searchApi.search({ q: debouncedQuery, limit: 5 }),

    // --- TỐI ƯU UX ---

    // 1. Chỉ fetch khi từ khóa có ít nhất 2 ký tự (đỡ spam rác)
    enabled: debouncedQuery.length >= 2,

    // 2. Giữ kết quả cũ khi đang fetch từ khóa mới (tránh layout shift / nhấp nháy)
    placeholderData: keepPreviousData,

    // 3. Cache kết quả trong 5 phút (khớp với Redis Backend)
    staleTime: 5 * 60 * 1000,

    // 4. Không retry nếu lỗi 404/500 (Search lỗi thì thôi, không cần thử lại ngay)
    retry: false,
  });
};
