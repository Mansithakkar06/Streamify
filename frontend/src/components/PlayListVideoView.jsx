 import React from 'react'
import { formatTime } from '../utils/formatTime'
import { formatDuration } from '../utils/formatDuration'
import { Link } from 'react-router-dom'

function PlayListVideoView({ video }) {
    return (
        <Link to={`/videoDetail/${video._id}`} replace>
        <div className='flex mb-4 border'>
            <div className='w-64'>
                <div className='relative'>
                    <img src={video.thumbnail.url} alt="thumbnail" className="h-36 w-75 object-cover shadow-md" />
                    <div className='absolute bottom-0 right-0'>
                        <p className='bg-black px-2 m-1 rounded-md'>{formatDuration(video.duration)}</p>
                    </div>
                </div>
            </div>
            <div className='px-4 py-1'>
                <div className='w-50'>
                    <p className='text-md'>{(video.title).replace(/^./, char => char.toUpperCase()).length>50? (video.title).slice(0,45)+"...":video.title}</p>
                </div>
                <div className='flex my-1'>
                    <img src={video.owner.avatar.url} alt="avatar" className='rounded-full h-8 w-8 object-cover shadow-md' />
                    <p className='mx-1 p-1 text-md'>{(video.owner.username).replace(/^./, char => char.toUpperCase())}</p>
                </div>
                    <span className='text-sm'>{video.views} Views . </span><span className='text-sm'>{formatTime(video.createdAt)}</span>

            </div>
        </div>
        </Link>
    )
}

export default PlayListVideoView
