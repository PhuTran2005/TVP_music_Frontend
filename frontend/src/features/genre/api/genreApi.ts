import api from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types";
import type {
  CreateGenreInput,
  UpdateGenreInput,
  Genre,
  GenreFilterParams,
  GenreDetail,
} from "../types";
import { buildFormData } from "@/utils/form-data";

const genreApi = {
  getAll: async (params: GenreFilterParams) => {
    const res = await api.get<ApiResponse<PagedResponse<Genre>>>("/genres", {
      params,
    });
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<GenreDetail>>("/genres/" + slug);
    return res.data;
  },
  create: async (data: CreateGenreInput) => {
    const formData = buildFormData(data);
    console.log(data, ...formData);
    const res = await api.post<ApiResponse<Genre>>("/genres", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (data: UpdateGenreInput) => {
    const formData = buildFormData(data);
    if (data.parentId === null) {
      // Xóa dòng cũ nếu buildFormData đã lỡ add
      formData.delete("parentId");
      formData.append("parentId", ""); // Gửi chuỗi rỗng an toàn hơn "null"
    }
    const res = await api.patch<ApiResponse<Genre>>(
      `/genres/${data._id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

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
