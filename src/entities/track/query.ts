import { BASE_URL } from '@shared/api/base'
import { queryClient } from '@shared/api/query-client'
import { trackService, type TracksDTO } from '@shared/api/track'

const TRACKS_QUERY_KEY = 'get-all-tracks'

export const tracksQueryOptions = {
  queryKey: [TRACKS_QUERY_KEY],
  queryFn: async () => {
    return await trackService.getTracks()
  },
  select: (tracks: TracksDTO) => {
    return tracks.map(({ prod, title }, index) => ({
      title,
      productBy: prod,
      url: `${BASE_URL}/stream/${index + 1}.mp3`,
      coverURL: `${BASE_URL}/cover/${index + 1}.png`,
    }))
  },
}

export const invalidateTracks = () => {
  return queryClient.invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] })
}
