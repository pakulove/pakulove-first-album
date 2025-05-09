import { useStrictContext } from '@shared/lib/react';
import { useRef, type FC } from 'react';
import { audioStoreContext } from './audiostoreprovider';
import styles from './style.module.scss';
import { useProgressBar } from './useProgressBar';

type AudioPlayerProps = React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & {
  title: string;
  prod: string;
  coverUrl: string;
  trackIndex: number;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const AudioPlayer: FC<AudioPlayerProps> = ({
  title,
  prod,
  coverUrl,
  trackIndex,
  ...props
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    progress,
    duration,
    isPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    updateIsPlaying,
    updateProgress,
  } = useStrictContext(audioStoreContext);
  const { onEnded, onLoadMetadata, onTimeUpdate } = useProgressBar(audioRef);

  const handleClick = () => {
    if (!audioRef.current) return;

    if (currentTrackIndex === trackIndex) {
      if (isPlaying) {
        audioRef.current.pause();
        updateIsPlaying(false);
      } else {
        audioRef.current.play();
        updateIsPlaying(true);
      }
      return;
    }

    // Reset progress of the current track
    if (currentTrackIndex !== null) {
      const currentAudio = document.querySelector(
        `audio[data-index="${currentTrackIndex}"]`
      ) as HTMLAudioElement;
      if (currentAudio) {
        currentAudio.currentTime = 0;
        updateProgress(0);
      }
    }

    // Stop all other audio elements
    document.querySelectorAll('audio').forEach((audio) => {
      if (audio !== audioRef.current) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    audioRef.current.play();
    setCurrentTrackIndex(trackIndex);
    updateIsPlaying(true);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !isCurrentTrack) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = Math.min(
      Math.max((clickPosition / rect.width) * 100, 0),
      100
    );
    const newTime = (percentage / 100) * audioRef.current.duration;

    if (isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
    }
  };

  const isCurrentTrack = currentTrackIndex === trackIndex;
  const showPauseButton = isCurrentTrack && isPlaying;

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
        {showPauseButton ? '⏸' : '▶'}
      </button>
      <div className={styles.progress_container}>
        <div
          className={styles.progress_bar}
          onClick={handleProgressBarClick}
          style={{ cursor: 'pointer' }}
        >
          <div
            className={styles.progress}
            style={{
              width: isCurrentTrack ? `${progress}%` : '0%',
            }}
          />
        </div>
        <div className={styles.time_display}>
          <span>{formatTime((progress / 100) * duration)} </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <audio
        {...props}
        ref={audioRef}
        data-index={trackIndex}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadMetadata}
        onEnded={onEnded}
      />
    </div>
  );
};
