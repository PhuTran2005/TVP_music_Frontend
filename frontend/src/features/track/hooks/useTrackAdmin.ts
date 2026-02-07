import { useState } from "react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

import trackApi from "../api/trackApi";
import { trackKeys } from "@/features/track/utils/trackKeys";
import type { TrackFilterParams } from "../types";
import type {
  TrackFormValues,
  BulkTrackFormValues,
} from "@/features/track/schemas/track.schema";
import { handleError } from "@/utils/handleError";
import { queryClient } from "@/lib/queryClient";

export const useTrackAdmin = (initialLimit = 10, initialGenreId?: string) => {
  // ==========================================
  // 1. FILTER STATE
  // ==========================================
  const [filterParams, setFilterParams] = useState<TrackFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    status: undefined,
    genreId: initialGenreId,
    albumId: undefined,
    artistId: undefined,
  });

  // ==========================================
  // 2. QUERY DATA
  // ==========================================
  const { data, isLoading, isFetching } = useQuery({
    // 🔥 FIX KEY: ['tracks', 'list', { filter: ... }]
    queryKey: trackKeys.list(filterParams),

    queryFn: () => trackApi.getAll(filterParams),

    placeholderData: keepPreviousData,
    refetchInterval: 5000, // Polling để check status transcode
  });

  const tracks = data?.data?.data || [];
  const meta = data?.data?.meta || {
    totalItems: 0,
    page: 1,
    pageSize: initialLimit,
    totalPages: 1,
  };

  // ==========================================
  // 3. MUTATIONS
  // ==========================================

  // --- A. CREATE ---
  const createMutation = useMutation({
    mutationFn: (data: TrackFormValues) => trackApi.create(data),
    onSuccess: () => {
      toast.success("Upload bài hát thành công! Đang xử lý nền...");
      // Refresh list
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi upload"),
  });

  // --- B. UPDATE ---
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
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // --- C. DELETE ---
  const deleteMutation = useMutation({
    mutationFn: trackApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa bài hát");
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa"),
  });

  // --- D. RETRY TRANSCODE ---
  const retryTranscodeMutation = useMutation({
    mutationFn: trackApi.retryTranscode,
    onSuccess: () => {
      toast.success("Đã gửi lệnh xử lý lại!");
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi khi retry"),
  });

  // --- E. BULK UPDATE ---
  const bulkUpdateMutation = useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: BulkTrackFormValues }) =>
      trackApi.bulkUpdate(ids, data),
    onSuccess: (data, variables) => {
      toast.success(`Đã cập nhật ${variables.ids.length} bài hát!`);
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật hàng loạt"),
  });

  // ==========================================
  // 4. HANDLERS & WRAPPERS
  // ==========================================

  const handlePageChange = (p: number) =>
    setFilterParams((prev) => ({ ...prev, page: p }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  const updateFilter = (key: keyof TrackFilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  return {
    // Data
    tracks,
    meta,
    filterParams,

    // States
    isLoading: isLoading || isFetching,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkUpdateMutation.isPending ||
      retryTranscodeMutation.isPending,

    // Actions
    setFilterParams,
    handlePageChange,
    handleSearch,
    updateFilter,

    // Wrappers
    createTrack: (data: TrackFormValues, options?: any) =>
      createMutation.mutate(data, options),

    updateTrack: (id: string, data: Partial<TrackFormValues>, options?: any) =>
      updateMutation.mutate({ id, data }, options),

    deleteTrack: (id: string, options?: any) =>
      deleteMutation.mutate(id, options),

    retryTranscode: (id: string, options?: any) =>
      retryTranscodeMutation.mutate(id, options),

    bulkUpdateTrack: (
      ids: string[],
      data: BulkTrackFormValues,
      options?: any,
    ) => bulkUpdateMutation.mutate({ ids, data }, options),

    // Async Variants
    createTrackAsync: createMutation.mutateAsync,
    updateTrackAsync: (id: string, data: Partial<TrackFormValues>) =>
      updateMutation.mutateAsync({ id, data }),
  };
};
