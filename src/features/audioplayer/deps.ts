import { createStrictContext, useStrictContext } from '@shared/lib/react'

export type AudioPlayerDeps = {
  title: string
  productBy: string
  coverURL: string
  onStart: () => void
  onEnd: () => void
  isActive: boolean
  trackIndex: number
  discURL: string
}

export const audioPlayerDepsContext = createStrictContext<AudioPlayerDeps>()

export const useAudioPlayerDeps = () => useStrictContext(audioPlayerDepsContext)
