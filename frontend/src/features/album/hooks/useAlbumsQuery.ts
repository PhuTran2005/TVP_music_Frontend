import { useQuery, keepPreviousData } from "@tanstack/react-query";
import albumApi from "../api/albumApi";
import { albumKeys } from "../utils/albumKeys";
import type { AlbumFilterParams, Album } from "../types";

// ==========================================
// 1. PUBLIC LISTS (Trang Albums, Search)
// ==========================================

/**
 * Hook lấy danh sách Album (Có phân trang, lọc, tìm kiếm)
 * - Tối ưu UX: `keepPreviousData` giúp không bị giật Layout khi bấm sang trang khác.
 * - Tối ưu Data: Dùng `select` bóc tách sẵn `albums` và `meta`.
 */
export const useAlbumsQuery = (params: AlbumFilterParams) => {
  return useQuery({
    queryKey: albumKeys.list(params),
    queryFn: () => albumApi.getAll({ ...params }),

    // Giữ data cũ trên màn hình trong lúc fetch data trang mới -> Tránh Layout Shift
    placeholderData: keepPreviousData,

    // Cache 2 phút (List có thể thay đổi thứ tự/số lượng)
    staleTime: 2 * 60 * 1000,

    // Bóc tách data ngay tại Hook, Component gọi ra là xài được luôn
    select: (response) => ({
      albums: response.data.data as Album[],
      meta: response.data.meta,
      isEmpty: response.data.data.length === 0,
    }),
  });
};

// ==========================================
// 2. SPOTLIGHTS (Trang Home / Khám phá)
// ==========================================

/**
 * Hook lấy Album mới phát hành (Mới nhất)
 */
export const useNewReleases = (limit = 10) => {
  // Fix cứng params để đảm bảo queryKey luôn match chuẩn xác
  const params: AlbumFilterParams = { limit, sort: "newest", isPublic: true };

  return useQuery({
    queryKey: albumKeys.list(params),
    queryFn: () => albumApi.getAll(params),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    select: (response) => response.data.data as Album[],
  });
};

/**
 * Hook lấy Album nổi bật (Phổ biến nhất)
 */
export const useFeatureAlbums = (limit = 10) => {
  const params: AlbumFilterParams = { limit, sort: "popular", isPublic: true };

  return useQuery({
    queryKey: albumKeys.list(params),
    queryFn: () => albumApi.getAll(params),
    staleTime: 10 * 60 * 1000, // Cache 10 phút (Popular ít biến động hơn)
    select: (response) => response.data.data as Album[],
  });
};

// ==========================================
// 3. DETAIL & RELATED (Trang Chi tiết Album)
// ==========================================

/**
 * Hook lấy chi tiết 1 Album (Theo ID hoặc Slug)
 */
export const useAlbumDetail = (slugOrId: string) => {
  return useQuery({
    queryKey: albumKeys.detail(slugOrId),
    queryFn: () => albumApi.getById(slugOrId),

    // Chỉ chạy query nếu slugOrId tồn tại (tránh lỗi gọi API rỗng)
    enabled: !!slugOrId,

    // Cache 30 phút vì chi tiết Album (Tên, cover, tracklist) rất hiếm khi thay đổi
    staleTime: 30 * 60 * 1000,
    retry: 1, // Nếu sai slug/id (404) thì không cần retry nhiều lần làm nghẽn mạng

    // Bóc tách thẳng vào object data (để xài res.data thay vì res.data.data)
    select: (response) => response.data,
  });
};

/**
 * Hook lấy Album liên quan (Ví dụ: Cùng Thể loại)
 * Dùng để hiển thị ở mục "Có thể bạn cũng thích" cuối trang Detail.
 */
export const useRelatedAlbums = (currentAlbumId: string, genreId?: string) => {
  const params: AlbumFilterParams = {
    limit: 6, // Fetch dư ra 1 cái để phòng trường hợp bị trùng với currentAlbumId
    genreId,
    isPublic: true,
  };

  return useQuery({
    // Sử dụng currentAlbumId trong key ảo để buộc query cache riêng cho từng trang detail
    queryKey: ["albums", "related", currentAlbumId, genreId],

    queryFn: () => albumApi.getAll(params),

    enabled: !!currentAlbumId && !!genreId, // Buộc phải có đủ ID và Genre
    staleTime: 15 * 60 * 1000, // Cache 15 phút

    // Select: Lọc bỏ chính bài đang xem ở Client-side (Trường hợp Backend không hỗ trợ query exclude)
    select: (response) => {
      const albums = response.data.data as Album[];
      return albums.filter((album) => album._id !== currentAlbumId).slice(0, 5); // Cắt lấy đúng 5 album liên quan sau khi đã lọc
    },
  });
};
