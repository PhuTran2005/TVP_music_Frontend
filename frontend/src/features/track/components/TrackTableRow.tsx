import React, { memo } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  Loader2,
  Copy,
  Disc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDuration, STATUS_CONFIG } from "@/utils/track-helper";
import { useAppDispatch } from "@/store/store";
import { setIsPlaying } from "@/features/player";

// Memoized để tối ưu hiệu năng
export const TrackTableRow = memo(
  ({ track, index, isActive, isPlaying, onPlay, onEdit, onDelete }: any) => {
    const status =
      STATUS_CONFIG[track.status as keyof typeof STATUS_CONFIG] ||
      STATUS_CONFIG.pending;

    const handleCopyId = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(track._id);
      // toast.success(...)
    };
    const dispatch = useAppDispatch();
    return (
      <TableRow
        className={cn(
          "group/row transition-colors",
          isActive && "bg-secondary/50"
        )}
      >
        {/* Index / Playing Animation */}
        <TableCell className="text-center w-12 shrink-0">
          {isActive && isPlaying ? (
            /* Music Visualizer chuyên nghiệp */
            <div className="flex items-end justify-center gap-0.5 h-4 w-4 mx-auto">
              <span className="w-0.5 bg-primary animate-music-bar-1" />
              <span className="w-0.5 bg-primary animate-music-bar-2" />
              <span className="w-0.5 bg-primary animate-music-bar-3" />
            </div>
          ) : (
            <span
              className={cn(
                "text-xs font-mono text-muted-foreground",
                isActive && "text-primary font-bold"
              )}
            >
              {(index + 1).toString().padStart(2, "0")}
            </span>
          )}
        </TableCell>

        {/* Track Info */}
        <TableCell className="max-w-[300px]">
          <div className="flex items-center gap-3">
            <div
              className="relative shrink-0 size-10 rounded-md overflow-hidden border border-border group/cover cursor-pointer"
              onClick={() => onPlay(track)}
            >
              <img
                src={track.coverImage}
                alt=""
                className={cn(
                  "size-full object-cover transition-transform duration-500 group-hover/cover:scale-110",
                  isActive && "opacity-60"
                )}
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity"
                onClick={() => dispatch(setIsPlaying(!isPlaying))}
              >
                {isActive && isPlaying ? (
                  <Pause className="size-4 text-white fill-current" />
                ) : (
                  <Play className="size-4 text-white fill-current" />
                )}
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={cn(
                  "text-sm font-semibold truncate",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {track.title}
              </span>
              <span className="text-xs text-muted-foreground truncate sm:hidden">
                {track.artist?.name}
              </span>
            </div>
          </div>
        </TableCell>

        {/* Artist - Hidden on Mobile */}
        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
          <span className="hover:text-foreground cursor-pointer transition-colors line-clamp-1">
            {track.artist?.name || "Unknown Artist"}
          </span>
        </TableCell>

        {/* Album - Hidden on Medium Screens */}
        <TableCell className="hidden md:table-cell">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Disc className="size-3 shrink-0 opacity-40" />
            <span className="truncate max-w-[120px]">
              {track.album?.title || "Single"}
            </span>
          </div>
        </TableCell>

        {/* Status */}
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "font-xs font-semibold px-2 py-0 border-none shadow-none",
              status.className
            )}
          >
            {status.animate && <Loader2 className="mr-1 size-3 animate-spin" />}
            {status.label}
          </Badge>
        </TableCell>

        {/* Duration */}
        <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
          {formatDuration(track.duration)}
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(track)}>
                <Edit className="mr-2 size-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyId}>
                <Copy className="mr-2 size-4" /> Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(track)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 size-4" /> Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }
);
