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

export const usePlaylistAdmin = (initialLimit = 12) => {
  const queryClient = useQueryClient();

  // 1. STATE BỘ LỌC
  const [filterParams, setFilterParams] = useState<PlaylistFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    isSystem: undefined,
  });

  // 2. QUERY DATA
  const { data, isLoading } = useQuery({
    queryKey: ["admin-playlists", filterParams],
    queryFn: () => playlistApi.getAll(filterParams),
    placeholderData: keepPreviousData,
  });

  const playlists = data?.data?.data || []; // Giống Album
  const meta = data?.data?.meta || {
    totalItems: 0,
    page: 1,
    pageSize: initialLimit,
    totalPages: 1,
  };
  // 3. MUTATIONS
  const createMutation = useMutation({
    mutationFn: playlistApi.create,
    onSuccess: () => {
      toast.success("Tạo Playlist thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-playlists"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi tạo playlist"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      playlistApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-playlists"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi cập nhật"),
  });

  const deleteMutation = useMutation({
    mutationFn: playlistApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa playlist");
      queryClient.invalidateQueries({ queryKey: ["admin-playlists"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi xóa playlist"),
  });

  // 4. HANDLERS
  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearch = (keyword: string) => {
    setFilterParams((prev) => ({ ...prev, keyword: keyword, page: 1 }));
  };

  const handleFilterType = (type: "all" | "system" | "user") => {
    setFilterParams((prev) => ({
      ...prev,
      isSystem: type === "all" ? undefined : type === "system",
      page: 1,
    }));
  };

  return {
    playlists,
    meta,
    isLoading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    filterParams,
    setFilterParams,
    // Actions
    handlePageChange,
    handleSearch,
    handleFilterType,

    // Mutations Wrapper
    createPlaylist: (data: any, cb?: () => void) =>
      createMutation.mutate(data, { onSuccess: cb }),
    updatePlaylist: (id: string, data: any, cb?: () => void) =>
      updateMutation.mutate({ id, data }, { onSuccess: cb }),
    deletePlaylist: (id: string, cb?: () => void) =>
      deleteMutation.mutate(id, { onSuccess: cb }),
  };
};
