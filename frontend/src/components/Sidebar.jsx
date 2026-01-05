import { faGear, faHistory, faHome, faThumbsUp, faUserCheck, faVideoCamera } from '@fortawesome/free-solid-svg-icons'
import { faCircleQuestion, faFolder } from '@fortawesome/free-regular-svg-icons'
import React from 'react'
import SidebarItem from './SidebarItem'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Sidebar() {
  const user=useSelector(state=>state.user.userData)
  return (
    <div className='p-2 border-r border-r-white flex flex-col justify-between w-64 min-h-screen position-sticky top-0'>
      <div className='p-2 space-y-2'>
        <NavLink to="/" className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faHome} name="Home" /></NavLink>
        <NavLink to="*" className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faThumbsUp} name="Liked Videos" /></NavLink>
        <NavLink to="*" className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faHistory} name="History" /></NavLink>
        <NavLink to={`/channel/${user?.username}/Videos`} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faVideoCamera} name="My Content" /></NavLink>
        <NavLink to={`/channel/${user?.username}/Playlist`} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faFolder} name="Collections" /></NavLink>
        <NavLink to={`/channel/${user?.username}/Subscribers`} className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faUserCheck} name="Subscribers" /></NavLink>
      </div>
      <div className='p-2 space-y-2'>
        {/* <NavLink to="*" className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faCircleQuestion} name="Support" /></NavLink> */}
        <NavLink to="/settings" className={({ isActive }) => isActive ? "bg-[#ae7aff] text-black block" : ""}><SidebarItem icon={faGear} name="Settings" /></NavLink>
      </div>
    </div>
  )
}

export default Sidebar
