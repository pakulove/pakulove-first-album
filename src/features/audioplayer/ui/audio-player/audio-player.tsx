import { useStrictContext } from '@shared/lib/react'
import cn from 'classnames'
import { type FC } from 'react'
import { useAudioPlayerDeps } from '../../deps'
import { useAudio } from '../../model/useAudio'
import { audioStoreContext, AudioStoreProvider } from '../audio-store-provider'
import RotatingDisc from '../rotating-disc/rotating-disc'
import Timer from '../timer'
import styles from './audio-player.module.scss'

export type AudioPlayerProps = React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
>

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" />
  </svg>
)

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor" />
  </svg>
)

export const AudioPlayer: FC<AudioPlayerProps> = props => {
  return (
    <AudioStoreProvider>
      <AudioPlayerContent {...props} />
    </AudioStoreProvider>
  )
}

const AudioPlayerContent: FC<AudioPlayerProps> = props => {
  const [audioRef, containerRef, handlers] = useAudio()
  const { handlePlay, togglePlay, handleProgressBarClick, ...audioHandlers } = handlers
  const { currentTime, durationTime, isPlaying, progress } = useStrictContext(audioStoreContext)
  const { isActive, coverURL, productBy, title, trackIndex } = useAudioPlayerDeps()

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget
    const progressBar = audio.parentElement?.querySelector(`.${styles.progress}`) as HTMLElement
    if (progressBar) {
      progressBar.style.width = '0%'
    }
    if (audioHandlers.onLoadedMetadata) {
      audioHandlers.onLoadedMetadata()
    }
  }

  return (
    <div className={styles.wrapper}>
      <RotatingDisc />
      <div
        ref={containerRef}
        className={cn(styles.player_container, { [styles.playing]: isActive })}>
        <img src={coverURL} alt={`Cover for ${title}`} className={styles.cover_image} />
        <h1 className={styles.player_title}>{title}</h1>
        <p className={styles.player_production}>prod. by {productBy}</p>
        <button className={styles.play_button} onClick={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className={styles.progress_container}>
          <div
            className={styles.progress_bar}
            style={{ cursor: isActive ? 'pointer' : 'auto' }}
            onClick={isActive ? handleProgressBarClick : undefined}>
            <div
              className={styles.progress}
              style={{ width: isActive ? `${progress}%` : '0%' }}
              data-track-index={trackIndex}
            />
            <div
              className={styles.progress_hover}
              style={{
                left: isActive ? `${progress}%` : '0%',
                opacity: isActive ? 1 : 0,
              }}
            />
          </div>
          <div className={styles.time_display}>
            <Timer time={currentTime} />
            <Timer time={durationTime} />
          </div>
        </div>
        <audio
          {...props}
          {...audioHandlers}
          onLoadedMetadata={handleLoadedMetadata}
          ref={audioRef}
          data-index={title}
        />
      </div>
    </div>
  )
}
