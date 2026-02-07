import { useQuery, keepPreviousData } from "@tanstack/react-query";
import trackApi from "../api/trackApi";
import { trackKeys } from "@/features/track/utils/trackKeys";
import type { TrackFilterParams } from "../types";

// ==========================================
// 1. LISTS (Playlist Page, Search, Album Detail...)
// ==========================================

export const useTracks = (params: TrackFilterParams) => {
  return useQuery({
    // Key: ['tracks', 'list', { filter: ... }]
    queryKey: trackKeys.list(params),
    queryFn: () => trackApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
};

// ==========================================
// 2. SPOTLIGHTS
// ==========================================

export const useTopTracks = (limit = 10) => {
  return useQuery({
    queryKey: trackKeys.list({ sort: "popular", limit }),
    queryFn: async () => {
      const res = await trackApi.getAll({
        page: 1,
        limit,
        sort: "popular",
        status: "ready",
      });
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ==========================================
// 3. DETAIL
// ==========================================

// export const useTrackDetail = (slug: string) => {
//   return useQuery({
//     queryKey: trackKeys.detail(slug),
//     queryFn: () => trackApi.getDetail(slug),
//     enabled: !!slug,
//     staleTime: 10 * 60 * 1000,
//   });
// };
