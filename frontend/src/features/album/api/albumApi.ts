import type {
  Album,
  AlbumFilterParams,
  AlbumResponse,
  CreateAlbumInput,
  UpdateAlbumInput,
} from "@/features/album/types";
import api from "@/lib/axios"; // Instance axios đã config interceptor của bạn
import type { ApiResponse, PagedResponse } from "@/types";
import { buildFormData } from "@/utils/form-data";

const albumApi = {
  // 1. Lấy danh sách (Có lọc)
  getAll: async (params: AlbumFilterParams) => {
    // Backend nhận: page, limit, q, artistId...
    const response = await api.get<ApiResponse<PagedResponse<Album>>>(
      "/albums",
      { params }
    );
    return response.data; // Trả về { success, data: { data: [], meta: {} } }
  },

  // 2. Lấy chi tiết
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Album }>(
      `/albums/${id}`
    );
    return response.data;
  },

  // 3. Tạo mới (Dùng FormData)
  create: async (data: CreateAlbumInput) => {
    const formData = buildFormData(data);
    console.log(data, ...formData);
    const response = await api.post("/albums", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 4. Cập nhật
  update: async (id: string, data: UpdateAlbumInput) => {
    const formData = buildFormData(data);
    console.log(data, ...formData);
    const response = await api.patch(`/albums/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 5. Xóa
  delete: async (id: string) => {
    const response = await api.delete(`/albums/${id}`);
    return response.data;
  },
  getPublicAlbums: async (params: AlbumFilterParams) => {
    const response = await api.get<ApiResponse<PagedResponse<Album>>>(
      "/albums",
      { params }
    );
    return response.data;
  },

  // 2. Lấy chi tiết Album (Album Detail Page)
  // Ưu tiên dùng Slug cho đẹp URL (vd: /album/chung-ta-cua-hien-tai)
  getAlbumDetail: async (slugOrId: string) => {
    const response = await api.get<{ success: boolean; data: Album }>(
      `/albums/${slugOrId}`
    );
    return response.data;
  },

  // 3. (Optional) Lấy Album liên quan/Gợi ý
  getRelatedAlbums: async (genreId: string) => {
    const response = await api.get<AlbumResponse>("/albums", {
      params: { genreId, limit: 5 },
    });
    return response.data;
  },
};

export default albumApi;
