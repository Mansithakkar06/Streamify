import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Layout from './Layout'
import Home from './pages/Home'
import VideoListPage from './pages/VideoListPage'
import VideoDetailPage from './pages/VideoDetailPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Layout}>
            <Route path='/' Component={Home} />
            <Route path='/search' Component={VideoListPage} />
            <Route path='/videoDetail/:id' Component={VideoDetailPage} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
