import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import genreApi from "../api/genreApi";
import { genreKeys } from "@/features/genre/utils/genreKeys"; // Import Key Factory
import type {
  CreateGenreInput,
  UpdateGenreInput,
  GenreFilterParams,
} from "../types";
import { handleError } from "@/utils/handleError";

// ==========================================
// UTILS
// ==========================================

// ==========================================
// 1. QUERY HOOKS
// ==========================================

/**
 * Hook lấy danh sách Genres (có phân trang, lọc, tìm kiếm).
 * Sử dụng key factory để cache quản lý tự động theo params.
 */
export const useGenres = (params: GenreFilterParams) => {
  return useQuery({
    // 🔥 FIX: Dùng genreKeys.list(params) thay vì mảng thủ công ["genres", params]
    // Kết quả: ['genres', 'list', { filter: params }]
    queryKey: genreKeys.list(params),

    queryFn: () => genreApi.getAll(params),

    // Giữ data cũ khi chuyển trang để UI mượt mà (tránh loading state nhấp nháy)
    placeholderData: keepPreviousData,

    // Cache data 1 phút
    staleTime: 1000 * 60,
  });
};

// ==========================================
// 2. MUTATION HOOKS
// ==========================================

/**
 * Hook tạo mới Genre
 */
export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGenreInput) => genreApi.create(data),
    onSuccess: () => {
      toast.success("Tạo thể loại thành công!");
      // 🔥 Invalidate toàn bộ các query bắt đầu bằng ['genres', 'list']
      // Điều này sẽ refresh mọi trang danh sách (page 1, page 2, search...)
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi khi tạo thể loại"),
  });
};

/**
 * Hook cập nhật thông tin Genre
 */
export const useUpdateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGenreInput) => genreApi.update(data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      // Refresh danh sách để cập nhật tên/ảnh/màu sắc
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
      // Refresh chi tiết (nếu user đang xem trang detail của genre đó)
      queryClient.invalidateQueries({ queryKey: genreKeys.details() });
    },
    onError: (err) => handleError(err, "Lỗi khi cập nhật"),
  });
};

/**
 * Hook bật/tắt trạng thái Active/Inactive
 */
export const useToggleGenreStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => genreApi.toggleStatus(id),
    onSuccess: () => {
      toast.success("Đã thay đổi trạng thái");
      // Refresh danh sách để badge status cập nhật
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
      queryClient.invalidateQueries({ queryKey: genreKeys.details() });
    },
    onError: (err) => handleError(err, "Lỗi thay đổi trạng thái"),
  });
};

/**
 * Hook xóa Genre
 */
export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => genreApi.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa thể loại");
      // Refresh danh sách để loại bỏ item đã xóa
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (err) =>
      handleError(
        err,
        "Không thể xóa thể loại này (có thể do ràng buộc dữ liệu)",
      ),
  });
};
