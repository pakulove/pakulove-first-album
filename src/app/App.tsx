import { AudioPlayer } from '@features/audioplayer'
import './App.css'


const A_URL = "http://127.0.0.1:8000/stream/a.mp3/"
const B_URL = "http://127.0.0.1:8000/stream/b.mp3/"


function App() {

  return (
    <>
      <AudioPlayer src={A_URL} title='Первый трек'></AudioPlayer>
      <AudioPlayer src={B_URL} title='Второй трекь'></AudioPlayer>
    </>
  )
}

export default App
