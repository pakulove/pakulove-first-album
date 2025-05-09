import { AudioPlayer } from '@features/audioplayer';
import {
  audioStoreContext,
  AudioStoreProvider,
} from '@features/audioplayer/audiostoreprovider';
import { BASE_URL } from '@shared/api/base';
import { trackService } from '@shared/api/track';
import { useStrictContext } from '@shared/lib/react';
import { useQuery } from '@tanstack/react-query';
import style from './style.module.scss';

const HomePageContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const data = await trackService.getTracks();
      return data.map((track, index) => ({
        ...track,
        url: `${BASE_URL}/stream/${index + 1}.mp3/`,
        coverURL: `${BASE_URL}/cover/${index + 1}.png/`,
      }));
    },
  });

  const { currentTrackIndex } = useStrictContext(audioStoreContext);

  if (isLoading) {
    return <div>Loading playlist...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const currentCover =
    currentTrackIndex !== null && data ? data[currentTrackIndex] : data?.[0];

  return (
    <div className={style.home_container}>
      <div className={style.wrapper}>
        <section className={style.track_list}>
          {data?.map(({ prod, title, url, coverURL }, index) => (
            <AudioPlayer
              key={url}
              src={url}
              title={title}
              prod={prod}
              coverUrl={coverURL}
              trackIndex={index}
            />
          ))}
        </section>
      </div>
      <section className={style.img_wrapper}>
        <div
          className={style.static_img}
          style={{
            backgroundImage: `url(${currentCover?.coverURL})`,
          }}
        />
      </section>
    </div>
  );
};

const HomePage = () => {
  return (
    <AudioStoreProvider>
      <HomePageContent />
    </AudioStoreProvider>
  );
};

export default HomePage;
