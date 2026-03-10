import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import artistApi from "../api/artistApi";
import { artistKeys } from "@/features/artist/utils/artistKeys";
import { handleError } from "@/utils/handleError";
import type { ArtistFilterParams } from "../types";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";

// ==========================================
// 1. PUBLIC HOOKS (Dành cho Người dùng cuối)
// ==========================================

/**
 * Hook lấy danh sách Nghệ sĩ (Có phân trang & Lọc)
 * - Tối ưu UX: Không bị giật layout khi chuyển trang nhờ `keepPreviousData`
 * - Tối ưu Data: Bóc tách sẵn `artists` và `meta`
 */
export const useArtistsQuery = (params: ArtistFilterParams) => {
  return useQuery({
    queryKey: artistKeys.list(params),
    queryFn: () => artistApi.getAll(params),

    // UX: Giữ data cũ trên màn hình trong lúc fetch data trang mới -> Tránh Layout Shift
    placeholderData: keepPreviousData,

    // Performance: Dữ liệu public ít thay đổi liên tục, cache 5 phút là hợp lý
    staleTime: 1000 * 60 * 5,

    // Select: Bóc tách data ngay tại Hook, Component không cần gọi `data.data.data` nữa
    select: (response) => ({
      artists: response.data.data,
      meta: response.data.meta,
      isEmpty: response.data.data.length === 0,
    }),
  });
};

/**
 * Hook lấy danh sách Nghệ sĩ nổi bật (Trang chủ)
 */
export const useSpotlightArtists = (limit = 10) => {
  return useQuery({
    // Đảm bảo queryKey phản ánh đúng params được truyền vào API
    queryKey: artistKeys.list({ sort: "popular", limit, isActive: true }),
    queryFn: () =>
      artistApi.getAll({
        page: 1,
        limit,
        sort: "popular",
        isActive: true,
      }),
    staleTime: 1000 * 60 * 10, // Cache 10 phút vì độ hot không thay đổi từng giây
    select: (response) => response.data.data, // Chỉ trả về mảng artists
  });
};

/**
 * Hook lấy chi tiết 1 Nghệ sĩ (Theo ID hoặc Slug)
 */
export const useArtistDetail = (slugOrId: string) => {
  return useQuery({
    queryKey: artistKeys.detail(slugOrId),
    queryFn: () => artistApi.getDetail(slugOrId),
    enabled: !!slugOrId, // Chỉ chạy khi có ID/Slug hợp lệ
    staleTime: 1000 * 60 * 5,
    select: (response) => response.data, // Bóc tách thẳng data của artist
  });
};

// ==========================================
// 2. STUDIO HOOKS (Dành cho Nghệ sĩ tự quản lý)
// ==========================================

/**
 * Hook lấy Profile của chính Nghệ sĩ đang đăng nhập
 */
export const useMyArtistProfile = () => {
  return useQuery({
    queryKey: artistKeys.profile(),
    queryFn: artistApi.getMyProfile,
    retry: 1, // Không retry nhiều lần nếu họ chưa phải là artist (tránh spam API lỗi 403/404)
    select: (response) => response.data,
  });
};

/**
 * Hook cập nhật Profile của chính Nghệ sĩ
 */
export const useUpdateMyArtistProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArtistFormValues) => artistApi.updateMyProfile(data),
    onSuccess: (res) => {
      toast.success("Hồ sơ đã được cập nhật thành công!");

      // 1. Refresh lại data trong trang Studio
      queryClient.invalidateQueries({ queryKey: artistKeys.profile() });

      // 2. Nếu update có làm thay đổi slug, refresh luôn trang Public Detail của họ
      if (res.data?.slug) {
        queryClient.invalidateQueries({
          queryKey: artistKeys.detail(res.data.slug),
        });
      }

      // 3. (Tùy chọn) Có thể clear cache list để lỡ user ra ngoài trang chủ thấy tên mới liền
      // queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
    },
    onError: (err) => handleError(err, "Lỗi cập nhật hồ sơ nghệ sĩ"),
  });
};
