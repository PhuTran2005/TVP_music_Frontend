import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import trackApi from "../api/trackApi";
import { type TrackFilterParams } from "../types";
import { type TrackFormValues } from "@/features/track/schemas/track.schema";

export const useTrackAdmin = (initialLimit = 10) => {
  const queryClient = useQueryClient();

  // 1. State quản lý bộ lọc (Thêm genreId, albumId, artistId)
  const [filterParams, setFilterParams] = useState<TrackFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    status: undefined,
    genreId: undefined, // Thêm
    albumId: undefined, // Thêm
    artistId: undefined, // Thêm
  });

  // 2. Fetch Data
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["admin-tracks", filterParams],
    queryFn: () => trackApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    refetchInterval: 5000, // Refresh để check trạng thái transcode
  });
  // Safe access data
  const tracks = data?.data?.data || [];
  const meta = data?.data?.meta || {
    totalItems: 0,
    page: 1,
    pageSize: initialLimit,
    totalPages: 1,
  };
  // 3. Mutations

  // Create
  const createMutation = useMutation({
    mutationFn: (data: TrackFormValues) => trackApi.create(data),
    onSuccess: () => {
      toast.success("Upload bài hát thành công! Đang xử lý nền...");
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi upload"),
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TrackFormValues>;
    }) => trackApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi cập nhật"),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: trackApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa bài hát");
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi xóa"),
  });

  // 4. Handlers (Tiện ích)

  // Chuyển trang
  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  // Tìm kiếm (Keyword)
  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  // Helper: Update 1 bộ lọc cụ thể (VD: updateFilter("genreId", "123"))
  const updateFilter = (key: keyof TrackFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value, // Nếu value='all' thì set undefined để bỏ lọc
      page: 1, // Reset về trang 1 khi đổi bộ lọc
    }));
  };

  return {
    // Data
    tracks,
    meta,
    isLoading,
    isPlaceholderData,

    // States
    filterParams,

    // Actions
    setFilterParams,
    handlePageChange,
    handleSearch,
    updateFilter, // Dùng cái này cho mấy cái Dropdown Filter

    // Mutation Triggers
    createTrack: createMutation.mutate,
    updateTrack: updateMutation.mutate,
    deleteTrack: deleteMutation.mutate,

    // Loading States (Cho UI Disable nút)
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
