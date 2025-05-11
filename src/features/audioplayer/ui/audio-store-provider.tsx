import { createStrictContext } from '@shared/lib/react'
import { useState, type FC, type PropsWithChildren } from 'react'
import { createAudioPlayerStore, type AudioPlayerStore } from '../model/store'

export const audioStoreContext = createStrictContext<AudioPlayerStore>()

export const AudioStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [useAudioStore] = useState(() => createAudioPlayerStore())
  const storeAudioData = useAudioStore()

  return <audioStoreContext.Provider value={storeAudioData}>{children}</audioStoreContext.Provider>
}
