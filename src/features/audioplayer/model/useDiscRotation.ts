import { useStrictContext } from '@shared/lib/react'
import { useEffect, useRef } from 'react'
import { audioStoreContext } from '../ui/audio-store-provider'

export const useDiscRotation = () => {
  const discRef = useRef<HTMLImageElement>(null)
  const rotateRef = useRef<number>(0)
  const animationRef = useRef<number>(0)
  const { isPlaying } = useStrictContext(audioStoreContext)

  const animate = () => {
    if (isPlaying && discRef.current) {
      rotateRef.current += 0.5
      discRef.current.style.setProperty('--rotation', `${rotateRef.current}deg`)
    }
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return discRef
}
