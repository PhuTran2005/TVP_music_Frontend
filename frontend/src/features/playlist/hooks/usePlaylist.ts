import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import playlistApi from "../api/playlistApi";
import type { PlaylistFilterParams } from "@/features/playlist/types";

// Key Constants
const KEYS = {
  LIST: "playlists",
  MY_LIST: "my-playlists",
  DETAIL: "playlist-detail",
};

// --- QUERIES (Giữ nguyên) ---
export const usePlaylists = (params: PlaylistFilterParams) => {
  return useQuery({
    queryKey: [KEYS.LIST, params],
    queryFn: () => playlistApi.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useMyPlaylists = () => {
  return useQuery({
    queryKey: [KEYS.MY_LIST],
    queryFn: playlistApi.getMyPlaylists,
  });
};

export const usePlaylistDetail = (id: string) => {
  return useQuery({
    queryKey: [KEYS.DETAIL, id],
    queryFn: () => playlistApi.getDetail(id),
    enabled: !!id,
  });
};

// --- PLAYLIST MUTATIONS (Giữ nguyên) ---
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: playlistApi.create,
    onSuccess: () => {
      toast.success("Tạo playlist thành công!");
      queryClient.invalidateQueries({ queryKey: [KEYS.MY_LIST] });
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi tạo playlist"),
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      playlistApi.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: [KEYS.DETAIL, id] });
      queryClient.invalidateQueries({ queryKey: [KEYS.MY_LIST] });
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] }); // Refresh cả list public nếu cần
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi cập nhật"),
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: playlistApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa playlist");
      queryClient.invalidateQueries({ queryKey: [KEYS.MY_LIST] });
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi xóa playlist"),
  });
};

// --- 🔥 TRACK ACTIONS (ĐÃ CẢI TIẾN) ---

// 1. Cải tiến: Nhận mảng trackIds để hỗ trợ Bulk Add
export const useAddTracksToPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playlistId,
      trackIds, // 🔥 Đổi từ trackId sang trackIds[]
    }: {
      playlistId: string;
      trackIds: string[];
    }) => playlistApi.addTracks(playlistId, trackIds), // API phải hỗ trợ nhận mảng
    onSuccess: (_, { playlistId, trackIds }) => {
      const msg =
        trackIds.length > 1
          ? `Đã thêm ${trackIds.length} bài hát`
          : "Đã thêm vào playlist";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: [KEYS.DETAIL, playlistId] });
    },
    onError: (err: any) =>
      // toast.error(err.response?.data?.message || "Không thể thêm bài hát")
      console.log(err),
  });
};

// 2. Giữ nguyên: Xóa 1 bài (Thường xoá từng dòng nên không cần bulk)
export const useRemoveTrackFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 🔥 Mutation nhận vào mảng trackIds
    mutationFn: ({
      playlistId,
      trackIds,
    }: {
      playlistId: string;
      trackIds: string[];
    }) => playlistApi.removeTracks(playlistId, trackIds),

    onSuccess: (_, { playlistId, trackIds }) => {
      // Thông báo thông minh
      const msg =
        trackIds.length > 1
          ? `Đã xóa ${trackIds.length} bài hát`
          : "Đã xóa bài hát khỏi playlist";

      toast.success(msg);
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail", playlistId],
      });
    },
    onError: (err: any) => toast.error(err.message),
  });
};

// 3. 🔥 Mới: Reorder Tracks (Kéo thả sắp xếp)
// Cái này rất quan trọng cho Playlist
export const useReorderPlaylistTracks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playlistId,
      rangeStart,
      insertBefore,
    }: {
      playlistId: string;
      rangeStart: number;
      insertBefore: number;
    }) => playlistApi.reorderTracks(playlistId, rangeStart, insertBefore),

    // Optimistic Update (Nâng cao): Cập nhật UI ngay lập tức trước khi API trả về
    onMutate: async ({ playlistId, rangeStart, insertBefore }) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.DETAIL, playlistId] });
      const previousPlaylist = queryClient.getQueryData([
        KEYS.DETAIL,
        playlistId,
      ]);

      // Logic update cache thủ công ở đây nếu muốn UI mượt (hoặc bỏ qua chờ onSuccess)
      return { previousPlaylist };
    },

    onSuccess: (_, { playlistId }) => {
      // Không cần toast success cho thao tác kéo thả vì nó xảy ra liên tục
      queryClient.invalidateQueries({ queryKey: [KEYS.DETAIL, playlistId] });
    },
    onError: (err: any, { playlistId }, context) => {
      // Nếu lỗi thì rollback lại thứ tự cũ
      if (context?.previousPlaylist) {
        queryClient.setQueryData(
          [KEYS.DETAIL, playlistId],
          context.previousPlaylist
        );
      }
      toast.error("Lỗi khi sắp xếp bài hát");
    },
  });
};
