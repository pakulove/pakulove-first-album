export type TPicturesAtTime = {
  second: number
  name: string
}

export type TTrack = {
  url: string
  title: string
  picturesAtTime: TPicturesAtTime[]
  productBy: string
  coverURL: string
  discURL: string
  fetchConfig: {
    credentials: 'include'
    mode: 'cors'
    headers: {
      'Content-Type': string
      Accept: string
    }
    referrerPolicy: 'no-referrer-when-downgrade'
  }
}
