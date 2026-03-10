import api from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types";
import type { Genre, GenreDetail, GenreFilterParams } from "../types";

const genreApi = {
  // ==========================================
  // PUBLIC (READ)
  // ==========================================
  getAll: async (params: GenreFilterParams) => {
    const res = await api.get<ApiResponse<PagedResponse<Genre>>>("/genres", {
      params,
    });
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<GenreDetail>>(`/genres/${slug}`);
    return res.data;
  },

  // Lấy cây danh mục (Hierarchy) - Thường dùng cho menu hoặc selector
  getTree: async () => {
    const res = await api.get<ApiResponse<Genre[]>>("/genres/tree");
    return res.data;
  },

  // ==========================================
  // ADMIN (WRITE - Protected)
  // ==========================================

  // 🔥 FIX: Nhận FormData trực tiếp (đã build từ hook)
  create: async (data: FormData) => {
    const res = await api.post<ApiResponse<Genre>>("/genres", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // 🔥 FIX: Tách ID và FormData
  update: async (id: string, data: FormData) => {
    const res = await api.patch<ApiResponse<Genre>>(`/genres/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Toggle Trending/Active (Gửi JSON thường)
  toggleStatus: async (id: string) => {
    const res = await api.patch<ApiResponse<Genre>>(`/genres/${id}/toggle`);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<Genre>>(`/genres/${id}`);
    return res.data;
  },
};

export default genreApi;
