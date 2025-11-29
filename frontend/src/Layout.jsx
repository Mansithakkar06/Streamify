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
                <div className='p-4'>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default Layout
