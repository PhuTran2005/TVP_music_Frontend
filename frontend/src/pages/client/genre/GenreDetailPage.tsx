import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Shuffle,
  MoreHorizontal,
  ChevronRight,
  Disc3,
  Share2,
  SearchX,
} from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useGenreDetail } from "@/features/genre/hooks/useGenre";
import { useTracks } from "@/features/track/hooks/useTrackPublic.ts";

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

import { SubGenreGrid } from "@/features/genre/components/SubGenreGrid";
import { TrackList } from "@/features/track/components/TrackList";
// Assuming TrackList is not used directly or replaced by the table logic below for consistency
// import { TrackList } from "@/features/track/components/TrackList";

dayjs.extend(relativeTime);

export const GenreDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // 1. Data Fetching
  const {
    data: genreRes,
    isLoading: loadingGenre,
    error,
  } = useGenreDetail(slug!);
  const genre = genreRes?.data;

  const { data: tracksRes, isLoading: loadingTracks } = useTracks({
    genreId: genre?._id || "",
    limit: 20,
    sort: "popular",
    page: 1,
  });
  console.log(genreRes);
  const tracks = tracksRes?.data.data || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Dynamic Background Logic
  const themeColor = useMemo(() => genre?.color || "#6366f1", [genre]);

  if (loadingGenre) return <GenreDetailSkeleton />;
  if (error || !genre)
    return <GenreNotFound onBack={() => navigate("/genres")} />;

  return (
    <div className="relative min-h-screen bg-background text-foreground animate-in fade-in duration-700 overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* --- LAYER 1: AMBIENT BACKDROP --- */}
      <div
        className="absolute inset-0 h-[60vh] pointer-events-none opacity-25 dark:opacity-20 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% -20%, ${themeColor}, transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 h-[60vh] bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 pb-24">
        {/* 1. HERO SECTION */}
        <header className="flex flex-col md:flex-row items-center md:items-end gap-8 pt-24 pb-8 md:pt-32 md:pb-10">
          {/* Cover Art */}
          <div className="group relative shrink-0">
            <div className="relative size-52 sm:size-60 md:size-72 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden bg-card border border-white/10 transition-transform duration-500 group-hover:scale-[1.01]">
              <ImageWithFallback
                src={genre.image}
                alt={genre.name}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Genre Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 w-full min-w-0">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-widest h-6 px-2.5 bg-background/40 backdrop-blur-md border-white/10 shadow-sm"
              >
                Genre
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1] line-clamp-2">
              {genre.name}
            </h1>

            <p className="text-muted-foreground text-sm md:text-base font-medium line-clamp-2 max-w-2xl">
              {genre.description ||
                `Explore the best tracks and artists in ${genre.name}.`}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-1 mt-2 text-sm font-medium text-foreground/90">
              <span className="text-muted-foreground">
                {new Intl.NumberFormat().format(genre.trackCount || 0)} songs
              </span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">
                {new Intl.NumberFormat().format(genre.artistCount || 0)} artists
              </span>
            </div>
          </div>
        </header>

        {/* 2. STICKY ACTION BAR */}
        <div className="sticky top-[64px] z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-4 mb-6 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-white/5 transition-all">
          <div className="flex items-center gap-4">
            {/* Primary Action */}
            <Button
              size="icon"
              className="size-14 rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(var(--primary),0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Play className="size-6 fill-current ml-1" />
            </Button>

            {/* Secondary Actions */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-transparent transition-transform hover:scale-110 ml-2"
            >
              <Shuffle className="size-7" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  <MoreHorizontal className="size-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-xl p-1 border-white/10 bg-background/95 backdrop-blur-md shadow-xl"
              >
                <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                  <Share2 className="size-4" /> Share Genre
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 3. MAIN CONTENT */}
        <div className="space-y-12">
          {/* Sub-Genres Section */}
          {genre.subGenres && genre.subGenres.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  Explore {genre.name}{" "}
                  <ChevronRight className="size-5 text-muted-foreground" />
                </h2>
              </div>
              <SubGenreGrid genres={genre.subGenres} />
            </section>
          )}

          {/* Tracks Section (Table Layout like Playlist) */}
          <section className="bg-background/40 rounded-xl backdrop-blur-sm -mx-2 sm:mx-0">
            <div className="flex items-center justify-between mb-6 px-4 pt-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Popular Tracks
              </h2>
            </div>

            <TrackList tracks={tracks} isLoading={loadingTracks} />
          </section>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const GenreDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-[50vh] w-full bg-muted/20 animate-pulse relative">
      <div className="absolute bottom-0 w-full p-8 container mx-auto flex items-end gap-8">
        <Skeleton className="size-60 rounded-xl" />
        <div className="flex-1 space-y-4 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    </div>
    <div className="container mx-auto mt-8 space-y-8 px-8">
      <div className="flex gap-4">
        <Skeleton className="size-14 rounded-full" />
        <Skeleton className="size-12 rounded-full" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  </div>
);

const GenreNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6 animate-in zoom-in-95 duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full scale-150" />
      <div className="size-28 rounded-full bg-background border-4 border-muted flex items-center justify-center relative z-10 shadow-2xl">
        <SearchX className="size-12 text-muted-foreground" />
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
        Genre Not Found
      </h2>
      <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
        The genre you are looking for does not exist.
      </p>
    </div>
    <Button
      variant="outline"
      onClick={onBack}
      size="lg"
      className="rounded-full px-10 h-12 font-bold uppercase tracking-widest border-border hover:bg-foreground hover:text-background transition-all duration-300"
    >
      Back to Genres
    </Button>
  </div>
);
