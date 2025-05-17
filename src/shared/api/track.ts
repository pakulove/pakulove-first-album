import axios from 'axios'
import { z } from 'zod'
import { BASE_URL, fetchConfig } from './base'

const TrackDTOSchema = z.object({
  title: z.string(),
  prod: z.string(),
  pics: z.object({ sec: z.number(), name: z.string() }).array(),
})

const TracksDTOSchema = TrackDTOSchema.array()

export type TracksDTO = z.infer<typeof TracksDTOSchema>

export const trackService = {
  async getTracks() {
    return axios
      .get<TracksDTO>(`${BASE_URL}/playlist/`, fetchConfig)
      .then(({ data }) => TracksDTOSchema.parse(data))
  },
} as const
