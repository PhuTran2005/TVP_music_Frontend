import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Heart,
  Loader2,
  ChevronDown,
  ListMusic,
  Maximize2,
  Share2,
  MoreHorizontal,
  Mic2,
  PlusCircle,
  Download,
  Clock,
  CircleStop,
} from "lucide-react";

// --- IMPORTS ---
import {
  selectPlayer,
  setIsPlaying,
  setVolume,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleRepeat,
  stopListening,
} from "@/features/player/slice/playerSlice";
import { useAudioPlayer } from "@/features/player/hooks/useAudioPlayer";
import { formatTime } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// --- ANIMATION VARIANTS ---
const fullPlayerVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export function MusicPlayer() {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // --- OPTIMISTIC SEEK STATE ---
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  const {
    currentTrack,
    isPlaying,
    volume,
    isShuffling,
    repeatMode,
    isLoading,
  } = useSelector(selectPlayer);
  console.log(currentTrack, repeatMode, isShuffling);
  const { audioRef, currentTime, duration, seek, events } = useAudioPlayer();

  // --- DRAG LOGIC (Mobile only) ---
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100) {
      setIsExpanded(false);
    }
  };

  if (!currentTrack) return null;

  // --- PROGRESS LOGIC ---
  const realProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressPercent = isDraggingSlider ? sliderValue : realProgress;

  const displayTime = isDraggingSlider
    ? (sliderValue / 100) * duration
    : currentTime;

  // --- HANDLERS ---
  const handleSliderChange = (val: number[]) => {
    setIsDraggingSlider(true);
    setSliderValue(val[0]);
  };

  const handleSliderCommit = (val: number[]) => {
    if (duration) seek((val[0] / 100) * duration);
    setTimeout(() => {
      setIsDraggingSlider(false);
    }, 100);
  };

  const handleVolumeChange = (val: number[]) => {
    dispatch(setVolume(val[0] / 100));
  };

  return (
    <>
      <audio ref={audioRef} {...events} preload="auto" />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="full-player"
            className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-3xl lg:bg-background/90"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fullPlayerVariants}
            style={{ y, opacity }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.1 }}
            onDragEnd={handleDragEnd}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] opacity-40" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] opacity-40" />
            </div>

            {/* Drag Handle (Mobile) */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing lg:hidden">
              <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center lg:px-12 lg:py-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground rounded-full hover:bg-white/10"
              >
                <ChevronDown className="size-6 lg:size-8" />
              </Button>
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Now Playing
                </span>
                <span className="text-xs font-bold hidden lg:block mt-1 opacity-80">
                  From Playlist: My Favorites
                </span>
              </div>

              {/* --- MENU 3 CHẤM (MOBILE ONLY - Dùng Sheet) --- */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground rounded-full hover:bg-white/10 lg:hidden"
                    >
                      <MoreHorizontal className="size-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="rounded-t-3xl border-t-white/10 bg-background/95 backdrop-blur-xl"
                  >
                    <SheetHeader className="mb-4">
                      <SheetTitle className="text-center text-sm font-normal text-muted-foreground uppercase tracking-widest">
                        Options
                      </SheetTitle>
                    </SheetHeader>

                    {/* Track Info in Sheet */}
                    <div className="flex items-center gap-4 mb-4 border-b border-white/5 p-4">
                      <ImageWithFallback
                        src={currentTrack.coverImage}
                        alt={currentTrack.title}
                        className="size-14 rounded-md object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-lg line-clamp-1">
                          {currentTrack.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {currentTrack.artist?.name}
                        </p>
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="space-y-1 p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-base h-12 font-normal"
                      >
                        <PlusCircle className="size-5" /> Add to Playlist
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-base h-12 font-normal"
                        onClick={() => dispatch(stopListening())}
                      >
                        <CircleStop className="size-5" /> Stop listening
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-base h-12 font-normal"
                      >
                        <Heart
                          className={cn(
                            "size-5",
                            isLiked && "fill-current text-red-500"
                          )}
                        />
                        {isLiked ? "Remove from Favorites" : "Add to Favorites"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-base h-12 font-normal"
                      >
                        <Mic2 className="size-5" /> View Lyrics
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-base h-12 font-normal"
                      >
                        <Share2 className="size-5" /> Share Song
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-base h-12 font-normal"
                      >
                        <Download className="size-5" /> Download
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-base h-12 font-normal"
                      >
                        <Clock className="size-5" /> Sleep Timer
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Menu Placeholder (nếu cần) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex text-muted-foreground rounded-full hover:bg-white/10"
              >
                <MoreHorizontal className="size-8" />
              </Button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 container px-6 pb-10 flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-24 max-w-7xl mx-auto h-full overflow-y-auto lg:overflow-visible no-scrollbar">
              {/* --- LEFT: ARTWORK (Vinyl Style) --- */}
              <div className="flex-1 flex justify-center items-center py-4 lg:py-0 w-full max-w-md mx-auto lg:max-w-none lg:justify-end">
                <motion.div
                  className="relative aspect-square w-[70vw] max-w-[320px] lg:w-[450px] lg:max-w-[500px] rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/5 ring-1 ring-white/10"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: isPlaying ? 360 : 0,
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 200, damping: 20 },
                    opacity: { duration: 0.3 },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  }}
                >
                  <ImageWithFallback
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Vinyl Center Hole */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] bg-background rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                    <div className="w-[60%] h-[60%] bg-black/90 rounded-full" />
                  </div>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-full" />
                </motion.div>
              </div>

              {/* --- RIGHT: CONTROLS --- */}
              <div className="flex-1 flex flex-col justify-end lg:justify-center w-full max-w-md mx-auto lg:max-w-xl space-y-8 lg:space-y-12">
                {/* Title & Like */}
                <div className="flex justify-between items-end">
                  <div className="space-y-2 overflow-hidden">
                    <motion.h2
                      className="text-2xl lg:text-5xl font-bold leading-tight truncate pr-4"
                      layoutId="title"
                    >
                      {currentTrack.title}
                    </motion.h2>
                    <motion.p
                      className="text-lg lg:text-2xl text-muted-foreground font-medium truncate hover:text-primary transition-colors cursor-pointer"
                      layoutId="artist"
                    >
                      {currentTrack.artist?.name || "Unknown Artist"}
                    </motion.p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full shrink-0 transition-all hover:bg-white/10",
                      isLiked
                        ? "text-red-500 scale-110"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={cn(
                        "size-6 lg:size-8",
                        isLiked && "fill-current"
                      )}
                    />
                  </Button>
                </div>

                {/* Progress Bar (Optimistic UI) */}
                <div className="space-y-2 group/player-slider">
                  <Slider
                    value={[progressPercent]}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderCommit}
                    max={100}
                    step={0.1}
                    className="cursor-pointer py-2"
                  />
                  <div className="flex justify-between text-xs lg:text-sm font-medium text-muted-foreground font-mono select-none">
                    <span>{formatTime(displayTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls Area */}
                <div className="flex flex-col gap-8">
                  {/* Main Playback Controls */}
                  <div className="flex items-center justify-between lg:justify-center lg:gap-14">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-full text-muted-foreground hover:text-primary transition-all hover:bg-white/5",
                        isShuffling && "text-primary bg-primary/10"
                      )}
                      onClick={() => dispatch(toggleShuffle())}
                    >
                      <Shuffle className="size-5 lg:size-7" />
                    </Button>

                    <div className="flex items-center gap-6 lg:gap-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full size-12 lg:size-16 hover:bg-white/10 active:scale-95 transition-all"
                        onClick={() => dispatch(prevTrack())}
                      >
                        <SkipBack className="size-7 lg:size-9 fill-current" />
                      </Button>

                      <Button
                        size="icon"
                        className="size-16 lg:size-24 rounded-full shadow-2xl shadow-primary/30 hover:scale-105 hover:shadow-primary/50 transition-all bg-primary text-primary-foreground border-4 border-background/20"
                        onClick={() => dispatch(setIsPlaying(!isPlaying))}
                      >
                        {isLoading ? (
                          <Loader2 className="size-8 lg:size-12 animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="size-8 lg:size-12 fill-current" />
                        ) : (
                          <Play className="size-8 lg:size-12 fill-current ml-1" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full size-12 lg:size-16 hover:bg-white/10 active:scale-95 transition-all"
                        onClick={() => dispatch(nextTrack())}
                      >
                        <SkipForward className="size-7 lg:size-9 fill-current" />
                      </Button>
                    </div>

                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-full text-muted-foreground hover:text-primary transition-all hover:bg-white/5",
                          repeatMode !== "off" && "text-primary bg-primary/10"
                        )}
                        onClick={() => dispatch(toggleRepeat())}
                      >
                        <Repeat className="size-5 lg:size-7" />
                      </Button>
                      {repeatMode === "one" && (
                        <span className="absolute top-0 right-0 text-[8px] font-bold bg-primary text-primary-foreground px-1 rounded-sm shadow-sm pointer-events-none">
                          1
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Extra Controls (Volume, Lyrics, Share) */}
                  <div className="hidden lg:flex items-center justify-between gap-6 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Mic2 className="size-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Share2 className="size-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full backdrop-blur-md flex-1 max-w-xs transition-colors hover:bg-white/10">
                      <Volume2 className="size-5 text-muted-foreground shrink-0" />
                      <Slider
                        value={[volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ListMusic className="size-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MINI PLAYER (Fixed Bottom) --- */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            key="mini-player"
            className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-2xl border-t border-white/10 h-20 lg:h-24 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Progress Bar (Thin line top) */}
            <div className="absolute top-[-1px] left-0 right-0 h-[2px] bg-muted/20 pointer-events-none">
              <motion.div
                className="h-full bg-primary origin-left shadow-[0_0_10px_currentColor]"
                style={{ width: `${realProgress}%` }}
                layoutId="progress"
              />
            </div>

            <div className="container h-full px-4 flex items-center justify-between gap-4 max-w-[1920px] mx-auto">
              {/* Left: Info */}
              <div
                className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group select-none"
                onClick={() => setIsExpanded(true)}
              >
                <div
                  className={cn(
                    "relative size-12 lg:size-16 rounded-full overflow-hidden bg-black border-2 border-white/10 shadow-lg group-hover:border-primary/50 transition-colors shrink-0",
                    isPlaying && "animate-[spin_8s_linear_infinite]"
                  )}
                >
                  <ImageWithFallback
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="size-3 bg-background rounded-full border border-white/10" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm lg:text-base truncate group-hover:text-primary transition-colors">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">
                    {currentTrack.artist?.name || "Unknown Artist"}
                  </p>
                </div>
              </div>

              {/* Center: Controls */}
              <div className="flex items-center gap-2 lg:gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:inline-flex text-muted-foreground hover:text-foreground rounded-full size-10"
                  onClick={() => dispatch(prevTrack())}
                >
                  <SkipBack className="size-5 lg:size-6 fill-current" />
                </Button>

                <Button
                  size="icon"
                  className="size-10 lg:size-12 rounded-full shadow-2xl shadow-primary/30 hover:scale-105 hover:shadow-primary/50 transition-all bg-primary text-primary-foreground border-4 border-background/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setIsPlaying(!isPlaying));
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="size-5 lg:size-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="size-5 lg:size-6 fill-current" />
                  ) : (
                    <Play className="size-5 lg:size-6 fill-current ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground rounded-full size-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(nextTrack());
                  }}
                >
                  <SkipForward className="size-5 lg:size-6 fill-current" />
                </Button>
              </div>

              {/* Right: Extra */}
              <div className="hidden sm:flex items-center justify-end w-[150px] gap-2">
                <div className="hidden lg:flex items-center gap-2 w-24 mr-2">
                  <Volume2 className="size-4 text-muted-foreground" />
                  <Slider
                    value={[volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    className="h-1.5"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => setIsExpanded(true)}
                >
                  <Maximize2 className="size-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
