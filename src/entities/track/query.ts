import { BASE_URL, fetchConfig } from '@shared/api/base'
import { queryClient } from '@shared/api/query-client'
import { trackService, type TracksDTO } from '@shared/api/track'
import type { TTrack } from './type'

const TRACKS_QUERY_KEY = 'get-all-tracks'

export const tracksQueryOptions = {
  queryKey: [TRACKS_QUERY_KEY],
  queryFn: async () => {
    return await trackService.getTracks()
  },
  select: (tracks: TracksDTO) => {
    return tracks.map<TTrack>(({ prod, title, pics }, index) => ({
      title,
      productBy: prod,
      picturesAtTime: pics.map(({ sec, name }) => ({ second: sec, name })),
      url: `${BASE_URL}/stream/${index + 1}.mp3`,
      discURL: `${BASE_URL}/disc/${index + 1}.webp`,
      coverURL: `${BASE_URL}/cover/cover256.webp`,
      fetchConfig,
    }))
  },
}

export const invalidateTracks = () => {
  return queryClient.invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] })
}
