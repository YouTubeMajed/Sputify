import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const isShuffleState = atom({
  key: "isShuffleState",
  default: false,
});

export const isReplayState = atom({
  key: "isReplayState",
  default: false,
});
