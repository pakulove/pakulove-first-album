import { AudioPlayer } from '@features/audioplayer'
import './App.css'


const A_URL = "http://127.0.0.1:8000/stream/a.mp3/"
const B_URL = "http://127.0.0.1:8000/stream/b.mp3/"


function App() {

  return (
    <>
      <AudioPlayer src={A_URL}></AudioPlayer>
      <AudioPlayer src={B_URL}></AudioPlayer>
    </>
  )
}

export default App
