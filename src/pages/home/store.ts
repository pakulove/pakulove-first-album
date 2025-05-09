import type { TTrack } from '@entities/track'
import { create } from 'zustand'

type ActiveTrackStore = {
  activeTrack: TTrack | null
  updateActiveTrack: (activeTrack: TTrack | null) => void
}

const defaultActiveTrack = {
  activeTrack: null,
}

export const useActiveTrackStore = create<ActiveTrackStore>((set, get) => ({
  ...defaultActiveTrack,
  updateActiveTrack: activeTrack => set({ ...get(), activeTrack }),
}))
