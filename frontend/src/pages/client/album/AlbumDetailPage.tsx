import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Clock,
  Heart,
  MoreHorizontal,
  Disc,
  Music,
  Share2,
  AlertCircle,
  Calendar,
  ListMusic,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/track-helper";

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

const AlbumDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // --- 1. DATA FETCHING ---
  const { data: album, isLoading, isError } = useAlbumDetail(slug!);

  // --- 2. PLAYER MOCK ---
  const activeTrackId = "track_123";
  const isGlobalPlaying = false;
  console.log(album);
  // --- 3. THEME & STYLING ---
  const themeColor = useMemo(() => album?.themeColor || "#7c3aed", [album]);
  console.log(themeColor, album);
  // --- LOADING ---
  if (isLoading) return <AlbumDetailSkeleton />;

  // --- ERROR / NOT FOUND ---
  if (isError || !album)
    return <AlbumErrorState onBack={() => navigate("/albums")} />;

  return (
    <div className="relative min-h-screen bg-background text-foreground animate-in fade-in duration-700 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* --- LAYER 1: DYNAMIC GRADIENT BACKDROP (Adaptive) --- */}
      {/* Opacity thấp để hòa trộn tốt với cả nền trắng và đen */}
      <div
        className="absolute inset-0 h-[500px] md:h-[650px] pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `linear-gradient(to bottom, ${themeColor}40 0%, ${themeColor}05 60%, transparent 100%)`,
        }}
      />

      <div className="relative z-10">
        {/* 1. HERO SECTION */}
        <header className="flex flex-col md:flex-row items-center md:items-end gap-8 p-6 md:p-10 pt-20 md:pt-28 text-center md:text-left">
          {/* Album Cover */}
          <div className="shrink-0">
            <div className="relative size-56 md:size-64 rounded-xl overflow-hidden shadow-2xl bg-card border border-border/50 group transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={album.coverImage || "/images/default-album.png"}
                alt={album.title}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Vinyl Effect Overlay (Optional aesthetic) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none opacity-50" />
            </div>
          </div>

          {/* Album Info */}
          <div className="flex flex-col gap-3 w-full min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge
                variant="outline"
                className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary uppercase text-[10px] tracking-widest px-2.5 h-6"
              >
                {album.type || "Album"}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground line-clamp-2 leading-[1.1]">
              {album.title}
            </h1>

            {/* Metadata Line */}
            <div className="flex items-center justify-center md:justify-start flex-wrap gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground mt-2">
              <div
                className="flex items-center gap-2 hover:text-primary cursor-pointer group transition-colors text-foreground"
                onClick={() => navigate(`/artist/${album.artist?.slug}`)}
              >
                <Avatar className="size-6 border border-border shadow-sm">
                  <AvatarImage src={album.artist?.avatar} />
                  <AvatarFallback className="text-[10px] bg-muted uppercase">
                    {album.artist?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-bold underline-offset-4 group-hover:underline">
                  {album.artist?.name}
                </span>
              </div>

              <span className="hidden sm:inline">•</span>
              <span>{album.releaseYear}</span>

              <span className="hidden sm:inline">•</span>
              <span className="text-foreground/80">
                {album.totalTracks} bài hát,{" "}
                {Math.floor((album.totalDuration || 0) / 60)} phút
              </span>
            </div>
          </div>
        </header>

        {/* 2. STICKY ACTIONS BAR */}
        <div className="sticky top-0 z-30 px-6 md:px-10 py-4 flex items-center justify-between backdrop-blur-xl bg-background/80 border-b border-border/40 transition-all">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Play Button */}
            <Button
              size="icon"
              className="size-12 sm:size-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Play className="size-6 sm:size-7 fill-current ml-1" />
            </Button>

            {/* Like Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full h-11 w-11 transition-colors"
            >
              <Heart className="size-7" />
            </Button>

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-11 w-11 rounded-full"
                >
                  <MoreHorizontal className="size-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-xl p-1.5 border-border/50 shadow-xl bg-popover"
              >
                <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                  <Plus className="size-4" /> Thêm vào Playlist
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                  <ListMusic className="size-4" /> Thêm vào hàng chờ
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer text-primary focus:text-primary">
                  <Share2 className="size-4" /> Chia sẻ Album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 3. TRACKLIST SECTION */}
        <section className="px-2 sm:px-6 md:px-10 pt-6 pb-24">
          <Table>
            <TableHeader className="[&_tr]:border-none">
              <TableRow className="hover:bg-transparent border-b border-border/40 text-muted-foreground/70 uppercase text-[11px] font-bold tracking-wider">
                <TableHead className="w-12 sm:w-14 text-center">#</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Lượt nghe
                </TableHead>
                <TableHead className="w-16 sm:w-20 text-right">
                  <Clock className="size-4 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* --- EMPTY STATE CHECK --- */}
              {!album.tracks || album.tracks.length === 0 ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={4} className="h-[300px] p-0">
                    <AlbumEmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                /* --- TRACK LIST --- */
                album.tracks.map((track: any, index: number) => {
                  const isTrackActive = activeTrackId === track._id;
                  const isPlayingThis = isTrackActive && isGlobalPlaying;

                  return (
                    <TableRow
                      key={track._id}
                      className={cn(
                        "group border-none transition-colors duration-200 rounded-lg cursor-pointer h-14 sm:h-16",
                        isTrackActive
                          ? "bg-primary/10 hover:bg-primary/15" // Active styles
                          : "hover:bg-muted/50" // Standard Hover styles (Light/Dark safe)
                      )}
                    >
                      {/* Index / Animation */}
                      <TableCell className="text-center relative p-0">
                        <div className="flex items-center justify-center font-mono text-sm text-muted-foreground w-full h-full">
                          {isPlayingThis ? (
                            <div className="flex items-end gap-[2px] h-3.5">
                              <span className="w-1 bg-primary animate-music-bar-1 rounded-t-sm" />
                              <span className="w-1 bg-primary animate-music-bar-2 rounded-t-sm" />
                              <span className="w-1 bg-primary animate-music-bar-3 rounded-t-sm" />
                            </div>
                          ) : (
                            <>
                              <span
                                className={cn(
                                  "group-hover:hidden",
                                  isTrackActive && "text-primary font-bold"
                                )}
                              >
                                {index + 1}
                              </span>
                              <Play className="hidden group-hover:block size-4 fill-foreground text-foreground ml-1" />
                            </>
                          )}
                        </div>
                      </TableCell>

                      {/* Title & Artist */}
                      <TableCell className="max-w-[200px] sm:max-w-none">
                        <div className="flex flex-col min-w-0">
                          <span
                            className={cn(
                              "font-bold truncate text-sm sm:text-base transition-colors",
                              isTrackActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            )}
                          >
                            {track.title}
                          </span>
                          <span className="text-[11px] sm:text-xs text-muted-foreground truncate font-medium group-hover:text-foreground/80 transition-colors">
                            {track.artist?.name || album.artist?.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Play Count */}
                      <TableCell className="hidden md:table-cell text-right font-mono text-xs text-muted-foreground/70">
                        {new Intl.NumberFormat("en-US").format(
                          track.playCount || 0
                        )}
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="text-right font-mono text-[11px] sm:text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {formatDuration(track.duration)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* 4. FOOTER CREDITS */}
          <footer className="mt-16 py-12 border-t border-border/40 flex flex-col gap-2 opacity-70">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Calendar className="size-3 text-primary" />
              Phát hành {new Date(album.createdAt).toLocaleDateString()}
            </div>
            <div className="text-xs font-medium space-y-1 text-foreground/80">
              <p>
                © {album.releaseYear} {album.artist?.name} Studio. All rights
                reserved.
              </p>
              <p className="italic text-muted-foreground">
                ℗ {album.releaseYear} {album.artist?.name} Official Records.
              </p>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Tách nhỏ để dễ quản lý style) ---

const AlbumEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10 animate-in slide-in-from-bottom-2 fade-in">
    <div className="size-20 bg-muted/50 rounded-full flex items-center justify-center border border-border">
      <Disc className="size-10 text-muted-foreground/40" />
    </div>
    <div className="space-y-1">
      <h3 className="text-lg font-bold text-foreground">Chưa có bài hát</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
        Album này hiện đang trống. Hãy quay lại sau khi nghệ sĩ cập nhật.
      </p>
    </div>
  </div>
);

const AlbumErrorState = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-6 animate-in zoom-in-95">
    <div className="relative">
      <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full scale-150" />
      <div className="size-24 rounded-full bg-muted flex items-center justify-center border border-border relative z-10">
        <AlertCircle className="size-10 text-muted-foreground" />
      </div>
    </div>
    <div className="space-y-2">
      <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">
        Không tìm thấy Album
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        Đường dẫn bị lỗi, album đã bị xóa hoặc đang ở chế độ riêng tư.
      </p>
    </div>
    <Button
      variant="outline"
      onClick={onBack}
      className="rounded-full px-8 h-11 font-bold uppercase text-[11px] tracking-widest border-border hover:bg-accent hover:text-accent-foreground"
    >
      Quay lại thư viện
    </Button>
  </div>
);

export default AlbumDetailPage;
