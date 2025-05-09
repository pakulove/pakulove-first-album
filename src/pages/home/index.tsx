import { AudioPlayer } from '@features/audioplayer';
import {
  audioStoreContext,
  AudioStoreProvider,
} from '@features/audioplayer/audiostoreprovider';
import { BASE_URL } from '@shared/api/base';
import { trackService } from '@shared/api/track';
import { useStrictContext } from '@shared/lib/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import style from './style.module.scss';

const HomePageContent = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupContentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const data = await trackService.getTracks();
      return data.map((track, index) => ({
        ...track,
        url: `${BASE_URL}/stream/${index + 1}.mp3/`,
        coverURL: `${BASE_URL}/cover/cover.png/`,
      }));
    },
  });

  const { currentTrackIndex } = useStrictContext(audioStoreContext);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupContentRef.current &&
        !popupContentRef.current.contains(event.target as Node) &&
        isPopupVisible
      ) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupVisible]);

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

      {/* Pull Tab */}
      <div className={style.pull_tab} onClick={togglePopup}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </div>

      {/* Popup */}
      <div
        className={`${style.popup_overlay} ${
          isPopupVisible ? style.visible : ''
        }`}
      >
        <div className={style.popup_content} ref={popupContentRef}>
          <div className={style.popup_img_wrapper}>
            <div className={style.cover_side}>
              <img
                className={style.popup_img}
                src={`${BASE_URL}/cover/cover.png`}
                alt="Front cover"
              />
              <span className={style.side_label}>Лицевая сторона</span>
            </div>
            <img
              className={style.popup_img}
              src={`${BASE_URL}/cover/disks.png`}
              style={{  
                verticalAlign: 'center',
                width: '18rem',
                height: '11rem',
                objectFit: 'contain',
              }}
              alt="disks"
            />
            <div className={style.cover_side}>
              <img
                className={style.popup_img}
                src={`${BASE_URL}/cover/reverse.png`}
                alt="Back cover"
              />
              <span className={style.side_label}>Оборотная сторона</span>
            </div>
          </div>
        </div>
      </div>
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
