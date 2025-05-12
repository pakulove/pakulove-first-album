import { BASE_URL } from '@shared/api/base'
import { useStrictContext } from '@shared/lib/react'
import cn from 'classnames'
import { type FC } from 'react'
import { audioStoreContext, AudioStoreProvider } from './audiostoreprovider'
import { useAudio, type AudioPlayerOptions } from './model/useAudio'
import { useDiscRotation } from './model/useDiscRotation'
import styles from './style.module.scss'
import Timer from './ui/timer'

export type AudioPlayerProps = AudioPlayerOptions &
  React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>

export const AudioPlayer: FC<AudioPlayerProps> = props => {
  return (
    <AudioStoreProvider>
      <AudioPlayerContent {...props} />
    </AudioStoreProvider>
  )
}

export const AudioPlayerContent: FC<AudioPlayerProps> = props => {
  const { isActive, trackIndex, coverURL, productBy, title, onStart, onEnd, ...htmlProps } = props
  const [audioRef, containerRef, handlers] = useAudio(props)
  const { handlePlay, togglePlay, handleProgressBarClick, ...audioHandlers } = handlers
  const { currentTime, durationTime, isPlaying, progress } = useStrictContext(audioStoreContext)
  const discRef = useDiscRotation()

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.disc_image_wrapper, { [styles.current]: isActive })}>
        <img
          ref={discRef}
          className={styles.disc_image}
          src={`${BASE_URL}/disc/${trackIndex + 1}.png`}
        />
      </div>
      <div
        ref={containerRef}
        className={cn(styles.player_container, { [styles.playing]: isActive })}>
        <img src={coverURL} className={styles.cover_image} />
        <h1 className={styles.player_title}>{title}</h1>
        <p className={styles.player_production}>prod. by {productBy}</p>
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
            <Timer time={currentTime} />
            <Timer time={durationTime} />
          </div>
        </div>
        <audio {...htmlProps} {...audioHandlers} ref={audioRef} data-index={title} />
      </div>
    </div>
  )
}
