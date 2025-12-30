import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Play,
  MoreHorizontal,
  Music2,
  Share2,
  PlusCircle,
  Calendar,
  Disc3,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Album } from "@/features/album/types";
import { Genre } from "@/features/genre/types";

interface PublicAlbumCardProps {
  album: Album;
  className?: string;
  onPlay?: (album: Album) => void;
}

const PublicAlbumCard: React.FC<PublicAlbumCardProps> = ({
  album,
  className,
  onPlay,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Gradient mặc định nếu không có color
  const gradientColor = album.themeColor || "from-primary/80 to-purple-600/80";

  const handleCardClick = () => {
    navigate(`/albums/${album.slug || album._id}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) onPlay(album);
    else console.log("Play album:", album.title);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col gap-3 cursor-pointer h-full",
        className
      )}
    >
      {/* --- 1. ARTWORK CONTAINER --- */}
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-muted border border-border/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:-translate-y-1.5">
        {/* Main Image with Zoom Effect */}
        <motion.div
          className="w-full h-full"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {album.coverImage ? (
            <ImageWithFallback
              src={album.coverImage}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/50">
              <Disc3 className="w-1/3 h-1/3 text-muted-foreground/30" />
            </div>
          )}
        </motion.div>

        {/* Gradient Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
          {album.type && (
            <Badge className="bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border-white/10 h-5 px-2 hover:bg-black/80 shadow-sm">
              {album.type}
            </Badge>
          )}
          {album.genres &&
            album.genres.map((g: Genre) => (
              <Badge
                variant="secondary"
                className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border-none h-5 px-2"
              >
                {g.name}
              </Badge>
            ))}
        </div>

        {/* Heart Button (Top Right) */}
        <div className="absolute top-3 right-3 z-20">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleLikeClick}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isLiked ? "fill-red-500 text-red-500" : ""
              )}
            />
          </Button>
        </div>

        {/* Play Button (Center) */}
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
                  className="size-14 rounded-full bg-white text-black shadow-2xl hover:scale-110 transition-transform duration-200 border-none hover:bg-white/90"
                  onClick={handlePlayClick}
                >
                  <Play className="size-6 fill-current ml-1" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- 2. INFO SECTION --- */}
      <div className="space-y-1 px-1 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className="font-bold text-[15px] sm:text-base text-foreground truncate group-hover:text-primary transition-colors leading-snug"
              title={album.title}
            >
              {album.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
              <Link
                to={`/artist/${album.artist?.slug || album.artist?._id || ""}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-foreground hover:underline truncate max-w-[180px]"
              >
                {album.artist?.name || "Unknown Artist"}
              </Link>
            </div>
          </div>

          {/* Context Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border-border/50 shadow-xl bg-background/95 backdrop-blur-xl"
            >
              <DropdownMenuItem
                className="gap-3 py-2.5 font-medium cursor-pointer"
                onClick={handlePlayClick}
              >
                <Play className="size-4" /> Phát ngay
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 font-medium cursor-pointer">
                <Music2 className="size-4" /> Thêm vào danh sách phát
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 font-medium cursor-pointer">
                <PlusCircle className="size-4" /> Lưu vào thư viện
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="gap-3 py-2.5 font-medium cursor-pointer">
                <Share2 className="size-4" /> Chia sẻ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wide pt-1 mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />{" "}
            {album.releaseYear || new Date().getFullYear()}
          </span>
          {album.totalTracks && (
            <>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span>{album.totalTracks} Tracks</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PublicAlbumCard;
