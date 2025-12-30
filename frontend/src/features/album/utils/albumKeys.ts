import { AlbumFilterParams } from "@/features/album/types";

// features/album/utils/albumKeys.ts
export const albumKeys = {
  all: ["albums"] as const,
  lists: () => [...albumKeys.all, "list"] as const,
  list: (filter: AlbumFilterParams) =>
    [...albumKeys.lists(), { filter }] as const,
  details: () => [...albumKeys.all, "detail"] as const,
  detail: (slug: string) => [...albumKeys.details(), slug] as const,
  search: (query: string) => [...albumKeys.all, "search", query] as const,
};
