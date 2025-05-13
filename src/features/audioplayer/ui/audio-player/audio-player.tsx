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
  const { isActive, coverURL, productBy, title } = useAudioPlayerDeps()

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
        <audio {...props} {...audioHandlers} ref={audioRef} data-index={title} />
      </div>
    </div>
  )
}
