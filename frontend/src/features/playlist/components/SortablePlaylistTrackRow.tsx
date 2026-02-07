import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Disc } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Track } from "@/features/track/types";

interface SortablePlaylistTrackRowProps {
  track: Track;
  index: number;
  onRemove: (id: string) => void;
  isRemoving: boolean;
}

export const SortablePlaylistTrackRow = ({
  track,
  index,
  onRemove,
  isRemoving,
}: SortablePlaylistTrackRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const, // Đảm bảo z-index hoạt động đúng
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-2 sm:p-3 rounded-xl border mb-2 transition-all duration-200 touch-none select-none",
        isDragging
          ? "bg-primary/5 border-primary shadow-xl scale-[1.02] z-50 cursor-grabbing"
          : "bg-card border-border/60 hover:border-primary/30 hover:shadow-sm hover:bg-accent/20"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
        {/* --- DRAG HANDLE --- */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 text-muted-foreground/50 hover:text-foreground hover:bg-muted rounded-lg transition-colors touch-none"
          title="Kéo để sắp xếp"
        >
          <GripVertical className="size-5" />
        </div>

        {/* Index: Ẩn trên mobile rất nhỏ, hiện trên mobile thường */}
        <span className="w-6 text-xs font-mono font-bold text-muted-foreground/70 shrink-0 text-center hidden xs:block">
          {(index + 1).toString().padStart(2, "0")}
        </span>

        {/* Avatar */}
        <Avatar className="size-10 sm:size-11 rounded-lg shrink-0 border border-border shadow-sm">
          <AvatarImage src={track.coverImage} className="object-cover" />
          <AvatarFallback className="bg-muted">
            <Disc className="size-5 opacity-30 animate-pulse" />
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex flex-col min-w-0 gap-0.5">
          <h4
            className={cn(
              "text-sm font-bold truncate leading-tight text-foreground",
              isDragging && "text-primary"
            )}
          >
            {track.title}
          </h4>
          <p className="text-xs text-muted-foreground font-medium truncate">
            {track.artist?.name || "Unknown Artist"}
          </p>
        </div>
      </div>
    </div>
  );
};
