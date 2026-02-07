/**
 * @file playerSlice.ts
 * @description Quản lý toàn bộ State của trình phát nhạc.
 * @features Smart Shuffle, Dual Queue, Seek Checkpointing.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { Track } from "@/features/track/types";

// ============================================================================
// 1. HELPER: SMART SHUFFLE (Spotify Style)
// ============================================================================

/**
 * Thuật toán Shuffle thông minh: Tránh xếp 2 bài cùng ca sĩ cạnh nhau.
 */
const smartShuffle = (tracks: Track[], currentTrack: Track): Track[] => {
  const result = [currentTrack];
  const pool = tracks.filter((t) => t._id !== currentTrack._id);

  while (pool.length > 0) {
    let attempts = 0;
    let chosen: Track | null = null;

    // Thử tìm bài khác ca sĩ với bài trước đó
    while (attempts < 3 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      const candidate = pool[idx];

      if (result[result.length - 1].artist?._id !== candidate.artist?._id) {
        chosen = candidate;
        pool.splice(idx, 1);
        break;
      }
      attempts++;
    }

    // Nếu không tìm được (hoặc pool còn ít), lấy random
    if (!chosen && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      chosen = pool.splice(idx, 1)[0];
    }

    if (chosen) result.push(chosen);
  }

  return result;
};

// ============================================================================
// 2. STATE INTERFACE
// ============================================================================

interface PlayerState {
  currentTrack: Track | null;

  // Dual Queue: Giữ danh sách gốc để khi tắt Shuffle có thể khôi phục
  originalQueue: Track[];
  activeQueue: Track[];
  currentIndex: number;

  // Playback Status
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;

  /**
   * Seek Checkpoint: Chỉ lưu vị trí khi user tua hoặc pause.
   * KHÔNG lưu liên tục mỗi giây để tối ưu hiệu năng ghi LocalStorage.
   */
  lastSeekTime: number; // Timestamp trigger
  seekPosition: number; // Seconds

  // Audio Settings
  volume: number;
  isMuted: boolean;
  repeatMode: "off" | "all" | "one";
  isShuffling: boolean;

  // Gapless Playback (Preload bài tiếp theo)
  nextTrackPreloaded: Track | null;
}

const initialState: PlayerState = {
  currentTrack: null,
  originalQueue: [],
  activeQueue: [],
  currentIndex: -1,
  isPlaying: false,
  isLoading: false,
  duration: 0,
  lastSeekTime: 0,
  seekPosition: 0,
  volume: 1,
  isMuted: false,
  repeatMode: "off",
  isShuffling: false,
  nextTrackPreloaded: null,
};

// ============================================================================
// 3. SLICE DEFINITION
// ============================================================================

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // --- Queue Management ---
    setQueue: (
      state,
      action: PayloadAction<{ tracks: Track[]; startIndex: number }>
    ) => {
      const { tracks, startIndex } = action.payload;
      state.originalQueue = tracks;
      state.currentTrack = tracks[startIndex];

      if (state.isShuffling) {
        state.activeQueue = smartShuffle(tracks, tracks[startIndex]);
        state.currentIndex = 0;
      } else {
        state.activeQueue = tracks;
        state.currentIndex = startIndex;
      }

      // Preload logic
      const nextIdx = state.currentIndex + 1;
      state.nextTrackPreloaded =
        nextIdx < state.activeQueue.length ? state.activeQueue[nextIdx] : null;

      state.isPlaying = true;
      state.isLoading = true;
      state.seekPosition = 0; // Reset seek khi đổi bài
      state.lastSeekTime = Date.now();
    },

    // --- Controls ---
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    stopPlaying: (state) => {
      state.currentTrack = null;
      state.originalQueue = [];
      state.activeQueue = [];
      state.currentIndex = -1;
      state.isPlaying = false;
      state.isLoading = false;
      state.duration = 0;
      state.lastSeekTime = 0;
      state.seekPosition = 0;
      state.volume = 1;
      state.isMuted = false;
      state.repeatMode = "off";
      state.isShuffling = false;
      state.nextTrackPreloaded = null;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },

    /**
     * Action này lưu lại vị trí bài hát vào Redux.
     * Được gọi khi: User kéo thanh tua, Pause nhạc, hoặc Tắt tab.
     */
    seekTo: (state, action: PayloadAction<number>) => {
      state.seekPosition = action.payload;
      state.lastSeekTime = Date.now();
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
      if (state.volume > 0) state.isMuted = false;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },

    // --- Navigation (Shuffle/Repeat/Next/Prev) ---
    toggleShuffle: (state) => {
      state.isShuffling = !state.isShuffling;
      if (!state.currentTrack) return;

      if (state.isShuffling) {
        state.activeQueue = smartShuffle(
          state.originalQueue,
          state.currentTrack
        );
        state.currentIndex = 0;
      } else {
        state.activeQueue = state.originalQueue;
        state.currentIndex = state.originalQueue.findIndex(
          (t) => t._id === state.currentTrack?._id
        );
      }

      // Update preload
      const nextIdx = state.currentIndex + 1;
      state.nextTrackPreloaded =
        nextIdx < state.activeQueue.length ? state.activeQueue[nextIdx] : null;
    },

    toggleRepeat: (state) => {
      const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
      const idx = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(idx + 1) % 3];
    },

    nextTrack: (state) => {
      if (state.activeQueue.length === 0) return;

      if (state.repeatMode === "one") {
        state.seekPosition = 0;
        state.lastSeekTime = Date.now();
        state.isPlaying = true;
        return;
      }

      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.activeQueue.length) {
        if (state.repeatMode === "all") {
          nextIndex = 0;
        } else {
          // End of queue -> Stop & Reset to first track
          state.isPlaying = false;
          state.currentIndex = 0;
          state.currentTrack = state.activeQueue[0];
          state.seekPosition = 0;
          state.lastSeekTime = Date.now();
          return;
        }
      }

      state.currentIndex = nextIndex;
      state.currentTrack = state.activeQueue[nextIndex];
      state.seekPosition = 0;
      state.lastSeekTime = Date.now();
      state.isPlaying = true;

      const preloadIdx = nextIndex + 1;
      state.nextTrackPreloaded =
        preloadIdx < state.activeQueue.length
          ? state.activeQueue[preloadIdx]
          : null;
    },

    prevTrack: (state, action: PayloadAction<number | undefined>) => {
      if (state.activeQueue.length === 0) return;
      const currentTime = action.payload || 0;

      // Rule: Nếu nghe > 3s thì replay, ngược lại thì back bài trước
      if (currentTime > 3) {
        state.seekPosition = 0;
        state.lastSeekTime = Date.now();
        return;
      }

      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex =
          state.repeatMode === "all" ? state.activeQueue.length - 1 : 0;
      }

      state.currentIndex = prevIndex;
      state.currentTrack = state.activeQueue[prevIndex];
      state.seekPosition = 0;
      state.lastSeekTime = Date.now();
      state.isPlaying = true;

      const nextIdx = prevIndex + 1;
      state.nextTrackPreloaded =
        nextIdx < state.activeQueue.length ? state.activeQueue[nextIdx] : null;
    },
  },
});

export const {
  setQueue,
  setIsPlaying,
  stopPlaying,
  setIsLoading,
  setDuration,
  seekTo,
  setVolume,
  toggleMute,
  toggleShuffle,
  toggleRepeat,
  nextTrack,
  prevTrack,
} = playerSlice.actions;

// Selectors
export const selectPlayer = (state: RootState) => state.player;
export const selectNextTrack = (state: RootState) =>
  state.player.nextTrackPreloaded;

export default playerSlice.reducer;
