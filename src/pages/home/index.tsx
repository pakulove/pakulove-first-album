import { tracksQueryOptions, type TTrack } from '@entities/track'
import { AudioPlayer, audioPlayerDepsContext, type AudioPlayerDeps } from '@features/audioplayer'
import { BASE_URL } from '@shared/api/base'
import { useQuery } from '@tanstack/react-query'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useActiveTrackStore } from './store'
import style from './style.module.scss'

const trackExists = (index: number, tracks: unknown[]) => index < tracks.length

const HomePage = () => {
  const [isRightPopupVisible, setIsRightPopupVisible] = useState(false)
  const [isLeftPopupVisible, setIsLeftPopupVisible] = useState(true)
  const rightPopupContentRef = useRef<HTMLDivElement>(null)
  const leftPopupContentRef = useRef<HTMLDivElement>(null)

  const audioListRef = useRef<HTMLDivElement>(null)
  const { activeTrack, updateActiveTrack } = useActiveTrackStore()
  const { data, isLoading, isError, error } = useQuery(tracksQueryOptions)

  const getPlayerDeps: (track: TTrack, index: number) => AudioPlayerDeps = (track, index) => ({
    coverURL: track.coverURL,
    productBy: track.productBy,
    title: track.title,
    discURL: track.discURL,
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
            <audioPlayerDepsContext.Provider
              key={track.title}
              value={{ ...getPlayerDeps(track, index) }}>
              <AudioPlayer src={track.url} />
            </audioPlayerDepsContext.Provider>
          ))}
        </section>
      </div>

      <section className={style.img_wrapper}>
        <div className={style.static_img} style={{ backgroundImage: `url(${BASE_URL}/cover/)` }} />
      </section>

      {/* Right Pull Tab */}
      <div className={style.pull_tab} onClick={toggleRightPopup}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
        </svg>
      </div>

      {/* Left Pull Tab */}
      <div className={`${style.pull_tab} ${style.left}`} onClick={toggleLeftPopup}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
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
                alt='Front cover'
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
              alt='disks'
            />
            <div className={style.cover_side}>
              <img
                className={style.popup_img}
                src={`${BASE_URL}/cover/reverse.png`}
                alt='Back cover'
              />
              <span className={style.side_label}>оборотная сторона</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Popup - Album Info */}
      <div className={cn(style.popup_overlay, { [style.visible]: isLeftPopupVisible })}>
        <div ref={leftPopupContentRef} className={style.popup_content}>
          <h2 className={style.popup_title}>skeesh - цсмж ч.1</h2>
          <button className={style.play_all_button} onClick={playFirstTrack}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M8 5v14l11-7z' />
            </svg>
            прикоснуться
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
