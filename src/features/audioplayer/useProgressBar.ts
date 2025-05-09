import { useStrictContext } from '@shared/lib/react';
import { audioStoreContext } from './audiostoreprovider';

export const useProgressBar = (
  audioRef: React.RefObject<HTMLAudioElement | null>
) => {
  const {
    updateProgress,
    updateDuration,
    updateIsPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
  } = useStrictContext(audioStoreContext);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;

      updateProgress(currentProgress);
    }
  };

  const onEnded = () => {
    updateIsPlaying(false);
    updateProgress(0);

    const nextTrackIndex =
      currentTrackIndex !== null ? currentTrackIndex + 1 : 0;
    const nextAudio = document.querySelector(
      `audio[data-index="${nextTrackIndex}"]`
    ) as HTMLAudioElement;

    if (nextAudio) {
      document.querySelectorAll('audio').forEach((audio) => {
        if (audio !== nextAudio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      nextAudio.play();
      setCurrentTrackIndex(nextTrackIndex);
      updateIsPlaying(true);
    }
  };

  const onLoadMetadata = () => {
    updateDuration(audioRef.current?.duration ?? 0);
  };

  return {
    onEnded,
    onLoadMetadata,
    onTimeUpdate,
  };
};
