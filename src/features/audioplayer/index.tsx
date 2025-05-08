import { useStrictContext } from '@shared/lib/react';
import { useRef, type FC } from 'react';
import { audioStoreContext, AudioStoreProvider } from './audiostoreprovider';
import styles from './style.module.scss';
import { useProgressBar } from './useProgressBar';

type AudioPlayerProps = React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & {
  title: string;
  prod: string,
  coverUrl: string;
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

const AudioPlayerContent: FC<AudioPlayerProps> = ({
  title,
  prod,
  coverUrl,
  ...props
}) => {
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

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;
    const newTime = (percentage / 100) * duration;

    audioRef.current.currentTime = newTime;
  };

  return (
    <div className={styles.player_container}>
      <img
        src={coverUrl}
        alt={`Cover for ${title}`}
        className={styles.cover_image}
      />
      <h1 className={styles.player_title}>{title}</h1>
      <p className={styles.player_production}>prod. by {prod}</p>
      <button className={styles.play_button} onClick={handleClick}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className={styles.progress_container}>
        <div
          className={styles.progress_bar}
          onClick={handleProgressBarClick}
          style={{ cursor: 'pointer' }}
        >
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
