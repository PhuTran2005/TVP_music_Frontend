import React from "react";
import { Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";
import { toast } from "sonner"; // Hoặc thư viện Toast bạn dùng

// Components
import { PublicPlaylistFilter } from "@/features/playlist/components/PublicPlaylistFilter";
import PublicPlaylistCard from "@/features/playlist/components/PublicPlaylistCard";
import MusicResult from "@/components/ui/Result";
import Pagination from "@/utils/pagination";
import CardSkeleton from "@/components/ui/CardSkeleton";

// Hooks & Types
import { usePlaylistParams } from "@/features/playlist/hooks/usePlaylistParams";
import { usePlaylistsQuery } from "@/features/playlist/hooks/usePlaylistsQuery";
import playlistApi from "@/features/playlist/api/playlistApi";
import { playlistKeys } from "@/features/playlist/utils/playlistKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features";

// Thay thế bằng hook Redux của bạn để play nhạc
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

const PlaylistPage = () => {
  // const dispatch = useAppDispatch();
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = usePlaylistParams(24);
  const { data, isLoading, isError } = usePlaylistsQuery(filterParams);

  const playlists = data?.playlists || [];
  const meta = data?.meta || {
    totalPages: 1,
    totalItems: 0,
    page: 1,
    pageSize: 24,
  };

  // 🔥 LOGIC PHÁT NHẠC XUYÊN XUYÊN SUỐT
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const handlePlayPlaylist = async (playlistId: string) => {
    try {
      // 2. Thay thế gọi API trực tiếp bằng fetchQuery
      const res = await queryClient.fetchQuery({
        queryKey: playlistKeys.detail(playlistId),
        queryFn: () => playlistApi.getById(playlistId),
        // Cache 2 phút. Nếu user bấm Play lại trong 2 phút, nhạc phát ngay lập tức không cần đợi
        staleTime: 1000 * 60 * 2,
      });

      // Lưu ý: Tùy vào cấu trúc API của bạn (res.data hay res.data.tracks)
      const tracks = res.data?.tracks;

      // 3. Chặn nếu rỗng
      if (!tracks || tracks.length === 0) {
        toast.error("Danh sách phát này chưa có bài hát nào!");
        return;
      }

      // 4. Dispatch vào Trình phát nhạc
      dispatch(setQueue({ tracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      toast.success(`Đang phát ${tracks.length} bài hát.`);
    } catch (error) {
      toast.error("Lỗi kết nối. Không thể phát nhạc lúc này.");
      throw error; // Ném lỗi để Component Con tắt vòng Loading
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="min-h-[70vh] flex items-center justify-center ">
          <MusicResult
            status="error"
            title="Không thể tải danh sách Playlist"
            description="Đã có lỗi xảy ra từ máy chủ. Vui lòng kiểm tra đường truyền và thử lại."
            secondaryAction={{
              label: "Tải lại trang",
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24">
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-primary/10 via-background/80 to-background pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="container mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex flex-col gap-3 max-w-2xl animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="size-3.5" />
            <span>Khám phá</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Danh sách phát
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium">
            Lựa chọn hoàn hảo cho mọi tâm trạng. Khám phá những playlist được
            yêu thích nhất từ cộng đồng.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 sm:px-6 space-y-8">
        {/* FILTERS */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 py-2 transition-all">
          <PublicPlaylistFilter
            params={filterParams}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onReset={clearFilters}
          />
        </div>

        {/* GRID */}
        <div className="min-h-[50vh]">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              <CardSkeleton count={meta.pageSize} />
            </div>
          ) : playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center  bg-card rounded-3xl border border-dashed border-border shadow-sm animate-in fade-in duration-500">
              <MusicResult
                status="empty"
                title="Chưa có danh sách phát"
                description={
                  filterParams.keyword
                    ? `Không có kết quả nào phù hợp với tìm kiếm "${filterParams.keyword}".`
                    : "Hiện tại hệ thống chưa có danh sách phát nào thỏa mãn điều kiện này."
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {playlists.map((playlist, index) => (
                <div
                  key={playlist._id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-in zoom-in-95 fade-in duration-500 fill-mode-both"
                >
                  <PublicPlaylistCard
                    playlist={playlist}
                    // 🔥 Truyền hàm Play xuống
                    onPlay={() => handlePlayPlaylist(playlist._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {!isLoading && playlists.length > 0 && (
          <div className="pt-6">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
              totalItems={meta.totalItems}
              itemsPerPage={meta.pageSize || APP_CONFIG.PAGINATION_LIMIT}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default PlaylistPage;
