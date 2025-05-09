import { tracksQueryOptions } from '@entities/track'
import { AudioPlayer } from '@features/audioplayer'
import { useQuery } from '@tanstack/react-query'
import style from './style.module.scss'

const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery(tracksQueryOptions)

  if (isLoading) {
    return <div>Loading playlist...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className={style.home_container}>
      <div className={style.wrapper}>
        <section className={style.track_list}>
          {data?.map(({ productBy, title, url, coverURL }) => (
            <AudioPlayer key={url} src={url} title={title} prod={productBy} coverUrl={coverURL} />
          ))}
        </section>
      </div>
      <section className={style.img_wrapper}>
        <div
          className={style.static_img}
          style={{
            backgroundImage: `url(${data?.[0].coverURL})`,
          }}
        />
      </section>
    </div>
  )
}

export default HomePage
