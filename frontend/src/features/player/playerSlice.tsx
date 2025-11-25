// src/features/player/playerSlice.ts
import type { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
  currentSong: string | null;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playSong: (state, action: PayloadAction<string>) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    pauseSong: (state) => {
      state.isPlaying = false;
    },
  },
});

export const selectCurrentSong = (state: RootState) => state.player.currentSong;
export const selectIsPlaying = (state: RootState) => state.player.isPlaying;
export const { playSong, pauseSong } = playerSlice.actions;
export default playerSlice.reducer;
