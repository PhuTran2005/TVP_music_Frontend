import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Redux
import { useAppDispatch } from "@/store/store";

// API & Types
import userApi from "../api/userApi";
import type {
  ChangePasswordDTO,
  RequestArtistDTO,
  UpdateProfileDTO,
} from "@/features/user/types";
import type { ApiErrorResponse } from "@/types";
import { fetchCurrentUser } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  claimSchema,
  type ClaimInput,
} from "@/features/user/schemas/user.schema";
import authApi from "@/features/auth/api/authApi";

// ============================================================================
// 1. HOOK: LẤY PROFILE CÔNG KHAI (Xem tường người khác)
// ============================================================================
export const usePublicProfile = (userId: string) => {
  return useQuery({
    queryKey: ["users", "public-profile", userId],
    queryFn: () => userApi.getPublicProfile(userId),
    enabled: !!userId, // Chỉ chạy khi có userId hợp lệ
    retry: 1, // Nếu lỗi (404) thì thử lại 1 lần thôi
  });
};

// ============================================================================
// 2. HOOK: CẬP NHẬT HỒ SƠ CÁ NHÂN
// ============================================================================
export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDTO) => userApi.updateProfile(data),

    onSuccess: () => {
      toast.success("Cập nhật hồ sơ thành công!");

      // 🔥 QUAN TRỌNG: Cập nhật lại Redux State (để Avatar trên Header đổi ngay)
      dispatch(fetchCurrentUser());

      // Nếu đang xem profile của chính mình thì refresh luôn query đó
      queryClient.invalidateQueries({ queryKey: ["users", "public-profile"] });
    },

    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(error.response?.data?.message || "Lỗi cập nhật hồ sơ");
    },
  });
};

// ============================================================================
// 3. HOOK: ĐỔI MẬT KHẨU
// ============================================================================
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDTO) => userApi.changePassword(data),

    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },

    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    },
  });
};

// ============================================================================
// 4. HOOK: GỬI YÊU CẦU LÊN ARTIST
// ============================================================================
export const useRequestArtist = () => {
  return useMutation({
    mutationFn: (data: RequestArtistDTO) => userApi.requestBecomeArtist(data),

    onSuccess: () => {
      toast.success("Đã gửi yêu cầu! Vui lòng chờ Admin duyệt.");
    },

    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(error.response?.data?.message || "Gửi yêu cầu thất bại");
    },
  });
};

// ============================================================================
// 5. HOOK: FOLLOW / UNFOLLOW
// ============================================================================
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userApi.followUser(userId),

    onSuccess: (res, userId) => {
      const isFollowing = res.data.isFollowing;
      toast.success(isFollowing ? "Đã theo dõi" : "Đã hủy theo dõi");

      // Refresh lại trang profile của người vừa follow để cập nhật số follower
      queryClient.invalidateQueries({
        queryKey: ["users", "public-profile", userId],
      });
    },

    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    },
  });
};

export const useClaimProfile = () => {
  const navigate = useNavigate();

  const form = useForm<ClaimInput>({
    resolver: zodResolver(claimSchema),
    defaultValues: { newEmail: "", newPassword: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ClaimInput) =>
      authApi.claimProfile({
        newEmail: data.newEmail,
        newPassword: data.newPassword,
      }),
    onSuccess: (_, variables) => {
      toast.success("Đã cập nhật thông tin!");
      toast.info(`Mã OTP đã được gửi về ${variables.newEmail}`);

      // Chuyển hướng sang trang nhập OTP, mang theo email mới
      navigate("/verify-otp", { state: { email: variables.newEmail } });
    },
    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật profile");
    },
  });

  const onSubmit = (data: ClaimInput) => {
    mutate(data);
  };

  return { form, onSubmit, isPending };
};
