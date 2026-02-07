import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Play, MoreVertical, Heart, Share2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface PublicAlbumCardProps {
  album: Album;
  className?: string;
  onPlay?: (album: Album) => void;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const PublicAlbumCard: React.FC<PublicAlbumCardProps> = ({
  album,
  className,
  onPlay,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleNavigate = () => {
    navigate(`/albums/${album.slug || album._id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(album);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((p) => !p);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onClick={handleNavigate}
      className={cn("group cursor-pointer flex flex-col gap-3", className)}
    >
      {/* ================= ARTWORK ================= */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <ImageWithFallback
          src={album.coverImage}
          alt={album.title}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Album type */}
        {album.type && (
          <Badge className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-black/60 text-white backdrop-blur-md">
            {album.type}
          </Badge>
        )}

        {/* Play CTA */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            onClick={handlePlay}
            className="
              size-14 rounded-full
              bg-primary text-primary-foreground
              shadow-[0_24px_80px_rgba(0,0,0,0.6)]
              opacity-0 scale-90
              transition-all duration-300
              group-hover:opacity-100 group-hover:scale-100
            "
          >
            <Play className="size-6 ml-0.5 fill-current" />
          </Button>
        </div>

        {/* Desktop actions */}
        <div className="absolute top-3 right-3 hidden lg:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleLike}
            className={cn(
              "size-9 rounded-full backdrop-blur-md",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("size-4", isLiked && "fill-current")} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="secondary"
                className="size-9 rounded-full backdrop-blur-md"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem onClick={handlePlay}>
                <Play className="mr-2 size-4" /> Play
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PlusCircle className="mr-2 size-4" /> Add to library
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="mr-2 size-4" /> Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="px-1 space-y-1">
        <h3 className="font-bold text-[15px] leading-tight truncate group-hover:text-primary transition-colors">
          {album.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link
            to={`/artist/${album.artist?.slug || album.artist?._id}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate hover:text-foreground hover:underline"
          >
            {album.artist?.name || "Unknown Artist"}
          </Link>

          <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded-md">
            {album.releaseYear || new Date().getFullYear()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicAlbumCard;
