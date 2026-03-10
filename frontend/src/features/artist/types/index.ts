import { Album } from "@/features/album/types";
import type { Genre } from "@/features/genre/types";
import { ITrack } from "@/features/track/types";
import type { User } from "@/features/user";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  spotify?: string; // 🔥 Mới
  youtube?: string; // 🔥 Mới
}

export interface Artist {
  _id: string;
  name: string;
  slug: string;
  aliases: string[]; // 🔥 Mới: Các tên gọi khác
  nationality: string; // 🔥 Mới: VN, US...

  bio?: string;
  avatar?: string;
  coverImage?: string;
  images: string[]; // 🔥 Mới: Gallery ảnh
  themeColor: string; // 🔥 Mới: Dùng cho background gradient

  // Populate
  user?: User | null;
  genres: Genre[];

  socialLinks?: SocialLinks;

  // Stats & Status
  totalTracks: number; // 🔥 Mới
  totalAlbums: number; // 🔥 Mới
  totalFollowers: number;
  totalPlays: number;
  monthlyListeners: number; // 🔥 Mới: Chỉ số cực quan trọng cho UI

  isVerified: boolean;
  isActive: boolean;
  isFollowed?: boolean;

  createdAt: string;
  updatedAt: string;
}
export interface ArtistDetail {
  albums: Album[];
  topTracks: ITrack[];
  artist: Artist;
}
export interface ArtistFilterParams {
  page?: number;
  limit?: number;
  keyword?: string;
  genreId?: string;
  nationality?: string; // 🔥 Lọc theo quốc gia
  isVerified?: boolean;
  isActive?: boolean;
  sort?: "popular" | "monthlyListeners" | "newest" | "name"; // 🔥 Thêm sort chuẩn
}
