import { tracksQueryOptions } from '@entities/track';
import { AudioPlayer } from '@features/audioplayer';
import {
  audioStoreContext,
  AudioStoreProvider,
} from '@features/audioplayer/audiostoreprovider';
import { BASE_URL } from '@shared/api/base';
import { useStrictContext } from '@shared/lib/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import style from './style.module.scss';

const HomePageContent = () => {
  const [isRightPopupVisible, setIsRightPopupVisible] = useState(false);
  const [isLeftPopupVisible, setIsLeftPopupVisible] = useState(true);
  const rightPopupContentRef = useRef<HTMLDivElement>(null);
  const leftPopupContentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useQuery(tracksQueryOptions);

  const { currentTrackIndex, setCurrentTrackIndex, updateIsPlaying } =
    useStrictContext(audioStoreContext);

  const toggleRightPopup = () => {
    setIsRightPopupVisible(!isRightPopupVisible);
    setIsLeftPopupVisible(false);
  };

  const toggleLeftPopup = () => {
    setIsLeftPopupVisible(!isLeftPopupVisible);
    setIsRightPopupVisible(false);
  };

  const playFirstTrack = () => {
    setIsLeftPopupVisible(false);

    document.querySelectorAll('audio').forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    const firstAudio = document.querySelector(
      'audio[data-index="0"]'
    ) as HTMLAudioElement;

    if (firstAudio) {
      firstAudio.play();
      setCurrentTrackIndex(0);
      updateIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rightPopupContentRef.current &&
        !rightPopupContentRef.current.contains(event.target as Node) &&
        isRightPopupVisible
      ) {
        setIsRightPopupVisible(false);
      }

      if (
        leftPopupContentRef.current &&
        !leftPopupContentRef.current.contains(event.target as Node) &&
        isLeftPopupVisible
      ) {
        setIsLeftPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRightPopupVisible, isLeftPopupVisible]);

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
          {data?.map(({ productBy, title, url, coverURL }, index) => (
            <AudioPlayer
              key={url}
              src={url}
              title={title}
              prod={productBy}
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
            backgroundImage: `url(${BASE_URL}/cover/${name})`,
          }}
        />
      </section>

      {/* Right Pull Tab */}
      <div className={style.pull_tab} onClick={toggleRightPopup}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </div>

      {/* Left Pull Tab */}
      <div
        className={`${style.pull_tab} ${style.left}`}
        onClick={toggleLeftPopup}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </div>

      {/* Right Popup - Album Cover */}
      <div
        className={`${style.popup_overlay} ${
          isRightPopupVisible ? style.visible : ''
        }`}
      >
        <div className={style.popup_content} ref={rightPopupContentRef}>
          <div className={style.popup_img_wrapper}>
            <div className={style.cover_side}>
              <img
                className={style.popup_img}
                src={`${BASE_URL}/cover/cover.png`}
                alt="Front cover"
              />
              <span className={style.side_label}>лицевая сторона</span>
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
              <span className={style.side_label}>оборотная сторона</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Popup - Album Info */}
      <div
        className={`${style.popup_overlay} ${
          isLeftPopupVisible ? style.visible : ''
        }`}
      >
        <div className={style.popup_content} ref={leftPopupContentRef}>
          <h2 className={style.popup_title}>skeesh - цсмж ч.1</h2>
          <button className={style.play_all_button} onClick={playFirstTrack}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            прикоснуться
          </button>
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
