import { faGear, faHistory, faHome, faThumbsUp, faUserCheck, faVideoCamera } from '@fortawesome/free-solid-svg-icons'
import {faCircleQuestion, faFolder} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import React from 'react'
import SidebarItem from './SidebarItem'

function Sidebar() {
  return (
    <div className='p-2 border-r border-r-white flex flex-col justify-between w-64 min-h-screen position-sticky top-0'>
        <div className='p-2 space-y-2'>
            <SidebarItem icon={faHome} name="Home"/>
            <SidebarItem icon={faThumbsUp} name="Liked Videos"/>
            <SidebarItem icon={faHistory} name="History"/>
            <SidebarItem icon={faVideoCamera} name="My Content"/>
            <SidebarItem icon={faFolder} name="Collections"/>
            <SidebarItem icon={faUserCheck} name="Subscribers"/>
        </div>
        <div className='p-2 space-y-2'>
            <SidebarItem icon={faCircleQuestion} name="Support"/>
            <SidebarItem icon={faGear} name="Settings"/>
            </div>
    </div>
  )
}

export default Sidebar
