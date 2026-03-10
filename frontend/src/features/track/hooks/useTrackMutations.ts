import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import trackApi from "../api/trackApi";
import { trackKeys } from "../utils/trackKeys";
import { handleError } from "@/utils/handleError";
import { BulkTrackFormValues } from "../schemas/track.schema";

export const useTrackMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: trackKeys.lists() });

  // 1. CREATE (FormData - Upload File)
  const createMutation = useMutation({
    mutationFn: (data: FormData) => trackApi.upload(data),
    onSuccess: () => {
      toast.success("Upload bài hát thành công! Hệ thống đang xử lý...");
      invalidateList();
    },
    onError: (err) => handleError(err, "Lỗi upload bài hát"),
  });

  // 2. UPDATE (FormData - Edit Meta/File)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      trackApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật bài hát thành công");
      invalidateList();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật"),
  });

  // 3. DELETE
  const deleteMutation = useMutation({
    mutationFn: trackApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa bài hát");
      invalidateList();
    },
    onError: (err) => handleError(err, "Lỗi xóa"),
  });

  // 4. RETRY TRANSCODE (Đặc thù của Track)
  const retryMutation = useMutation({
    mutationFn: trackApi.retryTranscode,
    onSuccess: () => {
      toast.success("Đã gửi lệnh xử lý lại!");
      invalidateList();
    },
    onError: (err) => handleError(err, "Lỗi khi thử lại"),
  });

  // 5. BULK UPDATE (JSON)
  const bulkUpdateMutation = useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: BulkTrackFormValues }) =>
      trackApi.bulkUpdate(ids, data),
    onSuccess: (_, vars) => {
      toast.success(`Đã cập nhật ${vars.ids.length} bài hát!`);
      invalidateList();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật hàng loạt"),
  });

  return {
    // Async Wrappers
    createTrackAsync: createMutation.mutateAsync,
    updateTrackAsync: (id: string, data: FormData) =>
      updateMutation.mutateAsync({ id, data }),
    deleteTrack: deleteMutation.mutate,
    retryTranscode: retryMutation.mutate,
    bulkUpdateTrack: bulkUpdateMutation.mutate,

    // Loading States Aggregated
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      retryMutation.isPending ||
      bulkUpdateMutation.isPending,

    // Specific Loading (nếu cần UI riêng)
    isUploading: createMutation.isPending,
  };
};
