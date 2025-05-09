import { create } from 'zustand';

type AudioPlayerState = {
  duration: number;
  progress: number;
  isPlaying: boolean;
  currentTrackIndex: number | null;
};

export type AudioPlayerStore = AudioPlayerState & {
  updateDuration: (duration: number) => void;
  updateProgress: (progress: number) => void;
  updateIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
  setCurrentTrackIndex: (index: number | null) => void;
};

const defaultState: AudioPlayerState = {
  duration: 0,
  isPlaying: false,
  progress: 0,
  currentTrackIndex: null,
};

export const createAudioPlayerStore = () =>
  create<AudioPlayerStore>((set, get) => ({
    ...defaultState,
    updateDuration: (duration) => set({ ...get(), duration }),
    updateIsPlaying: (isPlaying) => set({ ...get(), isPlaying }),
    updateProgress: (progress) => set({ ...get(), progress }),
    togglePlay: () => set({ ...get(), isPlaying: !get().isPlaying }),
    setCurrentTrackIndex: (index) =>
      set({ ...get(), currentTrackIndex: index }),
  }));
