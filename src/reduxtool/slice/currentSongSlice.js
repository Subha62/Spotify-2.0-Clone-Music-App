import { createSlice } from "@reduxjs/toolkit";

const getLocalData = JSON.parse(localStorage.getItem("currentSongInfo"));

const initialState = {
  currentSongInfo: getLocalData || {},
};

export const currentSongSlice = createSlice({
  name: "currentSong",
  initialState,
  reducers: {
    addSongInfo: (state, action) => {
      state.currentSongInfo = {
        ...state.currentSongInfo,
        ...action.payload,
      };
      localStorage.setItem(
        "currentSongInfo",
        JSON.stringify(state.currentSongInfo)
      );
    },

    clearSongInfo: (state) => {
      state.currentSongInfo = {};
      localStorage.removeItem("currentSongInfo");
    },
  },
});

export const { addSongInfo, clearSongInfo } = currentSongSlice.actions;

export default currentSongSlice.reducer;
