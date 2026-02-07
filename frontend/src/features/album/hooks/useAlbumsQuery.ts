import { useQuery, keepPreviousData } from "@tanstack/react-query";
import albumApi from "../api/albumApi";
import { albumKeys } from "../utils/albumKeys";
import { AlbumFilterParams } from "../types";

export const useAlbumsQuery = (params: AlbumFilterParams) => {
  return useQuery({
    queryKey: albumKeys.list(params),
    queryFn: () => albumApi.getAll(params),

    // UX: Giữ data cũ khi chuyển trang -> Không bị nháy Loading
    placeholderData: keepPreviousData,

    // Performance: Cache 30s. Nếu user quay lại trong 30s sẽ hiện ngay lập tức
    staleTime: 1000 * 30,

    // Optimization: Chỉ trả về data cần thiết cho UI
    select: (response) => ({
      albums: response.data.data,
      meta: response.data.meta,
      isEmpty: response.data.data.length === 0,
    }),
  });
};
