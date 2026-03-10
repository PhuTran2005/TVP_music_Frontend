import React, { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  BadgeCheck,
  MoreHorizontal,
  Globe,
  Instagram,
  Youtube,
  Disc3,
  TrendingUp,
  MapPin,
  Share2,
  Heart,
  Music,
  ChevronRight,
  Info,
  AlertCircle,
  Facebook,
  Mic2,
  Camera,
  Music4,
  Loader2, // 🔥 Icon xoay
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import PublicAlbumCard from "@/features/album/components/PublicAlbumCard";
import { TrackList } from "@/features/track/components/TrackList";
import { Album } from "@/features/album/types";
import { useArtistDetail } from "@/features/artist/hooks/useArtistsQuery";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features";

const ArtistDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔥 Thêm State Loading cho nút Play
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);

  // --- API ---
  const { data: artistData, isLoading, isError } = useArtistDetail(slug!);
  const artist = artistData?.artist;
  const topTracks = artistData?.topTracks || [];
  const albums = artistData?.albums || [];

  // Theme màu chủ đạo với Fallback mượt mà
  const themeColor = useMemo(() => artist?.themeColor || "#3b82f6", [artist]);

  // --- UX: Cuộn trang kích hoạt Sticky Nav ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGIC PHÁT NHẠC ---
  const handlePlayArtist = async () => {
    if (!topTracks || topTracks.length === 0) {
      toast.error("Nghệ sĩ này hiện chưa có bài hát nổi bật nào!");
      return;
    }

    setIsLoadingPlay(true);
    try {
      // 1. Đưa danh sách Top Tracks vào hàng đợi và phát
      dispatch(setQueue({ tracks: topTracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      // Giả lập độ trễ để thấy hiệu ứng loading
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(
        `Đang phát Top ${topTracks.length} bài hát của ${artist.name}.`,
      );
    } catch (error) {
      toast.error("Lỗi phát nhạc. Vui lòng thử lại.");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  // --- Typography Động ---
  const titleClass = useMemo(() => {
    if (!artist?.name) return "";
    const len = artist.name.length;
    if (len > 25) return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";
    if (len > 15) return "text-5xl sm:text-6xl md:text-7xl lg:text-8xl";
    return "text-6xl sm:text-7xl md:text-8xl lg:text-[6rem] xl:text-[7.5rem]";
  }, [artist?.name]);

  if (isLoading) return <ArtistDetailSkeleton />;
  if (isError || !artist)
    return <ArtistNotFound onBack={() => navigate("/artists")} />;

  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : undefined;
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 animate-in fade-in duration-1000 overflow-x-hidden pb-32">
      {/* ================= 1. HERO SECTION (Immersive Vibe) ================= */}
      {/* (Giữ nguyên cấu trúc tuyệt đẹp của bạn) */}
      <section className="relative w-full min-h-[450px] sm:min-h-[500px] md:min-h-[600px] flex flex-col justify-end overflow-hidden shrink-0 group/hero">
        <div
          className="absolute inset-0 transition-all duration-1000 z-0 opacity-100 dark:opacity-80 mix-blend-multiply dark:mix-blend-normal"
          style={{
            background: `linear-gradient(to bottom, ${hexToRgba(themeColor, 0.4)} 0%, ${hexToRgba(themeColor, 0.1)} 50%, hsl(var(--background)) 100%)`,
          }}
        />
        {artist.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[4s] ease-out group-hover/hero:scale-110 pointer-events-none z-0 opacity-60 mix-blend-overlay dark:opacity-40"
            style={{ backgroundImage: `url(${artist.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 mt-24">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 text-center md:text-left">
            <div className="relative shrink-0 group/avatar">
              <div
                className="absolute inset-0 blur-3xl rounded-full scale-[1.35] opacity-50 animate-pulse duration-3000"
                style={{ backgroundColor: themeColor }}
              />
              <Avatar className="size-40 sm:size-52 md:size-64 rounded-full border-[6px] sm:border-[8px] border-background shadow-2xl relative z-10 bg-card transition-transform duration-500 hover:scale-[1.02]">
                <AvatarImage src={artist.avatar} className="object-cover" />
                <AvatarFallback className="text-5xl font-black bg-muted text-muted-foreground">
                  {artist.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {artist.isVerified && (
                <Badge className="bg-background/50 backdrop-blur-xl text-foreground border-border/40 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <BadgeCheck className="size-4 fill-blue-500 text-background" />{" "}
                  Nghệ sĩ xác thực
                </Badge>
              )}
              <h1
                className={cn(
                  "font-black tracking-tighter leading-[0.85] drop-shadow-2xl text-foreground",
                  titleClass,
                )}
              >
                {artist.name}
              </h1>
              <div className="flex items-center flex-wrap justify-center md:justify-start gap-4 sm:gap-6 mt-2 text-[13px] font-bold uppercase tracking-widest text-foreground/80">
                <div className="flex items-center gap-2 bg-background/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-sm">
                  <TrendingUp className="size-4 text-primary" />
                  <span>
                    {new Intl.NumberFormat().format(
                      artist.monthlyListeners || 0,
                    )}{" "}
                    <span className="opacity-60 font-semibold text-[11px] ml-1">
                      Người nghe / tháng
                    </span>
                  </span>
                </div>
                {artist.nationality && (
                  <div className="flex items-center gap-2 opacity-80">
                    <MapPin className="size-4" />{" "}
                    <span>{artist.nationality}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. DYNAMIC STICKY ACTIONS BAR ================= */}
      <div className="sticky top-[64px] z-40 backdrop-blur-2xl bg-background/85 md:bg-background/90 border-b border-border/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* 🔥 NÚT PLAY KÈM LOADING */}
            <Button
              size="icon"
              onClick={handlePlayArtist}
              disabled={isLoadingPlay}
              className="size-14 sm:size-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-90 transition-all hover:scale-105 group shrink-0"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 10px 25px -5px ${hexToRgba(themeColor, 0.5)}`,
              }}
            >
              {isLoadingPlay ? (
                <Loader2 className="size-7 sm:size-8 animate-spin" />
              ) : (
                <Play className="size-7 sm:size-8 fill-current ml-1.5 group-hover:scale-110 transition-transform" />
              )}
            </Button>

            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "rounded-full px-8 font-black uppercase text-[11px] sm:text-xs tracking-widest h-10 sm:h-12 transition-all active:scale-95 shadow-sm hidden xs:flex border-2",
                isFollowing
                  ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
                  : "border-foreground bg-foreground text-background hover:bg-foreground/90",
              )}
            >
              {isFollowing ? "Đang theo dõi" : "Theo dõi"}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full size-11 sm:size-12 active:scale-90 transition-colors"
            >
              <Heart className="size-6 sm:size-7" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full size-11 sm:size-12 transition-colors hover:bg-muted text-muted-foreground"
                >
                  <MoreHorizontal className="size-6 sm:size-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-2xl border-border/60 p-2 shadow-2xl backdrop-blur-xl"
              >
                <DropdownMenuItem className="gap-3 py-3 rounded-xl cursor-pointer font-bold text-sm">
                  <Share2 className="size-4 text-primary" /> Chia sẻ
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 py-3 rounded-xl cursor-pointer font-bold text-sm">
                  <Music4 className="size-4 text-emerald-500" /> Đài nghệ sĩ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-3 py-3 rounded-xl cursor-pointer font-bold text-sm text-destructive focus:text-destructive focus:bg-destructive/10">
                  <AlertCircle className="size-4" /> Báo cáo vi phạm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mini Nav Artist Info */}
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-500 transform pointer-events-none sm:pointer-events-auto origin-right",
              isScrolled
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-95 translate-x-4",
            )}
          >
            <span className="font-bold text-sm hidden md:block truncate max-w-[150px] lg:max-w-[250px]">
              {artist.name}
            </span>
            <Avatar className="size-9 sm:size-10 rounded-full border border-border shadow-sm">
              <AvatarImage src={artist.avatar} className="object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {artist.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* ================= 3. MAIN CONTENT LAYOUT ================= */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 xl:gap-24">
          {/* --- CỘT TRÁI: Nhạc & Album --- */}
          <div className="lg:col-span-8 space-y-20">
            {/* Phổ biến */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter flex items-center gap-3 uppercase">
                  Phổ biến{" "}
                  <TrendingUp className="size-5 sm:size-6 text-primary" />
                </h2>
              </div>
              {topTracks.length > 0 ? (
                <TrackList tracks={topTracks} isLoading={isLoading} />
              ) : (
                <EmptySection
                  icon={<Music />}
                  title="Chưa có bài hát"
                  message="Nghệ sĩ này chưa có bài hát nào đạt đủ lượt nghe để hiển thị."
                />
              )}
            </section>

            {/* 🔥 THƯ VIỆN ẢNH (DRAGGABLE GALLERY) */}
            {artist.images?.length > 0 && (
              <section className="space-y-5">
                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 px-1">
                  <Camera className="size-4 text-primary" /> Thư viện ảnh
                </h3>
                {/* Gọi component xử lý cuộn chuột/vuốt tay */}
                <DraggableImageGallery
                  images={artist.images}
                  artistName={artist.name}
                />
              </section>
            )}

            {/* Đĩa Nhạc */}
            <section>
              <div className="flex items-center justify-between mb-8 px-1">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                  Đĩa nhạc <Disc3 className="size-5 sm:size-6 text-primary" />
                </h2>
                {albums.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary font-bold text-[11px] uppercase tracking-widest gap-1 hidden sm:flex"
                  >
                    Xem tất cả <ChevronRight className="size-4" />
                  </Button>
                )}
              </div>

              {albums.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                  {albums.map((album: Album) => (
                    <PublicAlbumCard key={album._id} album={album} />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<Disc3 />}
                  title="Trống đĩa nhạc"
                  message="Nghệ sĩ này hiện chưa phát hành album hay đĩa đơn nào."
                />
              )}
            </section>
          </div>

          {/* --- CỘT PHẢI: Sinh sử & Mạng xã hội --- */}
          <aside className="lg:col-span-4 space-y-10 relative">
            <div className="sticky top-32 space-y-10">
              <div
                className="absolute -top-10 -right-10 w-[120%] aspect-square rounded-full blur-[120px] opacity-15 pointer-events-none -z-10"
                style={{ backgroundColor: themeColor }}
              />

              <section className="bg-card/60 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-8 border border-border/60 shadow-xl relative overflow-hidden group transition-all">
                <h3 className="font-black text-lg sm:text-xl mb-6 sm:mb-8 flex items-center gap-3 tracking-tighter text-foreground uppercase">
                  Tiểu sử <Info className="size-5 text-primary" />
                </h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16 sm:size-20 rounded-2xl border-2 border-border shadow-md">
                      <AvatarImage src={artist.avatar} />
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-lg font-black text-foreground truncate uppercase tracking-tight">
                        {artist.name}
                      </p>
                      <Badge className="mt-1 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
                        Hồ sơ chính thức
                      </Badge>
                    </div>
                  </div>

                  {artist.bio ? (
                    <p className="text-[13px] sm:text-[14px] text-muted-foreground leading-[1.8] font-medium line-clamp-[15] border-l-[3px] border-primary/40 pl-4">
                      {artist.bio}
                    </p>
                  ) : (
                    <div className="py-8 text-center bg-muted/30 rounded-2xl border border-dashed border-border/50">
                      <Mic2 className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-xs font-bold text-muted-foreground italic uppercase tracking-widest">
                        Tiểu sử đang cập nhật
                      </p>
                    </div>
                  )}

                  {artist.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-border/50">
                      {artist.genres.map((g: any) => (
                        <Badge
                          key={g._id}
                          variant="secondary"
                          className="bg-secondary/60 text-foreground/80 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-border/40 hover:bg-primary/20 hover:text-primary transition-colors cursor-default"
                        >
                          {g.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {artist.socialLinks &&
                Object.values(artist.socialLinks).some(Boolean) && (
                  <section className="space-y-5 px-2">
                    <h3 className="font-black text-[12px] uppercase tracking-[0.3em] text-muted-foreground pl-3 border-l-[3px] border-primary">
                      Mạng xã hội
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                      <SocialLink
                        icon={<Instagram />}
                        label="Instagram"
                        href={artist.socialLinks.instagram}
                        color="#E4405F"
                      />
                      <SocialLink
                        icon={<Facebook />}
                        label="Facebook"
                        href={artist.socialLinks.facebook}
                        color="#1877F2"
                      />
                      <SocialLink
                        icon={<Youtube />}
                        label="YouTube"
                        href={artist.socialLinks.youtube}
                        color="#FF0000"
                      />
                      <SocialLink
                        icon={<Globe />}
                        label="Website"
                        href={artist.socialLinks.website}
                        color={themeColor}
                      />
                    </div>
                  </section>
                )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// ================= SUB-COMPONENTS TỐI ƯU =================

// 🔥 XỬ LÝ KÉO THẢ ẢNH BẰNG CHUỘT (DRAGGABLE GALLERY)
const DraggableImageGallery = ({
  images,
  artistName,
}: {
  images: string[];
  artistName: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Tốc độ cuộn khi kéo
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUpOrLeave}
      onMouseUp={handleMouseUpOrLeave}
      onMouseMove={handleMouseMove}
      className={cn(
        "flex gap-4 sm:gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0",
        // Khi kéo thả bằng chuột thì tắt Snap để không bị giật, thả tay ra thì bật lại
        isDragging
          ? "cursor-grabbing snap-none"
          : "cursor-grab snap-x snap-mandatory scroll-smooth",
      )}
    >
      {images.map((img: string, idx: number) => (
        <div
          key={idx}
          // Mobile thì rộng 85% để lòi tấm kế tiếp ra, Desktop thì cứng 350px - 450px
          className="shrink-0 w-[85%] sm:w-[350px] md:w-[450px] aspect-[16/10] rounded-3xl sm:rounded-[2rem] overflow-hidden snap-center shadow-lg sm:shadow-xl border border-border/40 group relative bg-muted select-none"
        >
          <img
            src={img}
            className="size-full object-cover transition-transform duration-[2s] group-hover:scale-105 pointer-events-none" // pointer-events-none để tránh lỗi kéo ảnh gốc của trình duyệt
            alt={`${artistName} photo ${idx + 1}`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

const SocialLink = ({
  icon,
  label,
  href,
  color,
}: {
  icon: any;
  label: string;
  href?: string;
  color: string;
}) => {
  if (!href || !href.trim()) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-center lg:justify-start gap-4 h-12 sm:h-14 w-full rounded-2xl bg-card border border-border/60 hover:border-border transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
    >
      <span
        className="shrink-0 transition-transform group-hover:scale-110 lg:ml-5"
        style={{ color }}
      >
        {React.cloneElement(icon, { size: 20 })}
      </span>
      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
        {label}
      </span>
    </a>
  );
};

const EmptySection = ({
  icon,
  title,
  message,
}: {
  icon: any;
  title: string;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 bg-muted/10 rounded-[2rem] border border-dashed border-border/60 text-center gap-4">
    <div className="size-16 rounded-full bg-background border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground/40">
      {React.cloneElement(icon, { size: 28, strokeWidth: 1.5 })}
    </div>
    <div className="space-y-2">
      <p className="font-black text-foreground uppercase text-sm tracking-widest">
        {title}
      </p>
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  </div>
);

// ... (ArtistDetailSkeleton & ArtistNotFound giữ nguyên như code gốc của bạn)
const ArtistDetailSkeleton = () => (
  <div className="w-full min-h-screen bg-background flex flex-col overflow-hidden">
    <div className="h-[450px] sm:h-[600px] w-full bg-muted/30 animate-pulse relative">
      <div className="absolute bottom-10 left-10 flex items-end gap-8">
        <div className="size-52 rounded-full bg-muted border-[6px] border-background shadow-lg" />
        <div className="space-y-4 mb-4">
          <div className="h-16 w-80 bg-muted rounded-xl" />
          <div className="h-5 w-48 bg-muted/60 rounded-full" />
        </div>
      </div>
    </div>
    <div className="h-20 w-full bg-card border-b border-border/40 mb-12 animate-pulse" />
    <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-16">
      <div className="lg:col-span-8 space-y-12">
        <div className="h-8 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-muted/30 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4 h-[500px] bg-muted/20 rounded-[2.5rem] animate-pulse border border-border/40" />
    </div>
  </div>
);

const ArtistNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[85vh] gap-8 text-center px-6 bg-background animate-in fade-in zoom-in-95 duration-500">
    <AlertCircle className="size-24 text-muted-foreground/30" />
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter uppercase text-foreground">
        Không tìm thấy Nghệ sĩ
      </h2>
      <p className="text-muted-foreground text-base max-w-md mx-auto font-medium">
        Hồ sơ nghệ sĩ này có thể đã bị xóa hoặc đường dẫn không hợp lệ. Vui lòng
        kiểm tra lại.
      </p>
    </div>
    <Button
      onClick={onBack}
      variant="secondary"
      className="rounded-full px-10 font-bold uppercase text-xs tracking-[0.2em] h-12 mt-4 hover:scale-105 transition-transform"
    >
      Quay lại danh sách
    </Button>
  </div>
);

export default ArtistDetailPage;
