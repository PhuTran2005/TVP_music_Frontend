// src/config/constants.ts

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_INFO: "userInfo",
  THEME: "theme",
} as const;

export const APP_CONFIG = {
  PAGINATION_LIMIT: 4,
  UPLOAD_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  API_TIMEOUT: 10000,
} as const;

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
};

export interface Country {
  label: string;
  value: string;
  flag: string;
}

// 🔥 Top quốc gia có nhiều nghệ sĩ nhất để ưu tiên hiển thị đầu danh sách
export const TOP_NATIONALITIES: Country[] = [
  { label: "Việt Nam", value: "VN", flag: "🇻🇳" },
  { label: "Hoa Kỳ", value: "US", flag: "🇺🇸" },
  { label: "Hàn Quốc", value: "KR", flag: "🇰🇷" },
  { label: "Anh Quốc", value: "UK", flag: "🇬🇧" },
  { label: "Nhật Bản", value: "JP", flag: "🇯🇵" },
];

export const ALL_NATIONALITIES: Country[] = [
  ...TOP_NATIONALITIES,
  { label: "Trung Quốc", value: "CN", flag: "🇨🇳" },
  { label: "Thái Lan", value: "TH", flag: "🇹🇭" },
  { label: "Pháp", value: "FR", flag: "🇫🇷" },
  { label: "Đức", value: "DE", flag: "🇩🇪" },
  { label: "Canada", value: "CA", flag: "🇨🇦" },
  { label: "Úc", value: "AU", flag: "🇦🇺" },
  { label: "Brazil", value: "BR", flag: "🇧🇷" },
  { label: "Tây Ban Nha", value: "ES", flag: "🇪🇸" },
  { label: "Na Uy", value: "NO", flag: "🇳🇴" },
  { label: "Thụy Điển", value: "SE", flag: "🇸🇪" },
];
