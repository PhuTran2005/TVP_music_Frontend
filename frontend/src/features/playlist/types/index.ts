import { type Track } from "@/features/track/types";
import { type User } from "@/features/user/types";

export type PlaylistVisibility = "public" | "private" | "unlisted";
export type PlaylistType = "playlist" | "radio" | "mix";

export interface Playlist {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage: string;
  themeColor: string;

  // Quan hệ đã được Populate
  user: User;
  collaborators: User[];

  // Danh sách bài hát (Dạng phẳng hoặc dạng lồng tùy API của bạn)
  tracks: Track[];

  visibility: PlaylistVisibility;
  type: PlaylistType;
  tags: string[];

  isPublic: boolean; // Field ảo hoặc cũ (nếu BE vẫn trả về để tương thích ngược)
  isSystem: boolean;

  // Các con số thống kê để hiển thị UI
  totalTracks: number;
  totalDuration: number;
  followersCount: number;
  playCount: number;

  createdAt: string;
  updatedAt: string;
}
export interface PlaylistFormInput {
  title: string;
  slug: string;
  description?: string;
  coverImage: string;
  themeColor: string;

  // Quan hệ đã được Populate
  collaborators: User[];

  // Danh sách bài hát (Dạng phẳng hoặc dạng lồng tùy API của bạn)

  visibility: PlaylistVisibility;
  type: PlaylistType;
  tags: string[];

  isPublic: boolean; // Field ảo hoặc cũ (nếu BE vẫn trả về để tương thích ngược)
  isSystem: boolean;
}
export type CreatePlaylistInput = PlaylistFormInput;

// Input dùng cho hàm Update (cần thêm _id để định danh)
export interface UpdatePlaylistInput extends Partial<PlaylistFormInput> {
  _id: string;
}
// Params để gọi Hook useQuery hoặc usePlaylistAdmin
export interface PlaylistFilterParams {
  page?: number;
  limit?: number;
  keyword?: string;
  visibility?: PlaylistVisibility | "all";
  type?: PlaylistType | "all";
  userId?: string;
  isSystem?: boolean;
  sort?: "newest" | "popular" | "followers" | "name";
}

export interface PlaylistListResponse {
  data: Playlist[];
  meta: {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
