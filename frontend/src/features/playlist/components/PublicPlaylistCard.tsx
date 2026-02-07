import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// UI
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

// Types
import { Playlist } from "@/features/playlist/types";

interface PublicPlaylistCardProps {
  playlist: Playlist;
  className?: string;
  onPlay?: (playlist: Playlist) => void;
}

const PublicPlaylistCard: React.FC<PublicPlaylistCardProps> = ({
  playlist,
  className,
  onPlay,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const playlistLink = `/playlists/${playlist.slug || playlist._id}`;

  const handleNavigate = () => navigate(playlistLink);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(playlist);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <motion.article
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border/40",
        "hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer",
        className
      )}
    >
      {/* ================= COVER ================= */}
      <div className="relative aspect-square bg-muted">
        {/* IMAGE */}
        {playlist.coverImage ? (
          <ImageWithFallback
            src={playlist.coverImage}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/50">
            <ListMusic className="size-14 text-muted-foreground/30" />
          </div>
        )}

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* BADGES */}
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {playlist.isSystem ? (
            <Badge className="bg-primary/90 text-white text-[10px] h-5 px-1.5">
              <Globe className="size-3 mr-1" /> Official
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-black/50 text-white text-[10px] h-5 px-1.5"
            >
              <User className="size-3 mr-1" /> User
            </Badge>
          )}
        </div>

        {!playlist.isPublic && (
          <div className="absolute top-2 right-2 z-10 bg-black/60 p-1.5 rounded-full">
            <Lock className="size-3 text-white" />
          </div>
        )}

        {/* PLAY BUTTON */}
        <div className="absolute inset-0 items-center justify-center z-20 hidden lg:flex">
          <AnimatePresence>
            {(isHovered || window.innerWidth < 768) && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <Button
                  size="icon"
                  onClick={handlePlay}
                  className="size-12 rounded-full bg-primary text-white shadow-xl hover:scale-110"
                >
                  <Play className="size-5 ml-0.5 fill-current" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LIKE (DESKTOP) */}
        <div className="hidden md:block absolute bottom-2 right-2 z-20">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLike}
            className="size-8 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <Heart
              className={cn("size-4", isLiked && "fill-red-500 text-red-500")}
            />
          </Button>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="flex flex-col gap-1 p-3">
        <h3 className="font-semibold text-sm md:text-base leading-tight truncate text-foreground">
          {playlist.title}
        </h3>

        {/* AUTHOR – ẨN TRÊN MOBILE */}
        <p className="hidden md:block text-xs text-muted-foreground truncate">
          {playlist.isSystem
            ? "MusicHub Editor"
            : playlist.user?.fullName || "Unknown"}
        </p>

        {/* META */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Music2 className="size-3" />
            <span>{playlist.totalTracks || 0} tracks</span>
          </div>

          {/* MENU – DESKTOP */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                className="hidden md:flex size-7 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePlay}>
                <Play className="size-4 mr-2" /> Play
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PlusCircle className="size-4 mr-2" /> Add to Library
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="size-4 mr-2" /> Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.article>
  );
};

export default PublicPlaylistCard;
