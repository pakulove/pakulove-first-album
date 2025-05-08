import { tracksQueryOptions } from '@entities/track'
import { AudioPlayer } from '@features/audioplayer'
import { useQuery } from '@tanstack/react-query'

const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery(tracksQueryOptions)

  if (isLoading) {
    return <div>Loading playlist...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      {data?.map(({ productBy, title, url, coverURL }) => (
        <AudioPlayer key={url} src={url} title={title} prod={productBy} coverUrl={coverURL} />
      ))}
    </>
  )
}

export default HomePage
