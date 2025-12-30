import { SearchInput } from "@/features/search/schemas/search.schema";
import { SearchResponse, SearchData } from "../types";
import api from "@/lib/axios";

export const searchApi = {
  search: async (params: SearchInput): Promise<SearchData> => {
    // Nếu query rỗng, trả về data rỗng ngay lập tức để đỡ gọi API thừa
    if (!params.q) {
      return {
        topResult: null,
        tracks: [],
        artists: [],
        albums: [],
        playlists: [],
      };
    }

    const { data } = await api.get<SearchResponse>("/search", {
      params,
    });
    return data.data;
  },
};
