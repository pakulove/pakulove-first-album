import { useStrictContext } from '@shared/lib/react'
import { audioStoreContext } from '../ui/audio-store-provider'

export const useProgressBar = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
  const { updateProgress, updateDuration, updateCurrent, updateIsPlaying, isPlaying } =
    useStrictContext(audioStoreContext)

  const onLoadedMetadata = () => {
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

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const percentage = Math.min(Math.max((clickPosition / rect.width) * 100, 0), 100)
    const newTime = (percentage / 100) * audioRef.current.duration
    audioRef.current.currentTime = newTime
  }

  return { onEnded, onTimeUpdate, onLoadedMetadata, handleProgressBarClick }
}
