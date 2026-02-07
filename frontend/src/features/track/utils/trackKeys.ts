import { TrackFilterParams } from "@/features/track/types";

// features/track/utils/trackKeys.ts
export const trackKeys = {
  all: ["tracks"] as const,
  lists: () => [...trackKeys.all, "list"] as const,
  list: (filter: TrackFilterParams) =>
    [...trackKeys.lists(), { filter }] as const,
  details: () => [...trackKeys.all, "detail"] as const,
  detail: (slug: string) => [...trackKeys.details(), slug] as const,
  search: (query: string) => [...trackKeys.all, "search", query] as const,
};
