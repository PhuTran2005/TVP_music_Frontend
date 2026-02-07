import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import playlistApi from "../api/playlistApi";
import { type PlaylistFilterParams } from "../types";
import { playlistKeys } from "@/features/playlist/utils/playlistKeys";
import { handleError } from "@/utils/handleError";

/**
 * Hook quản lý logic Admin cho Playlist (CRUD, Filter, Pagination)
 * @param initialLimit Số lượng item mỗi trang (Mặc định: 12)
 */
export const usePlaylistAdmin = (initialLimit = 12) => {
  const queryClient = useQueryClient();

  // ==========================================
  // 1. FILTER STATE
  // ==========================================
  const [filterParams, setFilterParams] = useState<PlaylistFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    isSystem: undefined, // undefined = Lấy cả System & User Playlist
  });

  // ==========================================
  // 2. QUERY DATA (FETCHING)
  // ==========================================
  const { data, isLoading, isFetching, isError } = useQuery({
    // Sử dụng factory function để tạo key đồng nhất
    // Kết quả: ['playlists', 'list', { filter: ... }]
    queryKey: playlistKeys.list(filterParams),

    queryFn: () => playlistApi.getAll(filterParams),

    // Giữ data cũ khi chuyển trang để UI không bị "nháy" loading
    placeholderData: keepPreviousData,

    // Cache data trong 1 phút để tránh fetch lại không cần thiết
    staleTime: 1000 * 60,
  });

  // Safe access data
  const playlists = data?.data?.data || [];
  const meta = data?.data?.meta || {
    totalItems: 0,
    page: 1,
    pageSize: initialLimit,
    totalPages: 1,
  };

  // Helper xử lý lỗi chung (DRY Code)

  // ==========================================
  // 3. MUTATIONS (CUD OPERATIONS)
  // ==========================================

  // --- A. CREATE ---
  const createMutation = useMutation({
    mutationFn: playlistApi.create,
    onSuccess: () => {
      toast.success("Tạo Playlist thành công");
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo playlist"),
  });

  // --- B. UPDATE METADATA ---
  const updateMetadataMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      playlistApi.update(id, data),
    onSuccess: () => {
      toast.success("Đã cập nhật thông tin");
      // Refresh danh sách & chi tiết
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: playlistKeys.details() });
    },
    // 🔥 FIX LỖI CÚ PHÁP Ở ĐÂY: Thêm {}
    onError: (err) => {
      handleError(err, "Lỗi cập nhật thông tin");
    },
  });

  // --- C. DELETE ---
  const deleteMutation = useMutation({
    mutationFn: playlistApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa playlist");
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa playlist"),
  });

  // ==========================================
  // 4. TRACK OPERATIONS (Sub-Mutations)
  // ==========================================

  // Reorder Tracks
  const reorderMutation = useMutation({
    mutationFn: ({ id, trackIds }: { id: string; trackIds: string[] }) =>
      playlistApi.reorderTracks(id, trackIds),
    onSuccess: () => {
      toast.success("Đã lưu thứ tự!");
      queryClient.invalidateQueries({ queryKey: playlistKeys.details() });
    },
    onError: (err) => handleError(err, "Lỗi sắp xếp"),
  });

  // Add Tracks
  const addTracksMutation = useMutation({
    mutationFn: ({ id, trackIds }: { id: string; trackIds: string[] }) =>
      playlistApi.addTracks(id, trackIds),
    onSuccess: (res: any) => {
      toast.success(res.message || "Đã thêm bài hát");
      queryClient.invalidateQueries({ queryKey: playlistKeys.details() });
      // Cập nhật lại list tổng (trackCount thay đổi)
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi thêm bài"),
  });

  // Remove Track
  const removeTrackMutation = useMutation({
    mutationFn: ({ id, trackId }: { id: string; trackId: string }) =>
      playlistApi.removeTracks(id, [trackId]),
    onSuccess: () => {
      toast.success("Đã gỡ bài hát");
      queryClient.invalidateQueries({ queryKey: playlistKeys.details() });
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa bài"),
  });

  // ==========================================
  // 5. HELPER HANDLERS
  // ==========================================
  const handlePageChange = (newPage: number) =>
    setFilterParams((prev) => ({ ...prev, page: newPage }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  const handleFilterType = (type: "all" | "system" | "user") =>
    setFilterParams((prev) => ({
      ...prev,
      isSystem: type === "all" ? undefined : type === "system",
      page: 1,
    }));

  return {
    // --- Data ---
    playlists,
    meta,
    filterParams,

    // --- Loading States ---
    isLoading: isLoading || isFetching,

    // isMutating: Loading cho các hành động thay đổi dữ liệu
    isMutating:
      createMutation.isPending ||
      updateMetadataMutation.isPending ||
      deleteMutation.isPending,

    isReordering: reorderMutation.isPending,
    isError,

    // --- Actions ---
    setFilterParams,
    handlePageChange,
    handleSearch,
    handleFilterType,

    // --- Mutation Wrappers (Wrapper Functions) ---

    // 1. Create
    createPlaylist: (data: any, options?: any) =>
      createMutation.mutate(data, options),

    // 2. Update (Tự động gói id và data)
    updateMetadata: (id: string, data: any, options?: any) =>
      updateMetadataMutation.mutate({ id, data }, options),

    // 3. Delete
    deletePlaylist: (id: string, options?: any) =>
      deleteMutation.mutate(id, options),

    // 4. Tracks
    reorderTracks: (id: string, trackIds: string[], options?: any) =>
      reorderMutation.mutate({ id, trackIds }, options),
    addTracks: (id: string, trackIds: string[]) =>
      addTracksMutation.mutate({ id, trackIds }),

    removeTrack: (id: string, trackId: string) =>
      removeTrackMutation.mutate({ id, trackId }),

    // --- Async Variants (Dùng khi cần await) ---
    createPlaylistAsync: createMutation.mutateAsync,
    updateMetadataAsync: (id: string, data: any) =>
      updateMetadataMutation.mutateAsync({ id, data }),
    deletePlaylistAsync: deleteMutation.mutateAsync,
  };
};
