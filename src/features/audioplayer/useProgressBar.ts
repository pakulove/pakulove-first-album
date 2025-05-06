import { useStrictContext } from "@shared/lib/react";
import { audioStoreContext } from "./audiostoreprovider";

export const useProgressBar = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
  const { updateProgress, updateDuration, updateIsPlaying } = useStrictContext(audioStoreContext);
  const onTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      updateProgress(currentProgress);
    }
  };
  const onEnded = () => {
    updateIsPlaying(false)
  };
  const onLoadMetadata = () => {
    updateDuration(audioRef.current?.duration ?? 0);
  };

  return {
   onEnded,
   onLoadMetadata, 
   onTimeUpdate,
  }
};
