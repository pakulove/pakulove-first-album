import { create } from "zustand";

type AudioPlayerState = {
  duration: number;
  progress: number;
  isPlaying: boolean;
};

export type AudioPlayerStore = AudioPlayerState & {
  updateDuration: (duration: number) => void;
  updateProgress: (progress: number) => void;
  updateIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
};

const defaultState: AudioPlayerState = {
  duration: 0,
  isPlaying: false,
  progress: 0,
};

export const createAudioPlayerStore = () => create<AudioPlayerStore>((set, get) => ({
  ...defaultState,
  updateDuration: (duration) => set({ ...get(), duration }),
  updateIsPlaying: (isPlaying) => set({ ...get(), isPlaying }),
  updateProgress: (progress) => set({ ...get(), progress }),
  togglePlay: () => set({...get(), isPlaying: !get().isPlaying}),
}));
