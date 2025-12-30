import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  selectPlayer,
  setIsPlaying,
  setIsLoading,
  nextTrack,
  prevTrack,
  setTrack,
} from "@/features/player/slice/playerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const useAudioPlayer = () => {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, volume, isMuted } =
    useAppSelector(selectPlayer);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Local state cho progress bar (để UI mượt hơn, không đẩy lên Redux)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 1. XỬ LÝ LOAD SOURCE (HLS / MP3)
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    const audio = audioRef.current;
    const src = currentTrack.hlsUrl || currentTrack.trackUrl; // Ưu tiên HLS

    // Reset HLS instance cũ nếu có
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Logic HLS
    if (Hls.isSupported() && src.endsWith(".m3u8")) {
      const hls = new Hls({
        maxBufferLength: 30, // Buffer trước 30s
      });
      hls.loadSource(src);
      hls.attachMedia(audio);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Chỉ auto play nếu trạng thái đang là playing
        if (isPlaying) audio.play().catch(() => dispatch(setIsPlaying(false)));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("HLS Fatal Error", data);
          // Fallback logic hoặc next bài nếu lỗi
        }
      });
    }
    // Logic Safari (Native HLS)
    else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = src;
      if (isPlaying) audio.play();
    }
    // Logic MP3 thường
    else {
      audio.src = src;
      if (isPlaying) audio.play();
    }

    // 2. CẬP NHẬT MEDIA SESSION (Màn hình khóa điện thoại)
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist?.name || "Unknown Artist", // Sửa theo data thực tế của bạn
        artwork: [
          {
            src: currentTrack.coverImage,
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () =>
        dispatch(setIsPlaying(true))
      );
      navigator.mediaSession.setActionHandler("pause", () =>
        dispatch(setIsPlaying(false))
      );
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        dispatch(prevTrack())
      );
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        dispatch(nextTrack())
      );
    }
  }, [currentTrack?._id]); // Chỉ chạy lại khi ID bài hát đổi

  // 3. ĐỒNG BỘ PLAY/PAUSE
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay prevented:", error);
          dispatch(setIsPlaying(false));
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // 4. ĐỒNG BỘ VOLUME
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 5. CÁC EVENT HANDLERS
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      // Duration đôi khi load chậm, cập nhật liên tục cho chắc
      if (
        audioRef.current.duration !== Infinity &&
        !isNaN(audioRef.current.duration)
      ) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    dispatch(nextTrack()); // Tự động chuyển bài khi hết
  };

  const handleWaiting = () => dispatch(setIsLoading(true)); // Hiện spinner
  const handleCanPlay = () => dispatch(setIsLoading(false)); // Tắt spinner

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return {
    audioRef,
    currentTime,
    duration,
    seek,
    events: {
      onTimeUpdate: handleTimeUpdate,
      onEnded: handleEnded,
      onWaiting: handleWaiting,
      onPlaying: handleCanPlay,
      onCanPlay: handleCanPlay,
    },
  };
};
