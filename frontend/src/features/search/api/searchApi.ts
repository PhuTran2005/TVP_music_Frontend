// src/features/search/api/searchApi.ts
import api from "@/lib/axios";
import { SearchInput } from "@/features/search/schemas/search.schema";
import { SearchResponse, SearchData } from "../types";

const EMPTY_SEARCH_DATA: SearchData = {
  topResult: null,
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
};

export const searchApi = {
  search: async (params: SearchInput): Promise<SearchData> => {
    // Nếu query rỗng hoặc toàn dấu cách, trả về bộ khung rỗng lập tức
    if (!params.q || !params.q.trim()) {
      return EMPTY_SEARCH_DATA;
    }

    // Truyền trực tiếp params vào axios
    const { data } = await api.get<SearchResponse>("/search", { params });

    // Fallback an toàn nếu backend trả về null/undefined cho data
    return data.data || EMPTY_SEARCH_DATA;
  },
};
