import { AlbumFilterParams } from "@/features/album/types";
import { PlaylistFilterParams } from "@/features/playlist/types";

// features/playlist/utils/playlistKeys.ts
export const playlistKeys = {
  all: ["playlists"] as const,
  lists: () => [...playlistKeys.all, "list"] as const,
  list: (filter: PlaylistFilterParams) =>
    [...playlistKeys.lists(), { filter }] as const,
  details: () => [...playlistKeys.all, "detail"] as const,
  detail: (slug: string) => [...playlistKeys.details(), slug] as const,
  search: (query: string) => [...playlistKeys.all, "search", query] as const,
};
