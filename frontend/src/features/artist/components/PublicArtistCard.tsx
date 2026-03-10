import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Music,
  CheckCircle2,
  Play,
  Loader2,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

import { Artist } from "@/features/artist/types";
import { Genre } from "@/features/genre/types";

interface Props {
  artist: Artist;
  variant?: "default" | "compact";
  className?: string;
  onPlay?: () => Promise<void>;
}

const formatNumber = (num = 0) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

const PublicArtistCard: React.FC<Props> = ({
  artist,
  variant = "default",
  className,
  onPlay,
}) => {
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);

  // --- HANDLERS ---
  const handleNavigate = () =>
    navigate(`/artists/${artist.slug || artist._id}`);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onPlay) {
      setIsLoadingPlay(true);
      try {
        await onPlay();
      } finally {
        setIsLoadingPlay(false);
      }
    } else {
      handleNavigate();
    }
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowed(!isFollowed);
    // TODO: Call API to follow/unfollow
  };

  const mainGenre = artist.genres?.[0] as Genre | undefined;

  return (
    <motion.article
      onClick={handleNavigate}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative flex flex-col bg-card rounded-2xl sm:rounded-[20px] overflow-hidden border border-border/40 hover:border-primary/20 shadow-sm hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] transition-all duration-500 cursor-pointer h-full",
        className,
      )}
    >
      {/* ================= 1. IMAGE SECTION ================= */}
      <div className="relative aspect-square overflow-hidden bg-muted shrink-0">
        <ImageWithFallback
          src={artist.avatar || artist.coverImage}
          alt={artist.name}
          className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* PLAY BUTTON (Nổi bật) */}
        <div
          className={cn(
            "absolute right-3 bottom-3 z-20 transition-all duration-300 ease-out",
            isLoadingPlay
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100",
          )}
        >
          <Button
            size="icon"
            onClick={handlePlay}
            disabled={isLoadingPlay}
            className="size-10 sm:size-14 rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-transform"
          >
            {isLoadingPlay ? (
              <Loader2 className="size-4 sm:size-6 animate-spin" />
            ) : (
              <Play className="size-4 sm:size-6 ml-1 fill-current" />
            )}
          </Button>
        </div>
      </div>

      {/* ================= 2. INFO SECTION ================= */}
      {/* Padding linh hoạt: Nhỏ trên mobile (p-3), to trên Desktop (p-5) */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Tên & Tích xanh */}
          <div className="flex items-center gap-1.5">
            <h3 className="font-black text-base sm:text-xl truncate text-foreground group-hover:text-primary transition-colors leading-tight">
              {artist.name}
            </h3>
            {artist.isVerified && (
              <CheckCircle2 className="size-3.5 sm:size-5 text-blue-500 shrink-0 sm:mt-0.5" />
            )}
          </div>

          {/* Thống kê (Chỉ hiện Số Follower trên Mobile. Hiện cả Genre/Track trên Desktop) */}
          <div className="flex items-center gap-2 text-[11px] sm:text-[13px] font-medium text-muted-foreground truncate">
            <span className="flex items-center gap-1 shrink-0">
              <Users className="size-3 sm:size-3.5" />
              {formatNumber(artist.totalFollowers)}
            </span>

            {/* Chỉ hiện dấu chấm và Thể loại trên màn hình lớn (sm trở lên) */}
            <span className="hidden sm:block size-1 rounded-full bg-muted-foreground/40 shrink-0" />
            <span className="hidden sm:block truncate">
              {mainGenre ? (
                mainGenre.name
              ) : (
                <span className="flex items-center gap-1">
                  <Music className="size-3 sm:size-3.5" />
                  {artist.totalTracks || 0} Bài
                </span>
              )}
            </span>
          </div>

          {/* Tiểu sử (Chỉ hiện khi variant = default VÀ trên màn hình Desktop) */}
          {variant === "default" && artist.bio && (
            <p className="hidden md:block text-[13px] text-muted-foreground/80 line-clamp-2 mt-2 leading-relaxed">
              {artist.bio}
            </p>
          )}
        </div>

        {/* ================= 3. ACTIONS ================= */}
        <div className="flex items-center mt-auto pt-1 sm:pt-2">
          <Button
            size="sm"
            onClick={handleFollow}
            variant={isFollowed ? "secondary" : "default"}
            className={cn(
              "w-full rounded-full h-8 sm:h-10 text-[11px] sm:text-sm font-bold transition-all",
              isFollowed
                ? "bg-muted text-foreground hover:bg-destructive/10 hover:text-destructive border border-transparent"
                : "shadow-sm group/follow",
            )}
          >
            {isFollowed ? (
              <>
                <UserCheck className="size-3.5 sm:size-4 mr-1.5" />
                <span className="truncate">Đã theo dõi</span>
              </>
            ) : (
              <>
                <UserPlus className="size-3.5 sm:size-4 mr-1.5 transition-transform group-hover/follow:scale-110" />
                <span className="truncate">Theo dõi</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default PublicArtistCard;
