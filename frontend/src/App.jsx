import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Layout from './Layout'
import Home from './pages/Home'
import VideoListPage from './pages/VideoListPage'
import VideoDetailPage from './pages/VideoDetailPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Channel from './pages/Channel'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import LikedVideos from './pages/LikedVideos'
import ProtectedRoute from './components/ProtectedRoute'
import PlaylistVideos from './pages/PlaylistVideos'
import ScreenGuard from './ScreenGuard'

function App() {

  return (
    <>
      <BrowserRouter>
      <ScreenGuard>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<VideoListPage />} />
            <Route path='/videoDetail/:id' element={<VideoDetailPage />} />
            <Route path='/channel/:username/:activeTab' element={
              <ProtectedRoute>
                <Channel />
              </ProtectedRoute>
            } />
            <Route path='/settings' element={<Settings />} />
            <Route path='/history' element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path='/likedVideos' element={
              <ProtectedRoute>
                <LikedVideos />
              </ProtectedRoute>
            } />
            <Route path='/playlistVideos/:id' element={
              <ProtectedRoute>
                <PlaylistVideos />
              </ProtectedRoute>
            } />
          </Route>

        </Routes>
      </ScreenGuard>
      </BrowserRouter>
    </>
  )
}

export default App
