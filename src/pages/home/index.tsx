import { tracksQueryOptions, type TTrack } from '@entities/track'
import { AudioPlayer, audioPlayerDepsContext, type AudioPlayerDeps } from '@features/audioplayer'
import { BASE_URL } from '@shared/api/base'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useActiveTrackStore } from './store'
import style from './style.module.scss'

const trackExists = (index: number, tracks: unknown[]) => index < tracks.length

const HomePage = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentImage, setCurrentImage] = useState('cover.webp')
  const [isImageChanged, setIsImageChanged] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout>(null)

  const audioListRef = useRef<HTMLDivElement>(null)
  const { activeTrack, updateActiveTrack } = useActiveTrackStore()
  const { data, isLoading, isError, error } = useQuery(tracksQueryOptions)

  // Скроллинг к активному треку
  useEffect(() => {
    if (activeTrack && audioListRef.current) {
      const activeElement = document
        .querySelector(`[data-index="${activeTrack.title}"]`)
        ?.closest('div')
      if (activeElement) {
        setTimeout(() => {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 100)
      }
    }
  }, [activeTrack])

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

  useEffect(() => {
    if (activeTrack) {
      const audioElement = document.querySelector(
        `audio[data-index="${activeTrack.title}"]`
      ) as HTMLAudioElement
      if (audioElement) {
        const handleTimeUpdate = () => {
          const currentTime = Math.floor(audioElement.currentTime)
          const picture = activeTrack.picturesAtTime.find(pic => pic.second === currentTime)
          if (picture) {
            setIsImageChanged(true)
            // Если пришло слово default, используем cover.webp
            setCurrentImage(picture.name === 'default' ? 'cover.webp' : picture.name)
            // Сбрасываем предыдущий таймаут если он есть
            if (animationTimeoutRef.current) {
              clearTimeout(animationTimeoutRef.current)
            }
            // Устанавливаем новый таймаут
            animationTimeoutRef.current = setTimeout(() => {
              setIsImageChanged(false)
            }, 500)
          }
        }

        audioElement.addEventListener('timeupdate', handleTimeUpdate)

        return () => {
          audioElement.removeEventListener('timeupdate', handleTimeUpdate)
          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current)
          }
        }
      }
    }
  }, [activeTrack])

  // Обрабатываем клик по контейнеру трека
  const handleTrackClick = (event: React.MouseEvent<HTMLElement>) => {
    const targetElement = event.currentTarget
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

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
            <div key={track.title} onClick={e => handleTrackClick(e)} className={style.track_item}>
              <audioPlayerDepsContext.Provider value={{ ...getPlayerDeps(track, index) }}>
                <AudioPlayer src={track.url} />
              </audioPlayerDepsContext.Provider>
            </div>
          ))}
        </section>
      </div>

      <section className={style.img_wrapper}>
        <div
          className={`${style.static_img} ${isFlipped ? style.flipped : ''} ${
            isImageChanged ? style.image_changed : ''
          }`}
          style={
            {
              '--front-image': `url(${BASE_URL}/cover/${currentImage})`,
              '--back-image': `url(${BASE_URL}/cover/reverse.webp)`,
            } as React.CSSProperties
          }
        />
        <div className={style.image_arrow}>
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 40C10 40 30 20 50 20C70 20 90 40 110 40"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M100 35L110 40L100 45"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={style.image_caption}>здесь будут сопроводительные фотографии</span>
        </div>
        <button
          className={style.flip_button}
          onClick={() => setIsFlipped(!isFlipped)}
          title="перевернуть обложку">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"
              fill="white"
            />
          </svg>
        </button>
      </section>
      <div className={style.footer}>
        <p>для лучшего экспириенса рекомендуем открыть на широком экране</p>
        <a
          href="https://music.yandex.com/users/danilapakulov/playlists/1011?utm_source=web&utm_medium=copy_link"
          target="_blank"
          rel="noopener noreferrer">
          вдохновившие треки
        </a>
      </div>
    </div>
  )
}

export default HomePage
