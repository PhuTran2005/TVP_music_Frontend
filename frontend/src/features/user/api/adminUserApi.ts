import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserFilterParams,
} from "@/features/user/types";
import api from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types";
import { buildFormData } from "@/utils/form-data";

const adminUserApi = {
  // 1. Lấy danh sách User (Phân trang, Tìm kiếm)
  getUsers: async (params: UserFilterParams) => {
    const res = await api.get<ApiResponse<PagedResponse<User>>>("/users", {
      params,
    });
    return res.data;
  },

  // 2. Khóa / Mở khóa tài khoản
  toggleBlockUser: async (userId: string) => {
    const res = await api.post<ApiResponse<User>>(`/users/${userId}/block`);
    return res.data;
  },

  // 3. Lấy danh sách đơn đăng ký Artist (Pending)
  // (Giả sử bạn đã tạo route này ở bài trước: GET /admin/requests)
  // getArtistRequests: async () => {
  //   const res = await api.get<ApiResponse<ArtistRequest[]>>(
  //     "/admin/requests?status=pending"
  //   );
  //   return res.data;
  // },

  // 4. Duyệt đơn
  // approveArtistRequest: async (requestId: string) => {
  //   const res = await api.post<ApiResponse<any>>(
  //     `/users/requests/${requestId}/approve`
  //   );
  //   return res.data;
  // },

  // 5. Từ chối đơn
  // rejectArtistRequest: async (requestId: string, reason: string) => {
  //   const res = await api.post<ApiResponse<any>>(
  //     `/users/requests/${requestId}/reject`,
  //     { reason }
  //   );
  //   return res.data;
  // },
  createUser: async (data: CreateUserRequest) => {
    const res = await api.post("/users", buildFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  updateUser: (id: string, data: UpdateUserRequest) => {
    return api.patch(`/users/${id}`, buildFormData(data), {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
    });
  },
};

export default adminUserApi;
