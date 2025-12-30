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
    <div className="group relative bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {playlist.coverImage ? (
          <img
            src={playlist.coverImage}
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Music2 className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlay Play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button
            onClick={() => navigate(`/playlists/${playlist.slug}`)}
            className="transform scale-90 group-hover:scale-100 transition-transform duration-300 text-white hover:text-primary"
          >
            <PlayCircle className="w-12 h-12 fill-current" />
          </button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          {playlist.isSystem ? (
            <Badge
              variant="default"
              className="text-[10px] h-5 px-1.5 shadow-sm bg-primary/90 hover:bg-primary/90"
            >
              <Globe className="w-3 h-3 mr-1" /> System
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-[10px] h-5 px-1.5 shadow-sm bg-background/80 backdrop-blur-md"
            >
              <User className="w-3 h-3 mr-1" /> User
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex justify-between items-start gap-1">
          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold text-base leading-tight truncate text-foreground"
              title={playlist.title}
            >
              {playlist.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {playlist.description || "No description"}
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
              <DropdownMenuItem onClick={() => setEditTrackPlaylist(true)}>
                <FolderKanban className="w-4 h-4 mr-2" />
                Tracks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" /> Edit Playlist
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <EditPlaylistTracksModal
          isOpen={editTrackPlaylist}
          onClose={() => setEditTrackPlaylist(false)}
          playlistId={playlist._id}
        />
        {/* Footer Info */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <span>By {playlist.user?.fullName || "Unknown"}</span>
          <span className="font-mono">{playlist.totalTracks || 0} tracks</span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
