import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  MoreHorizontal,
  Heart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ChartTrack } from "@/features/track/types";
import { formatDuration } from "@/utils/track-helper";

interface ChartItemProps {
  track: ChartTrack;
  rank: number;
  prevRank: number;
}

export const ChartItem = memo(({ track, rank, prevRank }: ChartItemProps) => {
  const diff = prevRank - rank;

  // --- RANK STYLING LOGIC (FIXED) ---
  // Đã bỏ 'text-transparent' để tránh lỗi mất màu.
  // Dùng màu Solid + Drop Shadow để số nổi bật hơn.
  let rankStyle = "text-muted-foreground/40 font-black text-3xl opacity-70"; // Top 4+

  if (rank === 1) {
    // Top 1: Màu xanh dương chủ đạo, bóng mờ
    rankStyle =
      "text-blue-500 font-black text-5xl drop-shadow-md scale-110 origin-bottom";
  } else if (rank === 2) {
    // Top 2: Màu xanh ngọc
    rankStyle = "text-emerald-500 font-black text-4xl drop-shadow-sm";
  } else if (rank === 3) {
    // Top 3: Màu đỏ
    rankStyle = "text-red-500 font-black text-4xl drop-shadow-sm";
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "group relative flex items-center p-2 pr-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-white/5 transition-all duration-200 cursor-pointer",
        rank === 1 && "bg-white/5 border-border/20" // Highlight Top 1
      )}
    >
      {/* 1. RANK COLUMN */}
      <div className="w-14 sm:w-16 flex flex-col items-center justify-center shrink-0 gap-1">
        <span
          className={cn(
            "leading-none tracking-tighter transition-all",
            rankStyle
          )}
        >
          {rank}
        </span>

        {/* Trend Indicator */}
        <div className="h-5 flex items-center justify-center">
          {diff > 0 ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              <TrendingUp size={10} strokeWidth={3} /> {diff}
            </span>
          ) : diff < 0 ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">
              <TrendingDown size={10} strokeWidth={3} /> {Math.abs(diff)}
            </span>
          ) : (
            <span className="flex items-center text-muted-foreground/50">
              <Minus size={14} strokeWidth={3} />
            </span>
          )}
        </div>
      </div>

      {/* 2. ARTWORK */}
      <div className="relative size-12 sm:size-14 shrink-0 mr-4 group-hover:scale-105 transition-transform duration-300">
        <ImageWithFallback
          src={track.coverImage}
          alt={track.title}
          className="size-full rounded-lg object-cover shadow-sm border border-white/5"
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
          <Play className="size-5 text-white fill-white drop-shadow-md" />
        </div>
      </div>

      {/* 3. INFO */}
      <div className="flex-1 min-w-0 flex flex-col justify-center pr-4">
        <h3 className="font-bold text-sm sm:text-base truncate text-foreground leading-tight group-hover:text-primary transition-colors">
          {track.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate font-medium hover:underline cursor-pointer w-fit mt-0.5">
          {track.artist?.name || "Unknown Artist"}
        </p>
      </div>

      {/* 4. ALBUM (Tablet+) */}
      <div className="hidden md:block w-[30%] px-4 text-xs text-muted-foreground font-medium truncate hover:text-foreground transition-colors cursor-pointer">
        {track.album?.title || `${track.title} (Single)`}
      </div>

      {/* 5. METRICS / ACTIONS */}
      <div className="flex items-center justify-end w-24 gap-1 sm:gap-4 shrink-0">
        {/* Score */}
        <div className="text-right group-hover:hidden">
          <span className="block font-mono font-bold text-sm text-foreground/80">
            {((track.score || 0) / 100).toFixed(0)}%
          </span>
        </div>

        {/* Actions (Hover) */}
        <div className="hidden group-hover:flex items-center animate-in fade-in slide-in-from-right-2 duration-200">
          <Button
            size="icon"
            variant="ghost"
            className="size-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-transparent hidden sm:flex"
          >
            <Heart className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        {/* Duration */}
        <span className="text-xs font-mono text-muted-foreground/60 w-10 text-right group-hover:hidden sm:group-hover:block">
          {formatDuration(track.duration)}
        </span>
      </div>
    </motion.div>
  );
});

ChartItem.displayName = "ChartItem";
