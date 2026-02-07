import { useDispatch, useSelector } from "react-redux";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  selectPlayer,
  setIsPlaying,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleRepeat,
} from "@/features/player/slice/playerSlice";

export const PlayerControls = ({
  variant = "full",
  getCurrentTime,
}: {
  variant?: "mini" | "full";
  getCurrentTime?: () => number;
}) => {
  const dispatch = useDispatch();
  // 🔥 Thêm activeQueue và currentIndex để tính toán logic
  const {
    isPlaying,
    isShuffling,
    repeatMode,
    isLoading,
    activeQueue,
    currentIndex,
  } = useSelector(selectPlayer);

  // --- LOGIC MỚI: KIỂM TRA ĐIỀU KIỆN ---
  const hasQueue = activeQueue.length > 0;

  // Khóa nút Prev nếu: Không có bài HOẶC (Đang ở bài đầu VÀ Không lặp lại)
  const isPrevDisabled =
    !hasQueue || (currentIndex === 0 && repeatMode === "off");

  // Khóa nút Next nếu: Không có bài HOẶC (Đang ở bài cuối VÀ Không lặp lại)
  const isNextDisabled =
    !hasQueue ||
    (currentIndex === activeQueue.length - 1 && repeatMode === "off");

  // --- HANDLERS (Đã thêm chặn logic) ---
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPrevDisabled) return; // Chặn nếu đang disabled
    dispatch(prevTrack(getCurrentTime ? getCurrentTime() : 0));
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasQueue) return; // Chặn nếu không có bài
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNextDisabled) return; // Chặn nếu đang disabled
    dispatch(nextTrack());
  };

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasQueue) return;
    dispatch(toggleShuffle());
  };

  const handleRepeat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasQueue) return;
    dispatch(toggleRepeat());
  };

  // --- RENDERING (Giữ nguyên CSS cũ, chỉ thêm disabled prop) ---

  if (variant === "mini") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          className="text-foreground hover:text-primary hover:bg-accent disabled:opacity-50"
        >
          <SkipBack className="size-5 fill-current" />
        </Button>
        <Button
          size="icon"
          onClick={togglePlay}
          disabled={!hasQueue}
          className="rounded-full size-10 bg-primary text-primary-foreground shadow-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current ml-0.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="text-foreground hover:text-primary hover:bg-accent disabled:opacity-50"
        >
          <SkipForward className="size-5 fill-current" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "text-white hover:text-primary hover:bg-secondary disabled:opacity-50",
          isShuffling && "text-primary"
        )}
        onClick={handleShuffle}
        disabled={!hasQueue}
      >
        <Shuffle className="size-5 lg:size-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={cn(
          "text-white hover:text-primary hover:bg-secondary rounded-full size-12 disabled:opacity-50",
          isPrevDisabled && "pointer-events-none opacity-5"
        )}
      >
        <SkipBack className="size-8 fill-current" />
      </Button>

      <Button
        size="icon"
        className="size-16 lg:size-20 rounded-full text-white hover:text-primary hover:bg-secondary shadow-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
        onClick={togglePlay}
        disabled={!hasQueue}
      >
        {isLoading ? (
          <Loader2 className="size-8 animate-spin" />
        ) : isPlaying ? (
          <Pause className="size-8 lg:size-10 fill-current" />
        ) : (
          <Play className="size-8 lg:size-10 fill-current ml-1" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={isNextDisabled}
        className={cn(
          "text-white hover:text-primary hover:bg-secondary rounded-full size-12 disabled:opacity-50",
          isNextDisabled && "pointer-events-none opacity-10"
        )}
      >
        <SkipForward className="size-8 fill-current" />
      </Button>

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-white hover:text-primary hover:bg-secondary disabled:opacity-50",
            repeatMode !== "off" && "text-primary"
          )}
          onClick={handleRepeat}
          disabled={!hasQueue}
        >
          <Repeat className="size-5 lg:size-6" />
        </Button>
        {repeatMode === "one" && (
          <span className="absolute top-0 right-0 text-[8px] bg-primary text-primary-foreground px-1 rounded-sm">
            1
          </span>
        )}
      </div>
    </div>
  );
};
