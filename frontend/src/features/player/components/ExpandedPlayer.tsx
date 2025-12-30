import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControlButton } from "./ControlButton";
import { ProgressBar } from "./ProgressBar";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { formatTime } from "@/utils/format";

interface ExpandedPlayerProps {
  track: any;
  isPlaying: boolean;
  isShuffling: boolean;
  repeatMode: string;
  progress: number;
  currentTime: number;
  duration: number;
  isScrubbing: boolean;
  onPlayToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onSeek: (v: number) => void;
  onScrubStart: () => void;
  onScrubEnd: (v: number) => void;
}

export function ExpandedPlayer(props: ExpandedPlayerProps) {
  const {
    track,
    isPlaying,
    isShuffling,
    repeatMode,
    progress,
    currentTime,
    duration,
    isScrubbing,
    onPlayToggle,
    onNext,
    onPrev,
    onShuffle,
    onRepeat,
    onSeek,
    onScrubStart,
    onScrubEnd,
  } = props;

  return (
    <div className="flex flex-col gap-8">
      {/* Album */}
      <motion.div className="flex justify-center">
        <ImageWithFallback
          src={track.coverImage}
          className="w-64 h-64 rounded-full object-cover shadow-2xl"
        />
      </motion.div>

      {/* Info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">{track.title}</h2>
        <p className="text-muted-foreground">{track.artist?.name}</p>
      </div>

      {/* Progress */}
      <motion.div
        animate={{
          scale: isScrubbing ? 1.08 : 1,
          boxShadow: isScrubbing ? "0 0 30px hsl(var(--primary))" : "none",
        }}
      >
        <ProgressBar
          progress={progress}
          onSeek={onSeek}
          onScrubStart={onScrubStart}
          onScrubEnd={onScrubEnd}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6">
        <ControlButton
          icon={Shuffle}
          isActive={isShuffling}
          onClick={onShuffle}
          ariaLabel="Shuffle"
        />
        <ControlButton
          icon={SkipBack}
          size="large"
          onClick={onPrev}
          ariaLabel="Previous"
        />

        <Button
          aria-label="Play / Pause"
          onClick={onPlayToggle}
          className="w-20 h-20 rounded-full bg-primary text-primary-foreground"
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>

        <ControlButton
          icon={SkipForward}
          size="large"
          onClick={onNext}
          ariaLabel="Next"
        />
        <ControlButton
          icon={Repeat}
          isActive={repeatMode !== "off"}
          onClick={onRepeat}
          ariaLabel="Repeat"
        />
      </div>
    </div>
  );
}
