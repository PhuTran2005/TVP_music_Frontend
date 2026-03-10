import { Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner"; // Hoặc thư viện toast bạn đang dùng
import { useQueryClient } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import PublicAlbumCard from "@/features/album/components/PublicAlbumCard";
import { Album } from "@/features/album/types";
import { SectionHeader } from "@/pages/client/home/SectionHeader";
import { HorizontalScroll } from "@/pages/client/home/HorizontalScroll";

// Hooks & API
import { useFeatureAlbums } from "@/features/album/hooks/useAlbumsQuery";
import albumApi from "@/features/album/api/albumApi";
import { albumKeys } from "@/features/album/utils/albumKeys";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features";

// Redux (Mở comment khi bạn đã sẵn sàng nối vào Player)
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

export function FeaturedAlbums() {
  const { data: albums, isLoading } = useFeatureAlbums(6); // Lấy 6 cái để chẵn grid Desktop
  console.log("Featured Albums:", albums, "Loading:", isLoading);
  const queryClient = useQueryClient();
  // const dispatch = useAppDispatch();
  const dispatch = useAppDispatch(); // Bật comment khi đã sẵn sàng nối vào Player
  // 🔥 LOGIC PHÁT NHẠC (Sẽ được truyền xuống PublicAlbumCard)
  const handlePlayAlbum = async (albumId: string) => {
    try {
      // 1. Fetch chi tiết Album để lấy mảng tracks (Có Cache để lần sau bấm không bị trễ)
      const res = await queryClient.fetchQuery({
        queryKey: albumKeys.detail(albumId),
        queryFn: () => albumApi.getById(albumId),
        staleTime: 1000 * 60 * 5, // Cache 5 phút
      });

      const tracks = res.data?.tracks; // Tùy thuộc vào cấu trúc trả về của API

      // 2. Chặn nếu Album rỗng
      if (!tracks || tracks.length === 0) {
        toast.error("Album này hiện chưa có bài hát nào!");
        return;
      }

      // 3. Đưa vào Queue và Phát (Redux)
      dispatch(setQueue({ tracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      // Giả lập độ trễ mạng xíu để UI kịp hiện xoay xoay (bỏ đi khi lên Production nếu API chậm sẵn)
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success(`Đang phát ${tracks.length} bài hát của Album.`);
    } catch (error) {
      toast.error("Lỗi tải nhạc. Vui lòng thử lại sau.");
      // Ném lỗi ra để PublicAlbumCard biết đường tắt vòng xoay Loading
      throw error;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-background border-b border-border/40 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12">
          <SectionHeader
            icon={<Disc3 className="w-4 h-4" />}
            label="Selection"
            title="Featured Albums"
            description="Album nổi bật được biên tập chọn lọc."
            viewAllHref="/albums"
          />
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="relative">
            {/* ================= MOBILE SCROLL ================= */}
            <div className="lg:hidden -mx-4 px-4">
              <HorizontalScroll>
                {albums?.map((album: Album) => (
                  <div
                    key={album._id}
                    className="snap-start shrink-0 w-[260px] sm:w-[300px] first:pl-0 last:pr-4"
                  >
                    <PublicAlbumCard
                      album={album}
                      // Truyền hàm play xuống Card
                      onPlay={() => handlePlayAlbum(album._id)}
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
              {albums?.map((album: Album) => (
                <PublicAlbumCard
                  key={album._id}
                  album={album}
                  // Truyền hàm play xuống Card
                  onPlay={() => handlePlayAlbum(album._id)}
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 xl:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-[18px]" />
          <Skeleton className="h-4 w-3/4 rounded-full" />
          <Skeleton className="h-3 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}
