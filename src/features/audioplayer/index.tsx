import { useStrictContext } from '@shared/lib/react';
import { useRef, type FC } from 'react';
import { audioStoreContext, AudioStoreProvider } from './audiostoreprovider';
import { useProgressBar } from './useProgressBar';
import styles from './style.module.scss'

type AudioPlayerProps = React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & {
  title: string;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const AudioPlayer: FC<AudioPlayerProps> = (props) => {
  return (
    <AudioStoreProvider>
      <AudioPlayerContent {...props} />
    </AudioStoreProvider>
  );
};

const AudioPlayerContent: FC<AudioPlayerProps> = ({title, ...props}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { progress, duration, togglePlay, isPlaying } =
    useStrictContext(audioStoreContext);
  const { onEnded, onLoadMetadata, onTimeUpdate } = useProgressBar(audioRef);
  const handleClick = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    togglePlay();
  };
  return (
    <div className={styles.player_container}>
      <h1 className={styles.player_title}>{title}</h1>
      <button className={styles.play_button} onClick={handleClick}>
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>
      <div className={styles.progress_container}>
        <div className={styles.progress_bar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.time_display}>
          <span>{formatTime((progress / 100) * duration)} </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <audio
        {...props}
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadMetadata}
        onEnded={onEnded}
      />
    </div>
  );
};
