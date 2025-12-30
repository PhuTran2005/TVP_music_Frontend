import { keepPreviousData, useQuery } from "@tanstack/react-query";
import albumApi from "../api/albumApi"; // Đảm bảo import đúng
import { albumKeys } from "@/features/album/utils/albumKeys";
import { AlbumFilterParams } from "@/features/album/types";

// ==========================================
// 1. Hook: Danh sách Album Public (Dùng cho trang AlbumPage)
// ==========================================
export const usePublicAlbums = (params: AlbumFilterParams) => {
  return useQuery({
    // Key phụ thuộc vào params để tự động refetch khi user đổi trang/filter
    queryKey: albumKeys.list(params),
    queryFn: async () => {
      const res = await albumApi.getPublicAlbums(params);
      return res.data; // Trả về { data: [], meta: {} }
    },
    placeholderData: keepPreviousData, // Giữ UI cũ khi đang tải trang mới -> UX mượt
    staleTime: 2 * 60 * 1000, // Cache 2 phút
  });
};

// ==========================================
// 2. Hook: Mới phát hành (Home Page - Simplified)
// ==========================================
export const useNewReleases = (limit = 10) => {
  return useQuery({
    queryKey: albumKeys.list({ sort: "newest" }),
    queryFn: async () => {
      const res = await albumApi.getPublicAlbums({
        page: 1,
        limit,
        sort: "newest",
      });
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
export const useFeatureAlbum = (limit = 10) => {
  return useQuery({
    queryKey: albumKeys.list({ sort: "popular" }),
    queryFn: async () => {
      const res = await albumApi.getPublicAlbums({
        page: 1,
        limit,
        sort: "popular",
      });
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ==========================================
// 2. Hook: Chi tiết Album (Detail)
// ==========================================
export const useAlbumDetail = (slug: string) => {
  return useQuery({
    queryKey: albumKeys.detail(slug),
    queryFn: async () => {
      const res = await albumApi.getAlbumDetail(slug);
      return res.data;
    },
    enabled: !!slug, // Chỉ chạy khi có slug
    staleTime: 30 * 60 * 1000, // ✅ Cache 30 phút. Detail album hiếm khi đổi.
    retry: 1, // Nếu lỗi, thử lại 1 lần thôi rồi báo lỗi (tránh spam server nếu 404)
  });
};

// ==========================================
// 4. Hook: Album liên quan (Bonus Logic)
// ==========================================
// Thường trang detail cần hiện thêm "Có thể bạn thích"
export const useRelatedAlbums = (currentAlbumId: string, genreId?: string) => {
  return useQuery({
    queryKey: albumKeys.list(`related-${currentAlbumId}`),
    queryFn: async () => {
      if (!genreId) return [];
      // Giả sử API hỗ trợ filter theo genre
      const res = await albumApi.getPublicAlbums({
        limit: 5,
        genreId: genreId,
        exclude: currentAlbumId, // Loại trừ album đang xem
      });
      return res.data.data;
    },
    enabled: !!currentAlbumId && !!genreId,
    staleTime: 15 * 60 * 1000,
  });
};
