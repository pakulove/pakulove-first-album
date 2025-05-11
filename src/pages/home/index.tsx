import { tracksQueryOptions, type TTrack } from '@entities/track'
import { AudioPlayer, type AudioPlayerProps } from '@features/audioplayer'
import { BASE_URL } from '@shared/api/base'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useActiveTrackStore } from './store'
import style from './style.module.scss'

const trackExists = (index: number, tracks: unknown[]) => index < tracks.length

const HomePage = () => {
  const [isRightPopupVisible, setIsRightPopupVisible] = useState(false)
  const [isLeftPopupVisible, setIsLeftPopupVisible] = useState(true)
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentImage, setCurrentImage] = useState('cover.png')
  const rightPopupContentRef = useRef<HTMLDivElement>(null)
  const leftPopupContentRef = useRef<HTMLDivElement>(null)

  const audioListRef = useRef<HTMLDivElement>(null)
  const { activeTrack, updateActiveTrack } = useActiveTrackStore()
  const { data, isLoading, isError, error } = useQuery(tracksQueryOptions)

  const getPlayerProps: (track: TTrack, index: number) => AudioPlayerProps = (track, index) => ({
    coverURL: track.coverURL,
    productBy: track.productBy,
    title: track.title,
    src: track.url,
    trackIndex: index,
    isActive: activeTrack?.url === track.url,
    onStart: () => {
      updateActiveTrack(track)
    },
    onEnd: () => {
      if (data && trackExists(index + 1, data)) {
        updateActiveTrack(data[index + 1])
      }
    },
  })

  const toggleRightPopup = () => {
    setIsRightPopupVisible(!isRightPopupVisible)
    setIsLeftPopupVisible(false)
  }

  const toggleLeftPopup = () => {
    setIsLeftPopupVisible(!isLeftPopupVisible)
    setIsRightPopupVisible(false)
  }

  const playFirstTrack = () => {
    setIsLeftPopupVisible(false)

    data && updateActiveTrack(data[0])
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    // Задержка для смены изображения в середине анимации
    setTimeout(() => {
      setCurrentImage(isFlipped ? 'cover.png' : 'reverse.png')
    }, 400) // Половина времени анимации (0.8s / 2)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rightPopupContentRef.current &&
        !rightPopupContentRef.current.contains(event.target as Node) &&
        isRightPopupVisible
      ) {
        setIsRightPopupVisible(false)
      }

      if (
        leftPopupContentRef.current &&
        !leftPopupContentRef.current.contains(event.target as Node) &&
        isLeftPopupVisible
      ) {
        setIsLeftPopupVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isRightPopupVisible, isLeftPopupVisible])

  if (isLoading) {
    return <div>Loading playlist...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className={style.home_container}>
      <div className={style.wrapper}>
        <section ref={audioListRef} className={style.track_list}>
          {data?.map((track, index) => (
            <AudioPlayer key={track.title} {...getPlayerProps(track, index)} />
          ))}
        </section>
      </div>

      <section className={style.img_wrapper}>
        <div
          className={`${style.static_img} ${isFlipped ? style.flipped : ''}`}
          style={
            {
              '--front-image': `url(${BASE_URL}/cover/cover.png)`,
              '--back-image': `url(${BASE_URL}/cover/reverse.png)`,
            } as React.CSSProperties
          }
        />
        <button
          className={style.flip_button}
          onClick={() => setIsFlipped(!isFlipped)}
          title="Перевернуть обложку">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"
              fill="white"
            />
          </svg>
        </button>
      </section>

      {/* Right Pull Tab */}
      <div className={style.pull_tab} onClick={toggleRightPopup}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </div>

      {/* Left Pull Tab */}
      <div className={`${style.pull_tab} ${style.left}`} onClick={toggleLeftPopup}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </div>

      {/* Right Popup - Album Cover */}
      <div className={`${style.popup_overlay} ${isRightPopupVisible ? style.visible : ''}`}>
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
      <div className={`${style.popup_overlay} ${isLeftPopupVisible ? style.visible : ''}`}>
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
  )
}

export default HomePage
