import {
  useMutation,
  useQueryClient,
  type MutateOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import albumApi from "../api/albumApi";
import { albumKeys } from "../utils/albumKeys";
import { handleError } from "@/utils/handleError";
// import { CreateAlbumInput, UpdateAlbumInput } from "@/features/album/types"; // ❌ Bỏ dòng này
// ✅ Chúng ta dùng FormData cho Create/Update vì có upload ảnh

export const useAlbumMutations = () => {
  const queryClient = useQueryClient();

  // ==========================================
  // 1. CREATE (FormData)
  // ==========================================
  const createMutation = useMutation({
    // 🔥 FIX: Explicitly set type as FormData
    mutationFn: (data: FormData) => albumApi.create(data),
    onSuccess: () => {
      toast.success("Tạo Album thành công");
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi tạo album"),
  });

  // ==========================================
  // 2. UPDATE (FormData)
  // ==========================================
  const updateMutation = useMutation({
    // 🔥 FIX: Data phải là FormData, không phải UpdateAlbumInput
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      albumApi.update(id, data),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: albumKeys.detail(variables.id),
      });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // ==========================================
  // 3. DELETE
  // ==========================================
  const deleteMutation = useMutation({
    mutationFn: albumApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa Album");
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi xóa album"),
  });

  // ==========================================
  // 4. TOGGLE VISIBILITY (JSON)
  // ==========================================
  const toggleMutation = useMutation({
    // 🔥 Uncomment và fix type
    mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      albumApi.update(id, { isPublic }), // Gửi JSON thường (Partial Update)
    onSuccess: () => {
      toast.success("Đã thay đổi trạng thái");
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi thay đổi trạng thái"),
  });

  return {
    // --- Wrappers (Type Safe) ---

    // 1. Create Wrapper
    createAlbum: (
      data: FormData, // ✅ Type chuẩn
      options?: MutateOptions<any, unknown, FormData>,
    ) => createMutation.mutate(data, options),

    createAlbumAsync: createMutation.mutateAsync,

    // 2. Update Wrapper
    updateAlbum: (
      id: string,
      data: FormData, // ✅ Type chuẩn (sửa từ UpdateAlbumInput -> FormData)
      options?: MutateOptions<any, unknown, { id: string; data: FormData }>,
    ) => updateMutation.mutate({ id, data }, options),

    // ✅ Fix type async
    updateAlbumAsync: (id: string, data: FormData) =>
      updateMutation.mutateAsync({ id, data }),

    // 3. Delete Wrapper
    deleteAlbum: (id: string, options?: MutateOptions<any, unknown, string>) =>
      deleteMutation.mutate(id, options),

    // 4. Toggle Wrapper
    toggleVisibility: (id: string, isPublic: boolean) =>
      toggleMutation.mutate({ id, isPublic }),

    // --- Loading States (Aggregated) ---
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,

    // Loading chung cho Table Action (Disable nút khi đang làm bất cứ gì)
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleMutation.isPending,
  };
};
