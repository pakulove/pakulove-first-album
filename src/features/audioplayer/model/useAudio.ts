import { useStrictContext } from '@shared/lib/react'
import { useEffect, useRef } from 'react'
import { audioStoreContext } from '../audiostoreprovider'
import { useProgressBar } from './useProgressBar'

const isTrackOver = (progress: number) => progress === 100

export type AudioPlayerOptions = {
  title: string
  productBy: string
  coverURL: string
  onStart: () => void
  onEnd: () => void
  isActive: boolean
  trackIndex: number
}

export const useAudio = (props: AudioPlayerOptions) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
    props.onStart()
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
    isTrackOver(progress) && props.onEnd()
    progressBarHandlers.onEnded()
    audioRef.current.currentTime = 0
  }

  const togglePlay = () => {
    if (isPlaying) {
      handlePause()
    } else {
      if (props.isActive) handleResume()
      else handlePlay()
    }
  }

  const onEnded = () => {
    handleEnd()
    progressBarHandlers.onEnded()
  }

  useEffect(() => {
    if (props.isActive) {
      handlePlay()
    } else {
      handleEnd()
    }
  }, [props.isActive])

  return [
    audioRef,
    containerRef,
    { ...progressBarHandlers, togglePlay, handlePlay, onEnded },
  ] as const
}
