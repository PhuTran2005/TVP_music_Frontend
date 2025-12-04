import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from "@/features/auth/types";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types";

const authApi = {
  // 🟢 Đăng nhập
  login: async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );
    return res.data;
  },

  // Hàm này cần support truyền token thủ công (vì lúc này chưa lưu vào axios global)
  getMe: async (token?: string) => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const res = await api.get<ApiResponse<UserProfile>>("/auth/me", config);
    return res.data;
  },
  // 🟣 Đăng ký
  register: async (
    payload: RegisterRequest,
    secret?: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    const res = await api.post<ApiResponse<RegisterResponse>>(
      `/auth/register${secret ? `/admin/${secret}` : ""}`,
      payload
    );
    return res.data;
  },
  // Thêm vào trong object authApi

  // ✅ Xác thực Email (OTP)
  verifyEmail: async (payload: {
    email: string;
    otp: string;
  }): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "/auth/verify-email",
      payload
    );
    return res.data;
  },

  // ✅ Gửi lại mã OTP
  resendOtp: async (email: string): Promise<ApiResponse<void>> => {
    const res = await api.post<ApiResponse<void>>("/auth/resend-otp", {
      email,
    });
    return res.data;
  },
  // 🔄 Làm mới Access Token (từ Refresh Token trong cookie)
  refreshAuth: async (): Promise<ApiResponse<RefreshResponse>> => {
    const res = await api.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh-token"
    );
    return res.data;
  },
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (
    token: string,
    password: string
  ): Promise<ApiResponse<void>> => {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    return res.data;
  },
  // 🔴 Đăng xuất
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Server có thể đã thu hồi token rồi:", error);
    }
  },
};

export default authApi;
