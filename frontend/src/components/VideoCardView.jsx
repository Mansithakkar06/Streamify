import React from 'react'
import { formatDuration } from '../utils/formatDuration';
import { formatTime } from '../utils/formatTime';
import { Link } from 'react-router-dom';

function VideoCardView({ video }) {
  return (
    <div className='w-75'>
      <Link to={`/videoDetail/${video._id}`}>
      <div className='relative'>
        <img src={video.thumbnail.url} alt="thumbnail" className="h-48 w-full object-cover shadow-md" />
        <div className="absolute bottom-0 right-0 m-1">
          <p className='bg-black px-2 text-white rounded-md'>{formatDuration(video.duration)}</p>
        </div>
      </div>
      <div className='py-2 my-1 flex'>
        <div className='rounded-full h-10 w-10 shrink-0 overflow-hidden'>
          <img src={video.owner.avatar.url} alt="avatar" className='rounded-full h-10 w-10 object-cover shadow-md' />
        </div>
        <div className='px-1 ms-2'>
          <p>{(video.title).replace(/^./, char => char.toUpperCase())}</p>
          <span>{video.views} Views . </span><span>{formatTime(video.createdAt)}</span>
          <p>{(video.owner.username).replace(/^./, char => char.toUpperCase())}</p>
        </div>
      </div>
      </Link>
    </div>
  )
}

export default VideoCardView
