import { useStrictContext } from '@shared/lib/react'
import { useEffect, useRef } from 'react'
import { useAudioPlayerDeps } from '../deps'
import { audioStoreContext } from '../ui/audio-store-provider'
import { useProgressBar } from './useProgressBar'

const isTrackOver = (progress: number) => progress === 100

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioDeps = useAudioPlayerDeps()

  const { progress, isPlaying, updateIsPlaying } = useStrictContext(audioStoreContext)

  const progressBarHandlers = useProgressBar(audioRef)

  const scrollTo = () => {
    containerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const handleResume = () => {
    if (!audioRef.current) return
    if (!isPlaying) {
      scrollTo()
      audioRef.current.play()
      updateIsPlaying(true)
    }
  }

  const handlePlay = () => {
    handleResume()
    audioDeps.onStart()
  }

  const handlePause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      updateIsPlaying(false)
    }
  }

  const handleEnd = () => {
    if (!audioRef.current) return
    handlePause()
    isTrackOver(progress) && audioDeps.onEnd()
    progressBarHandlers.onEnded()
    audioRef.current.currentTime = 0
  }

  const togglePlay = () => {
    if (isPlaying) {
      handlePause()
    } else {
      if (audioDeps.isActive) handleResume()
      else handlePlay()
    }
  }

  const onEnded = () => {
    handleEnd()
    progressBarHandlers.onEnded()
  }

  useEffect(() => {
    if (audioDeps.isActive) {
      handlePlay()
    } else {
      handleEnd()
    }
  }, [audioDeps.isActive])

  return [
    audioRef,
    containerRef,
    { ...progressBarHandlers, togglePlay, handlePlay, onEnded },
  ] as const
}
