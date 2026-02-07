import React, { useState } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  PlayCircle,
  Globe,
  User,
  Music2,
  FolderKanban,
} from "lucide-react";
import type { Playlist } from "@/features/playlist/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPlaylistTracksModal } from "@/features/playlist/components/EditPlaylistTracksModal";
import { useNavigate } from "react-router-dom";

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: () => void;
  onDelete: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [editTrackPlaylist, setEditTrackPlaylist] = useState(false);

  return (
    <>
      <div className="group relative bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Cover Image Area - Mobile: h-32, Desktop: Aspect Square */}
        <div className="relative h-32 sm:h-auto sm:aspect-square bg-muted overflow-hidden">
          {playlist.coverImage ? (
            <img
              src={playlist.coverImage}
              alt={playlist.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/30">
              <Music2 className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Overlay Play - Desktop Only (hover) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
            <button
              onClick={() => navigate(`/playlists/${playlist.slug}`)}
              className="transform scale-90 group-hover:scale-100 transition-transform duration-300 text-white hover:text-primary drop-shadow-lg"
            >
              <PlayCircle className="w-12 h-12 sm:w-14 sm:h-14 fill-current" />
            </button>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 left-2 z-10">
            {playlist.isSystem ? (
              <Badge
                variant="default"
                className="text-[10px] h-5 px-1.5 shadow-sm bg-primary text-primary-foreground border border-primary/20"
              >
                <Globe className="w-3 h-3 mr-1" /> System
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-[10px] h-5 px-1.5 shadow-sm bg-background/90 backdrop-blur border border-border text-foreground"
              >
                <User className="w-3 h-3 mr-1" /> User
              </Badge>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
          <div className="flex justify-between items-start gap-1">
            <div className="min-w-0 flex-1">
              <h3
                className="font-bold text-sm sm:text-base leading-tight truncate text-foreground hover:text-primary transition-colors cursor-pointer"
                title={playlist.title}
                onClick={() => navigate(`/playlists/${playlist.slug}`)}
              >
                {playlist.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5 sm:mt-1">
                {playlist.description || "No description provided"}
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
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setEditTrackPlaylist(true)}
                  className="cursor-pointer"
                >
                  <FolderKanban className="w-4 h-4 mr-2 text-primary" />
                  Manage Tracks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive cursor-pointer font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60 text-[10px] sm:text-xs text-muted-foreground font-medium">
            <span className="truncate max-w-[60%]">
              By{" "}
              <span className="text-foreground">
                {playlist.user?.fullName || "Unknown"}
              </span>
            </span>
            <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-foreground/80">
              {playlist.totalTracks || 0} tracks
            </span>
          </div>
        </div>
      </div>

      <EditPlaylistTracksModal
        isOpen={editTrackPlaylist}
        onClose={() => setEditTrackPlaylist(false)}
        playlistId={playlist._id}
      />
    </>
  );
};

export default PlaylistCard;
