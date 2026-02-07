import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import albumApi from "../api/albumApi";
import { albumKeys } from "@/features/album/utils/albumKeys";
import { ApiErrorResponse } from "@/types"; // Import type lỗi chuẩn
import type { AlbumFilterParams } from "../types";

/**
 * Hook quản lý toàn bộ logic Admin cho Album
 * Bao gồm: Filter, Pagination, CRUD, Toggle Visibility
 */
export const useAlbumAdmin = (initialLimit = 10) => {
  const queryClient = useQueryClient();

  // ==========================================
  // 1. FILTER STATE
  // ==========================================
  const [filterParams, setFilterParams] = useState<AlbumFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    artistId: "",
    genreId: "",
    year: undefined,
    sort: "newest",
    type: undefined,
    isPublic: undefined,
  });

  // ==========================================
  // 2. QUERY DATA (FETCHING)
  // ==========================================
  const {
    data: queryData,
    isLoading,
    isFetching,
  } = useQuery({
    // 🔥 FIX KEY: ['albums', 'list', { filter: ... }]
    queryKey: albumKeys.list(filterParams),

    queryFn: () => albumApi.getAll(filterParams),

    // Giữ data cũ khi chuyển trang
    placeholderData: keepPreviousData,

    // Cache data 1 phút
    staleTime: 1000 * 60,
  });

  const albums = queryData?.data?.data || [];
  const meta = queryData?.data?.meta || {
    totalItems: 0,
    page: 1,
    pageSize: initialLimit,
    totalPages: 1,
  };

  // Helper xử lý lỗi (DRY)
  const handleError = (err: unknown, defaultMessage: string) => {
    const error = err as ApiErrorResponse;
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
  };

  // ==========================================
  // 3. MUTATIONS
  // ==========================================

  // --- A. CREATE ---
  const createMutation = useMutation({
    mutationFn: (data: any) => albumApi.create(data),
    onSuccess: () => {
      toast.success("Tạo Album mới thành công");
      // Refresh danh sách
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo album"),
  });

  // --- B. UPDATE ---
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      albumApi.update(id, data),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật Album thành công");
      // Refresh danh sách
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
      // Refresh chi tiết (nếu đang xem)
      queryClient.invalidateQueries({
        queryKey: albumKeys.detail(variables.id),
      }); // Lưu ý: id này phải là slug hoặc id tùy logic detail key
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // --- C. DELETE ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => albumApi.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa Album");
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa album"),
  });

  // --- D. TOGGLE VISIBILITY (Quick Action) ---
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: boolean;
    }) => albumApi.update(id, { isPublic: !currentStatus }),
    onSuccess: (_, variables) => {
      const newStatus = !variables.currentStatus ? "Công khai" : "Riêng tư";
      toast.success(`Đã chuyển sang ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
    onError: (err) => handleError(err, "Không thể thay đổi trạng thái"),
  });

  // ==========================================
  // 4. HANDLERS & WRAPPERS
  // ==========================================

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: keyof AlbumFilterParams, value: any) => {
    setFilterParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return {
    // --- Data ---
    albums,
    meta,
    filterParams,

    // --- Loading States ---
    isLoading: isLoading || isFetching,

    // Gom nhóm loading cho các hành động thay đổi dữ liệu
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleVisibilityMutation.isPending,

    // --- Actions ---
    setFilterParams,
    handlePageChange,
    handleFilterChange,

    // --- Wrapper Functions (UI gọi dễ dàng hơn) ---

    // 1. Create: createAlbum(data, options)
    createAlbum: (data: any, options?: any) =>
      createMutation.mutate(data, options),

    // 2. Update: updateAlbum(id, data, options) -> Tự động đóng gói {id, data}
    updateAlbum: (id: string, data: any, options?: any) =>
      updateMutation.mutate({ id, data }, options),

    // 3. Delete
    deleteAlbum: (id: string, options?: any) =>
      deleteMutation.mutate(id, options),

    // 4. Toggle Visibility
    toggleVisibility: (id: string, currentStatus: boolean) =>
      toggleVisibilityMutation.mutate({ id, currentStatus }),

    // --- Async Variants ---
    createAlbumAsync: createMutation.mutateAsync,
    updateAlbumAsync: (id: string, data: any) =>
      updateMutation.mutateAsync({ id, data }),
  };
};
