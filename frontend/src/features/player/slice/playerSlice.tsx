import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { Track } from "@/features/player/types";

// 2. Định nghĩa State của Player
interface PlayerState {
  currentTrack: Track | null; // Bài đang hát
  isPlaying: boolean; // Trạng thái Play/Pause
  isLoading: boolean; // Trạng thái đang tải (Buffering)

  queue: Track[]; // Danh sách phát hiện tại
  currentIndex: number; // Vị trí bài hiện tại trong queue

  volume: number; // 0 đến 1 (Chuẩn HTML Audio)
  isMuted: boolean;

  repeatMode: "off" | "all" | "one"; // Chế độ lặp
  isShuffling: boolean; // Chế độ ngẫu nhiên
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  queue: [],
  currentIndex: -1,
  volume: 1, // Max volume
  isMuted: false,
  repeatMode: "off",
  isShuffling: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // ➤ SET BÀI HÁT MỚI (Và thay đổi luôn cả danh sách phát nếu cần)
    setTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true; // Tự động play khi chọn bài mới
      state.isLoading = true; // Bật loading chờ buffer

      // Nếu bài hát chưa có trong queue, thêm vào queue (Tùy logic)
      // Ở đây logic đơn giản: Nếu chọn bài lẻ, queue chỉ có 1 bài
      // Nếu muốn queue thông minh hơn thì xử lý ở action setQueue bên dưới
    },

    // ➤ SET DANH SÁCH PHÁT (Khi bấm Play Album/Playlist)
    setQueue: (
      state,
      action: PayloadAction<{ tracks: Track[]; startIndex: number }>
    ) => {
      const { tracks, startIndex } = action.payload;
      state.queue = tracks;
      state.currentIndex = startIndex;
      state.currentTrack = tracks[startIndex];
      state.isPlaying = true;
      state.isLoading = true;
    },

    // ➤ ĐIỀU KHIỂN CƠ BẢN
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // ➤ NEXT / PREV
    nextTrack: (state) => {
      if (state.queue.length === 0) return;

      let nextIndex = state.currentIndex + 1;

      // Logic Shuffle: Nếu đang bật Shuffle, random index (đơn giản)
      if (state.isShuffling) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      }
      // Logic Repeat All: Nếu hết bài thì quay lại đầu
      else if (nextIndex >= state.queue.length) {
        if (state.repeatMode === "all") nextIndex = 0;
        else {
          // Nếu không repeat, dừng lại và không làm gì hoặc stop
          state.isPlaying = false;
          return;
        }
      }

      state.currentIndex = nextIndex;
      state.currentTrack = state.queue[nextIndex];
      state.isLoading = true;
      state.isPlaying = true;
    },

    prevTrack: (state) => {
      if (state.queue.length === 0) return;

      let prevIndex = state.currentIndex - 1;

      if (prevIndex < 0) {
        // Quay về cuối danh sách hoặc bài đầu tiên tùy logic
        prevIndex = state.queue.length - 1;
      }

      state.currentIndex = prevIndex;
      state.currentTrack = state.queue[prevIndex];
      state.isLoading = true;
      state.isPlaying = true;
    },

    // ➤ ÂM THANH
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload)); // Kẹp giữa 0 và 1
      if (state.volume > 0) state.isMuted = false;
    },

    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },

    // ➤ CHẾ ĐỘ
    toggleShuffle: (state) => {
      state.isShuffling = !state.isShuffling;
    },

    toggleRepeat: (state) => {
      const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
      const currentIdx = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(currentIdx + 1) % 3]; // Xoay vòng chế độ
    },
  },
});

export const {
  setTrack,
  setQueue,
  setIsPlaying,
  setIsLoading,
  nextTrack,
  prevTrack,
  setVolume,
  toggleMute,
  toggleShuffle,
  toggleRepeat,
} = playerSlice.actions;

// Selectors
export const selectPlayer = (state: RootState) => state.player;
export const selectCurrentTrack = (state: RootState) =>
  state.player.currentTrack;
export const selectIsPlaying = (state: RootState) => state.player.isPlaying;

export default playerSlice.reducer;
