import { useRef, type FC} from "react";
import { useProgressBar } from "./useProgressBar";
import { audioStoreContext, AudioStoreProvider } from "./audiostoreprovider";
import { useStrictContext } from "@shared/lib/react";


type AudioPlayerProps = React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>


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
    )
}

const AudioPlayerContent: FC<AudioPlayerProps> = (props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { progress, duration, togglePlay, isPlaying } = useStrictContext(audioStoreContext);
  const { onEnded, onLoadMetadata, onTimeUpdate } = useProgressBar(audioRef); 
  const handleClick = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    togglePlay();
  }
  return (
    <div className="player-container">
      <h1 className="player-title">Audio Stream</h1>
      <button className="play-button" onClick={handleClick}>
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="time-display">
          <span>{formatTime((progress / 100) * duration)}</span>
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
    )
}