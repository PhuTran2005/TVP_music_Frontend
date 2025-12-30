import type {
  CreatePlaylistInput,
  Playlist,
  PlaylistFilterParams,
  UpdatePlaylistInput,
} from "@/features/playlist/types";
import api from "@/lib/axios";
import { type ApiResponse, type PagedResponse } from "@/types";
import { buildFormData } from "@/utils/form-data";

const playlistApi = {
  // 1. Lấy danh sách (SỬA LẠI: Thêm async/await và return .data)
  getAll: async (params: PlaylistFilterParams) => {
    const response = await api.get<ApiResponse<PagedResponse<Playlist>>>(
      "/playlists",
      {
        params,
      }
    );
    return response.data;
  },

  // 2. Lấy Playlist của tôi
  getMyPlaylists: async () => {
    const response = await api.get<{ data: Playlist[] }>("/playlists/me/all");
    return response.data;
  },

  // 3. Lấy chi tiết
  getDetail: async (id: string) => {
    const response = await api.get<{ data: Playlist }>(`/playlists/${id}`);
    return response.data;
  },

  // 4. Tạo Playlist
  create: async (data: CreatePlaylistInput) => {
    const formData = buildFormData(data);
    console.log("Form Data:", data, ...formData);
    // SỬA: return response.data
    const response = await api.post("/playlists", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 5. Cập nhật
  update: async (id: string, data: UpdatePlaylistInput) => {
    // SỬA: return response.data
    const formData = buildFormData(data);
    console.log("Form Data:", data, ...formData);
    const response = await api.patch(`/playlists/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 6. Xóa Playlist
  delete: async (id: string) => {
    const response = await api.delete(`/playlists/${id}`);
    return response.data;
  },

  // 7. Thêm bài hát
  // Sửa addTrack cũ thành addTracks nhận mảng
  addTracks: (playlistId: string, trackIds: string[]) => {
    const res = api.post(`/playlists/${playlistId}/tracks`, { trackIds });
    console.log("Add Tracks Response:", res);
    return res;
  },

  removeTracks: (playlistId: string, trackIds: string[]) => {
    return api.delete(`/playlists/${playlistId}/tracks`, {
      data: { trackIds }, // Axios yêu cầu body của DELETE phải nằm trong key 'data'
    });
  },

  // API reorder (nếu backend hỗ trợ)
  reorderTracks: (
    playlistId: string,
    rangeStart: number,
    insertBefore: number
  ) => {
    return api.put(`/playlists/${playlistId}/tracks/reorder`, {
      rangeStart,
      insertBefore,
    });
  },
};

export default playlistApi;
