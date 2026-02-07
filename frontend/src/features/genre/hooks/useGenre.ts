import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import genreApi from "../api/genreApi";
import { GenreFilterParams } from "@/features/genre/types";
import { genreKeys } from "@/features/genre/utils/genreKeys";
import { handleError } from "@/utils/handleError";

// ==========================================
// 1. QUERIES (READ)
// ==========================================

/**
 * Hook lấy danh sách (có phân trang, lọc)
 */
export const useGenres = (params: GenreFilterParams) => {
  return useQuery({
    // 🔥 FIX KEY: ['genres', 'list', { filter: ... }]
    queryKey: genreKeys.list(params),
    queryFn: () => genreApi.getAll(params),
    placeholderData: keepPreviousData, // Giữ data cũ khi chuyển trang
    staleTime: 60 * 1000, // 1 phút
  });
};

/**
 * Hook lấy chi tiết theo Slug
 */
export const useGenreDetail = (slug: string) => {
  return useQuery({
    // 🔥 FIX KEY: ['genres', 'detail', slug]
    queryKey: genreKeys.detail(slug),
    queryFn: () => genreApi.getBySlug(slug),
    enabled: !!slug,
  });
};

/**
 * Hook đặc biệt: Chỉ lấy Root Genres (Menu/Sidebar)
 */
export const useRootGenres = () => {
  const rootParams: GenreFilterParams = {
    parentId: "root",
    limit: 100,
    page: 1,
    sort: "popular",
  };

  return useQuery({
    // 🔥 FIX KEY: ['genres', 'list', { filter: { parentId: 'root'... } }]
    queryKey: genreKeys.list(rootParams),
    queryFn: () => genreApi.getAll(rootParams),
    staleTime: Infinity, // Cache vĩnh viễn
  });
};

// ==========================================
// 2. MUTATIONS (WRITE)
// ==========================================

export const useGenreMutations = () => {
  const queryClient = useQueryClient();

  // 1. Tạo mới
  const createMutation = useMutation({
    mutationFn: genreApi.create,
    onSuccess: () => {
      toast.success("Tạo thể loại thành công");
      // 🔥 INVALIDATE: Refresh toàn bộ danh sách
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi khi tạo thể loại"),
  });

  // 2. Cập nhật
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      genreApi.update(id, data), // Lưu ý: Đảm bảo API nhận đúng tham số
    onSuccess: (_, variables) => {
      toast.success("Cập nhật thành công");
      // Refresh danh sách
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
      // Refresh chi tiết genre này
      queryClient.invalidateQueries({
        queryKey: genreKeys.detail(variables.id), // Lưu ý: Nếu biến id là slug thì đúng, nếu là _id thì cần check lại logic detail dùng slug hay id
      });
    },
    onError: (err) => handleError(err, "Lỗi khi cập nhật"),
  });

  // 3. Xóa
  const deleteMutation = useMutation({
    mutationFn: genreApi.delete,
    onSuccess: () => {
      toast.success("Xóa thể loại thành công");
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (err) => handleError(err, "Không thể xóa thể loại này"),
  });

  // 4. Đổi trạng thái
  const toggleStatusMutation = useMutation({
    mutationFn: genreApi.toggleStatus,
    onSuccess: () => {
      // Refresh list để badge status cập nhật
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi thay đổi trạng thái"),
  });

  return {
    createGenre: createMutation.mutateAsync,
    updateGenre: updateMutation.mutateAsync,
    deleteGenre: deleteMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
