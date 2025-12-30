import type { Artist } from "@/features/artist/types";
import type { Genre } from "@/features/genre/types";
import { Track } from "hls.js";

// ==========================================
// 1. ENTITY (Dữ liệu hiển thị từ API)
// ==========================================
export interface Album {
  _id: string;
  title: string;
  slug: string;
  type: "album" | "single" | "ep" | "compilation";
  description?: string;

  // Visuals
  coverImage: string; // Luôn là URL string khi nhận từ API
  themeColor: string; // Hex color

  // Relations (Thường đã được populate)
  artist: Artist; // Backend trả về object Artist đầy đủ
  genres: Genre[]; // Backend trả về mảng Genre đầy đủ

  // Release & Legal
  releaseDate: string; // ISO Date String
  releaseYear: number;
  label?: string;
  copyright?: string;
  upc?: string;
  tags?: string[];
  playCount: number; // Tổng lượt nghe của Album
  likeCount: number; // Số lượng yêu thích
  tracks?: Track[];
  // Stats & Status
  totalTracks: number;
  isPublic: boolean;
  totalDuration: number; // Tổng thời lượng tất cả track trong album (tính bằng giây)
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. INPUTS (Dữ liệu gửi lên API)
// ==========================================

// Base Input cho Form (Khớp với Zod Schema AlbumFormValues)
export interface AlbumFormInput {
  title: string;
  type: "album" | "single" | "ep" | "compilation";
  description?: string;

  // 🔥 Quan trọng: Khi upload, coverImage là File. Khi edit không đổi ảnh, nó là string (URL) hoặc null.
  coverImage: File | string | null;

  themeColor: string;

  // Relations: Gửi lên ID (string), không gửi cả object
  artist: string;
  genreIds: string[];

  releaseDate: string; // YYYY-MM-DD
  isPublic: boolean;

  // New fields
  label?: string;
  copyright?: string;
  upc?: string;
  tags?: string; // Form nhập string "tag1, tag2", sau đó convert thành mảng khi submit
}

// Input dùng cho hàm Create (thường giống FormInput)
export type CreateAlbumInput = AlbumFormInput;

// Input dùng cho hàm Update (cần thêm _id để định danh)
export interface UpdateAlbumInput extends Partial<AlbumFormInput> {
  _id: string;
}

// ==========================================
// 3. PARAMS & RESPONSE
// ==========================================

// Params lọc danh sách
export interface AlbumFilterParams {
  page?: number;
  limit?: number;
  keyword?: string;
  artistId?: string;
  genreId?: string;
  year?: number;
  type?: "album" | "single" | "ep" | "compilation" | "all";
  sort?: "newest" | "oldest" | "popular" | "a-z"; // Thêm sort
  isPublic?: boolean; // Admin có thể lọc theo trạng thái
}

// Response chuẩn từ Backend
export interface AlbumResponse {
  success: boolean;
  data: {
    data: Album[];
    meta: {
      totalItems: number; // Backend thường trả về totalItems
      total: number; // Hoặc total (tùy convention team bạn)
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
