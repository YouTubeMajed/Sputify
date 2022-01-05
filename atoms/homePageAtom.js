import { atom } from "recoil";

export const recentlyPlayedTracks = atom({
  key: "recentlyPlayedTracks",
  default: null,
});

export const topTracksState = atom({
  key: "topTracksState",
  default: null,
});
