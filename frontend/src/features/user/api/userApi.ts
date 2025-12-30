import type {
  ArtistRequest,
  ChangePasswordDTO,
  RequestArtistDTO,
  UpdateProfileDTO,
  User,
} from "@/features/user/types";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types";
import { buildFormData } from "@/utils/form-data";

const userApi = {
  // 1. Lấy Public Profile (Xem tường nhà người khác)
  getPublicProfile: async (userId: string) => {
    const res = await api.get<ApiResponse<User>>(`/users/${userId}/profile`);
    return res.data;
  },

  // 2. Cập nhật Profile (Có upload ảnh)
  updateProfile: async (data: UpdateProfileDTO) => {
    const res = await api.patch<ApiResponse<User>>(
      "/users/profile",
      buildFormData(data),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  // 3. Đổi mật khẩu
  changePassword: async (data: ChangePasswordDTO) => {
    const res = await api.post<ApiResponse<void>>(
      "/users/change-password",
      data
    );
    return res.data;
  },

  // 4. Follow / Unfollow
  followUser: async (userId: string) => {
    const res = await api.post<ApiResponse<{ isFollowing: boolean }>>(
      `/users/${userId}/follow`
    );
    return res.data;
  },

  // 5. Gửi yêu cầu lên Artist
  requestBecomeArtist: async (data: RequestArtistDTO) => {
    const res = await api.post<ApiResponse<ArtistRequest>>(
      "/users/request-artist",
      buildFormData(data),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },
};

export default userApi;
