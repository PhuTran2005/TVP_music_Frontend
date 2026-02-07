import { AlbumFilterParams } from "@/features/album/types";

export const albumKeys = {
  all: ["albums"] as const,
  lists: () => [...albumKeys.all, "list"] as const,
  list: (filter: AlbumFilterParams) =>
    [...albumKeys.lists(), { filter }] as const,
  details: () => [...albumKeys.all, "detail"] as const,
  detail: (slug: string) => [...albumKeys.details(), slug] as const,
};
