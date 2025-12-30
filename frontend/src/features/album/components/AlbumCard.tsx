import React from "react";
import {
  Calendar,
  Disc,
  MoreVertical,
  Edit,
  Trash2,
  PlayCircle,
  EyeOff,
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
    <div className="group relative bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* --- 1. COVER IMAGE --- */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={album.coverImage || "/images/default-cover.png"}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay Play Icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button
            onClick={() => navigate(`/albums/${album.slug}`)}
            className="transform scale-90 group-hover:scale-100 transition-transform duration-300 text-white hover:text-primary"
          >
            <PlayCircle className="w-12 h-12 fill-current" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!album.isPublic && (
            <Badge
              variant="secondary"
              className="bg-black/60 text-white backdrop-blur-md border-transparent text-[10px] h-5 px-1.5"
            >
              <EyeOff className="w-3 h-3 mr-1" /> Private
            </Badge>
          )}
          <Badge variant="default" className="text-[10px] h-5 px-1.5 shadow-sm">
            {album.type}
          </Badge>
        </div>
      </div>

      {/* --- 2. INFO AREA --- */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-1">
          <div className="min-w-0 flex-1 space-y-1">
            <h3
              className="font-semibold text-base leading-tight truncate text-foreground"
              title={album.title}
            >
              {album.title}
            </h3>
            <p
              className="text-sm text-muted-foreground truncate hover:text-primary transition-colors cursor-pointer"
              title={album.artist?.name}
            >
              {album.artist?.name || (
                <span className="italic text-muted-foreground/50">
                  Unknown Artist
                </span>
              )}
            </p>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-muted-foreground"
              >
                <MoreVertical className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(album)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Album
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(album)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Album
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{album.releaseYear || "N/A"}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1">
            <Disc className="w-3 h-3" />
            <span>{album.totalTracks || 0} tracks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
