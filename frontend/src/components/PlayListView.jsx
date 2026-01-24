import React from 'react'
import { NavLink } from 'react-router-dom'

function PlayListView({ playlist }) {
    // console.log(playlist)
    return (
        <NavLink to={`/playlistVideos/${playlist?._id}`}>
            <div className='relative'>
                <img src={playlist?.videos[0]?.thumbnail?.url} alt="thumbnail" className='w-full h-75' />
                <div className='absolute bg-gray-500 opacity-80 border-t py-3 px-4 w-full bottom-0 h-14 flex justify-between'>
                    <p>{playlist?.name?.replace(/^./, char => char.toUpperCase())}</p>
                    <p>{playlist?.videos?.length} {playlist?.videos?.length === 1 ? "Video" : "Videos"}</p>
                </div>
            </div>
        </NavLink>
    )
}

export default PlayListView
