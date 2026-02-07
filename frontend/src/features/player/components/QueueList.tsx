/**
 * @file QueueList.tsx
 * @description Danh sách chờ - Spotify Style Redesign
 */
import { useEffect, useRef, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  MoreHorizontal,
  ListMusic,
  GripVertical,
  Clock,
} from "lucide-react";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { Track } from "@/features/track/types";
import {
  selectPlayer,
  setQueue,
  setIsPlaying,
} from "@/features/player/slice/playerSlice";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/format";

// --- 1. SÓNG NHẠC (Visualizer) ---
// Sử dụng animation từ index.css của bạn
const PlayingVisualizer = () => (
  <div className="flex items-end gap-[2px] h-3.5 mb-0.5">
    <span className="w-[3px] bg-primary rounded-sm animate-music-bar-1" />
    <span className="w-[3px] bg-primary rounded-sm animate-music-bar-2" />
    <span className="w-[3px] bg-primary rounded-sm animate-music-bar-3" />
    <span className="w-[3px] bg-primary rounded-sm animate-music-bar-4" />
  </div>
);

// --- 2. QUEUE ITEM ---
interface QueueItemProps {
  track: Track;
  index: number;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}

const QueueItem = memo(
  ({ track, index, isCurrent, isPlaying, onPlay }: QueueItemProps) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
          // Active State: Sáng hơn chút + Border mờ
          isCurrent
            ? "bg-white/10 border-white/5 shadow-sm"
            : "hover:bg-white/5 hover:border-white/5"
        )}
        onClick={onPlay}
      >
        {/* --- COL 1: INDEX / PLAY STATUS --- */}
        <div className="w-8 flex justify-center items-center shrink-0">
          {isCurrent && isPlaying ? (
            <PlayingVisualizer />
          ) : (
            <>
              {/* Số thứ tự hiện mặc định */}
              <span
                className={cn(
                  "text-xs font-medium font-mono group-hover:hidden",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              {/* Nút Play hiện khi Hover */}
              <Play
                className={cn(
                  "size-3.5 fill-current hidden group-hover:block",
                  isCurrent ? "text-primary" : "text-white"
                )}
              />
            </>
          )}
        </div>

        {/* --- COL 2: ARTWORK --- */}
        <div className="relative size-10 shrink-0 rounded-[4px] overflow-hidden bg-muted/20">
          <ImageWithFallback
            src={track.coverImage}
            alt={track.title}
            className={cn(
              "size-full object-cover transition-opacity",
              isCurrent && isPlaying
                ? "opacity-100"
                : "opacity-80 group-hover:opacity-100"
            )}
          />
          {isCurrent && (
            <div className="absolute inset-0 bg-black/20" /> // Dim nhẹ ảnh khi đang phát để text dễ đọc
          )}
        </div>

        {/* --- COL 3: INFO --- */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <h4
            className={cn(
              "text-sm font-medium truncate leading-none transition-colors",
              isCurrent
                ? "text-primary"
                : "text-foreground group-hover:text-white"
            )}
          >
            {track.title}
          </h4>
          <p className="text-[11px] text-muted-foreground truncate hover:text-white/70 transition-colors">
            {track.artist?.name}
          </p>
        </div>

        {/* --- COL 4: ACTIONS (Hidden on mobile mostly) --- */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Duration (Chỉ hiện ở màn hình lớn hơn một chút hoặc khi không hover) */}
          <span className="text-[10px] text-muted-foreground font-mono hidden sm:block group-hover:hidden">
            {formatTime(track.duration || 0)}
          </span>

          {/* Drag Handle (Giả lập UX chuyên nghiệp) */}
          <div className="hidden group-hover:flex items-center text-muted-foreground hover:text-white cursor-grab active:cursor-grabbing px-1">
            <GripVertical className="size-4" />
          </div>

          {/* Option Menu */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Context menu logic
            }}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </motion.div>
    );
  }
);

QueueItem.displayName = "QueueItem";

// --- 3. MAIN COMPONENT ---
export const QueueList = () => {
  const dispatch = useDispatch();
  const { activeQueue, currentTrack, isPlaying } = useSelector(selectPlayer);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll tới bài hát đang phát
  useEffect(() => {
    if (scrollRef.current && currentTrack) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTrack?._id]);

  const handleTrackClick = useCallback(
    (index: number, trackId: string) => {
      if (currentTrack?._id === trackId) {
        dispatch(setIsPlaying(!isPlaying));
      } else {
        dispatch(setQueue({ tracks: activeQueue, startIndex: index }));
      }
    },
    [activeQueue, currentTrack, isPlaying, dispatch]
  );

  return (
    <div className="flex flex-col w-full h-full bg-background/60 backdrop-blur-3xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      {/* --- HEADER --- */}
      <div className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <ListMusic className="size-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Play Queue</span>
          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {activeQueue.length}
          </span>
        </div>
        <Button
          variant="ghost"
          className="h-7 text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-white hover:bg-white/5 rounded-full px-3"
        >
          Clear
        </Button>
      </div>

      {/* --- SCROLLABLE LIST --- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {activeQueue.map((track, index) => {
            const isCurrent = currentTrack?._id === track._id;

            return (
              <div key={`${track._id}-${index}`} data-active={isCurrent}>
                <QueueItem
                  track={track}
                  index={index}
                  isCurrent={isCurrent}
                  isPlaying={isPlaying}
                  onPlay={() => handleTrackClick(index, track._id)}
                />
              </div>
            );
          })}
        </AnimatePresence>

        {/* Padding bottom để không bị che bởi các thành phần khác nếu có */}
        <div className="h-16" />
      </div>
    </div>
  );
};
