// src/features/search/hooks/useSearch.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchApi } from "../api/searchApi";
import { useDebounce } from "@/hooks/useDebounce";

export const useSearch = (query: string) => {
  // Delay 400ms mang lại cảm giác phản hồi nhanh hơn 500ms
  const debouncedQuery = useDebounce(query, 400);

  return useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchApi.search({ q: debouncedQuery, limit: 10 }), // Tăng limit lên để list trả về phong phú hơn

    // --- TỐI ƯU UX ---

    // 1. Cho phép tìm kiếm ngay cả với 1 ký tự (Ví dụ: "V" của BTS)
    // Dùng .trim() để tránh việc user chỉ gõ dấu cách " " làm gọi API lỗi
    enabled: debouncedQuery.trim().length > 0,

    // 2. Giữ kết quả cũ trên màn hình trong lúc Fetching data mới -> Tránh chớp nháy (Layout Shift)
    placeholderData: keepPreviousData,

    // 3. StaleTime: Dữ liệu được coi là "tươi" trong 2 phút (Search thay đổi liên tục, không nên để 5 phút)
    staleTime: 2 * 60 * 1000,

    // 4. Garbage Collection Time (Cache Time cũ): Giữ kết quả trong bộ nhớ 15 phút.
    // Giúp UX cực mượt khi user bấm Back/Forward trình duyệt.
    gcTime: 15 * 60 * 1000,

    // 5. Không retry nếu lỗi 404/500 để tránh spam server khi đang sập
    retry: false,
  });
};
