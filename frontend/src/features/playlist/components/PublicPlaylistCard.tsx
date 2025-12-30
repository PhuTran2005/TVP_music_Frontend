import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Play,
  MoreHorizontal,
  Heart,
  Share2,
  PlusCircle,
  Music2,
  Globe,
  Lock,
  User,
  ListMusic,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Playlist } from "@/features/playlist/types";

interface PublicPlaylistCardProps {
  playlist: Playlist;
  className?: string;
  onPlay?: (playlist: Playlist) => void; // Hàm xử lý khi bấm nút Play to
}

const PublicPlaylistCard: React.FC<PublicPlaylistCardProps> = ({
  playlist,
  className,
  onPlay,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false); // Logic like (nên dùng hook riêng)
  const [isHovered, setIsHovered] = useState(false);

  // Link điều hướng
  const playlistLink = `/playlists/${playlist.slug || playlist._id}`;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlay) {
      onPlay(playlist);
    } else {
      console.log("Play playlist:", playlist.title);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // Gọi API like tại đây
  };

  const handleNavigate = () => {
    navigate(playlistLink);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer h-full",
        className
      )}
      onClick={handleNavigate}
    >
      {/* --- 1. COVER IMAGE AREA --- */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Main Image with Zoom Effect */}
        <motion.div
          className="w-full h-full"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {playlist.coverImage ? (
            <ImageWithFallback
              src={playlist.coverImage}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/50">
              <ListMusic className="w-16 h-16 text-muted-foreground/20" />
            </div>
          )}
        </motion.div>

        {/* Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* --- BADGES (Top Left) --- */}
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {playlist.isSystem ? (
            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-md h-5 px-1.5 text-[10px] uppercase tracking-wider shadow-sm border-none">
              <Globe className="w-3 h-3 mr-1" /> Official
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-black/50 text-white hover:bg-black/60 backdrop-blur-md h-5 px-1.5 text-[10px] uppercase tracking-wider border-none"
            >
              <User className="w-3 h-3 mr-1" /> User
            </Badge>
          )}
        </div>

        {/* --- PRIVACY LOCK (Top Right) --- */}
        {!playlist.isPublic && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-md text-white">
              <Lock className="size-3" />
            </div>
          </div>
        )}

        {/* --- PLAY BUTTON (Center) --- */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="pointer-events-auto"
              >
                <Button
                  size="icon"
                  className="size-12 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 transition-transform duration-200 border-2 border-white/10"
                  onClick={handlePlayClick}
                >
                  <Play className="size-5 fill-current ml-1" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- LIKE BUTTON (Bottom Right - Overlay) --- */}
        <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="ghost"
            className="size-8 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white backdrop-blur-md"
            onClick={handleLikeClick}
          >
            <Heart
              className={cn(
                "size-4",
                isLiked ? "fill-red-500 text-red-500" : ""
              )}
            />
          </Button>
        </div>
      </div>

      {/* --- 2. INFO AREA --- */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <div className="flex justify-between items-start gap-2">
          {/* Title & Desc */}
          <div className="min-w-0 flex-1">
            <h3
              className="font-bold text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors"
              title={playlist.title}
            >
              {playlist.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span className="truncate max-w-[120px]">
                {playlist.isSystem
                  ? "MusicHub Editor"
                  : playlist.user?.fullName || "Unknown"}
              </span>
            </div>
          </div>

          {/* Context Menu (User Actions) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handlePlayClick}
                className="cursor-pointer"
              >
                <Play className="w-4 h-4 mr-2" /> Play Now
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add to Library
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer Meta */}
        <div className="mt-auto pt-2 flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <Music2 className="size-3" />
            <span>{playlist.totalTracks || 0} tracks</span>
          </div>
          {playlist.totalDuration !== undefined &&
            playlist.totalDuration > 0 && (
              <>
                <span className="w-0.5 h-0.5 bg-muted-foreground/50 rounded-full" />
                <span>{playlist.totalDuration} likes</span>
              </>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default PublicPlaylistCard;
