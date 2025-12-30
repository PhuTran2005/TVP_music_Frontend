import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData, // 👈 Quan trọng cho Pagination v5
} from "@tanstack/react-query";
import { toast } from "sonner";

// API & Types
import adminUserApi from "../api/adminUserApi";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserFilterParams,
} from "@/features/user/types";
import type { ApiErrorResponse } from "@/types";

// ============================================================================
// 1. HOOK: LẤY DANH SÁCH USER (Phân trang & Tìm kiếm)
// ============================================================================
export const useAdminUsers = (params: UserFilterParams) => {
  return useQuery({
    // Key phân cấp: Khi params (page/search) đổi -> Tự động fetch lại
    queryKey: ["admin", "users", params],

    queryFn: () => adminUserApi.getUsers(params),

    // ✅ CHUẨN v5: Giữ data cũ khi chuyển trang để UI không bị nháy loading
    placeholderData: keepPreviousData,

    // Cache data trong 1 phút để đỡ gọi API nhiều lần nếu admin click qua lại
    staleTime: 1000 * 60,
  });
};

// ============================================================================
// 2. HOOK: KHÓA / MỞ KHÓA USER
// ============================================================================
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminUserApi.toggleBlockUser(userId),

    onSuccess: (res) => {
      const isActive = res.data.isActive;
      const statusText = isActive ? "Đã mở khóa" : "Đã khóa";

      toast.success(`${statusText} tài khoản thành công!`);

      // Refresh lại danh sách user (bất kể trang nào)
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },

    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái"
      );
    },
  });
};

// ============================================================================
// 3. HOOK: DUYỆT YÊU CẦU NGHỆ SĨ
// ============================================================================
// export const useApproveArtist = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (requestId: string) =>
//       adminUserApi.approveArtistRequest(requestId),

//     onSuccess: () => {
//       toast.success("Đã phê duyệt yêu cầu lên Nghệ sĩ!");

//       // Refresh danh sách requests
//       queryClient.invalidateQueries({ queryKey: ["admin", "artist-requests"] });

//       // Refresh danh sách user (vì role user đó đã đổi từ 'user' -> 'artist')
//       queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
//     },

//     onError: (err: unknown) => {
//       const error = err as ApiErrorResponse;
//       toast.error(error.response?.data?.message || "Phê duyệt thất bại");
//     },
//   });
// };
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminUserApi.createUser(data),
    onSuccess: (res) => {
      // Res trả về generatedPassword, ta có thể hiện ra cho Admin xem
      const pass = res.data.generatedPassword;

      toast.success("Tạo thành công!", {
        description: `Mật khẩu khởi tạo: ${pass}`,
        duration: 10000, // Hiện lâu để kịp copy
      });

      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(error.response?.data?.message);
    },
  });
};
// 3. HOOK: CẬP NHẬT USER (Update) - 🔥 MỚI
// ============================================================================
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserRequest | FormData;
    }) => adminUserApi.updateUser(id, data),

    onSuccess: () => {
      // Invalidate query để list user cập nhật data mới (tên, role, status...)
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      // Không cần toast ở đây vì Modal thường sẽ toast rồi đóng
    },

    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });
};
