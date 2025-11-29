import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Layout from './Layout'
import Home from './pages/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Layout}>
            <Route path='/' Component={Home}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
