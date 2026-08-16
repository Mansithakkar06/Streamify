import { faGear, faHistory, faHome, faSignOutAlt, faThumbsUp, faUserCheck, faVideoCamera, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleQuestion, faFolder } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SidebarItem from './SidebarItem'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../api/api'
import { logout } from '../slices/userSlice.js'

function Sidebar({ isOpen, closeSidebar }) {
  const user = useSelector(state => state.user.userData)
  const isLoggedin = useSelector(state => state.user.isLoggedin)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/logout');
      if (res.status === 200) {
        dispatch(logout())
        if (closeSidebar) closeSidebar()
        navigate("/")
      }
    } catch (error) {
      console.log("error in logout", error)
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <div className={`
        fixed md:sticky top-0 left-0 z-50 md:z-auto
        w-64 h-screen bg-[#242424] border-r border-r-white/20 p-2 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className='p-2 space-y-2 overflow-y-auto'>
          <div className="flex justify-between items-center md:hidden mb-2 pb-2 border-b border-gray-700">
            <span className="font-semibold text-lg">Menu</span>
            <button onClick={closeSidebar} className="p-2 text-gray-300 hover:text-white">
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
          <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block rounded-md" : "block"}><SidebarItem icon={faHome} name="Home" /></NavLink>
          <NavLink to="/likedVideos" onClick={closeSidebar} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block rounded-md" : "block"}><SidebarItem icon={faThumbsUp} name="Liked Videos" /></NavLink>
          <NavLink to="/history" onClick={closeSidebar} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block rounded-md" : "block"}><SidebarItem icon={faHistory} name="History" /></NavLink>
          <NavLink to={`/channel/${user?.username}/Videos`} onClick={closeSidebar} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block rounded-md" : "block"}><SidebarItem icon={faVideoCamera} name="My Content" /></NavLink>
          <NavLink to={`/channel/${user?.username}/Playlist`} onClick={closeSidebar} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block rounded-md" : "block"}><SidebarItem icon={faFolder} name="Collections" /></NavLink>
          <NavLink to={`/channel/${user?.username}/Subscribers`} onClick={closeSidebar} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block rounded-md" : "block"}><SidebarItem icon={faUserCheck} name="Subscribers" /></NavLink>
        </div>

        {/* Mobile Logout Button at Bottom of Side Menu */}
        {isLoggedin && user && (
          <div className="p-2 border-t border-gray-700 md:hidden mb-4">
            <button 
              onClick={logoutHandler}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-md bg-red-600/20 hover:bg-red-600/40 text-red-400 font-medium transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar
