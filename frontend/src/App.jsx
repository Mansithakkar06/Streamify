import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <Navbar/>
      {/* <BrowserRouter>
        <Routes>
          <Route/>
        </Routes>
      </BrowserRouter> */}
    </>
  )
}

export default App
