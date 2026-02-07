import React from "react";
import {
  Calendar,
  Disc,
  MoreVertical,
  Edit,
  Trash2,
  PlayCircle,
  EyeOff,
  Music2,
} from "lucide-react";
import type { Album } from "@/features/album/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  album: Album;
  onEdit: (album: Album) => void;
  onDelete: (album: Album) => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="group relative bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col overflow-hidden">
      {/* --- 1. COVER IMAGE --- */}
      <div className="relative h-32 sm:h-auto sm:aspect-square bg-muted overflow-hidden">
        {album.coverImage ? (
          <img
            src={album.coverImage}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/30">
            <Music2 className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Overlay Play - Desktop Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
          <button
            onClick={() => navigate(`/albums/${album.slug}`)}
            className="transform scale-90 group-hover:scale-100 transition-transform duration-300 text-white hover:text-primary drop-shadow-lg"
          >
            <PlayCircle className="w-12 h-12 sm:w-14 sm:h-14 fill-current" />
          </button>
        </div>

        {/* Badges - Floating on top */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {!album.isPublic && (
            <Badge
              variant="secondary"
              className="bg-black/70 text-white backdrop-blur border border-white/10 text-[10px] h-5 px-1.5 font-semibold"
            >
              <EyeOff className="w-3 h-3 mr-1" /> Private
            </Badge>
          )}
          <Badge
            variant="default"
            className="text-[10px] h-5 px-1.5 shadow-sm bg-primary/90 hover:bg-primary border border-primary/20 text-primary-foreground font-bold uppercase tracking-wider"
          >
            {album.type}
          </Badge>
        </div>
      </div>

      {/* --- 2. INFO AREA --- */}
      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
        <div className="flex justify-between items-start gap-1">
          <div className="min-w-0 flex-1">
            <h3
              className="font-bold text-sm sm:text-base leading-tight truncate text-foreground hover:text-primary transition-colors cursor-pointer"
              title={album.title}
              onClick={() => navigate(`/albums/${album.slug}`)}
            >
              {album.title}
            </h3>
            <p
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer truncate mt-0.5 sm:mt-1 font-medium"
              title={album.artist?.name}
            >
              {album.artist?.name || (
                <span className="italic opacity-60">Unknown Artist</span>
              )}
            </p>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 -mr-2 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => onEdit(album)}
                className="cursor-pointer font-medium"
              >
                <Edit className="w-4 h-4 mr-2 text-primary" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(album)}
                className="text-destructive focus:text-destructive cursor-pointer font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Metadata Footer */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/60 text-[10px] sm:text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-foreground/50" />
            <span>{album.releaseYear || "N/A"}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1">
            <Disc className="w-3 h-3 text-foreground/50" />
            <span>{album.totalTracks || 0} tracks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
