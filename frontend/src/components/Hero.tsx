"use client";

import { useState, useMemo } from "react";
import {
  Play,
  Pause,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useHeroSlider } from "@/hooks/useHeroSlider";
import { useFeatureAlbum } from "@/features/album/hooks/useClientAlbum";
import { Album } from "@/features/album/types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface HeroAlbum {
  _id: string;
  title: string;
  artistName: string;
  description: string;
  coverImage: string;
  moodColor: string;
}

/* -------------------------------------------------------------------------- */
/*                                    HERO                                    */
/* -------------------------------------------------------------------------- */

export function Hero() {
  const { data, isLoading } = useFeatureAlbum(6);

  const albums: HeroAlbum[] = useMemo(
    () =>
      data?.map((album: Album) => ({
        _id: album._id,
        title: album.title,
        artistName: album.artist?.name || "Unknown Artist",
        description:
          album.description ||
          `Trải nghiệm album ${album.title} với chất lượng âm thanh tốt nhất.`,
        coverImage: album.coverImage || "/images/default-cover.jpg",
        moodColor: "262 83% 58%",
      })) || [],
    [data]
  );

  const { currentIndex, direction, nextSlide, prevSlide, goToSlide } =
    useHeroSlider(albums.length);

  const currentAlbum = albums[currentIndex];

  const [isPlaying, setIsPlaying] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  if (isLoading || !currentAlbum) return <HeroSkeleton />;

  /* ----------------------------- DRAG HANDLER ----------------------------- */
  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -120 || velocity < -500) {
      nextSlide();
    } else if (offset > 120 || velocity > 500) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative min-h-[85dvh] lg:min-h-[90vh] flex items-center overflow-hidden justify-center"
      style={
        {
          "--hero-mood": currentAlbum.moodColor,
        } as React.CSSProperties
      }
    >
      {/* ============================ BACKGROUND ============================ */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentAlbum._id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />
          <ImageWithFallback
            src={currentAlbum.coverImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover blur-md brightness-[0.35]"
          />
        </motion.div>
      </AnimatePresence>

      {/* ============================ CONTENT ============================ */}
      <motion.div
        className="container relative z-20 px-4 sm:px-6 w-full mx-auto"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-center text-center lg:text-left">
            {/* --------------------- ALBUM ART --------------------- */}
            <div className="lg:col-span-5 flex justify-center mb-8 lg:mb-0">
              <motion.div
                key={currentAlbum._id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 90 }}
                className="relative"
              >
                <div
                  className="absolute inset-0 blur-[70px] opacity-40 rounded-full"
                  style={{ background: "hsl(var(--hero-mood))" }}
                />

                <div className="relative w-[220px] sm:w-[300px] lg:w-[440px] aspect-square rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                  <ImageWithFallback
                    src={currentAlbum.coverImage}
                    alt={currentAlbum.title}
                    className="w-full h-full object-cover rounded-2xl border border-white/10"
                  />
                  {isPlaying && <MusicBars />}
                </div>
              </motion.div>
            </div>

            {/* --------------------- TEXT --------------------- */}
            <div className="lg:col-span-7 space-y-5">
              <p className="uppercase tracking-widest text-xs font-semibold text-primary">
                Featured Album
              </p>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black leading-[0.95] text-white line-clamp-2">
                {currentAlbum.title}
              </h1>

              <p className="text-base sm:text-lg text-white/80">
                by{" "}
                <span className="text-primary font-semibold">
                  {currentAlbum.artistName}
                </span>
              </p>

              <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto lg:mx-0 line-clamp-3">
                {currentAlbum.description}
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="rounded-full px-8 h-12 font-bold bg-primary"
                >
                  {isPlaying ? (
                    <Pause className="mr-2 size-5" />
                  ) : (
                    <Play className="mr-2 size-5 fill-current" />
                  )}
                  {isPlaying ? "Pause" : "Play Now"}
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setLikedMap((p) => ({
                      ...p,
                      [currentAlbum._id]: !p[currentAlbum._id],
                    }))
                  }
                  className="rounded-full size-12"
                >
                  <Heart
                    className={
                      likedMap[currentAlbum._id]
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }
                  />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full size-12"
                >
                  <Share2 className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================ CONTROLS (DESKTOP) ============================ */}
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

/* -------------------------------------------------------------------------- */
/*                                 MUSIC BARS                                 */
/* -------------------------------------------------------------------------- */

function MusicBars() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-1 h-6 rounded-full bg-primary animate-music-bar-${i}`}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                CONTROLS                                    */
/* -------------------------------------------------------------------------- */

function HeroControls({ onPrev, onNext, albums, index, goTo }: any) {
  return (
    <>
      {/* ARROWS (HIDDEN ON MOBILE) */}
      <div className="hidden lg:flex absolute inset-x-4 top-1/2 -translate-y-1/2 justify-between z-30">
        <Button size="icon" variant="ghost" onClick={onPrev}>
          <ChevronLeft />
        </Button>
        <Button size="icon" variant="ghost" onClick={onNext}>
          <ChevronRight />
        </Button>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {albums.map((_: any, i: number) => (
          <button key={i} onClick={() => goTo(i)}>
            <div
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-primary" : "w-2 bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 SKELETON                                   */
/* -------------------------------------------------------------------------- */

function HeroSkeleton() {
  return (
    <div className="min-h-[85dvh] flex items-center justify-center bg-background">
      <Skeleton className="w-72 h-72 rounded-2xl" />
    </div>
  );
}
