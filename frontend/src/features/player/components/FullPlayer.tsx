import { useState, memo, useEffect } from "react";
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  MoreHorizontal,
  Share2,
  PlusCircle,
  Download,
  Mic2,
  Clock,
  Heart,
} from "lucide-react";
import { useSelector } from "react-redux";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";

// Logic
import { Track } from "@/features/track/types";
import { selectPlayer } from "@/features/player/slice/playerSlice";

// Children
import { ProgressBar } from "./ProgressBar";
import { PlayerControls } from "./PlayerControls";
import { VolumeControl } from "./VolumeControl";
import { ExtraControls } from "./ExtraControls";
import { QueueList } from "./QueueList";

// --- 1. BACKGROUND NHẸ (Static) ---
const CosmicBackground = memo(() => (
  <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden transform-gpu">
    <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-[#050a18] to-[#0a0f25]" />
    <div className="absolute inset-0 bg-stars opacity-60 animate-twinkle" />
    <div className="absolute top-[-20%] left-[-20%] w-[90vw] h-[90vw] rounded-full bg-purple-900/20 blur-[80px] mix-blend-screen" />
    <div className="absolute bottom-[-20%] right-[-20%] w-[90vw] h-[90vw] rounded-full bg-blue-900/20 blur-[80px] mix-blend-screen" />
  </div>
));

interface Props {
  track: Track;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onCollapse: () => void;
  getCurrentTime: () => number;
}

export const FullPlayer = ({
  track,
  currentTime,
  duration,
  onSeek,
  onCollapse,
  getCurrentTime,
}: Props) => {
  const { isPlaying } = useSelector(selectPlayer);
  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 🔥 FIX 1: Lazy Render Queue
  // Chỉ cho phép render QueueList sau khi Player đã mở xong (tránh giật lúc mở)
  const [isReadyToRenderQueue, setIsReadyToRenderQueue] = useState(false);

  useEffect(() => {
    // Đợi 400ms (tương đương thời gian animation mở) rồi mới cho phép render Queue
    const timer = setTimeout(() => {
      setIsReadyToRenderQueue(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // --- GESTURE ---
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [0, 200], [1, 0]);
  const scale = useTransform(dragY, [0, 200], [1, 0.95]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onCollapse();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-60 bg-[#050a18] flex flex-col h-dvh overflow-hidden will-change-transform"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      // 🔥 FIX 2: Tinh chỉnh transition nhanh hơn, dứt khoát hơn
      transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.8 }}
      style={{ y: dragY, opacity, scale }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.1 }}
      onDragEnd={handleDragEnd}
    >
      <CosmicBackground />

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-5 pt-1.5 pb-1.5 md:pt-4 md:pb-4 shrink-0 z-10 min-h-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="rounded-full text-white hover:bg-white/10 h-10 w-10 md:h-12 md:w-12 transition-colors"
        >
          <ChevronDown className="size-6 md:size-8" />
        </Button>

        <div className="flex flex-col items-center flex-1 mx-2">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70 drop-shadow-md">
            {showQueue ? "Up Next" : "Now Playing"}
          </span>
          <span className="text-[10px] font-bold text-white/40 mt-0.5 truncate max-w-40 hidden md:block">
            From Playlist: Cosmic Vibes
          </span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 h-10 w-10 md:h-12 md:w-12"
            >
              <MoreHorizontal className="size-5 md:size-6" />
            </Button>
          </SheetTrigger>
          {/* ... (Giữ nguyên phần Sheet Content) ... */}
          <SheetContent
            side="bottom"
            className="rounded-t-4xl border-t-white/10 bg-[#0a0f25]/95 backdrop-blur-xl pb-8 z-[70] max-h-[85vh] overflow-y-auto"
          >
            {/* ... Sheet Content Code cũ ... */}
            <SheetHeader className="mb-6 mt-2">
              <div className="mx-auto w-12 h-1 bg-white/20 rounded-full mb-4" />
            </SheetHeader>
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 px-2">
              <ImageWithFallback
                src={track.coverImage}
                className="size-16 rounded-lg object-cover shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-white line-clamp-1">
                  {track.title}
                </h4>
                <p className="text-white/60 text-sm truncate">
                  {track.artist?.name}
                </p>
              </div>
            </div>
            <div className="space-y-1 px-1">
              {/* Demo Buttons */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-5 h-14 text-base font-medium text-white/90 hover:bg-white/10 rounded-xl"
              >
                <PlusCircle className="size-6 text-white/70" /> Add to Playlist
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-5 h-14 text-base font-medium text-white/90 hover:bg-white/10 rounded-xl"
              >
                <Share2 className="size-6 text-white/70" /> Share
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between md:justify-center w-full max-w-7xl mx-auto overflow-hidden pb-6 md:pb-12">
        {/* === SECTION A: ARTWORK / QUEUE === */}
        <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8 min-h-0">
          <div className="relative aspect-square w-auto h-auto max-h-full max-w-full flex items-center justify-center perspective-1000">
            <AnimatePresence mode="wait">
              {showQueue ? (
                <motion.div
                  key="queue"
                  className="w-full h-full max-h-[60vh] md:max-h-125 aspect-square"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* 🔥 FIX 3: Chỉ render QueueList khi đã sẵn sàng (sau khi mở xong) */}
                  {isReadyToRenderQueue ? (
                    <QueueList />
                  ) : (
                    // Skeleton Loading trong lúc chờ animation mở xong
                    <div className="w-full h-full bg-white/5 rounded-2xl animate-pulse border border-white/10" />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="artwork"
                  className={cn(
                    "relative aspect-square rounded-full overflow-hidden bg-black z-10 will-change-transform transform-gpu",
                    "w-[85vw] max-w-87.5 md:w-[45vw] md:max-w-125",
                    "border-4 md:border-8 border-black/90",
                    "shadow-[0_0_40px_rgba(59,130,246,0.3),0_0_80px_rgba(147,51,234,0.15)] ring-1 ring-white/10",
                    isPlaying
                      ? "animate-spin-slow-cosmic"
                      : "animate-[spin_60s_linear_infinite_reverse]",
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                >
                  {/* 🔥 FIX 4: Eager loading cho ảnh chính */}
                  <ImageWithFallback
                    src={track.coverImage}
                    imgProps={{ loading: "eager", decoding: "sync" }}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-[url('/vinyl-texture.png')] opacity-40 mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10%] h-[10%] bg-[#0a0f25] rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                    <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-black rounded-full" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* === SECTION B: CONTROLS === */}
        <div className="w-full max-w-[550px] flex flex-col gap-6 md:gap-8 px-6 md:px-0 flex-shrink-0 z-20">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1 pr-4 overflow-hidden">
              <h2 className="text-2xl md:text-4xl font-black leading-tight truncate text-white drop-shadow-xl">
                {track.title}
              </h2>
              <p className="text-base md:text-xl text-white/60 font-medium truncate cursor-pointer hover:text-white transition-colors">
                {track.artist?.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "mb-1 rounded-full shrink-0 hover:bg-white/10",
                isLiked && "text-red-500",
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn("size-7 md:size-8", isLiked && "fill-current")}
              />
            </Button>
          </div>

          <div className="space-y-2 px-1">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={onSeek}
            />
          </div>

          <div className="py-2 md:py-4">
            <PlayerControls getCurrentTime={getCurrentTime} />
          </div>

          <div className="md:flex hidden items-center justify-between px-2 mb-safe">
            <ExtraControls
              onQueueClick={() => setShowQueue(!showQueue)}
              isQueueActive={showQueue}
            />
            <div className="hidden md:block pl-6 border-l border-white/10">
              <VolumeControl />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
