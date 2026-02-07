import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import artistApi from "../api/artistApi";
import { artistKeys } from "@/features/artist/utils/artistKeys";
import { ApiErrorResponse } from "@/types";
import type { ArtistFilterParams } from "../types";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { handleError } from "@/utils/handleError";

// ==========================================
// 1. PUBLIC HOOKS (Client Side)
// ==========================================

export const usePublicArtists = (params: ArtistFilterParams) => {
  return useQuery({
    queryKey: artistKeys.list(params),
    queryFn: () => artistApi.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5, // Cache 5 min
  });
};

export const useSpotlightArtist = (limit = 10) => {
  return useQuery({
    queryKey: artistKeys.list({ sort: "popular", limit }),
    queryFn: async () => {
      const res = await artistApi.getAll({
        page: 1,
        limit,
        sort: "popular",
        isActive: true,
      });
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useArtistDetail = (slugOrId: string) => {
  return useQuery({
    queryKey: artistKeys.detail(slugOrId),
    queryFn: () => artistApi.getDetail(slugOrId),
    enabled: !!slugOrId,
  });
};

// ==========================================
// 2. STUDIO HOOKS (Self-Management)
// ==========================================

export const useMyArtistProfile = () => {
  return useQuery({
    queryKey: artistKeys.profile(),
    queryFn: artistApi.getMyProfile,
    retry: 1,
  });
};

export const useUpdateMyArtistProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ArtistFormValues) => artistApi.updateMyProfile(data),
    onSuccess: (res) => {
      toast.success("Hồ sơ đã được cập nhật");
      // Refresh studio profile
      queryClient.invalidateQueries({ queryKey: artistKeys.profile() });
      // Refresh public detail nếu cần
      if (res.data?.slug) {
        queryClient.invalidateQueries({
          queryKey: artistKeys.detail(res.data.slug),
        });
      }
    },
    onError: (err) => handleError(err, "Lỗi cập nhật hồ sơ"),
  });
};
