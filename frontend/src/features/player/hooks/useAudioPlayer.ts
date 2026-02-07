/**
 * @file useAudioPlayer.ts
 * @status ENTERPRISE-READY
 * @description Hook Core xử lý Audio.
 * @updates
 * - Added: Retry Limit cho HLS (Max 3 lần).
 * - Added: Cleanup Media Session khi unmount.
 * - Added: Detach Media an toàn.
 * - Added: Xử lý sự kiện 'seeking' và 'stalled' cho Loading Spinner.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  selectPlayer,
  selectNextTrack,
  setIsPlaying,
  setIsLoading,
  setDuration as setReduxDuration,
  seekTo,
  nextTrack,
  prevTrack,
} from "@/features/player/slice/playerSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const toLogVolume = (val: number) => (val === 0 ? 0 : Math.pow(val, 2));
const MAX_RETRY_COUNT = 3; // Giới hạn thử lại khi lỗi mạng

export const useAudioPlayer = () => {
  const dispatch = useAppDispatch();

  // 1. Redux State
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    seekPosition,
    lastSeekTime,
    repeatMode,
    duration: reduxDuration,
  } = useAppSelector(selectPlayer);

  const nextTrack_preload = useAppSelector(selectNextTrack);

  // 2. Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadHlsRef = useRef<Hls | null>(null);

  // Track logic refs
  const lastSeekTimeRef = useRef(lastSeekTime);
  const retryCountRef = useRef(0); // 🔥 Đếm số lần retry mạng

  // Local UI State
  const [currentTime, setCurrentTime] = useState(0);

  // ============================================================================
  // A. HANDLE SEEK & F5 RESUME
  // ============================================================================
  useEffect(() => {
    if (!audioRef.current) return;

    if (lastSeekTime !== lastSeekTimeRef.current) {
      const performSeek = () => {
        if (audioRef.current) {
          // Kiểm tra xem số có hợp lệ không trước khi gán
          if (Number.isFinite(seekPosition)) {
            audioRef.current.currentTime = seekPosition;
            setCurrentTime(seekPosition);
          }
          lastSeekTimeRef.current = lastSeekTime;
        }
      };

      if (audioRef.current.readyState > 0) {
        performSeek();
      } else {
        audioRef.current.addEventListener("loadedmetadata", performSeek, {
          once: true,
        });
      }
    }
  }, [lastSeekTime, seekPosition]);

  // ============================================================================
  // B. MAIN TRACK LOADER (HLS / MP3)
  // ============================================================================
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    const audio = audioRef.current;
    const src = currentTrack.hlsUrl || currentTrack.trackUrl;

    // 🔥 CLEANUP AN TOÀN
    if (hlsRef.current) {
      hlsRef.current.detachMedia(); // Gỡ media trước
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    // Reset retry count khi đổi bài
    retryCountRef.current = 0;

    if (Hls.isSupported() && src.endsWith(".m3u8")) {
      const hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true,
        manifestLoadingTimeOut: 15000, // Timeout nếu mạng quá lag
      });

      hls.loadSource(src);
      hls.attachMedia(audio);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isPlaying) {
          audio.play().catch((err) => {
            console.warn("Autoplay blocked:", err);
            dispatch(setIsPlaying(false));
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // 🔥 LOGIC RETRY LIMIT
              if (retryCountRef.current < MAX_RETRY_COUNT) {
                retryCountRef.current++;
                console.warn(
                  `[HLS] Network error, retrying (${retryCountRef.current}/${MAX_RETRY_COUNT})...`
                );
                hls.startLoad();
              } else {
                console.error("[HLS] Network failure. Giving up.");
                // Có thể dispatch action showToast error ở đây
                dispatch(setIsPlaying(false)); // Dừng lại thay vì next track loạn xạ
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("[HLS] Media error, recovering...");
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              // dispatch(nextTrack()); // Tùy chọn: Next bài hoặc dừng
              break;
          }
        }
      });
    } else {
      audio.src = src;
      if (isPlaying) {
        audio.play().catch(() => dispatch(setIsPlaying(false)));
      }
    }
  }, [currentTrack?._id]);

  // ============================================================================
  // C. PRELOAD NEXT TRACK
  // ============================================================================
  useEffect(() => {
    if (!nextTrack_preload) {
      if (preloadHlsRef.current) {
        preloadHlsRef.current.destroy();
        preloadHlsRef.current = null;
      }
      return;
    }
    const src = nextTrack_preload.hlsUrl || nextTrack_preload.trackUrl;

    // Lazy init audio element
    if (!preloadAudioRef.current) {
      preloadAudioRef.current = new Audio();
      preloadAudioRef.current.muted = true; // Mute preload để an toàn
    }
    const preloadAudio = preloadAudioRef.current;

    if (preloadHlsRef.current) {
      preloadHlsRef.current.destroy();
      preloadHlsRef.current = null;
    }

    if (Hls.isSupported() && src.endsWith(".m3u8")) {
      const hls = new Hls({ maxBufferLength: 10, startLevel: 0 });
      hls.loadSource(src);
      hls.attachMedia(preloadAudio);
      preloadHlsRef.current = hls;
    } else {
      preloadAudio.src = src;
      preloadAudio.load();
    }
  }, [nextTrack_preload?._id]);

  // ============================================================================
  // D. SYNC & EVENTS
  // ============================================================================

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Catch lỗi "The play() request was interrupted" khi đổi bài nhanh
      });
    } else {
      audioRef.current.pause();
      if (audioRef.current.currentTime > 0) {
        dispatch(seekTo(audioRef.current.currentTime));
      }
    }
  }, [isPlaying, dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : toLogVolume(volume);
    }
  }, [volume, isMuted]);

  // Save on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current && isPlaying) {
        dispatch(seekTo(audioRef.current.currentTime));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying, dispatch]);

  // ============================================================================
  // E. EVENT HANDLERS & MEDIA SESSION
  // ============================================================================

  // Cập nhật Media Session
  useEffect(() => {
    if ("mediaSession" in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist?.name || "Unknown Artist",
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
        dispatch(prevTrack(audioRef.current?.currentTime))
      );
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        dispatch(nextTrack())
      );

      // 🔥 Thêm handler Seek cho Media Session (thanh control trên điện thoại)
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
          dispatch(seekTo(details.seekTime));
        }
      });
    }

    // 🔥 Cleanup Media Session khi unmount hoặc đổi bài
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        // ... clear others if strictly needed, but metadata = null is usually enough to hide controls
      }
    };
  }, [currentTrack, dispatch]);

  // DOM Events
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime: curr, duration: dur } = audioRef.current;

    setCurrentTime(curr);

    // Sync Duration (Redux)
    if (
      dur > 0 &&
      dur !== Infinity &&
      Math.floor(dur) !== Math.floor(reduxDuration)
    ) {
      dispatch(setReduxDuration(dur));
    }
  };

  const handleEnded = () => {
    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      dispatch(nextTrack());
    }
  };

  // 🔥 Xử lý Seeking/Waiting để hiện Spinner chuẩn hơn
  const handleWaiting = () => dispatch(setIsLoading(true));
  const handleCanPlay = () => dispatch(setIsLoading(false));
  const handleStalled = () => {
    // Mạng bị lag, không load được data
    if (isPlaying) dispatch(setIsLoading(true));
  };

  const getCurrentTime = useCallback(
    () => audioRef.current?.currentTime || 0,
    []
  );

  const seek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        // Ép kiểu về finite number để tránh lỗi NaN
        const validTime = Number.isFinite(time) ? time : 0;
        audioRef.current.currentTime = validTime;
        setCurrentTime(validTime);
        dispatch(seekTo(validTime));
      }
    },
    [dispatch]
  );

  return {
    audioRef,
    currentTime,
    seek,
    getCurrentTime,
    events: {
      onTimeUpdate: handleTimeUpdate,
      onEnded: handleEnded,
      onWaiting: handleWaiting,
      onStalled: handleStalled, // 🔥 Thêm sự kiện mạng lag
      onPlaying: handleCanPlay,
      onCanPlay: handleCanPlay,
      onSeeked: handleCanPlay, // Tắt loading khi tua xong
    },
  };
};
