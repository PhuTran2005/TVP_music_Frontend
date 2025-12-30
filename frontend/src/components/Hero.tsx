import { useState } from "react";
import { Play, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useHeroSlider } from "@/hooks/useHeroSlider";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeatureAlbum } from "@/features/album/hooks/useClientAlbum";
import { Album } from "@/features/album/types";

interface HeroAlbum {
  _id: string;
  title: string;
  artistName: string;
  description?: string;
  coverImage: string;
}

export function Hero() {
  // --- 1. DATA FETCHING ---
  const { data: apiData, isLoading } = useFeatureAlbum(5);

  const albums: HeroAlbum[] =
    apiData?.map((album: Album) => ({
      _id: album._id,
      title: album.title,
      artistName: album.artist?.name || "Unknown Artist",
      description:
        album.description ||
        `Trải nghiệm album ${album.title} với chất lượng âm thanh tốt nhất.`,
      coverImage: album.coverImage || "/images/default-cover.jpg",
    })) || [];

  // --- 2. SLIDER LOGIC ---
  const { currentIndex, direction, nextSlide, prevSlide, goToSlide } =
    useHeroSlider(albums.length);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const currentAlbum = albums[currentIndex];

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Variants animation: Mobile trượt ít hơn, Desktop trượt nhiều hơn
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  // --- 3. LOADING STATE ---
  if (isLoading || !currentAlbum) return <HeroSkeleton />;

  return (
    // Mobile: min-h-[85dvh] để chừa chỗ cho thanh header mobile
    <section className="relative min-h-[85dvh] lg:min-h-[90vh] flex items-center overflow-hidden group py-20 lg:py-0">
      {/* === BACKGROUND LAYER === */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentAlbum._id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Overlay đậm hơn trên mobile để đọc chữ dễ hơn */}
          <div className="absolute inset-0 bg-black/60 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/50 lg:to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />

          <ImageWithFallback
            src={currentAlbum.coverImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover blur-md lg:blur-sm brightness-[0.4]"
          />
        </motion.div>
      </AnimatePresence>

      {/* === MAIN CONTENT === */}
      <div className="container relative z-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: Flex cột (Ảnh trên, Chữ dưới). Desktop: Grid 2 cột */}
          <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-12 lg:gap-12 lg:text-left lg:items-center">
            {/* --- RIGHT: ALBUM ART (Mobile: Hiện đầu tiên, nhỏ hơn) --- */}
            {/* Order-1 trên mobile để ảnh hiện trước tiêu đề */}
            <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center w-full mb-8 lg:mb-0 perspective-1000">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentAlbum._id}
                  custom={direction}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative group/art cursor-pointer"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/40 blur-[40px] lg:blur-[80px] rounded-full opacity-50" />

                  {/* CD Art: Mobile 200px, Desktop 400px */}
                  <div className="relative w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[450px] lg:h-[450px] rounded-xl lg:rounded-2xl shadow-2xl shadow-black/50">
                    <ImageWithFallback
                      src={currentAlbum.coverImage}
                      alt={currentAlbum.title}
                      className="w-full h-full object-cover rounded-xl lg:rounded-2xl border border-white/10"
                    />
                    {/* Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-xl lg:rounded-2xl pointer-events-none" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* --- LEFT: TEXT CONTENT (Mobile: Hiện sau) --- */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 lg:space-y-8 w-full">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentAlbum._id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                  className="space-y-4 lg:space-y-6"
                >
                  {/* Label */}
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="w-8 lg:w-12 h-0.5 bg-primary" />
                    <p className="text-xs lg:text-sm uppercase tracking-wider font-bold text-primary">
                      Featured Album #{currentIndex + 1}
                    </p>
                    <div className="w-8 h-0.5 bg-primary lg:hidden" />
                  </div>

                  {/* Title: Responsive Text Size */}
                  <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-white line-clamp-2">
                    {currentAlbum.title}
                  </h1>

                  {/* Artist */}
                  <p className="text-lg sm:text-2xl text-white/90">
                    by{" "}
                    <span className="text-primary font-bold">
                      {currentAlbum.artistName}
                    </span>
                  </p>

                  {/* Description: Ẩn bớt trên mobile nếu quá dài */}
                  <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed line-clamp-3">
                    {currentAlbum.description}
                  </p>

                  {/* Actions: Căn giữa mobile, căn trái desktop */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 lg:pt-4">
                    <Button
                      size="lg"
                      className="rounded-full px-6 lg:px-8 h-10 lg:h-12 text-sm lg:text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform bg-primary text-primary-foreground border-none"
                    >
                      <Play className="mr-2 size-4 lg:size-5 fill-current" />{" "}
                      Play Now
                    </Button>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full size-10 lg:size-12 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:text-red-500"
                        onClick={() => toggleLike(currentAlbum._id)}
                      >
                        <Heart
                          className={`size-4 lg:size-5 transition-colors ${
                            likedMap[currentAlbum._id]
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full size-10 lg:size-12 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
                      >
                        <Share2 className="size-4 lg:size-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* === CONTROLS === */}
      {/* 1. Arrows: Mobile luôn hiện (nhỏ), Desktop hiện khi hover */}
      <div className="absolute inset-x-2 lg:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full size-10 lg:size-14 bg-black/20 lg:bg-black/10 hover:bg-primary/20 text-white backdrop-blur-md pointer-events-auto lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
          onClick={prevSlide}
        >
          <ChevronLeft className="size-6 lg:size-8" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full size-10 lg:size-14 bg-black/20 lg:bg-black/10 hover:bg-primary/20 text-white backdrop-blur-md pointer-events-auto lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
          onClick={nextSlide}
        >
          <ChevronRight className="size-6 lg:size-8" />
        </Button>
      </div>

      {/* 2. Dots: Đẩy lên cao hơn chút trên mobile để ko bị vướng mép dưới */}
      <div className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {albums.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            // Tăng vùng bấm cho dot trên mobile
            className="p-2"
          >
            <div
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                idx === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

// === SKELETON RESPONSIVE ===
export function HeroSkeleton() {
  return (
    <div className="w-full min-h-[85dvh] bg-background animate-pulse flex items-center justify-center py-20">
      <div className="container flex flex-col lg:grid lg:grid-cols-2 gap-10 items-center px-6">
        {/* Mobile: Ảnh skeleton hiện trước */}
        <div className="order-1 lg:order-2 w-full flex justify-center">
          <Skeleton className="size-56 lg:size-96 rounded-2xl" />
        </div>
        {/* Text Skeleton */}
        <div className="order-2 lg:order-1 w-full space-y-6 flex flex-col items-center lg:items-start">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-12 lg:h-20 w-3/4 rounded-xl" />
          <Skeleton className="h-6 lg:h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-24 w-full lg:w-3/4 rounded-xl" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
