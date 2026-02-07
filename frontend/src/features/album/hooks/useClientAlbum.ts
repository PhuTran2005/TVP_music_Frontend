import { useQuery, keepPreviousData } from "@tanstack/react-query";
import albumApi from "../api/albumApi";
import { albumKeys } from "@/features/album/utils/albumKeys";
import type { AlbumFilterParams } from "@/features/album/types";

// ==========================================
// 1. PUBLIC LISTS (Trang Album, Search)
// ==========================================

/**
 * Hook lấy danh sách Album Public (có phân trang, filter)
 * Dùng cho trang: /albums, /search
 */
export const usePublicAlbums = (params: AlbumFilterParams) => {
  return useQuery({
    // Key: ['albums', 'list', { filter: ... }]
    queryKey: albumKeys.list(params),

    queryFn: async () => {
      const res = await albumApi.getPublicAlbums(params);
      return res.data; // Trả về cấu trúc { data: [], meta: {} }
    },

    // Giữ UI cũ khi đang tải trang mới (UX mượt mà)
    placeholderData: keepPreviousData,

    // Cache 2 phút (List có thể thay đổi thứ tự/số lượng)
    staleTime: 2 * 60 * 1000,
  });
};

// ==========================================
// 2. SPOTLIGHTS (Trang Home)
// ==========================================

/**
 * Hook lấy Album mới phát hành
 */
export const useNewReleases = (limit = 10) => {
  const params = { page: 1, limit, sort: "newest" } as const;

  return useQuery({
    queryKey: albumKeys.list(params),
    queryFn: async () => {
      const res = await albumApi.getPublicAlbums(params);
      return res.data.data; // Chỉ lấy mảng data
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook lấy Album nổi bật/phổ biến
 */
export const useFeatureAlbum = (limit = 10) => {
  const params = { page: 1, limit, sort: "popular" } as const;

  return useQuery({
    queryKey: albumKeys.list(params),
    queryFn: async () => {
      const res = await albumApi.getPublicAlbums(params);
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 phút (Popular ít biến động hơn Newest)
  });
};

// ==========================================
// 3. DETAIL & RELATED
// ==========================================

/**
 * Hook lấy chi tiết Album
 */
export const useAlbumDetail = (slug: string) => {
  return useQuery({
    queryKey: albumKeys.detail(slug),
    queryFn: async () => {
      const res = await albumApi.getAlbumDetail(slug);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000, // 30 phút (Detail album hiếm khi đổi)
    retry: 1, // Hạn chế retry nếu 404
  });
};

/**
 * Hook lấy Album liên quan (Cùng Genre)
 * Thường dùng ở cuối trang Detail
 */
export const useRelatedAlbums = (currentAlbumId: string, genreId?: string) => {
  // Tạo params ảo để làm unique key cho React Query
  // Note: Cần ép kiểu hoặc đảm bảo AlbumFilterParams cho phép các field mở rộng nếu cần
  const filterParams: any = {
    limit: 5,
    genreId,
    exclude: currentAlbumId, // field này giúp key unique theo bài hiện tại
  };

  return useQuery({
    // 🔥 FIX: Truyền object vào list() thay vì string
    queryKey: albumKeys.list(filterParams),

    queryFn: async () => {
      if (!genreId) return [];
      const res = await albumApi.getPublicAlbums({
        limit: 5,
        genreId,
        // Lưu ý: API cần hỗ trợ param 'exclude' hoặc xử lý lọc ở FE
        // Nếu API chưa hỗ trợ 'exclude', bạn có thể filter thủ công ở đây:
        // return res.data.data.filter(a => a._id !== currentAlbumId);
      });

      // Giả sử API trả về list, ta lọc client-side để chắc chắn không trùng bài đang xem
      return res.data.data.filter((a: any) => a._id !== currentAlbumId);
    },

    enabled: !!currentAlbumId && !!genreId,
    staleTime: 15 * 60 * 1000,
  });
};
