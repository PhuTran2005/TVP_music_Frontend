// src/config/paths.ts

export const AUTH_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  AUTH_GOOGLE: "/auth/google",
  RESET_PASSWORD: (token: string) => `/reset-password/${token}`,
} as const;
export const CLIENT_PATHS = {
  CLIENT: "/",
  HOME: "/",
  SONGS: "users",
  ARTISTS: "artists",
  ALBUMS: "albums",
  PLAYLISTS: "playlists",
  SEARCH: "search",
  BROWSE: "browse",
  SETTINGS: "settings",
  // Track
  TRACK_DETAIL: (id: string) => `/tracks/${id}`, // Hàm tạo link động
  // User
  PROFILE: "/profile",
} as const;
export const ADMIN_PATHS = {
  ADMIN: "/admin",
  USERS: "users",
  SONGS: "songs",
  ARTISTS: "artists",
  ALBUMS: "albums",
  PLAYLISTS: "playlists",
  ANALYTICS: "analytics",
  DASHBOARD: "/",
  GENRES: "genres",
  SETTINGS: "settings",
  // Track
  UPLOAD: "upload",
} as const;
