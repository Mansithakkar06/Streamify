import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className='min-h-screen bg-[#242424] text-white'>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className='flex relative'>
                <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
                <div className='w-full flex-1 min-h-screen overflow-x-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
