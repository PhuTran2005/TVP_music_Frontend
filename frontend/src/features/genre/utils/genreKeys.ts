import { GenreFilterParams } from "@/features/genre/types";

// features/album/utils/albumKeys.ts
export const genreKeys = {
  all: ["genres"] as const,
  lists: () => [...genreKeys.all, "list"] as const,
  list: (filter: GenreFilterParams) =>
    [...genreKeys.lists(), { filter }] as const,
  details: () => [...genreKeys.all, "detail"] as const,
  detail: (slug: string) => [...genreKeys.details(), slug] as const,
  search: (query: string) => [...genreKeys.all, "search", query] as const,
};
