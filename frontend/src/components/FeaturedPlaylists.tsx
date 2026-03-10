import { Music2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner"; // Hoặc thư viện toast dự án đang dùng
import { useQueryClient } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import PublicPlaylistCard from "@/features/playlist/components/PublicPlaylistCard";
import { Playlist } from "@/features/playlist/types";
import { SectionHeader } from "@/pages/client/home/SectionHeader";
import { HorizontalScroll } from "@/pages/client/home/HorizontalScroll";

// Hooks & API
import { useFeaturedPlaylists } from "@/features/playlist/hooks/usePlaylistsQuery";
import playlistApi from "@/features/playlist/api/playlistApi";
import { playlistKeys } from "@/features/playlist/utils/playlistKeys";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features";

// Redux (Mở comment khi bạn đã sẵn sàng nối vào Player)
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

export function FeaturedPlaylists() {
  const { data: playlists, isLoading } = useFeaturedPlaylists(6); // Sửa thành 6 để chẵn Grid Desktop
  const queryClient = useQueryClient();
  // const dispatch = useAppDispatch();
  const dispatch = useAppDispatch(); // Bật comment khi đã sẵn sàng nối vào Player

  // 🔥 LOGIC PHÁT NHẠC (Sẽ được truyền xuống PublicPlaylistCard)
  const handlePlayPlaylist = async (playlistId: string) => {
    try {
      // 1. Fetch chi tiết Playlist để lấy mảng tracks (Sử dụng Cache để tối ưu)
      const res = await queryClient.fetchQuery({
        queryKey: playlistKeys.detail(playlistId),
        queryFn: () => playlistApi.getById(playlistId),
        staleTime: 1000 * 60 * 5, // Cache 5 phút
      });

      const tracks = res.data?.tracks; // Tùy thuộc vào cấu trúc trả về của API

      // 2. Chặn nếu Playlist rỗng
      if (!tracks || tracks.length === 0) {
        toast.error("Danh sách phát này hiện chưa có bài hát nào!");
        return;
      }

      // 3. Đưa vào Queue và Phát (Redux)
      dispatch(setQueue({ tracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      // Giả lập độ trễ mạng xíu để UI kịp hiện vòng Loading (có thể bỏ đi khi lên Prod)
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success(`Đang phát ${tracks.length} bài hát của Danh sách phát.`);
    } catch (error) {
      toast.error("Lỗi tải nhạc. Vui lòng thử lại sau.");
      // Ném lỗi ra để PublicPlaylistCard biết đường tắt vòng xoay Loading
      throw error;
    }
  };

  return (
    // 🔥 bg-muted/20 xen kẽ để tạo nhịp điệu (Rhythm) cho trang
    <section className="py-16 lg:py-24 bg-muted/20 border-b border-border/40 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12">
          <SectionHeader
            icon={<Music2 className="w-4 h-4" />}
            label="Curated"
            title="Featured Playlists"
            description="Playlist được tuyển chọn cho mọi cảm xúc."
            viewAllHref="/playlists"
          />
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="relative">
            {/* ================= MOBILE HORIZONTAL SCROLL ================= */}
            <div className="lg:hidden -mx-4 px-4">
              <HorizontalScroll>
                {playlists?.map((pl: Playlist) => (
                  <div
                    key={pl._id}
                    className="snap-start shrink-0 w-[260px] sm:w-[300px] first:pl-0 last:pr-4"
                  >
                    <PublicPlaylistCard
                      playlist={pl}
                      // 🔥 TRUYỀN HÀM PLAY XUỐNG ĐÂY
                      onPlay={() => handlePlayPlaylist(pl._id)}
                    />
                  </div>
                ))}
              </HorizontalScroll>
            </div>

            {/* ================= DESKTOP GRID ================= */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="hidden lg:grid grid-cols-5 xl:grid-cols-6 gap-6 xl:gap-8"
            >
              {playlists?.map((pl: Playlist) => (
                <PublicPlaylistCard
                  key={pl._id}
                  playlist={pl}
                  // 🔥 TRUYỀN HÀM PLAY XUỐNG ĐÂY
                  onPlay={() => handlePlayPlaylist(pl._id)}
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <>
      <div className="flex gap-4 overflow-hidden lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-[260px] shrink-0 space-y-3">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
      <div className="hidden lg:grid grid-cols-5 xl:grid-cols-6 gap-6 xl:gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    </>
  );
}
