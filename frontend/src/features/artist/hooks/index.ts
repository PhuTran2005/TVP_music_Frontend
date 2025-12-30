import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import artistApi from "../api/artistApi";
import { toast } from "sonner";
import type { ArtistFilterParams } from "../types";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { artistKeys } from "@/features/artist/utils/artistKeys";

// ==========================================
// 1. PUBLIC HOOKS (Dùng cho trang Home/Detail)
// ==========================================

export const usePublicArtists = (params: ArtistFilterParams) => {
  return useQuery({
    queryKey: ["public-artists", params],
    queryFn: () => artistApi.getAll(params),
    placeholderData: (prev) => prev,
  });
};
export const useSpotlightArtist = (limit = 10) => {
  return useQuery({
    queryKey: artistKeys.list({ sort: "popular" }),
    queryFn: async () => {
      const res = await artistApi.getAll({
        page: 1,
        limit,
        sort: "popular",
      });
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
export const useArtistDetail = (slugOrId: string) => {
  return useQuery({
    queryKey: [artistKeys.detail, slugOrId],
    queryFn: () => artistApi.getDetail(slugOrId),
    enabled: !!slugOrId, // Chỉ chạy khi có slug
  });
};

// ==========================================
// 2. ADMIN HOOKS (Dùng cho CMS)
// ==========================================

export const useAdminArtists = (params: ArtistFilterParams) => {
  return useQuery({
    queryKey: [artistKeys.all, params],
    queryFn: () => artistApi.getAll(params), // Admin dùng chung API get list nhưng có param active/inactive
  });
};
export const useClientGetArtists = (params: ArtistFilterParams) => {
  return useQuery({
    queryKey: [artistKeys.all, params],
    queryFn: () => artistApi.getAll(params), // Admin dùng chung API get list nhưng có param active/inactive
  });
};

export const useAdminCreateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ArtistFormValues) => artistApi.adminCreate(data),
    onSuccess: () => {
      toast.success("Tạo nghệ sĩ mới thành công");
      queryClient.invalidateQueries({ queryKey: [artistKeys.all] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi tạo nghệ sĩ"),
  });
};

export const useAdminUpdateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ArtistFormValues>;
    }) => artistApi.adminUpdate(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: [artistKeys.all] });
      queryClient.invalidateQueries({ queryKey: [artistKeys.detail] }); // Refresh trang detail nếu đang mở
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi cập nhật"),
  });
};

export const useAdminToggleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: artistApi.adminToggleStatus,
    onSuccess: () => {
      toast.success("Đã thay đổi trạng thái");
      queryClient.invalidateQueries({ queryKey: [artistKeys.all] });
    },
    onError: () => toast.error("Có lỗi xảy ra"),
  });
};

export const useAdminDeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: artistApi.adminDelete,
    onSuccess: () => {
      toast.success("Đã xóa vĩnh viễn nghệ sĩ");
      queryClient.invalidateQueries({ queryKey: [artistKeys.all] });
    },
    onError: () => toast.error("Lỗi xóa nghệ sĩ"),
  });
};

// ==========================================
// 3. ARTIST HOOKS (Dùng cho trang Studio)
// ==========================================

export const useMyArtistProfile = () => {
  return useQuery({
    queryKey: ["my-artist-profile"],
    queryFn: artistApi.getMyProfile,
    retry: 1,
  });
};

export const useUpdateMyArtistProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ArtistFormValues) => artistApi.updateMyProfile(data),
    onSuccess: () => {
      toast.success("Hồ sơ của bạn đã được cập nhật");
      queryClient.invalidateQueries({ queryKey: ["my-artist-profile"] });
      queryClient.invalidateQueries({ queryKey: [artistKeys.detail] }); // Update trang public
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi cập nhật"),
  });
};
