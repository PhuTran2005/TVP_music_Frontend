import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Heart,
  MoreHorizontal,
  Share2,
  AlertCircle,
  ListMusic,
  Plus,
  Music4,
  Loader2, // 🔥 Thêm icon Loading
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlbumDetailSkeleton } from "@/features/album/components/AlbumDetailSkeleton";
import { TrackList } from "@/features/track/components/TrackList";

// Hooks & Redux
import { useAlbumDetail } from "@/features/album/hooks/useAlbumsQuery";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features";
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

const AlbumDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  // --- 1. UI STATES ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false); // 🔥 State quản lý xoay icon Play
  const dispatch = useAppDispatch(); // Bật comment khi đã sẵn sàng nối vào Player

  // --- 2. DATA FETCHING ---
  const { data: album, isLoading, isError } = useAlbumDetail(slug!);

  // Lấy danh sách tracks từ album (Fall back về mảng rỗng nếu chưa có)
  const tracks = useMemo(() => album?.tracks || [], [album]);

  // --- 3. THEME & STYLING ---
  const themeColor = useMemo(() => album?.themeColor || "#5b21b6", [album]);

  // --- 4. UX: Cuộn trang kích hoạt Sticky Nav ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 5. LOGIC PLAY NHẠC ---
  const handlePlayAlbum = async () => {
    if (tracks.length === 0) {
      toast.error("Đĩa nhạc này hiện chưa có bài hát nào!");
      return;
    }

    setIsLoadingPlay(true);
    try {
      // 1. Dispatch vào Redux Queue
      dispatch(setQueue({ tracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      // 2. Giả lập delay một chút để UI thể hiện sự "Nạp dữ liệu" mượt mà
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success(`Đang phát ${tracks.length} bài hát của Album.`);
    } catch (err) {
      toast.error("Không thể phát nhạc lúc này. Vui lòng thử lại.");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  // --- 6. HELPERS ---
  const titleClass = useMemo(() => {
    if (!album?.title) return "";
    const len = album.title.length;
    if (len > 35) return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
    if (len > 15) return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";
    return "text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem]";
  }, [album?.title]);

  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : undefined;
  };

  // --- RENDER STATES ---
  if (isLoading) return <AlbumDetailSkeleton />;
  if (isError || !album)
    return <AlbumErrorState onBack={() => navigate("/albums")} />;

  const totalMinutes = Math.floor((album.totalDuration || 0) / 60);

  return (
    <div className="relative min-h-screen bg-background text-foreground animate-in fade-in duration-1000 overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* ================= LAYER 1: DYNAMIC GRADIENT BACKDROP ================= */}
      <div
        className="absolute inset-0 h-[65vh] pointer-events-none transition-all duration-1000 ease-out opacity-100 dark:opacity-60 mix-blend-multiply dark:mix-blend-normal"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(themeColor, 0.7)} 0%, ${hexToRgba(themeColor, 0.2)} 50%, hsl(var(--background)) 100%)`,
        }}
      />
      <div className="absolute inset-0 h-[65vh] bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

      {/* ================= LAYER 2: CONTENT ================= */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 pb-32">
        {/* --- 1. HERO SECTION (Immersive Layout) --- */}
        <header className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 pt-24 pb-8 md:pt-32 md:pb-10">
          <div className="group relative shrink-0">
            <div
              className="absolute inset-0 blur-2xl rounded-lg scale-110 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
              style={{ backgroundColor: themeColor }}
            />
            <div className="relative size-[220px] sm:size-[260px] md:size-[300px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.02] bg-muted border border-border/10 overflow-hidden">
              <img
                src={album.coverImage || "/images/default-album.png"}
                alt={album.title}
                className="size-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent rounded-xl pointer-events-none mix-blend-overlay" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 w-full min-w-0">
            <Badge className="uppercase text-[10px] font-black tracking-[0.2em] px-3 py-1 bg-background/50 backdrop-blur-md text-foreground border-border/50 shadow-sm hidden md:inline-flex">
              {album.type || "Album"}
            </Badge>

            <h1
              className={cn(
                "font-black tracking-tighter leading-[1.05] drop-shadow-2xl text-foreground",
                titleClass,
              )}
            >
              {album.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-1 text-[13px] font-bold text-foreground mt-2">
              <div
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer mr-2 group/artist"
                onClick={() => navigate(`/artist/${album.artist?.slug}`)}
              >
                <Avatar className="size-7 border-[1.5px] border-background shadow-sm">
                  <AvatarImage src={album.artist?.avatar} />
                  <AvatarFallback className="text-[10px] font-black bg-primary/20 text-primary">
                    {album.artist?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-black group-hover:underline underline-offset-4 decoration-2">
                  {album.artist?.name || "Unknown Artist"}
                </span>
              </div>

              <span className="text-muted-foreground/60 hidden sm:inline">
                •
              </span>
              <span className="opacity-90">{album.releaseYear}</span>

              <span className="text-muted-foreground/60 hidden sm:inline">
                •
              </span>
              <span className="opacity-90">
                {album.totalTracks} bài hát,{" "}
                <span className="text-muted-foreground ml-1 font-medium">
                  {totalMinutes} phút
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* --- 2. DYNAMIC STICKY ACTION BAR --- */}
        <div className="sticky top-[64px] z-40 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 mb-6 flex items-center justify-between bg-background/85 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* 🔥 Nút Play Kèm Loading */}
            <Button
              size="icon"
              onClick={handlePlayAlbum}
              disabled={isLoadingPlay}
              className="size-14 sm:size-16 rounded-full text-primary-foreground shadow-xl active:scale-90 transition-all hover:scale-105 group"
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

            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSaved(!isSaved)}
                className="text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full size-11 sm:size-12 active:scale-90 transition-all"
              >
                <Heart
                  className={cn(
                    "size-7 sm:size-8 transition-all duration-300",
                    isSaved && "fill-emerald-500 text-emerald-500 scale-110",
                  )}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full size-11 sm:size-12 transition-colors"
                  >
                    <MoreHorizontal className="size-7 sm:size-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
                >
                  <DropdownMenuItem className="gap-3 py-3 font-semibold text-sm rounded-xl cursor-pointer">
                    <Plus className="size-4" /> Thêm vào Playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 py-3 font-semibold text-sm rounded-xl cursor-pointer">
                    <ListMusic className="size-4" /> Thêm vào hàng đợi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem className="gap-3 py-3 font-semibold text-sm rounded-xl cursor-pointer text-primary focus:text-primary focus:bg-primary/10">
                    <Share2 className="size-4" /> Chia sẻ Album
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mini Album Info */}
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-500 transform pointer-events-none origin-right",
              isScrolled
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-95 translate-x-4",
            )}
          >
            <span className="font-bold text-sm hidden md:block truncate max-w-[150px] lg:max-w-[250px]">
              {album.title}
            </span>
            <div className="size-10 sm:size-11 rounded-md overflow-hidden shadow-sm border border-border/40 shrink-0">
              <img
                src={album.coverImage}
                alt=""
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- 3. TRACKLIST SECTION --- */}
        <div className="bg-background/40 rounded-2xl backdrop-blur-sm -mx-2 sm:mx-0 overflow-hidden">
          {tracks.length > 0 ? (
            <TrackList tracks={tracks} isLoading={isLoading} />
          ) : (
            <AlbumEmptyState />
          )}
        </div>

        {/* --- 4. FOOTER CREDITS --- */}
        {tracks.length > 0 && (
          <footer className="mt-20 pt-8 border-t border-border/30 flex flex-col gap-4 text-xs text-muted-foreground/70 font-medium pb-10">
            <div className="flex items-center gap-2">
              <span className="text-foreground/90 font-bold uppercase tracking-widest text-[10px]">
                {new Date(album.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] uppercase tracking-wider">
              <p>
                © {album.releaseYear} {album.artist?.name} Studio. All rights
                reserved.
              </p>
              <p>
                ℗ {album.releaseYear} {album.artist?.name} Official Records.
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

// ================= SUB-COMPONENTS =================
// (Các component AlbumEmptyState và AlbumErrorState giữ nguyên như cũ của bạn)

const AlbumEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[400px] gap-6 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
    <div className="p-6 bg-muted/30 rounded-full border border-dashed border-muted-foreground/20">
      <Music4 className="size-12 text-muted-foreground/40" />
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-xl font-black uppercase tracking-widest text-foreground">
        Chưa có bài hát
      </h3>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
        Đĩa nhạc này hiện tại chưa có bài hát nào. Nghệ sĩ có thể đang trong quá
        trình cập nhật.
      </p>
    </div>
  </div>
);

const AlbumErrorState = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-6 bg-background animate-in zoom-in-95 duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-destructive/20 blur-[100px] rounded-full scale-150" />
      <div className="size-32 rounded-full bg-background border-4 border-muted flex items-center justify-center relative z-10 shadow-2xl">
        <AlertCircle className="size-12 text-muted-foreground" />
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
        Không tìm thấy Đĩa nhạc
      </h2>
      <p className="text-muted-foreground text-base max-w-md mx-auto font-medium leading-relaxed">
        Đĩa nhạc bạn tìm kiếm không tồn tại, đã bị xóa hoặc được chuyển về chế
        độ riêng tư.
      </p>
    </div>
    <Button
      variant="secondary"
      onClick={onBack}
      className="rounded-full px-10 h-12 font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform"
    >
      Quay lại Thư viện
    </Button>
  </div>
);

export default AlbumDetailPage;
