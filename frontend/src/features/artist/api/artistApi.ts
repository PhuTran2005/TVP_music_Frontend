import api from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types";
import type { Artist, ArtistDetail, ArtistFilterParams } from "../types";

const artistApi = {
  // ==========================================
  // PUBLIC METHODS
  // ==========================================
  getAll: async (params: ArtistFilterParams) => {
    const res = await api.get<ApiResponse<PagedResponse<Artist>>>("/artists", {
      params,
    });
    return res.data;
  },

  getDetail: async (slugOrId: string) => {
    const res = await api.get<ApiResponse<ArtistDetail>>(
      `/artists/${slugOrId}`,
    );
    return res.data;
  },

  // ==========================================
  // ADMIN METHODS
  // ==========================================

  // 🔥 FIX: Nhận trực tiếp FormData (đã build từ Hook)
  adminCreate: async (data: FormData) => {
    // const res = await api.post<ApiResponse<Artist>>("/artists", data, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });
    // return res.data;
  },

  // 🔥 FIX: Nhận FormData cho update (Avatar, Cover, Info...)
  adminUpdate: async (id: string, data: FormData) => {
    const res = await api.patch<ApiResponse<Artist>>(`/artists/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Toggle Status (Gửi JSON thường)
  adminToggleStatus: async (id: string) => {
    const res = await api.patch<ApiResponse<Artist>>(`/artists/${id}/toggle`);
    return res.data;
  },

  adminDelete: async (id: string) => {
    const res = await api.delete<ApiResponse<Artist>>(`/artists/${id}`);
    return res.data;
  },

  // ==========================================
  // ARTIST SELF METHODS (Profile)
  // ==========================================
  getMyProfile: async () => {
    const res = await api.get<ApiResponse<Artist>>("/artists/me/profile");
    return res.data;
  },

  // 🔥 FIX: Profile update thường có ảnh -> Dùng FormData
  updateMyProfile: async (data: FormData) => {
    const res = await api.patch<ApiResponse<Artist>>(
      "/artists/me/profile",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  },
};

export default artistApi;
