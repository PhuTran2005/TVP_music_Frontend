import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { UserProfile, AuthState } from "@/features/auth/types";
import authApi from "@/features/auth/api/authApi";

// =================================================================
// 1. Initial State
// =================================================================
const initialState: AuthState<UserProfile> = {
  token: null, // Access Token (Lưu trong RAM)
  user: null, // Thông tin User
  isAuthChecking: true, // Cờ quan trọng để chặn render App khi F5
};

// =================================================================
// 2. Async Thunk: Init Auth (Chạy khi F5 App)
// =================================================================
// Nhiệm vụ: Gọi API lấy Access Token mới bằng HttpOnly Cookie
export const initAuth = createAsyncThunk(
  "auth/initAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Gọi API refresh token (Cookie tự động gửi đi)
      const response = await authApi.refreshAuth();
      console.log("Refresh response:", response);
      const { accessToken, user } = response.data;

      // Trả về data để extraReducers cập nhật State
      return { accessToken, user };
    } catch (error: unknown) {
      // Nếu lỗi (Cookie hết hạn/không có) -> Trả về lỗi
      return rejectWithValue(error || "Session expired");
    }
  }
);

// =================================================================
// 3. Slice Logic
// =================================================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🟢 LOGIN: Khi người dùng đăng nhập thủ công thành công
    login: (
      state,
      action: PayloadAction<{ accessToken: string; user: UserProfile }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthChecking = false;
    },

    // 🟡 REFRESH SUCCESS: Được gọi bởi Axios Interceptor
    // (Lưu ý: Axios dispatch action dạng chuỗi "auth/refreshSuccess")
    refreshSuccess: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
      // Giữ nguyên user, chỉ đổi token
    },

    // 🔴 LOGOUT: Xóa sạch thông tin
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthChecking = false;
    },

    // ⚪ CHECK FINISHED: Dùng khi muốn tắt loading thủ công (ít dùng)
    authCheckFinished: (state) => {
      state.isAuthChecking = false;
    },
  },

  // =================================================================
  // 4. Xử lý kết quả của initAuth (Khi F5)
  // =================================================================
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.pending, (state) => {
        state.isAuthChecking = true;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthChecking = false; // ✅ Đã xác thực xong -> Vào App
      })
      .addCase(initAuth.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthChecking = false; // ❌ Xác thực thất bại -> Về Login
      });
  },
});

export const { login, logout, refreshSuccess, authCheckFinished } =
  authSlice.actions;
export default authSlice.reducer;
