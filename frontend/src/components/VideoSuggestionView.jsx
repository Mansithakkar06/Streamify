import React from 'react'
import { formatTime } from '../utils/formatTime'
import { formatDuration } from '../utils/formatDuration'

function VideoSuggestionView({ video }) {
    return (
        <div className='flex mb-4 border'>
            <div className='w-50'>
                <div className='relative'>
                    <img src={video.thumbnail.url} alt="thumbnail" className="h-28 w-75 object-cover shadow-md" />
                    <div className='absolute bottom-0 right-0'>
                        <p className='bg-black px-2 m-1 rounded-md'>{formatDuration(video.duration)}</p>
                    </div>
                </div>
            </div>
            <div className='px-2'>
                <div className='w-50'>
                    <p className='text-md'>{(video.title).replace(/^./, char => char.toUpperCase())}</p>
                </div>
                <div className='flex my-1'>
                    <img src={video.owner.avatar.url} alt="avatar" className='rounded-full h-8 w-8 object-cover shadow-md' />
                    <p className='mx-1 p-1 text-md'>{(video.owner.username).replace(/^./, char => char.toUpperCase())}</p>
                </div>
                    <span>{video.views} Views . </span><span>{formatTime(video.createdAt)}</span>

            </div>
        </div>
    )
}

export default VideoSuggestionView
