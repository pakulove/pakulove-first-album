import { create } from 'zustand'

type AudioPlayerState = {
  currentTime: number
  durationTime: number
  progress: number
  isPlaying: boolean
}

export type AudioPlayerStore = AudioPlayerState & {
  updateDuration: (durationTime: number) => void
  updateCurrent: (currentTime: number) => void
  updateProgress: (progress: number) => void
  updateIsPlaying: (isPlaying: boolean) => void
  togglePlay: () => void
}

const defaultState: AudioPlayerState = {
  durationTime: 0,
  currentTime: 0,
  progress: 0,
  isPlaying: false,
}

export const createAudioPlayerStore = () =>
  create<AudioPlayerStore>((set, get) => ({
    ...defaultState,
    updateCurrent: currentTime => set({ ...get(), currentTime }),
    updateDuration: durationTime => set({ ...get(), durationTime }),
    updateIsPlaying: isPlaying => set({ ...get(), isPlaying }),
    updateProgress: progress => set({ ...get(), progress }),
    togglePlay: () => set({ ...get(), isPlaying: !get().isPlaying }),
  }))
