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
  // 1. GET LIST
  getAll: async (params: PlaylistFilterParams) => {
    const response = await api.get<ApiResponse<PagedResponse<Playlist>>>(
      "/playlists",
      { params }
    );
    return response.data;
  },

  // 2. GET ONE (Detail)
  getOne: async (id: string) => {
    const response = await api.get<ApiResponse<Playlist>>(`/playlists/${id}`);
    return response.data;
  },

  // 3. CREATE (FormData for Image)
  create: async (data: CreatePlaylistInput) => {
    const formData = buildFormData(data);
    const response = await api.post("/playlists", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 4. UPDATE METADATA (PATCH)
  update: async (id: string, data: UpdatePlaylistInput) => {
    const formData = buildFormData(data);
    console.log(formData);
    const response = await api.patch(`/playlists/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 5. DELETE
  delete: async (id: string) => {
    const response = await api.delete(`/playlists/${id}`);
    return response.data;
  },

  // --- TRACK MANAGEMENT ---

  // 6. ADD TRACKS (POST)
  addTracks: async (playlistId: string, trackIds: string[]) => {
    // API backend: POST /api/playlists/:id/tracks
    // Body: { trackIds: [...] }
    const response = await api.post(`/playlists/${playlistId}/tracks`, {
      trackIds,
    });
    return response.data;
  },

  // 7. REMOVE TRACKS (Single - DELETE)
  removeTracks: async (playlistId: string, trackIds: string[]) => {
    // API backend: DELETE /api/playlists/:id/tracks/:trackId
    const response = await api.delete(`/playlists/${playlistId}/tracks`, {
      data: { trackIds },
    });

    return response.data;
  },

  // 8. 🔥 REORDER TRACKS (PUT)
  // Payload: Danh sách trackIds mới đã được sắp xếp
  reorderTracks: async (playlistId: string, trackIds: string[]) => {
    // API backend: PUT /api/playlists/:id/tracks
    const response = await api.put(`/playlists/${playlistId}/tracks`, {
      trackIds,
    });
    return response.data;
  },
};

export default playlistApi;
