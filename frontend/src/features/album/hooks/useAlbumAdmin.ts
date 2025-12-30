import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import albumApi from "../api/albumApi";
import { type AlbumFilterParams } from "../types";
import { albumKeys } from "@/features/album/utils/albumKeys";

export const useAlbumAdmin = (initialLimit = 10) => {
  const queryClient = useQueryClient();

  // --- 1. LOCAL STATE (Đã bổ sung Sort, Type, Status) ---
  const [filterParams, setFilterParams] = useState<AlbumFilterParams>({
    page: 1,
    limit: initialLimit,
    keyword: "",
    artistId: "",
    genreId: "",
    year: undefined,

    // 🔥 MỚI THÊM:
    sort: "newest", // Mặc định mới nhất
    type: undefined, // Tất cả loại
    isPublic: undefined, // Tất cả trạng thái
  });

  // --- 2. QUERY (Fetch Data) ---
  const { data: queryData, isLoading: isFetching } = useQuery({
    // Thêm filterParams vào queryKey để tự động refetch khi filter đổi
    queryKey: [albumKeys.all, filterParams],
    queryFn: () => albumApi.getAll(filterParams),
    placeholderData: keepPreviousData,
  });

  const albums = queryData?.data?.data || [];
  const meta = queryData?.data?.meta || {
    totalItems: 0,
    page: 1,
    pageSize: initialLimit,
    totalPages: 1,
  };

  // --- 3. MUTATIONS ---

  // Create & Update & Delete (Giữ nguyên logic cũ)
  const createMutation = useMutation({
    mutationFn: (data: any) => albumApi.create(data),
    onSuccess: () => {
      toast.success("Tạo Album mới thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Lỗi tạo album"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      albumApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật Album thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
      queryClient.invalidateQueries({ queryKey: ["album-detail"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Lỗi cập nhật"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => albumApi.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa Album");
      queryClient.invalidateQueries({ queryKey: ["admin-albums"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Lỗi xóa album"),
  });

  // 🔥 4. NEW MUTATION: Toggle Visibility (Bật/Tắt nhanh)
  // Dùng để Admin click icon "Mắt" trên bảng mà không cần mở Modal Edit
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
      queryClient.invalidateQueries({ queryKey: albumKeys.all });
    },
    onError: (err: any) => toast.error("Không thể thay đổi trạng thái"),
  });

  // --- 5. HANDLERS ---

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Album này không?")) {
      deleteMutation.mutate(id);
    }
  };

  // Hàm wrapper tiện lợi
  const createAlbum = (data: any, onSuccess: () => void) => {
    createMutation.mutate(data, { onSuccess });
  };

  const updateAlbum = (id: string, data: any, onSuccess: () => void) => {
    updateMutation.mutate({ id, data }, { onSuccess });
  };

  // Hàm mới cho UI gọi
  const toggleVisibility = (id: string, currentStatus: boolean) => {
    toggleVisibilityMutation.mutate({ id, currentStatus });
  };

  const isGlobalLoading =
    isFetching ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    toggleVisibilityMutation.isPending;

  return {
    albums,
    meta,
    isLoading: isGlobalLoading,
    filterParams,

    // Setters
    setFilterParams,

    // Actions
    handlePageChange,
    handleDelete,
    createAlbum,
    updateAlbum,
    toggleVisibility, // 🔥 Export hàm mới

    refresh: () => queryClient.invalidateQueries({ queryKey: albumKeys.all }),
  };
};
