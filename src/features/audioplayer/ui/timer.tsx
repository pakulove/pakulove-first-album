import { type FC } from 'react'

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const Timer: FC<{ time: number }> = ({ time }) => {
  return <span>{formatTime(time)} </span>
}

export default Timer
