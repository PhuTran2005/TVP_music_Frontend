import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import userApi from "../api/userApi";
import { userKeys } from "../utils/userKeys";
import { handleError } from "@/utils/handleError";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  // Hàm tiện ích để làm mới danh sách sau khi thao tác thành công
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    // Nếu có query key riêng cho artist requests thì thêm vào đây, ví dụ:
    // queryClient.invalidateQueries({ queryKey: ["artist-requests"] });
  };

  // ==========================================
  // 1. CREATE USER (Admin)
  // ==========================================
  const createMutation = useMutation({
    mutationFn: (data: FormData) => userApi.create(data),
    onSuccess: () => {
      toast.success("Tạo người dùng thành công");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi tạo người dùng"),
  });

  // ==========================================
  // 2. UPDATE USER (Admin)
  // ==========================================
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      userApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật thông tin"),
  });

  // ==========================================
  // 3. TOGGLE BLOCK USER
  // ==========================================
  const toggleBlockMutation = useMutation({
    mutationFn: userApi.toggleBlock,
    onSuccess: (response) => {
      // Giả sử response trả về chứa data user vừa được update
      const status = response.data?.isActive ? "Đã mở khóa" : "Đã khóa";
      toast.success(`${status} tài khoản thành công`);
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi thay đổi trạng thái"),
  });

  // ==========================================
  // 4. DELETE USER
  // ==========================================
  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa người dùng thành công");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi xóa người dùng"),
  });

  // ==========================================
  // 5. APPROVE ARTIST REQUEST
  // ==========================================
  const approveArtistMutation = useMutation({
    mutationFn: userApi.approveArtistRequest,
    onSuccess: () => {
      toast.success("Đã duyệt yêu cầu nâng cấp Artist");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi duyệt yêu cầu"),
  });

  // ==========================================
  // 6. REJECT ARTIST REQUEST
  // ==========================================
  const rejectArtistMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      userApi.rejectArtistRequest(id, reason),
    onSuccess: () => {
      toast.success("Đã từ chối yêu cầu nâng cấp Artist");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi từ chối yêu cầu"),
  });

  return {
    // --- Async Methods (Dùng trong Form submit) ---
    createUserAsync: createMutation.mutateAsync,
    updateUserAsync: updateMutation.mutateAsync,
    rejectArtistAsync: rejectArtistMutation.mutateAsync,

    // --- Standard Methods (Dùng cho Button click trực tiếp) ---
    toggleBlockUser: toggleBlockMutation.mutate,
    deleteUser: deleteMutation.mutate,
    approveArtist: approveArtistMutation.mutate,

    // --- Loading States ---
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleBlockMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isApproving: approveArtistMutation.isPending,
    isRejecting: rejectArtistMutation.isPending,

    // Aggregate Loading State (Disable UI chung)
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      toggleBlockMutation.isPending ||
      deleteMutation.isPending ||
      approveArtistMutation.isPending ||
      rejectArtistMutation.isPending,
  };
};
