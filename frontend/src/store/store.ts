/**
 * @file store.ts
 * @description Cấu hình Redux Store trung tâm cho ứng dụng.
 * @architecture
 * - Auth State: Lưu trong RAM (Reset khi F5) -> Bảo mật, tránh XSS.
 * - Player State: Lưu trong LocalStorage (Redux Persist) -> UX, giữ trạng thái khi F5.
 */

import { configureStore, combineReducers } from "@reduxjs/toolkit";

// --- Redux Persist Imports ---
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for Web

// --- Slice Reducers ---
import authReducer from "@/features/auth/slice/authSlice";
import playerReducer from "@/features/player/slice/playerSlice";

// --- Services & Utils ---
import { injectStore, setGlobalAccessToken } from "@/lib/axios";

// ============================================================================
// 1. PERSIST CONFIGURATION (Cấu hình lưu trữ)
// ============================================================================

/**
 * Cấu hình lưu trữ riêng cho Player Slice.
 * Mục tiêu: Giữ lại playlist/volume/seekPosition khi user reload trang.
 */
const playerPersistConfig = {
  key: "player",
  storage,
  /**
   * Blacklist: Các field KHÔNG được lưu vào LocalStorage.
   * @reason
   * - isPlaying: Tránh việc F5 xong nhạc tự phát gây giật mình (Anti-Jumpscare).
   * - isLoading: Reset trạng thái loading UI.
   * - duration: Sẽ được tính toán lại khi metadata của file audio load xong.
   */
  blacklist: ["isPlaying", "isLoading", "duration"],
};

// ============================================================================
// 2. ROOT REDUCER (Gộp các Slices)
// ============================================================================

const rootReducer = combineReducers({
  /**
   * Auth Slice: Giữ nguyên (Raw Reducer).
   * @security AccessToken chỉ lưu trên RAM. Khi F5 sẽ mất -> Trigger refresh token flow.
   */
  auth: authReducer,

  /**
   * Player Slice: Được bọc bởi persistReducer.
   * @ux Giữ trạng thái UI nghe nhạc ổn định qua các phiên làm việc.
   */
  player: persistReducer(playerPersistConfig, playerReducer),
});

// ============================================================================
// 3. STORE INITIALIZATION (Khởi tạo Store)
// ============================================================================

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /**
       * Serializable Check: Cần tắt hoặc ignore các actions của redux-persist
       * để tránh warning trên console.
       */
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== "production",
});

/**
 * Persistor: Đối tượng dùng để đồng bộ store với localStorage.
 * Được sử dụng bởi Component <PersistGate> trong main.tsx.
 */
export const persistor = persistStore(store);

// ============================================================================
// 4. TYPES & HOOKS
// ============================================================================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ============================================================================
// 5. SIDE EFFECTS (Đồng bộ External Services)
// ============================================================================

injectStore(store);

// Đồng bộ Token từ Redux sang Axios Header
let currentToken = store.getState().auth.token;
if (currentToken) setGlobalAccessToken(currentToken);

store.subscribe(() => {
  const newState = store.getState();
  const newToken = newState.auth.token;
  if (newToken !== currentToken) {
    currentToken = newToken;
    setGlobalAccessToken(currentToken);
  }
});
