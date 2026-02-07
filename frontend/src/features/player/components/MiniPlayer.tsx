/**
 * @file MiniPlayer.tsx
 * @description Persistent Footer Music Player (Mini Mode)
 * @style Floating Capsule (Mobile) | Full Width (Desktop)
 * @theme Light/Dark Mode Supported
 */
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { CircleStop, Maximize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

import { selectPlayer, stopPlaying } from "@/features/player/slice/playerSlice";
import { Track } from "@/features/track/types";

import { PlayerControls } from "./PlayerControls";
import { VolumeControl } from "./VolumeControl";
import { ProgressBar } from "./ProgressBar";

import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/format";
import { useAppDispatch } from "@/store/hooks";

interface Props {
  track: Track;
  currentTime: number;
  duration?: number;
  onExpand: () => void;
  getCurrentTime: () => number;
  onSeek: (time: number) => void;
}

export const MiniPlayer = ({
  track,
  currentTime,
  onExpand,
  getCurrentTime,
  onSeek,
}: Props) => {
  const { duration = 0, isPlaying } = useSelector(selectPlayer);
  const dispatch = useAppDispatch();
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:pointer-events-auto">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={cn(
          "pointer-events-auto",

          // --- MOBILE STYLES (Floating Capsule) ---
          "w-[calc(100%-2rem)] mb-4 h-20",
          "rounded-[32px]",
          "border border-border/50", // Viền mờ theo theme

          // --- DESKTOP STYLES (Full Bar) ---
          "md:w-full md:mb-0 md:h-24 md:rounded-none md:border-x-0 md:border-b-0 md:border-t md:border-border",

          // --- THEME ADAPTIVE COLORS ---
          // Light: Nền trắng mờ, shadow êm
          // Dark: Nền đen sâu, shadow sắc nét
          "bg-background/80 backdrop-blur-xl shadow-lg dark:shadow-black/50",
          "text-foreground", // Chữ tự động đổi màu

          "overflow-hidden select-none relative group"
        )}
        onClick={onExpand}
      >
        {/* ────────────────────────────────────────────────────────────────
          MOBILE PROGRESS BAR (INSET GLOW) - THEME AWARE
          ────────────────────────────────────────────────────────────────
        */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-2 md:hidden z-10">
          {/* Background Track: Mờ nhẹ so với nền */}
          <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
            {/* Active Bar: Màu Primary hoặc Foreground nổi bật */}
            <div
              className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-[width] duration-100 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="h-full px-5 md:px-8 flex items-center justify-between gap-4 pb-2 md:pb-0">
          {/* LEFT: Artwork & Info */}
          <div
            className="flex items-center gap-4 flex-1 md:flex-none md:w-[30%] min-w-0 cursor-pointer"
            onClick={onExpand}
          >
            {/* Vinyl Artwork Animation */}
            <div
              className={cn(
                "relative shrink-0 transition-all",
                "h-12 w-12 md:h-16 md:w-16",
                "rounded-full overflow-hidden border border-border bg-muted shadow-md",
                isPlaying
                  ? "animate-[spin_8s_linear_infinite]"
                  : "animate-[spin_60s_linear_infinite_reverse]"
              )}
            >
              <ImageWithFallback
                src={track.coverImage}
                alt={track.title}
                className="h-full w-full object-cover opacity-90"
              />
              {/* Lỗ đĩa than: Màu nền thay đổi theo theme */}
              <div className="absolute inset-1/2 size-2 md:size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background border border-border" />
            </div>

            {/* Text */}
            <div className="min-w-0 flex flex-col justify-center">
              <h4 className="text-[15px] md:text-base font-bold truncate text-foreground leading-tight">
                {track.title}
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground truncate font-medium">
                {track.artist?.name}
              </p>
            </div>
          </div>

          {/* CENTER: Desktop Controls */}
          <div
            className="hidden md:flex flex-col items-center justify-center flex-1 max-w-[500px] gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* PlayerControls component cần hỗ trợ className hoặc tự adapt theo text-foreground */}
            <PlayerControls variant="mini" getCurrentTime={getCurrentTime} />

            {/* Desktop Scrubber */}
            <div className="w-full flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 flex h-4 items-center">
                <ProgressBar
                  hasTimeLabels={false}
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={onSeek}
                  className="transition-all"
                />
              </div>
              <span className="w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* MOBILE CONTROLS */}
          <div
            className="flex md:hidden items-center text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <PlayerControls
              variant="mini"
              getCurrentTime={getCurrentTime}
              hideSecondary
            />
          </div>

          {/* RIGHT: Volume & Expand */}
          <div
            className="hidden md:flex items-center justify-end md:w-[30%] gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <VolumeControl className="w-28" />
            <div className="h-8 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={onExpand}
            >
              <Maximize2 className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => dispatch(stopPlaying())}
              title="Expand Player"
            >
              <CircleStop className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
