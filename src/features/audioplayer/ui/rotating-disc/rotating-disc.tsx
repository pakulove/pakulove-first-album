import { useAudioPlayerDeps } from '@features/audioplayer/deps'
import cn from 'classnames'
import { useDiscRotation } from '../../model/useDiscRotation'
import styles from './rotating-disc.module.scss'

const RotatingDisc = () => {
  const discRef = useDiscRotation()
  const { isActive, discURL } = useAudioPlayerDeps()

  return (
    <div className={cn(styles.disc_image_wrapper, { [styles.current]: isActive })}>
      <img alt='Disc' ref={discRef} className={styles.disc_image} src={discURL} />
    </div>
  )
}

export default RotatingDisc
