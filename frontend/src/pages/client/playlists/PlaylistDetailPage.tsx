import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Hooks & Store
import { usePlaylistDetail } from "@/features/playlist/hooks/usePlaylist";

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

// Modals
import { EditPlaylistTracksModal } from "@/features/playlist/components/EditPlaylistTracksModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { PlaylistDetailSkeleton } from "@/features/playlist/components/PlaylistDetailSkeleton";
import PlaylistModal from "@/features/playlist/components/PlaylistModal";
import { TrackList } from "@/features/track/components/TrackList";
import { useAppSelector } from "@/store/hooks";

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

  const isOwner = useMemo(() => {
    return playlist?.user?._id === user?._id || user?.role === "admin";
  }, [playlist, user]);

  const themeColor = useMemo(
    () => playlist?.themeColor || "#8b5cf6", // Violet-500 default
    [playlist],
  );

  // --- LOADING / ERROR ---
  if (isLoading) return <PlaylistDetailSkeleton />;
  if (isError || !playlist)
    return <PlaylistNotFound onBack={() => navigate("/")} />;

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
          {/* Cover Art - Vuông vắn, bóng đổ sâu */}
          <div className="group relative shrink-0">
            <div className="relative size-52 sm:size-60 md:size-72 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden bg-card border border-white/10 transition-transform duration-500 group-hover:scale-[1.01]">
              {playlist.coverImage ? (
                <img
                  src={playlist.coverImage}
                  alt={playlist.title}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="size-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <ListMusic className="size-20 text-muted-foreground/20" />
                </div>
              )}

              {/* Edit Overlay (Owner Only) */}
              {isOwner && (
                <div
                  onClick={() => setIsEditMetaOpen(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                >
                  <PenSquare className="size-8 text-white mb-2" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                    Edit Cover
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 w-full min-w-0">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-widest h-6 px-2.5 bg-background/40 backdrop-blur-md border-white/10 shadow-sm"
              >
                {playlist.isSystem ? "Curated Playlist" : "Public Playlist"}
              </Badge>
              {playlist.visibility === "private" && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-bold h-6 gap-1 bg-black/40 text-white hover:bg-black/60 border-none"
                >
                  <Lock className="size-2.5" /> Private
                </Badge>
              )}
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1] line-clamp-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => isOwner && setIsEditMetaOpen(true)}
              title={isOwner ? "Click to edit title" : playlist.title}
            >
              {playlist.title}
            </h1>

            {/* Description */}
            {playlist.description && (
              <p className="text-muted-foreground text-sm md:text-base font-medium line-clamp-2 max-w-2xl">
                {playlist.description}
              </p>
            )}

            {isOwner && !playlist.description && (
              <p
                className="text-sm text-muted-foreground/50 italic cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                onClick={() => setIsEditMetaOpen(true)}
              >
                <PenSquare className="size-3" /> Add a description...
              </p>
            )}

            {/* Metadata & User */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-1 mt-2 text-sm font-medium text-foreground/90">
              <div
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer mr-2 pr-2 border-r border-border/40"
                onClick={() => navigate(`/profile/${playlist.user?._id}`)}
              >
                <Avatar className="size-6 border border-white/10 shadow-sm">
                  <AvatarImage src={playlist.user?.avatar} />
                  <AvatarFallback className="text-[9px] font-bold">
                    {playlist.user?.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-bold hover:underline underline-offset-4 decoration-2">
                  {playlist.user?.fullName}
                </span>
              </div>

              <span className="text-muted-foreground">
                {playlist.totalTracks || 0} songs,
              </span>
              <span className="text-muted-foreground opacity-70">
                updated {dayjs(playlist.updatedAt).fromNow()}
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

            {/* Owner Tools */}
            {isOwner && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                <TooltipAction
                  label="Manage Tracks"
                  icon={<ListMusic className="size-5" />}
                  onClick={() => setIsManageTracksOpen(true)}
                />
                <TooltipAction
                  label="Edit Details"
                  icon={<PenSquare className="size-5" />}
                  onClick={() => setIsEditMetaOpen(true)}
                />
              </div>
            )}

            {/* User Actions */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500 hover:bg-transparent transition-transform hover:scale-110 ml-2"
            >
              <Heart className="size-7" />
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
                  <PlusCircle className="size-4" /> Add to Queue
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 py-2.5 font-medium rounded-lg cursor-pointer">
                  <Share2 className="size-4" /> Share
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10 my-1" />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500 focus:bg-red-500/10 gap-3 py-2.5 font-bold rounded-lg cursor-pointer"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      <Trash2 className="size-4" /> Delete Playlist
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 3. TRACKLIST */}
        <div className="bg-background/40 rounded-xl backdrop-blur-sm -mx-2 sm:mx-0">
          <TrackList tracks={playlist.tracks || []} isLoading={isLoading} />
        </div>

        {/* Footer */}
        {playlist.tracks?.length > 0 && (
          <footer className="mt-16 pt-8 border-t border-border/20 flex flex-col gap-2 items-center text-xs text-muted-foreground/60 font-medium">
            <div className="flex items-center gap-2">
              <span>
                Created {dayjs(playlist.createdAt).format("MMMM D, YYYY")}
              </span>
              <Dot className="size-3" />
              <span>{playlist.tracks.length} songs</span>
            </div>
            <p>© {new Date().getFullYear()} Music Platform</p>
          </footer>
        )}
      </div>

      {/* --- MODALS --- */}
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
          /* Logic delete */
        }}
        title="Delete Playlist?"
        description={`This will permanently delete "${playlist?.title}" from your library.`}
        confirmLabel="Delete Forever"
        isDestructive
      />
    </div>
  );
};

// --- SUB-COMPONENTS (Clean & Styled) ---

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
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full size-10"
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="font-bold text-[10px] uppercase tracking-widest bg-black text-white border-white/20 shadow-lg mb-2">
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
  <div className="flex flex-col items-center justify-center h-full gap-6 animate-in slide-in-from-bottom-4 duration-700">
    <div className="relative group cursor-default">
      <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all duration-1000" />
      <div className="relative size-28 rounded-full bg-card border-2 border-dashed border-muted-foreground/20 flex items-center justify-center shadow-sm">
        <Music2 className="size-12 text-muted-foreground/30" />
      </div>
    </div>
    <div className="space-y-2 text-center max-w-sm">
      <h3 className="text-xl font-bold tracking-tight text-foreground">
        It's a bit quiet here
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {isOwner
          ? "Start building your dream collection. Add songs to get the vibe going."
          : "This playlist is currently empty."}
      </p>
    </div>
    {isOwner && (
      <Button
        onClick={onAdd}
        size="lg"
        className="rounded-full px-8 font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
      >
        Find Songs
      </Button>
    )}
  </div>
);

const PlaylistNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-6 animate-in zoom-in-95 duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full scale-150" />
      <div className="size-28 rounded-full bg-background border-4 border-muted flex items-center justify-center relative z-10 shadow-2xl">
        <SearchX className="size-12 text-muted-foreground" />
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
        Playlist Not Found
      </h2>
      <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
        The playlist you are looking for might have been deleted, set to
        private, or the link is incorrect.
      </p>
    </div>
    <Button
      variant="outline"
      onClick={onBack}
      size="lg"
      className="rounded-full px-10 h-12 font-bold uppercase tracking-widest border-border hover:bg-foreground hover:text-background transition-all duration-300"
    >
      Back to Home
    </Button>
  </div>
);

export default PlaylistDetailPage;
