import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { selectPlayer } from "@/features/player/slice/playerSlice";
import { useAudioPlayer } from "@/features/player/hooks/useAudioPlayer";
import { useKeyboardControls } from "@/features/player/hooks/useKeyboardControls";
import { useCrossTabSync } from "@/features/player/hooks/useCrossTabSync";
import { MiniPlayer } from "./MiniPlayer";
import { FullPlayer } from "./FullPlayer";

export function MusicPlayer() {
  const { currentTrack, duration } = useSelector(selectPlayer);
  const [isExpanded, setIsExpanded] = useState(false);

  const { audioRef, currentTime, seek, getCurrentTime, events } =
    useAudioPlayer();
  useKeyboardControls(seek, currentTime);
  useCrossTabSync();

  // 🔥 FIX 2: Khóa cuộn trang (Scroll Lock) khi mở FullPlayer
  useEffect(() => {
    if (isExpanded) {
      // Lưu lại style cũ
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Khóa cuộn
      document.body.style.overflow = "hidden";
      // Chặn luôn touchmove trên iOS để tránh kéo nền
      document.body.style.touchAction = "none";

      return () => {
        // Trả lại style cũ khi đóng
        document.body.style.overflow = originalStyle;
        document.body.style.touchAction = "auto";
      };
    }
  }, [isExpanded]);

  if (!currentTrack) return null;

  return (
    <>
      <audio ref={audioRef} {...events} preload="auto" />

      {/* 🔥 FIX 1: Tối ưu hiệu năng mở (Instant Open)
         - MiniPlayer luôn được render (không dùng điều kiện !isExpanded nữa).
         - Khi mở FullPlayer, MiniPlayer vẫn nằm ở dưới, giúp giảm tải cho React không phải gỡ DOM cũ.
         - Ta chỉ cần ẩn nó đi bằng CSS (hidden) khi animation xong hoặc để FullPlayer đè lên (z-index cao hơn).
      */}

      <div
        className={
          isExpanded
            ? "invisible opacity-0 transition-opacity duration-500 delay-200"
            : "visible opacity-100"
        }
      >
        <MiniPlayer
          key="mini-player"
          track={currentTrack}
          currentTime={currentTime}
          getCurrentTime={getCurrentTime}
          onSeek={seek}
          onExpand={() => setIsExpanded(true)}
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <FullPlayer
            key="full-player"
            track={currentTrack}
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            getCurrentTime={getCurrentTime}
            onCollapse={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
