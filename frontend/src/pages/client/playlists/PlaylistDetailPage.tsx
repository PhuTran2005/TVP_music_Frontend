import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Clock,
  Heart,
  MoreHorizontal,
  Lock,
  PenSquare,
  ListMusic,
  Trash2,
  PlusCircle,
  Share2,
  Calendar,
  AlertCircle,
  Music2,
  User,
  Disc3,
  SearchX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatDuration } from "@/utils/track-helper";

// Hooks & Store
import { usePlaylistDetail } from "@/features/playlist/hooks/usePlaylist";
import { useAppSelector } from "@/store/store";

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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Modals
import { EditPlaylistTracksModal } from "@/features/playlist/components/EditPlaylistTracksModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { PlaylistDetailSkeleton } from "@/features/playlist/components/PlaylistDetailSkeleton";
import PlaylistModal from "@/features/playlist/components/PlaylistModal";
import { Track } from "@/features/track/types";

dayjs.extend(relativeTime);

const PlaylistDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [isEditMetaOpen, setIsEditMetaOpen] = useState(false);
  const [isManageTracksOpen, setIsManageTracksOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- DATA ---
  const { data, isLoading, isError } = usePlaylistDetail(slug!);
  const playlist = data?.data;
  const { user } = useAppSelector((state) => state.auth);

  // --- PLAYER MOCK ---
  const activeTrackId = "track_123";
  const isGlobalPlaying = false;

  const isOwner = useMemo(() => {
    return playlist?.user?._id === user?._id || user?.role === "admin";
  }, [playlist, user]);

  // Fallback theme color nếu không có
  const themeColor = useMemo(
    () => playlist?.themeColor || "#7c3aed", // Violet default
    [playlist]
  );

  // --- 1. LOADING STATE ---
  if (isLoading) return <PlaylistDetailSkeleton />;

  // --- 2. ERROR / NOT FOUND STATE ---
  if (isError || !playlist)
    return <PlaylistNotFound onBack={() => navigate("/")} />;

  return (
    <div className="relative min-h-screen bg-background text-foreground animate-in fade-in duration-700 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* --- LAYER 1: DYNAMIC GRADIENT BACKDROP (Adaptive Light/Dark) --- */}
      {/* Sử dụng opacity thấp hơn để hòa trộn tốt với cả nền trắng và đen */}
      <div
        className="absolute inset-0 h-[500px] md:h-[650px] pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `linear-gradient(to bottom, ${themeColor}40 0%, ${themeColor}05 60%, transparent 100%)`,
        }}
      />

      <div className="relative z-10">
        {/* 1. HERO SECTION */}
        <header className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 p-6 md:p-10 pt-20 md:pt-28">
          {/* Cover Art Container */}
          <div className="group relative shrink-0 shadow-2xl rounded-xl overflow-hidden w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 border border-border/50 bg-card">
            {playlist.coverImage ? (
              <img
                src={playlist.coverImage}
                alt={playlist.title}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="size-full bg-muted/50 flex items-center justify-center">
                <ListMusic className="size-20 text-muted-foreground/30" />
              </div>
            )}

            {/* Overlay Edit (Chỉ hiện khi hover) */}
            {isOwner && (
              <div
                onClick={() => setIsEditMetaOpen(true)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-[2px]"
              >
                <PenSquare className="size-10 text-white mb-2 drop-shadow-md" />
                <span className="text-white font-bold text-[10px] uppercase tracking-widest drop-shadow-md">
                  Sửa ảnh bìa
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-3 w-full text-center md:text-left min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge
                variant="outline"
                className="bg-background/50 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest px-2.5 h-6 border-primary/20 text-primary"
              >
                {playlist.isSystem ? "System Curated" : "Playlist"}
              </Badge>

              {playlist.visibility === "private" && (
                <Badge
                  variant="destructive"
                  className="text-[9px] font-bold h-6 px-2 uppercase tracking-wider"
                >
                  <Lock className="size-2.5 mr-1" /> Private
                </Badge>
              )}
            </div>

            <h1
              className={cn(
                "text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] line-clamp-2 text-foreground",
                isOwner &&
                  "cursor-pointer hover:underline decoration-primary/50 underline-offset-8 transition-all"
              )}
              onClick={() => isOwner && setIsEditMetaOpen(true)}
            >
              {playlist.title}
            </h1>

            {playlist.description ? (
              <p className="text-sm md:text-base text-muted-foreground font-medium line-clamp-2 max-w-3xl mt-1">
                {playlist.description}
              </p>
            ) : (
              isOwner && (
                <p
                  className="text-sm text-muted-foreground/60 italic cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setIsEditMetaOpen(true)}
                >
                  Thêm mô tả cho playlist...
                </p>
              )
            )}

            {/* Metadata Footer */}
            <div className="flex items-center justify-center md:justify-start flex-wrap gap-x-4 gap-y-2 mt-4 text-sm font-medium text-foreground/80">
              <div
                className="flex items-center gap-2 group cursor-pointer transition-colors hover:text-primary"
                onClick={() => navigate(`/profile/${playlist.user?._id}`)}
              >
                <Avatar className="size-6 border border-border shadow-sm">
                  <AvatarImage src={playlist.user?.avatar} />
                  <AvatarFallback className="bg-muted text-[10px] uppercase">
                    {playlist.user?.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-bold">{playlist.user?.fullName}</span>
              </div>
              <span className="text-muted-foreground hidden sm:inline">•</span>

              <div className="flex items-center gap-1.5">
                <Disc3 className="size-4 text-muted-foreground" />
                <span>{playlist.totalTracks || 0} bài hát</span>
              </div>
              <span className="text-muted-foreground hidden sm:inline">•</span>

              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                Cập nhật {dayjs(playlist.updatedAt).fromNow()}
              </span>
            </div>
          </div>
        </header>

        {/* 2. STICKY ACTIONS BAR */}
        <div className="sticky top-0 z-30 px-6 md:px-10 py-4 flex items-center justify-between backdrop-blur-xl bg-background/80 border-b border-border/40 transition-all">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size="icon"
              className="size-12 sm:size-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all hover:shadow-primary/25"
            >
              <Play className="size-6 sm:size-7 fill-current ml-1" />
            </Button>

            {isOwner && (
              <div className="flex items-center gap-2">
                <TooltipAction
                  label="Quản lý bài hát"
                  icon={<ListMusic className="size-5" />}
                  onClick={() => setIsManageTracksOpen(true)}
                />
                <TooltipAction
                  label="Sửa thông tin"
                  icon={<PenSquare className="size-5" />}
                  onClick={() => setIsEditMetaOpen(true)}
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full h-11 w-11 transition-colors"
            >
              <Heart className="size-6" />
            </Button>
          </div>

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
              align="end"
              className="w-56 rounded-xl p-1.5 border-border/50 shadow-xl bg-popover"
            >
              <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                <PlusCircle className="size-4" /> Thêm vào hàng chờ
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                <Share2 className="size-4" /> Chia sẻ Playlist
              </DropdownMenuItem>
              {isOwner && (
                <>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 gap-3 py-2.5 font-bold rounded-lg cursor-pointer"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 className="size-4" /> Xóa Playlist
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 3. TRACKLIST SECTION */}
        <section className="px-2 sm:px-6 md:px-10 pt-6 pb-32">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/40 text-muted-foreground/70 uppercase text-[11px] font-bold tracking-wider">
                <TableHead className="w-12 sm:w-14 text-center">#</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead className="hidden md:table-cell">Album</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Ngày thêm
                </TableHead>
                <TableHead className="w-16 sm:w-20 text-right">
                  <Clock className="size-4 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* --- TRƯỜNG HỢP 1: CÓ DỮ LIỆU --- */}
              {playlist.tracks?.length > 0 ? (
                playlist.tracks.map((track: Track, index: number) => {
                  const isTrackActive = activeTrackId === track._id;
                  const isPlayingThis = isTrackActive && isGlobalPlaying;

                  return (
                    <TableRow
                      key={track._id}
                      className={cn(
                        "group border-none transition-colors duration-200 rounded-lg cursor-pointer h-14 sm:h-16",
                        isTrackActive
                          ? "bg-primary/10 hover:bg-primary/15" // Active state
                          : "hover:bg-muted/50" // Hover state chuẩn light/dark
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

                      {/* Info */}
                      <TableCell className="max-w-[200px] sm:max-w-none">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={track.coverImage}
                              className="size-10 rounded-md object-cover shadow-sm border border-border/10"
                              alt=""
                            />
                            {/* Optional: Playing Overlay */}
                            {isPlayingThis && (
                              <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                                <Music2 className="size-5 text-white animate-pulse" />
                              </div>
                            )}
                          </div>
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
                            <span className="text-xs text-muted-foreground truncate font-medium group-hover:text-foreground/80 transition-colors">
                              {track.artist?.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Album */}
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-medium hover:text-foreground hover:underline cursor-pointer transition-colors max-w-[200px] truncate">
                        {track.album?.title || "Single"}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground/60 font-mono">
                        {dayjs(playlist.createdAt).format("DD/MM/YYYY")}
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="text-right text-xs font-mono text-muted-foreground group-hover:text-foreground">
                        {formatDuration(track.duration)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                /* --- TRƯỜNG HỢP 2: PLAYLIST RỖNG --- */
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={5} className="h-[400px] p-0">
                    <EmptyPlaylistState
                      isOwner={isOwner}
                      onAdd={() => setIsManageTracksOpen(true)}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer Metadata */}
          {playlist.tracks?.length > 0 && (
            <footer className="mt-16 py-12 border-t border-border/40 flex flex-col gap-2 items-center text-muted-foreground">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Calendar className="size-3.5" /> Created{" "}
                {dayjs(playlist.createdAt).format("MMM D, YYYY")}
              </div>
              <p className="text-[10px] opacity-60">
                © {new Date().getFullYear()} Studio Music Platform.
              </p>
            </footer>
          )}
        </section>
      </div>

      {/* --- MODAL SYSTEM --- */}
      <PlaylistModal
        isOpen={isEditMetaOpen}
        onClose={() => setIsEditMetaOpen(false)}
        playlist={playlist}
      />
      <EditPlaylistTracksModal
        isOpen={isManageTracksOpen}
        onClose={() => setIsManageTracksOpen(false)}
        playlistId={playlist?._id}
      />
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          // Logic delete API
        }}
        title="Xóa Playlist vĩnh viễn?"
        description={`"${playlist?.title}" sẽ bị gỡ bỏ khỏi thư viện của bạn. Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        isDestructive
      />
    </div>
  );
};

// --- SUB-COMPONENTS (Tách ra và Style chuẩn) ---

const TooltipAction = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary" // Dùng secondary thay vì custom class cứng
          size="icon"
          className="rounded-full size-11 bg-background/50 hover:bg-background border border-border/50 transition-all"
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="font-bold text-[10px] uppercase tracking-widest bg-popover text-popover-foreground border-border shadow-lg">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// --- COMPONENT: EMPTY STATE (Đẹp hơn, chuẩn theme) ---
const EmptyPlaylistState = ({
  isOwner,
  onAdd,
}: {
  isOwner: boolean;
  onAdd: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-full gap-6 animate-in slide-in-from-bottom-4 duration-500">
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all" />
      <div className="relative size-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center shadow-inner">
        <Disc3 className="size-10 text-muted-foreground/50 group-hover:text-primary transition-colors duration-500 animate-slow-spin" />
      </div>
    </div>

    <div className="space-y-2 text-center max-w-sm">
      <h3 className="text-xl font-bold tracking-tight text-foreground">
        Playlist này còn trống
      </h3>
      <p className="text-sm text-muted-foreground">
        {isOwner
          ? "Hãy bắt đầu thêm những bài hát yêu thích để tạo nên giai điệu của riêng bạn."
          : "Người tạo chưa thêm bài hát nào vào playlist này."}
      </p>
    </div>

    {isOwner && (
      <Button
        onClick={onAdd}
        size="lg"
        className="rounded-full px-8 font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
      >
        <PlusCircle className="size-4 mr-2" />
        Thêm bài hát ngay
      </Button>
    )}
  </div>
);

// --- COMPONENT: NOT FOUND / ERROR (Toàn màn hình) ---
const PlaylistNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-6 animate-in zoom-in-95 duration-300">
    <div className="size-24 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
      <SearchX className="size-12 text-destructive opacity-80" />
    </div>
    <div className="space-y-2">
      <h2 className="text-3xl font-black tracking-tight text-foreground">
        Không tìm thấy Playlist
      </h2>
      <p className="text-muted-foreground max-w-[300px] mx-auto">
        Playlist bạn đang tìm kiếm có thể đã bị xóa, chuyển sang chế độ riêng tư
        hoặc đường dẫn không chính xác.
      </p>
    </div>
    <Button
      onClick={onBack}
      variant="outline"
      className="rounded-full px-8 h-11 font-bold uppercase text-[11px] tracking-widest border-border hover:bg-accent"
    >
      Quay lại trang chủ
    </Button>
  </div>
);

export default PlaylistDetailPage;
