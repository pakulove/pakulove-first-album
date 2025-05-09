import { useStrictContext } from '@shared/lib/react';
import { useEffect, useRef, useState, type FC } from 'react';
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
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackCurrentTime, setTrackCurrentTime] = useState(0);

  const {
    progress,
    isPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    updateIsPlaying,
    updateProgress,
  } = useStrictContext(audioStoreContext);

  const onTimeUpdateLocal = () => {
    if (audioRef.current) {
      setTrackCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadMetadataLocal = () => {
    if (audioRef.current) {
      setTrackDuration(audioRef.current.duration);
    }
  };

  const { onEnded, onTimeUpdate, onLoadMetadata } = useProgressBar(audioRef);

  const isCurrentTrack = currentTrackIndex === trackIndex;
  const showPauseButton = isCurrentTrack && isPlaying;

  const displayTime = isCurrentTrack ? (progress / 100) * trackDuration : 0;

  useEffect(() => {
    if (isCurrentTrack && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isCurrentTrack, currentTrackIndex]);

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

    if (currentTrackIndex !== null) {
      const currentAudio = document.querySelector(
        `audio[data-index="${currentTrackIndex}"]`
      ) as HTMLAudioElement;
      if (currentAudio) {
        currentAudio.currentTime = 0;
        updateProgress(0);
      }
    }

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

  const handleTimeUpdate = () => {
    onTimeUpdate();
    onTimeUpdateLocal();
  };

  const handleLoadMetadata = () => {
    onLoadMetadata();
    onLoadMetadataLocal();
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.player_container} ${
        isCurrentTrack ? styles.current : ''
      }`}
    >
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
          <span>{formatTime(displayTime)} </span>
          <span>{formatTime(trackDuration)}</span>
        </div>
      </div>
      <audio
        {...props}
        ref={audioRef}
        data-index={trackIndex}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadMetadata}
        onEnded={onEnded}
      />
    </div>
  );
};
