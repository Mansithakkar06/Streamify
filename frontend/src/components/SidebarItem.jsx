import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SidebarItem({icon,name}) {
    return (
        <div className='border p-2 my-2'>
            <FontAwesomeIcon icon={icon} className='mx-1' /> {name}
        </div>
    )
}

export default SidebarItem
