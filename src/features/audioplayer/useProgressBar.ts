import { useStrictContext } from '@shared/lib/react'
import { audioStoreContext } from './audiostoreprovider'

export const useProgressBar = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
  const { updateProgress, updateDuration, updateCurrent, updateIsPlaying } =
    useStrictContext(audioStoreContext)

  const onLoadMetadata = () => {
    updateDuration(audioRef.current?.duration ?? 0)
  }

  const onEnded = () => {
    updateIsPlaying(false)
    updateProgress(0)
  }

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const { duration, currentTime } = audioRef.current
      const currentProgress = (currentTime / duration) * 100
      updateCurrent(currentTime)
      updateProgress(currentProgress)
    }
  }

  return { onEnded, onTimeUpdate, onLoadMetadata }
}
