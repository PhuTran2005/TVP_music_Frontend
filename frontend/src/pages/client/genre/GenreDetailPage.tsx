import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Shuffle,
  MoreHorizontal,
  ChevronRight,
  Share2,
  SearchX,
  Loader2,
  Music4,
} from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner"; // Hoặc thư viện Toast bạn dùng

import { useGenreDetail } from "@/features/genre/hooks/useGenre";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { SubGenreGrid } from "@/features/genre/components/SubGenreGrid";
import { TrackList } from "@/features/track/components/TrackList";
import { usePublicTracks } from "@/features/track/hooks/useTracksQuery";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features";

// Import Redux Actions (Giả định)
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

dayjs.extend(relativeTime);

export const GenreDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  // --- 1. UI STATE ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);

  // --- 2. DATA FETCHING ---
  const {
    data: genreRes,
    isLoading: loadingGenre,
    error,
  } = useGenreDetail(slug!);
  const genre = genreRes?.data;

  // Fetch bài hát thuộc thể loại (1 trang đầu tiên để lấy bài nổi bật)
  const { data: tracksRes, isLoading: loadingTracks } = usePublicTracks({
    genreId: genre?._id || "",
    limit: 50, // Lấy nhiều một chút để đưa vào Queue nghe cho đã
    sort: "popular",
    page: 1,
  });
  const tracks = tracksRes?.tracks || [];
  const dispatch = useAppDispatch(); // Đặt ở đây để tránh lỗi hook trong điều kiện (nếu có)
  // --- 3. SCROLL EFFECT ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 280);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 4. COLORS & HELPERS ---
  const themeColor = useMemo(() => genre?.color || "#8b5cf6", [genre]);

  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : undefined;
  };

  // --- 5. ACTION HANDLERS ---
  const handlePlayGenre = async () => {
    if (!tracks || tracks.length === 0) {
      toast.error("Thể loại này hiện chưa có bài hát nào!");
      return;
    }

    setIsLoadingPlay(true);
    try {
      // Logic Redux thực tế:
      dispatch(setQueue({ tracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      // Giả lập delay mạng để thấy hiệu ứng loading đẹp mắt
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`Đang phát ${tracks.length} bài hát nổi bật.`);
    } catch (err) {
      toast.error("Không thể phát nhạc lúc này.");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  const handleShuffleGenre = async () => {
    // Tương tự handlePlayGenre nhưng random mảng tracks trước khi dispatch
    toast.success("Phát ngẫu nhiên danh sách.");
  };

  // --- 6. RENDER STATES ---
  if (loadingGenre) return <GenreDetailSkeleton />;
  if (error || !genre)
    return <GenreNotFound onBack={() => navigate("/genres")} />;

  return (
    <div className="relative min-h-screen bg-background text-foreground animate-in fade-in duration-1000 overflow-x-hidden selection:bg-primary/30 selection:text-primary pb-32">
      {/* ================= LAYER 1: VIBRANT BACKDROP ================= */}
      <div
        className="absolute inset-0 h-[65vh] pointer-events-none transition-all duration-1000 ease-out opacity-100 dark:opacity-60 mix-blend-multiply dark:mix-blend-normal"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(themeColor, 0.7)} 0%, ${hexToRgba(themeColor, 0.1)} 60%, hsl(var(--background)) 100%)`,
        }}
      />
      <div className="absolute inset-0 h-[65vh] bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

      {/* ================= LAYER 2: CONTENT ================= */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
        {/* --- 1. HERO SECTION --- */}
        <header className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 pt-24 pb-8 md:pt-32 md:pb-10">
          {/* Cover Art */}
          <div className="group relative shrink-0">
            <div
              className="absolute inset-0 blur-2xl rounded-lg scale-110 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
              style={{ backgroundColor: themeColor }}
            />
            <div className="relative size-[200px] sm:size-[240px] md:size-[280px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-muted border border-border/10 transition-transform duration-500 group-hover:scale-[1.02]">
              {genre.image ? (
                <ImageWithFallback
                  src={genre.image}
                  alt={genre.name}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <Music4 className="size-20 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>

          {/* Genre Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 w-full min-w-0">
            <Badge className="uppercase text-[10px] font-black tracking-[0.2em] px-3 py-1 bg-background/50 backdrop-blur-md text-foreground border-border/50 shadow-sm hidden md:inline-flex">
              Thể loại
            </Badge>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-foreground leading-[1.05] drop-shadow-xl line-clamp-2">
              {genre.name}
            </h1>

            <p className="text-muted-foreground text-[14px] md:text-[15px] font-medium line-clamp-2 max-w-2xl mt-1">
              {genre.description ||
                `Khám phá những giai điệu và nghệ sĩ đỉnh nhất thuộc dòng nhạc ${genre.name}.`}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-1.5 mt-2 text-[13px] font-bold text-foreground">
              <span className="opacity-90">
                {new Intl.NumberFormat("vi-VN").format(genre.trackCount || 0)}{" "}
                Bài hát
              </span>
              {(genre.artistCount ?? 0) > 0 && (
                <>
                  <span className="text-muted-foreground/60 hidden sm:inline">
                    •
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {new Intl.NumberFormat("vi-VN").format(
                      genre.artistCount || 0,
                    )}{" "}
                    Nghệ sĩ
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* --- 2. DYNAMIC STICKY ACTION BAR --- */}
        <div className="sticky top-[64px] z-40 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 mb-8 flex items-center justify-between bg-background/85 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Primary Action: Play */}
            <Button
              size="icon"
              disabled={isLoadingPlay}
              onClick={handlePlayGenre}
              className="size-14 sm:size-16 rounded-full text-primary-foreground shadow-xl active:scale-90 transition-all hover:scale-105 group shrink-0"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 10px 30px -10px ${hexToRgba(themeColor, 0.6)}`,
              }}
            >
              {isLoadingPlay ? (
                <Loader2 className="size-7 sm:size-8 animate-spin" />
              ) : (
                <Play className="size-7 sm:size-8 fill-current ml-1.5 group-hover:scale-110 transition-transform" />
              )}
            </Button>

            {/* Secondary: Shuffle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShuffleGenre}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full size-11 sm:size-12 active:scale-90 transition-all hidden sm:flex"
            >
              <Shuffle className="size-6 sm:size-7" />
            </Button>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full size-11 sm:size-12 transition-colors ml-1"
                >
                  <MoreHorizontal className="size-7 sm:size-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
              >
                <DropdownMenuItem className="gap-3 py-3 font-semibold text-sm rounded-xl cursor-pointer">
                  <Share2 className="size-4" /> Chia sẻ Thể loại
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 🔥 Mini Header Title (Fades in on scroll) */}
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-500 transform pointer-events-none origin-right",
              isScrolled
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-95 translate-x-4",
            )}
          >
            <span className="font-bold text-sm hidden md:block truncate max-w-[150px] lg:max-w-[250px]">
              {genre.name}
            </span>
            <div className="size-10 sm:size-11 rounded-md overflow-hidden shadow-sm border border-border/40 shrink-0 bg-muted flex items-center justify-center">
              {genre.image ? (
                <img
                  src={genre.image}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Music4 className="size-5 text-muted-foreground/50" />
              )}
            </div>
          </div>
        </div>

        {/* --- 3. MAIN CONTENT (SUB-GENRES & TRACKS) --- */}
        <div className="space-y-14">
          {/* A. Thể loại con (Nếu có) */}
          {genre.subGenres && genre.subGenres.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
                  Phân nhánh của {genre.name}
                  <ChevronRight className="size-6 text-muted-foreground mt-0.5" />
                </h2>
              </div>
              <SubGenreGrid genres={genre.subGenres} />
            </section>
          )}

          {/* B. Tracklist (Giao diện bảng) */}
          <section className="bg-background/40 rounded-2xl backdrop-blur-sm -mx-2 sm:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-center justify-between mb-4 px-2 sm:px-4 pt-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Bài hát nổi bật
              </h2>
            </div>

            {/* Hiển thị TrackList. Đảm bảo component TrackList của bạn xử lý tốt trạng thái empty nếu không có nhạc */}
            <TrackList tracks={tracks} isLoading={loadingTracks} />
          </section>
        </div>
      </div>
    </div>
  );
};

// ================= SUB-COMPONENTS =================

const GenreDetailSkeleton = () => (
  <div className="min-h-screen bg-background pb-32">
    <div className="h-[60vh] w-full bg-muted/20 animate-pulse relative">
      <div className="absolute bottom-0 w-full px-4 md:px-8 pb-10 container mx-auto flex flex-col md:flex-row items-center md:items-end gap-10">
        <Skeleton className="size-52 sm:size-60 md:size-[280px] rounded-2xl shrink-0 shadow-2xl" />
        <div className="flex-1 space-y-4 w-full text-center md:text-left">
          <Skeleton className="h-6 w-24 mx-auto md:mx-0 rounded-full" />
          <Skeleton className="h-16 sm:h-20 md:h-24 w-full max-w-xl mx-auto md:mx-0" />
          <Skeleton className="h-6 w-3/4 max-w-md mx-auto md:mx-0" />
        </div>
      </div>
    </div>
    <div className="container mx-auto mt-8 space-y-8 px-4 md:px-8">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="size-12 rounded-full hidden sm:block" />
        <Skeleton className="size-12 rounded-full" />
      </div>
      <Skeleton className="h-96 w-full rounded-3xl opacity-50" />
    </div>
  </div>
);

const GenreNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-6 bg-background animate-in zoom-in-95 duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full scale-150" />
      <div className="size-32 rounded-full bg-background border-4 border-muted flex items-center justify-center relative z-10 shadow-2xl">
        <SearchX className="size-12 text-muted-foreground" />
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
        Không tìm thấy Thể loại
      </h2>
      <p className="text-muted-foreground text-base max-w-md mx-auto font-medium leading-relaxed">
        Dòng nhạc bạn tìm kiếm có thể đã bị xóa hoặc đường dẫn không hợp lệ. Vui
        lòng quay lại trang chủ thể loại.
      </p>
    </div>
    <Button
      variant="secondary"
      onClick={onBack}
      className="rounded-full px-10 h-12 font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform"
    >
      Khám phá Thể loại khác
    </Button>
  </div>
);

export default GenreDetailPage;
