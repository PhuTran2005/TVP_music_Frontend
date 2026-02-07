import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import artistApi from "../api/artistApi";
import { artistKeys } from "@/features/artist/utils/artistKeys";
import type { ArtistFilterParams } from "../types";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { handleError } from "@/utils/handleError";

export const useArtistAdmin = (initialLimit = 10) => {
  const queryClient = useQueryClient();

  // ==========================================
  // 1. FILTER STATE
  // ==========================================
  const [filterParams, setFilterParams] = useState<ArtistFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    sort: "newest",
    nationality: undefined,
    isVerified: undefined,
    isActive: undefined,
  });

  // ==========================================
  // 2. QUERY DATA
  // ==========================================
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: artistKeys.list(filterParams),
    queryFn: () => artistApi.getAll(filterParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const artists = data?.data?.data || [];
  const meta = data?.data?.meta || {
    totalItems: 0,
    page: 1,
    pageSize: initialLimit,
    totalPages: 1,
  };

  // ==========================================
  // 3. MUTATIONS
  // ==========================================

  // --- CREATE ---
  const createMutation = useMutation({
    mutationFn: (data: ArtistFormValues) => artistApi.adminCreate(data),
    onSuccess: () => {
      toast.success("Tạo nghệ sĩ mới thành công");
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo nghệ sĩ"),
  });

  // --- UPDATE ---
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ArtistFormValues>;
    }) => artistApi.adminUpdate(id, data),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: artistKeys.detail(variables.id),
      });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // --- TOGGLE STATUS ---
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => artistApi.adminToggleStatus(id),
    onSuccess: () => {
      toast.success("Đã thay đổi trạng thái");
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi thay đổi trạng thái"),
  });

  // --- DELETE ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => artistApi.adminDelete(id),
    onSuccess: () => {
      toast.success("Đã xóa vĩnh viễn nghệ sĩ");
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa nghệ sĩ"),
  });

  // ==========================================
  // 4. HANDLERS
  // ==========================================
  const handlePageChange = (newPage: number) =>
    setFilterParams((prev) => ({ ...prev, page: newPage }));

  const handleSearch = (keyword: string) =>
    setFilterParams((prev) => ({ ...prev, keyword, page: 1 }));

  const handleFilterChange = (key: keyof ArtistFilterParams, value: any) =>
    setFilterParams((prev) => ({ ...prev, [key]: value, page: 1 }));

  return {
    // Data
    artists,
    meta,
    filterParams,

    // Loading
    isLoading: isLoading || isFetching,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleStatusMutation.isPending,
    isError,

    // Actions
    setFilterParams,
    handlePageChange,
    handleSearch,
    handleFilterChange,

    // Wrappers
    createArtist: (data: ArtistFormValues, options?: any) =>
      createMutation.mutate(data, options),

    updateArtist: (
      id: string,
      data: Partial<ArtistFormValues>,
      options?: any,
    ) => updateMutation.mutate({ id, data }, options),

    toggleArtistStatus: (id: string, options?: any) =>
      toggleStatusMutation.mutate(id, options),

    deleteArtist: (id: string, options?: any) =>
      deleteMutation.mutate(id, options),

    // Async Variants
    createArtistAsync: createMutation.mutateAsync,
    updateArtistAsync: (id: string, data: Partial<ArtistFormValues>) =>
      updateMutation.mutateAsync({ id, data }),
  };
};
