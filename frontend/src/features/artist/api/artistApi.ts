import api from "@/lib/axios";
import type { ApiResponse, PagedResponse } from "@/types";
import type { Artist, ArtistDetail, ArtistFilterParams } from "../types";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { buildFormData } from "@/utils/form-data";

const artistApi = {
  // --- PUBLIC ---
  getAll: async (params: ArtistFilterParams) => {
    const res = await api.get<ApiResponse<PagedResponse<Artist>>>("/artists", {
      params,
    });
    return res.data;
  },

  getDetail: async (slugOrId: string) => {
    const res = await api.get<ApiResponse<ArtistDetail>>(
      `/artists/${slugOrId}`
    );
    return res.data;
  },

  // --- ADMIN ---
  adminCreate: async (data: ArtistFormValues) => {
    const formData = buildFormData(data);
    console.log(data, ...formData);
    const res = await api.post<ApiResponse<Artist>>("/artists", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  adminUpdate: async (id: string, data: Partial<ArtistFormValues>) => {
    const formData = buildFormData(data);
    console.log(data, ...formData);
    const res = await api.patch<ApiResponse<Artist>>(
      `/artists/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  adminToggleStatus: async (id: string) => {
    return (await api.patch<ApiResponse<Artist>>(`/artists/${id}/toggle`)).data;
  },

  adminDelete: async (id: string) => {
    return (await api.delete<ApiResponse<Artist>>(`/artists/${id}`)).data;
  },

  // --- ARTIST SELF ---
  getMyProfile: async () => {
    const res = await api.get<ApiResponse<Artist>>("/artists/me/profile");
    return res.data;
  },

  updateMyProfile: async (data: ArtistFormValues) => {
    const res = await api.patch<ApiResponse<Artist>>(
      "/artists/me/profile",
      buildFormData(data),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },
};

export default artistApi;
