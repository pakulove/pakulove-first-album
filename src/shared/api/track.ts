import axios from 'axios'
import { z } from 'zod'
import { BASE_URL } from './base'

const TrackDTOSchema = z.object({
  title: z.string(),
  prod: z.string(),
  coverWidth: z.string(),
})

const TracksDTOSchema = TrackDTOSchema.array()

export type TracksDTO = z.infer<typeof TracksDTOSchema>

export const trackService = {
  async getTracks() {
    return axios
      .get<TracksDTO>(`${BASE_URL}/playlist/`)
      .then(({ data }) => TracksDTOSchema.parse(data))
  },
} as const
