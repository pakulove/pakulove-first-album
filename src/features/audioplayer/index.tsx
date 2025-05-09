import { useStrictContext } from '@shared/lib/react'
import cn from 'classnames'
import { useEffect, useRef, type FC } from 'react'
import { audioStoreContext, AudioStoreProvider } from './audiostoreprovider'
import styles from './style.module.scss'
import { useProgressBar } from './useProgressBar'

type AudioPlayerProps = React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & {
  title: string
  prod: string
  coverUrl: string
  onStarted: () => void
  onEnded: () => void
  isActive: boolean
}

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const isTrackOver = (progress: number) => progress === 100

export const AudioPlayer: FC<AudioPlayerProps> = props => {
  return (
    <AudioStoreProvider>
      <AudioPlayerContent {...props} />
    </AudioStoreProvider>
  )
}

export const AudioPlayerContent: FC<AudioPlayerProps> = props => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { title, prod, coverUrl, onStarted, onEnded, isActive, ...htmlProps } = props

  const { progress, isPlaying, currentTime, durationTime, updateIsPlaying } =
    useStrictContext(audioStoreContext)

  const progressBar = useProgressBar(audioRef)

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

  const handlePause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      updateIsPlaying(false)
    }
  }

  const handlePlay = () => {
    handleResume()
    onStarted()
  }

  const handleEnd = () => {
    if (!audioRef.current) return
    handlePause()
    isTrackOver(progress) && onEnded()
    progressBar.onEnded()
    audioRef.current.currentTime = 0
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !isActive) return
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const percentage = Math.min(Math.max((clickPosition / rect.width) * 100, 0), 100)
    const newTime = (percentage / 100) * audioRef.current.duration
    audioRef.current.currentTime = newTime
  }

  const togglePlay = () => {
    if (isPlaying) {
      handlePause()
    } else {
      if (isActive) handleResume()
      else handlePlay()
    }
  }

  //TODO GET RID PZH
  useEffect(() => {
    if (isActive) {
      handlePlay()
    } else {
      handleEnd()
    }
  }, [isActive])

  return (
    <div ref={containerRef} className={cn(styles.player_container, { [styles.current]: isActive })}>
      <img src={coverUrl} alt={`Cover for ${title}`} className={styles.cover_image} />
      <h1 className={styles.player_title}>{title}</h1>
      <p className={styles.player_production}>prod. by {prod}</p>
      <button className={styles.play_button} onClick={togglePlay}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className={styles.progress_container}>
        <div
          className={styles.progress_bar}
          style={{ cursor: isActive ? 'pointer' : 'auto' }}
          onClick={handleProgressBarClick}>
          <div
            className={cn(styles.progress, { [styles.progress_active]: isActive })}
            style={{ width: isActive ? `${progress}%` : '0%' }}
          />
        </div>
        <div className={styles.time_display}>
          <span>{formatTime(currentTime)} </span>
          <span>{formatTime(durationTime)}</span>
        </div>
      </div>
      <audio
        {...htmlProps}
        ref={audioRef}
        data-index={title}
        onEnded={handleEnd}
        onTimeUpdate={progressBar.onTimeUpdate}
        onLoadedMetadata={progressBar.onLoadMetadata}
      />
    </div>
  )
}
