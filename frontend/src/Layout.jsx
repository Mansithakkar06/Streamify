import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <div>
            <Navbar />
            <div className='flex'>
                <div>
                    <Sidebar />
                </div>
                <div className='w-full h-full'>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default Layout
