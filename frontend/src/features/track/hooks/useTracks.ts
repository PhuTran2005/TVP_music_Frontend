// src/features/track/hooks/useTracks.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import trackApi from "../api/trackApi"; // Giả sử bạn có api này
import { TrackFilterParams } from "@/features/track/types";

export const useTracks = (params: TrackFilterParams) => {
  return useQuery({
    queryKey: ["tracks", params],
    queryFn: () => trackApi.getAll(params),
    placeholderData: keepPreviousData,
  });
};
