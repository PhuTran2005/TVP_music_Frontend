import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Heart,
  MoreHorizontal,
  Lock,
  PenSquare,
  ListMusic,
  Trash2,
  PlusCircle,
  Share2,
  Music2,
  SearchX,
  Dot,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";

// Hooks & Store
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

// UI Components
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

// Modals & Sub-components
import { EditPlaylistTracksModal } from "@/features/playlist/components/EditPlaylistTracksModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { PlaylistDetailSkeleton } from "@/features/playlist/components/PlaylistDetailSkeleton";
import PlaylistModal from "@/features/playlist/components/PlaylistModal";
import { TrackList } from "@/features/track/components/TrackList";
import { usePlaylistDetail } from "@/features/playlist/hooks/usePlaylistsQuery";
import { setIsPlaying, setQueue } from "@/features";

dayjs.extend(relativeTime);

const PlaylistDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [isScrolled, setIsScrolled] = useState(false);

  // Modal & Interactive states
  const [isEditMetaOpen, setIsEditMetaOpen] = useState(false);
  const [isManageTracksOpen, setIsManageTracksOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);

  // --- DATA ---
  const { data: playlist, isLoading, isError } = usePlaylistDetail(slug!);
  const { user } = useAppSelector((state) => state.auth);

  // Trích xuất tracks an toàn
  const tracks = useMemo(() => playlist?.tracks || [], [playlist]);
  const dispatch = useAppDispatch();
  // --- PERMISSIONS ---
  const isOwner = useMemo(() => {
    return playlist?.user?._id === user?._id || user?.role === "admin";
  }, [playlist, user]);

  // --- THEME ---
  const themeColor = useMemo(
    () => playlist?.themeColor || "#8b5cf6",
    [playlist],
  );

  // --- UX: Scroll Listener cho Sticky Nav ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGIC PLAY NHẠC ---
  const handlePlayPlaylist = async () => {
    if (tracks.length === 0) {
      toast.error("Danh sách phát này hiện chưa có bài hát nào!");
      return;
    }

    setIsLoadingPlay(true);
    try {
      // 1. Dispatch vào Queue của Redux
      dispatch(setQueue({ tracks, startIndex: 0 }));
      dispatch(setIsPlaying(true));

      // 2. Giả lập delay mạng xíu để nhìn thấy hiệu ứng vòng xoay (Loading)
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success(`Đang phát ${tracks.length} bài hát.`);
    } catch (err) {
      toast.error("Không thể phát nhạc lúc này. Vui lòng thử lại.");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  // --- Fluid Typography ---
  const titleClass = useMemo(() => {
    if (!playlist?.title) return "";
    const len = playlist.title.length;
    if (len > 35) return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
    if (len > 15) return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";
    return "text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem]";
  }, [playlist?.title]);

  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : undefined;
  };

  // --- LOADING / ERROR ---
  if (isLoading) return <PlaylistDetailSkeleton />;
  if (isError || !playlist)
    return <PlaylistNotFound onBack={() => navigate("/playlists")} />;

  // Tính thời lượng
  const totalMinutes = tracks.length
    ? Math.floor(
        tracks.reduce((acc: number, t: any) => acc + (t.duration || 0), 0) / 60,
      )
    : 0;

  return (
    <div className="relative min-h-screen bg-background text-foreground animate-in fade-in duration-1000 overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* ================= LAYER 1: VIBRANT BACKDROP ================= */}
      <div
        className="absolute inset-0 h-[65vh] pointer-events-none transition-all duration-1000 ease-out opacity-100 dark:opacity-60 mix-blend-multiply dark:mix-blend-normal"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(themeColor, 0.7)} 0%, ${hexToRgba(themeColor, 0.2)} 50%, hsl(var(--background)) 100%)`,
        }}
      />
      <div className="absolute inset-0 h-[65vh] bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

      {/* ================= LAYER 2: CONTENT ================= */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 pb-32">
        {/* --- 1. HERO SECTION --- */}
        <header className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 pt-24 pb-8 md:pt-32 md:pb-10">
          {/* Playlist Cover Art */}
          <div className="group relative shrink-0">
            <div
              className="absolute inset-0 blur-2xl rounded-lg scale-110 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
              style={{ backgroundColor: themeColor }}
            />
            <div className="relative size-[220px] sm:size-[260px] md:size-[300px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-muted border border-border/10 transition-transform duration-500 group-hover:scale-[1.02]">
              {playlist.coverImage ? (
                <img
                  src={playlist.coverImage}
                  alt={playlist.title}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="size-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <ListMusic className="size-20 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none mix-blend-overlay" />

              {/* Edit Overlay (Owner Only) */}
              {isOwner && (
                <div
                  onClick={() => setIsEditMetaOpen(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                >
                  <PenSquare className="size-8 text-white mb-2" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                    Chỉnh sửa
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 w-full min-w-0">
            <div className="flex items-center gap-2">
              <Badge className="uppercase text-[10px] font-black tracking-[0.2em] px-3 py-1 bg-background/50 backdrop-blur-md text-foreground border-border/50 shadow-sm hidden md:inline-flex">
                {playlist.isSystem ? "Playlist Hệ Thống" : "Playlist Cộng Đồng"}
              </Badge>
              {playlist.visibility === "private" && (
                <Badge
                  variant="destructive"
                  className="uppercase text-[10px] font-black tracking-widest px-2.5 py-1 gap-1"
                >
                  <Lock className="size-3" /> Riêng tư
                </Badge>
              )}
            </div>

            <h1
              className={cn(
                "font-black tracking-tighter leading-[1.05] drop-shadow-2xl text-foreground transition-opacity",
                titleClass,
                isOwner && "hover:opacity-80 cursor-pointer",
              )}
              onClick={() => isOwner && setIsEditMetaOpen(true)}
              title={isOwner ? "Nhấn để đổi tên" : playlist.title}
            >
              {playlist.title}
            </h1>

            {playlist.description && (
              <p className="text-muted-foreground text-[14px] md:text-[15px] font-medium line-clamp-2 max-w-2xl mt-1">
                {playlist.description}
              </p>
            )}

            {isOwner && !playlist.description && (
              <p
                className="text-sm text-muted-foreground/50 italic cursor-pointer hover:text-primary transition-colors flex items-center gap-1.5 mt-1"
                onClick={() => setIsEditMetaOpen(true)}
              >
                <PenSquare className="size-3.5" /> Thêm mô tả cho danh sách
                phát...
              </p>
            )}

            {/* User & Metadata */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-1 mt-2 text-[13px] font-bold text-foreground">
              <div
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer mr-2 group/user"
                onClick={() => navigate(`/profile/${playlist.user?._id}`)}
              >
                <Avatar className="size-7 border-[1.5px] border-background shadow-sm">
                  <AvatarImage src={playlist.user?.avatar} />
                  <AvatarFallback className="text-[10px] font-black bg-primary/20 text-primary">
                    {playlist.user?.fullName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-black group-hover:underline underline-offset-4 decoration-2">
                  {playlist.user?.fullName || "Hệ thống"}
                </span>
              </div>

              <span className="text-muted-foreground/60 hidden sm:inline">
                •
              </span>
              <span className="opacity-90">
                {playlist.totalTracks || 0} bài hát
              </span>

              {totalMinutes > 0 && (
                <>
                  <span className="text-muted-foreground/60 hidden sm:inline">
                    ,
                  </span>
                  <span className="text-muted-foreground font-medium ml-1">
                    {totalMinutes} phút
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* --- 2. DYNAMIC STICKY ACTION BAR --- */}
        <div className="sticky top-[64px] z-40 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 mb-6 flex items-center justify-between bg-background/85 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Primary Action: Play */}
            <Button
              size="icon"
              onClick={handlePlayPlaylist}
              disabled={isLoadingPlay}
              className="size-14 sm:size-16 rounded-full bg-primary text-primary-foreground shadow-xl active:scale-90 transition-all hover:scale-105 group shrink-0"
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

            {/* Nút Tim (Save) */}
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

            {/* Owner Tools */}
            {isOwner && (
              <div className="flex items-center gap-1 sm:gap-2 ml-1">
                <TooltipAction
                  label="Thêm bài hát"
                  icon={<ListMusic className="size-5 sm:size-6" />}
                  onClick={() => setIsManageTracksOpen(true)}
                />
                <TooltipAction
                  label="Sửa thông tin"
                  icon={<PenSquare className="size-5 sm:size-6" />}
                  onClick={() => setIsEditMetaOpen(true)}
                />
              </div>
            )}

            {/* Menu Khác */}
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
                  <PlusCircle className="size-4" /> Thêm vào danh sách khác
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 py-3 font-semibold text-sm rounded-xl cursor-pointer text-primary focus:text-primary focus:bg-primary/10">
                  <Share2 className="size-4" /> Chia sẻ Playlist
                </DropdownMenuItem>

                {isOwner && (
                  <>
                    <DropdownMenuSeparator className="bg-border/50 my-1" />
                    <DropdownMenuItem
                      className="gap-3 py-3 font-bold text-sm rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      <Trash2 className="size-4" /> Xóa Playlist
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 🔥 Mini Nav Info (Fades in) */}
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-500 transform pointer-events-none origin-right",
              isScrolled
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-95 translate-x-4",
            )}
          >
            <span className="font-bold text-sm hidden md:block truncate max-w-[150px] lg:max-w-[250px]">
              {playlist.title}
            </span>
            <div className="size-10 sm:size-11 rounded-md overflow-hidden shadow-sm border border-border/40 shrink-0 bg-muted flex items-center justify-center">
              {playlist.coverImage ? (
                <img
                  src={playlist.coverImage}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <ListMusic className="size-5 text-muted-foreground/50" />
              )}
            </div>
          </div>
        </div>

        {/* --- 3. TRACKLIST SECTION --- */}
        <div className="bg-background/40 rounded-2xl backdrop-blur-sm -mx-2 sm:mx-0 min-h-[400px]">
          {tracks.length > 0 ? (
            <TrackList tracks={tracks} isLoading={isLoading} />
          ) : (
            <EmptyPlaylistState
              isOwner={isOwner}
              onAdd={() => setIsManageTracksOpen(true)}
            />
          )}
        </div>

        {/* --- 4. FOOTER CREDITS --- */}
        {tracks.length > 0 && (
          <footer className="mt-20 pt-8 border-t border-border/30 flex flex-col gap-2 items-center text-xs text-muted-foreground/70 font-medium">
            <div className="flex items-center gap-2">
              <span>
                Đã tạo ngày {dayjs(playlist.createdAt).format("DD/MM/YYYY")}
              </span>
              <Dot className="size-4" />
              <span className="text-foreground/90 font-bold">
                {tracks.length} bài hát
              </span>
            </div>
          </footer>
        )}
      </div>

      {/* ================= MODALS ================= */}
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
          // Xử lý logic Delete ở đây
          setIsDeleteOpen(false);
        }}
        title="Xóa danh sách phát?"
        description={`Hành động này không thể hoàn tác. Danh sách phát "${playlist?.title}" sẽ bị xóa vĩnh viễn khỏi thư viện của bạn.`}
        confirmLabel="Xóa vĩnh viễn"
        isDestructive
      />
    </div>
  );
};

// ================= SUB-COMPONENTS =================

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
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full size-11 sm:size-12 transition-colors"
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="font-bold text-[10px] uppercase tracking-widest bg-foreground text-background border-border shadow-xl mb-2 px-3 py-1.5 rounded-full">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const EmptyPlaylistState = ({
  isOwner,
  onAdd,
}: {
  isOwner: boolean;
  onAdd: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-full py-20 gap-6 animate-in slide-in-from-bottom-4 duration-700">
    <div className="relative group cursor-default">
      <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all duration-1000 scale-150" />
      <div className="relative size-32 rounded-full bg-card border-2 border-dashed border-border flex items-center justify-center shadow-lg">
        <Music2 className="size-12 text-muted-foreground/40" />
      </div>
    </div>
    <div className="space-y-2 text-center max-w-sm">
      <h3 className="text-2xl font-black tracking-tight text-foreground">
        Ở đây hơi vắng lặng
      </h3>
      <p className="text-muted-foreground leading-relaxed font-medium">
        {isOwner
          ? "Hãy bắt đầu xây dựng bộ sưu tập mơ ước của bạn. Thêm các bài hát để tạo nên giai điệu riêng."
          : "Danh sách phát này hiện tại chưa có bài hát nào."}
      </p>
    </div>
    {isOwner && (
      <Button
        onClick={onAdd}
        size="lg"
        className="rounded-full px-10 h-12 mt-2 font-bold uppercase text-[11px] tracking-widest shadow-xl hover:scale-105 transition-transform"
      >
        Tìm bài hát
      </Button>
    )}
  </div>
);

const PlaylistNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-6 bg-background animate-in zoom-in-95 duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-destructive/10 blur-[80px] rounded-full scale-150" />
      <div className="size-32 rounded-full bg-background border-4 border-muted flex items-center justify-center relative z-10 shadow-2xl">
        <SearchX className="size-12 text-muted-foreground" />
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
        Không tìm thấy Playlist
      </h2>
      <p className="text-muted-foreground text-base max-w-md mx-auto font-medium leading-relaxed">
        Danh sách phát bạn tìm kiếm có thể đã bị xóa, đặt về chế độ riêng tư,
        hoặc đường dẫn không hợp lệ.
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

export default PlaylistDetailPage;
