"use client";

import { useState, useMemo } from "react";
import {
  Play,
  Pause,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Disc3,
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// Hooks & Types
import { useHeroSlider } from "@/hooks/useHeroSlider";
import { Album } from "@/features/album/types";
import albumApi from "@/features/album/api/albumApi";
import { albumKeys } from "@/features/album/utils/albumKeys";
import { cn } from "@/lib/utils";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features/player/slice/playerSlice"; // Hoặc '@/features' tùy project bạn
import { useFeatureAlbums } from "@/features/album/hooks/useAlbumsQuery";

/* -------------------------------------------------------------------------- */
/* TYPES                                    */
/* -------------------------------------------------------------------------- */

interface HeroAlbum {
  _id: string;
  slug: string;
  title: string;
  artistName: string;
  description: string;
  coverImage: string;
  moodColor: string;
}

/* -------------------------------------------------------------------------- */
/* HERO                                     */
/* -------------------------------------------------------------------------- */

export function Hero() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Trạng thái Player từ Redux
  const { isPlaying: isGlobalPlaying, currentTrack } = useAppSelector(
    (state) => state.player,
  );

  // Fetch Data
  const { data, isLoading } = useFeatureAlbums(6);
  console.log("Hero Album Data:", data, "Loading:", isLoading);
  // Chuẩn hóa Data
  const albums: HeroAlbum[] = useMemo(
    () =>
      data?.map((album: Album) => ({
        _id: album._id,
        slug: album.slug || album._id,
        title: album.title,
        artistName: album.artist?.name || "Various Artists",
        description:
          album.description ||
          `Thưởng thức trọn vẹn từng âm sắc trong đĩa nhạc ${album.title} với chất lượng chuẩn Studio.`,
        coverImage: album.coverImage || "/images/default-cover.jpg",
        moodColor: album.themeColor || "262 83% 58%",
      })) || [],
    [data],
  );

  // Custom Hook xử lý Slider
  const { currentIndex, nextSlide, prevSlide, goToSlide } = useHeroSlider(
    albums.length,
  );
  const currentAlbum = albums[currentIndex];

  // States UI
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);

  // Kiểm tra xem Album hiển thị trên màn hình CÓ PHẢI là Album đang phát dưới Player hay không
  const isThisAlbumPlaying = useMemo(() => {
    return isGlobalPlaying && currentTrack?.album?._id === currentAlbum?._id;
  }, [isGlobalPlaying, currentTrack, currentAlbum]);

  if (isLoading || !currentAlbum) return <HeroSkeleton />;

  /* ----------------------------- LOGIC PLAY NHẠC ----------------------------- */
  const handlePlayAlbum = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. Nếu Album này đang phát -> Bấm vào thì Pause
    if (isThisAlbumPlaying) {
      dispatch(setIsPlaying(false));
      return;
    }

    // 2. Bắt đầu quá trình nạp nhạc
    setIsLoadingPlay(true);
    try {
      // Gọi API ngầm (Sử dụng bộ nhớ đệm 5 phút của React Query)
      const res = await queryClient.fetchQuery({
        queryKey: albumKeys.detail(currentAlbum._id),
        queryFn: () => albumApi.getById(currentAlbum._id),
        staleTime: 1000 * 60 * 5,
      });

      const tracks = res.data?.tracks;

      if (!tracks || tracks.length === 0) {
        toast.error("Đĩa nhạc này hiện chưa có bài hát nào!");
        return;
      }

      // 3. Có nhạc -> Ném vô Queue và Play
      dispatch(setQueue({ tracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success(`Đang phát: ${currentAlbum.title}`);
    } catch (error) {
      toast.error("Không thể nạp dữ liệu âm thanh. Vui lòng thử lại.");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  /* ----------------------------- DRAG HANDLER ----------------------------- */
  // Vuốt màn hình trên điện thoại
  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      nextSlide();
    } else if (offset > 100 || velocity > 500) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative min-h-[85dvh] lg:min-h-[90vh] flex items-center overflow-hidden justify-center bg-black"
      style={{ "--hero-mood": currentAlbum.moodColor } as React.CSSProperties}
    >
      {/* ============================ 1. BACKGROUND ============================ */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentAlbum._id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Lớp màu đen gradient chặn từ trên xuống dưới để bảo vệ chữ */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background z-10 pointer-events-none" />

          <ImageWithFallback
            src={currentAlbum.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[40px] brightness-[0.4] scale-110"
          />
        </motion.div>
      </AnimatePresence>

      {/* ============================ 2. DRAGGABLE CONTENT ============================ */}
      <motion.div
        className="container relative z-20 w-full mx-auto"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {/* 🔥 Tăng padding-bottom (pb-24) để tạo khoảng cách an toàn với thanh Dots Slider ở Mobile */}
        <div className="max-w-7xl mx-auto cursor-grab active:cursor-grabbing pb-24 lg:pb-0 pt-16 lg:pt-0 px-4 sm:px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-16 items-center text-center lg:text-left">
            {/* --------------------- ARTWORK (Cột Trái) --------------------- */}
            <div className="lg:col-span-5 flex justify-center mb-10 lg:mb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAlbum._id}
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative group"
                  onClick={() => navigate(`/albums/${currentAlbum.slug}`)}
                >
                  {/* Bóng Glow tỏa ra từ phía sau Album */}
                  <div
                    className="absolute inset-0 blur-[90px] opacity-40 rounded-full transition-all duration-[2s] group-hover:scale-110"
                    style={{ background: "hsl(var(--hero-mood))" }}
                  />

                  {/* Vỏ đĩa */}
                  <div className="relative w-[260px] sm:w-[320px] lg:w-[460px] aspect-square rounded-3xl sm:rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                    <ImageWithFallback
                      src={currentAlbum.coverImage}
                      alt={currentAlbum.title}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Lớp phủ Đen mờ + Trạng thái Play/Loading */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center",
                        isLoadingPlay || isThisAlbumPlaying
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    >
                      {isLoadingPlay ? (
                        <Loader2 className="size-16 text-white animate-spin drop-shadow-lg" />
                      ) : isThisAlbumPlaying ? (
                        <MusicBars />
                      ) : (
                        <Play className="size-16 text-white fill-white drop-shadow-lg" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* --------------------- TYPOGRAPHY (Cột Phải) --------------------- */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start pointer-events-none w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAlbum._id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                  }}
                  className="space-y-4 sm:space-y-6 w-full"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2 justify-center lg:justify-start"
                  >
                    <Disc3 className="size-4 text-primary" />
                    <span className="uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-black text-primary drop-shadow-md">
                      Tuyển tập đĩa nhạc
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-black leading-[1.05] tracking-tighter text-white drop-shadow-2xl pointer-events-auto cursor-pointer hover:text-primary transition-colors line-clamp-2"
                    onClick={() => navigate(`/albums/${currentAlbum.slug}`)}
                  >
                    {currentAlbum.title}
                  </motion.h1>

                  <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-xl text-white/80 font-medium"
                  >
                    Trình bày bởi{" "}
                    <span className="text-primary font-bold pointer-events-auto cursor-pointer hover:underline">
                      {currentAlbum.artistName}
                    </span>
                  </motion.p>

                  <motion.p
                    variants={itemVariants}
                    className="text-[13px] sm:text-base text-white/60 max-w-[90%] sm:max-w-xl mx-auto lg:mx-0 line-clamp-3 leading-relaxed"
                  >
                    {currentAlbum.description}
                  </motion.p>

                  {/* NÚT BẤM (Fix đè nhau: Dùng flex-wrap và gap linh hoạt) */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 pointer-events-auto"
                  >
                    {/* NÚT PLAY LỚN */}
                    <Button
                      size="lg"
                      onClick={handlePlayAlbum}
                      disabled={isLoadingPlay}
                      className="rounded-full px-4 lg:px-8 sm:px-10 h-12 sm:h-14 font-black uppercase tracking-widest text-[11px] sm:text-xs bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(var(--primary),0.4)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                    >
                      {isLoadingPlay ? (
                        <>
                          <Loader2 className="mr-2.5 size-4 sm:size-5 animate-spin" />{" "}
                          Đang nạp...
                        </>
                      ) : isThisAlbumPlaying ? (
                        <>
                          <Pause className="mr-2.5 size-4 sm:size-5 fill-current" />{" "}
                          Tạm dừng
                        </>
                      ) : (
                        <>
                          <Play className="mr-2.5 size-4 sm:size-5 fill-current" />{" "}
                          Phát ngay
                        </>
                      )}
                    </Button>

                    {/* CỤM NÚT PHỤ */}
                    <div className="flex gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLikedMap((p) => ({
                            ...p,
                            [currentAlbum._id]: !p[currentAlbum._id],
                          }));
                        }}
                        className="rounded-full size-12 sm:size-14 bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <Heart
                          className={cn(
                            "size-5 transition-transform",
                            likedMap[currentAlbum._id] &&
                              "fill-rose-500 text-rose-500 scale-110",
                          )}
                        />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full size-12 sm:size-14 bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <Share2 className="size-5 text-white" />
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================ 3. HERO CONTROLS ============================ */}
      <HeroControls
        onPrev={prevSlide}
        onNext={nextSlide}
        albums={albums}
        index={currentIndex}
        goTo={goToSlide}
      />
    </section>
  );
}

// Khai báo hiệu ứng trượt cho từng dòng Text
const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
};

/* -------------------------------------------------------------------------- */
/* COMPONENT: MUSIC BARS V2 (Sóng nhạc thiết kế Premium)                      */
/* -------------------------------------------------------------------------- */

function MusicBars() {
  return (
    <div className="flex items-end justify-center gap-1.5 p-4 rounded-full bg-black/50 backdrop-blur-md size-20">
      {[1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-primary"
          // Framer motion animate chiều cao ngẫu nhiên mượt mà
          animate={{
            height: ["10px", "35px", "15px", "25px", "10px"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2, // Mỗi cột delay lệch nhau để tạo sóng
          }}
          style={{ height: "10px" }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT: CONTROLS (Nút qua/lại và Dấu chấm)                              */
/* -------------------------------------------------------------------------- */

function HeroControls({ onPrev, onNext, albums, index, goTo }: any) {
  return (
    <>
      {/* ARROWS (Chỉ hiện trên màn lớn, đặt z-30 để đè lên vùng kéo) */}
      <div className="hidden lg:flex absolute inset-x-8 top-1/2 -translate-y-1/2 justify-between z-30 pointer-events-none">
        <Button
          size="icon"
          variant="ghost"
          onClick={onPrev}
          className="size-14 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white pointer-events-auto border border-white/10 transition-transform hover:scale-110"
        >
          <ChevronLeft className="size-8" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onNext}
          className="size-14 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white pointer-events-auto border border-white/10 transition-transform hover:scale-110"
        >
          <ChevronRight className="size-8" />
        </Button>
      </div>

      {/* DOTS (Chỉ báo trang - Nằm sát đáy, tách biệt hoàn toàn nội dung) */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-30">
        {albums.map((_: any, i: number) => (
          <button key={i} onClick={() => goTo(i)} className="p-2 group">
            <div
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out ${
                i === index
                  ? "w-8 sm:w-12 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                  : "w-2 sm:w-3 bg-white/30 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT: SKELETON (Bộ xương chờ tải)                                     */
/* -------------------------------------------------------------------------- */

function HeroSkeleton() {
  return (
    <div className="min-h-[85dvh] flex items-center justify-center bg-black relative overflow-hidden pt-16 lg:pt-0">
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <Skeleton className="w-[240px] sm:w-[320px] lg:w-[460px] aspect-square rounded-[2.5rem] opacity-20 bg-white/20" />
        </div>
        <div className="lg:col-span-7 space-y-6 flex flex-col items-center lg:items-start w-full">
          <Skeleton className="h-4 w-32 rounded-full opacity-20 bg-white/20" />
          <Skeleton className="h-24 sm:h-32 w-full lg:w-4/5 rounded-3xl opacity-20 bg-white/20" />
          <Skeleton className="h-8 w-64 rounded-full opacity-20 bg-white/20" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 sm:h-14 w-36 rounded-full opacity-20 bg-white/20" />
            <Skeleton className="size-12 sm:size-14 rounded-full opacity-20 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
