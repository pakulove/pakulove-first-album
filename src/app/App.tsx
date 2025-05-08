import { AudioPlayer } from '@features/audioplayer';
import { useEffect, useState } from 'react';
import './App.css';

const BASE_URL = 'http://127.0.0.1:8000';

interface Track {
  title: string,
  prod: string,
}

function App() {
  const [tracks, setTracks] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [prods, setProds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`${BASE_URL}/playlist/`);
        if (!response.ok) {
          throw new Error('Failed to fetch playlist');
        }
        const data: Track[] = await response.json();
        const trackUrls = data.map(
          (_, index) => `${BASE_URL}/stream/${index + 1}.mp3`
        );
        const trackNames = data.map((track) => track['title']);
        const trackProds = data.map((track) => track['prod']);

        setTracks(trackUrls);
        setTitles(trackNames);
        setProds(trackProds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, []);

  if (loading) {
    return <div>Loading playlist...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {tracks.map((trackUrl, index) => (
        <AudioPlayer
          key={index}
          src={trackUrl}
          title={titles[index]}
          prod={prods[index]}
          coverUrl={`${BASE_URL}/cover/${index + 1}.png/`}
        />
      ))}
    </>
  );
}

export default App;
