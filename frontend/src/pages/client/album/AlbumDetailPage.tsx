import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  Heart,
  MoreHorizontal,
  Disc,
  Share2,
  AlertCircle,
  ListMusic,
  Plus,
  Dot,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAlbumDetail } from "@/features/album/hooks/useClientAlbum";
import { TrackList } from "@/features/track/components/TrackList";

const AlbumDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // --- 1. DATA FETCHING ---
  const { data: album, isLoading, isError } = useAlbumDetail(slug!);
  console.log("Album Data:", album);

  // --- 3. THEME & STYLING ---
  const themeColor = useMemo(() => album?.themeColor || "#7c3aed", [album]);

  // --- LOADING ---
  if (isLoading) return <AlbumDetailSkeleton />;

  // --- ERROR / NOT FOUND ---
  if (isError || !album)
    return <AlbumErrorState onBack={() => navigate("/albums")} />;

  return (
    <div className="relative min-h-screen bg-background text-foreground animate-in fade-in duration-700 overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* --- LAYER 1: DYNAMIC GRADIENT BACKDROP --- */}
      <div
        className="absolute inset-0 h-[60vh] pointer-events-none transition-all duration-1000 ease-out opacity-40 dark:opacity-30"
        style={{
          background: `linear-gradient(180deg, ${themeColor} 0%, transparent 100%)`,
        }}
      />
      <div className="absolute inset-0 h-[60vh] bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 pb-20">
        {/* 1. HERO SECTION (Immersive Layout) */}
        <header className="flex flex-col md:flex-row items-center md:items-end gap-8 pt-24 pb-8 md:pt-32 md:pb-10">
          {/* Album Cover Art */}
          <div className="group relative shrink-0">
            <div className="relative size-52 sm:size-64 md:size-[280px] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src={album.coverImage || "/images/default-album.png"}
                alt={album.title}
                className="size-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-lg pointer-events-none" />
            </div>
          </div>

          {/* Album Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 w-full min-w-0">
            <div className="hidden md:flex items-center gap-2">
              <Badge
                variant="secondary"
                className="uppercase text-[10px] font-bold tracking-widest px-3 h-6 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none"
              >
                {album.type || "Album"}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1] md:line-clamp-2 drop-shadow-sm">
              {album.title}
            </h1>

            {/* Metadata & Artist Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-1 text-sm font-medium text-foreground/90 mt-1">
              <div
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer mr-2"
                onClick={() => navigate(`/artist/${album.artist?.slug}`)}
              >
                <Avatar className="size-6 border border-white/10 shadow-sm">
                  <AvatarImage src={album.artist?.avatar} />
                  <AvatarFallback className="text-[9px] font-bold">
                    {album.artist?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-bold hover:underline underline-offset-4 decoration-2">
                  {album.artist?.name}
                </span>
              </div>

              <span className="text-muted-foreground/60 hidden sm:inline">
                •
              </span>
              <span className="text-muted-foreground">{album.releaseYear}</span>

              <span className="text-muted-foreground/60 hidden sm:inline">
                •
              </span>
              <span className="text-muted-foreground">
                {album.totalTracks} songs,{" "}
                <span className="opacity-80">
                  {Math.floor((album.totalDuration || 0) / 60)} min
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* 2. ACTION BAR */}
        <div className="sticky top-[64px] z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-4 mb-6 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-white/5 transition-all">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              className="size-14 rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(var(--primary),0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Play className="size-6 fill-current ml-1" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-500 hover:bg-transparent transition-transform hover:scale-110"
              >
                <Heart className="size-8" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-transparent"
                  >
                    <MoreHorizontal className="size-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 rounded-xl p-1 border-white/10 bg-background/95 backdrop-blur-md shadow-xl"
                >
                  <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                    <Plus className="size-4" /> Add to Playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                    <ListMusic className="size-4" /> Add to Queue
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 my-1" />
                  <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer text-primary focus:text-primary">
                    <Share2 className="size-4" /> Share Album
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* 3. TRACKLIST SECTION (RE-DESIGNED) */}
        <div className="bg-background/40 rounded-xl backdrop-blur-sm -mx-2 sm:mx-0">
          <TrackList tracks={album.tracks || []} isLoading={isLoading} />
        </div>

        {/* 4. FOOTER CREDITS */}
        <footer className="mt-16 pt-8 border-t border-border/20 flex flex-col gap-4 text-xs text-muted-foreground/60 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-foreground/80 font-bold">
              {new Date(album.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Dot className="size-4" />
            <span>{album.totalTracks} Songs</span>
            <Dot className="size-4" />
            <span>{Math.floor((album.totalDuration || 0) / 60)} Minutes</span>
          </div>
          <div className="space-y-1">
            <p>
              © {album.releaseYear} {album.artist?.name} Studio. All rights
              reserved.
            </p>
            <p>
              ℗ {album.releaseYear} {album.artist?.name} Official Records.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const AlbumEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[400px] gap-6 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
    <div className="p-6 bg-muted/20 rounded-full border border-dashed border-muted-foreground/20">
      <Disc className="size-16 text-muted-foreground/30" />
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-xl font-bold text-foreground">No Tracks Available</h3>
      <p className="text-muted-foreground leading-relaxed">
        This album is currently empty. The artist might be updating the
        tracklist.
      </p>
    </div>
  </div>
);

const AlbumErrorState = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-6 animate-in zoom-in-95 duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full scale-150" />
      <div className="size-32 rounded-full bg-background border-4 border-muted flex items-center justify-center relative z-10 shadow-2xl">
        <AlertCircle className="size-12 text-muted-foreground" />
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
        Album Not Found
      </h2>
      <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
        We couldn't locate the album you're looking for. It may have been
        removed or set to private.
      </p>
    </div>
    <Button
      variant="outline"
      onClick={onBack}
      size="lg"
      className="rounded-full px-10 h-12 font-bold uppercase tracking-widest border-border hover:bg-foreground hover:text-background transition-all duration-300"
    >
      Return to Library
    </Button>
  </div>
);

export default AlbumDetailPage;
