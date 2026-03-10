import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  MoreHorizontal,
  Heart,
  Share2,
  PlusCircle,
  Lock,
  ListMusic,
  Loader2,
} from "lucide-react";
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
  // 🔥 onPlay giờ đây là một Promise để Card có thể hiện Loading
  onPlay?: () => Promise<void>;
}

const PublicPlaylistCard: React.FC<PublicPlaylistCardProps> = ({
  playlist,
  className,
  onPlay,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false); // Trạng thái Load nhạc

  const handleNavigate = () =>
    navigate(`/playlists/${playlist.slug || playlist._id}`);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Không cho sự kiện click lan ra ngoài thẻ Card

    if (onPlay) {
      setIsLoadingPlay(true); // Bật hiệu ứng xoay
      try {
        await onPlay(); // Đợi Component cha lấy nhạc
      } finally {
        setIsLoadingPlay(false); // Tắt hiệu ứng
      }
    } else {
      handleNavigate(); // Fallback nếu quên truyền onPlay
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <article
      onClick={handleNavigate}
      className={cn(
        "group flex flex-col rounded-2xl overflow-hidden bg-transparent",
        "transition-all duration-300 cursor-pointer hover:-translate-y-1.5",
        className,
      )}
    >
      {/* ================= COVER ================= */}
      <div className="relative aspect-square bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
        {/* IMAGE */}
        {playlist.coverImage ? (
          <ImageWithFallback
            src={playlist.coverImage}
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/30">
            <ListMusic className="size-14 text-muted-foreground/30" />
          </div>
        )}

        {/* OVERLAY TỐI DẦN KHI HOVER */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />

        {/* BADGES (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
          {playlist.isSystem ? (
            <Badge className="bg-background/60 backdrop-blur-md text-foreground border-border/50 shadow-sm text-[9px] uppercase font-black tracking-widest px-2 py-0.5">
              Hệ thống
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-black/40 backdrop-blur-md text-white border-white/10 shadow-sm text-[9px] uppercase font-black tracking-widest px-2 py-0.5"
            >
              Cộng đồng
            </Badge>
          )}
          {!playlist.isPublic && (
            <Badge className="bg-destructive/90 backdrop-blur-md text-white border-none shadow-sm px-1.5 py-0.5">
              <Lock className="size-3" />
            </Badge>
          )}
        </div>

        {/* PLAY BUTTON (Nổi lên khi hover HOẶC khi đang Loading) */}
        <div
          className={cn(
            "absolute right-3 bottom-3 z-20 flex transition-all duration-300 ease-out",
            isLoadingPlay
              ? "translate-y-0 opacity-100 scale-100" // Cố định khi đang tải
              : "translate-y-4 opacity-0 scale-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100", // Hiệu ứng nảy khi hover
          )}
        >
          <Button
            size="icon"
            onClick={handlePlay}
            disabled={isLoadingPlay}
            className="size-12 sm:size-14 rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-transform"
          >
            {isLoadingPlay ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <Play className="size-6 ml-1 fill-current" />
            )}
          </Button>
        </div>

        {/* LIKE (DESKTOP) */}
        <div className="hidden md:block absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLike}
            className="size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60"
          >
            <Heart
              className={cn("size-4", isLiked && "fill-red-500 text-red-500")}
            />
          </Button>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="flex flex-col gap-1 p-2 px-1">
        <h3 className="font-bold text-[15px] sm:text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors">
          {playlist.title}
        </h3>

        {/* AUTHOR & TRACK COUNT */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-muted-foreground">
            <span className="truncate max-w-[120px]">
              {playlist.isSystem
                ? "MusicHub"
                : playlist.user?.fullName || "Ẩn danh"}
            </span>
            <span className="size-1 rounded-full bg-muted-foreground/40 shrink-0" />
            <span className="shrink-0">{playlist.totalTracks || 0} bài</span>
          </div>

          {/* MENU Kebab */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                className="hidden md:flex size-6 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-xl"
            >
              <DropdownMenuItem
                onClick={handlePlay}
                className="cursor-pointer font-medium"
              >
                <Play className="size-4 mr-2" /> Phát ngay
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer font-medium">
                <PlusCircle className="size-4 mr-2" /> Thêm vào thư viện
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer font-medium">
                <Share2 className="size-4 mr-2" /> Chia sẻ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
};

export default PublicPlaylistCard;
