// ✅ Dữ liệu trả về từ backend
export interface AuthDto<TUser> {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

// ✅ Mô tả user trong hệ thống
export interface UserProfile {
  // 1. MongoDB luôn trả về '_id'.
  // (Nếu controller bạn map sang 'id' thì dùng 'id', nhưng chuẩn Mongo là _id)
  _id: string;

  // 2. Chúng ta đã chốt dùng 'fullName' để hiển thị tên
  fullName: string;

  // 3. Username là slug (tran-van-phu), tùy chọn hiển thị
  username?: string;

  email: string;

  // 4. Role nên dùng Union Type để code TS gợi ý cho sướng
  role: "user" | "artist" | "admin";

  // 5. Ảnh đại diện (quan trọng cho Header)
  avatar?: string;

  // 6. Trạng thái xác thực
  isVerified: boolean;

  // 7. Nguồn gốc (Google hay Local)
  authProvider?: "local" | "google";

  // 8. Mongo trả về 'createdAt', không phải 'joinDate'
  createdAt: string;
  updatedAt: string;
}

// ✅ Redux slice state
export interface AuthState<TUser = UserProfile> {
  token: string | null;
  user: TUser | null;
  isAuthChecking: boolean;
}

// ✅ Request/Response dạng API
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}
export interface ForgetPasswordRequest {
  email: string;
}
export interface ForgetPasswordResponse {
  email: string;
}

export type LoginResponse = AuthDto<UserProfile>;
export type RegisterResponse = AuthDto<UserProfile>;
export type RefreshResponse = AuthDto<UserProfile>;
