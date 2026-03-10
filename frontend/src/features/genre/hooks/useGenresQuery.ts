import { useQuery, keepPreviousData } from "@tanstack/react-query";
import genreApi from "../api/genreApi";
import { genreKeys } from "../utils/genreKeys";
import { GenreFilterParams } from "../types";

// ==========================================
// 1. Hook lấy danh sách phân trang (Cho Table Admin)
// ==========================================
export const useGenresQuery = (params: GenreFilterParams) => {
  return useQuery({
    // Key unique dựa trên filter params
    queryKey: genreKeys.list(params),

    // Hàm fetch data
    queryFn: () => genreApi.getAll(params),

    // UX: Giữ data cũ khi chuyển trang -> Không bị nháy Loading (Skeleton chỉ hiện lần đầu)
    placeholderData: keepPreviousData,

    // Performance: Cache data trong 1 phút.
    // Nếu user qua tab khác rồi quay lại ngay, data sẽ hiện tức thì từ cache.
    staleTime: 1000 * 60,

    // Optimization: Transform data ngay tại đây để UI gọn gàng
    select: (response) => ({
      genres: response.data.data,
      meta: response.data.meta,
      isEmpty: response.data.data.length === 0,
    }),
  });
};

// ==========================================
// 2. Hook lấy cây danh mục (Cho Dropdown/Selector)
// ==========================================
export const useGenreTreeQuery = () => {
  return useQuery({
    queryKey: genreKeys.tree(),
    queryFn: genreApi.getTree,

    // Tree ít khi thay đổi, cache lâu hơn (5 phút)
    staleTime: 1000 * 60 * 5,

    select: (response) => response.data, // Trả về mảng Genre[] dạng cây
  });
};

// ==========================================
// 3. Hook lấy chi tiết (Cho trang Edit/Detail riêng nếu cần)
// ==========================================
export const useGenreDetailQuery = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: genreKeys.detail(slug),
    queryFn: () => genreApi.getBySlug(slug),
    enabled: !!slug && enabled, // Chỉ fetch khi có slug
    staleTime: 1000 * 60,
    select: (response) => response.data,
  });
};
