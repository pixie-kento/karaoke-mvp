import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Room'
import TVMode from './pages/TVMode'
import Controller from './pages/Controller'
import Playlists from './pages/Playlists'
import PlaylistDetail from './pages/PlaylistDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:code" element={<Room />} />
        <Route path="/tv/:code" element={<TVMode />} />
        <Route path="/controller/:code" element={<Controller />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:id" element={<PlaylistDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

