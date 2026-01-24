import React from 'react'
import { formatTime } from '../utils/formatTime'
import { formatDuration } from '../utils/formatDuration'
import { Link } from 'react-router-dom'

function VideoListView({video}) {
  return (
    <Link to={`/videoDetail/${video?._id}`}>
    <div className='flex'>
      <div className='w-100'>
        <div className='relative'>
        <img src={video?.thumbnail?.url} alt="thumbnail" className="h-48 w-full object-cover shadow-md" /> 
        <div className='absolute bottom-0 right-0'>
            <p className='bg-black px-2 m-1 rounded-md'>{formatDuration(video?.duration)}</p>
        </div>

        </div>
      </div>
      <div className='px-2 mx-2 w-lg'>
        <div className='w-100'>
        <p className='text-lg'>{(video?.title).replace(/^./, char => char.toUpperCase())}</p>
        <span>{video?.views} Views . </span><span>{formatTime(video?.createdAt)}</span> 
        </div>
        <div className='flex my-2'>
            <img src={video?.owner?.avatar?.url} alt="avatar" className='rounded-full h-12 w-12 object-cover shadow-md' />
            <p className='mx-1 p-2 text-lg'>{(video?.owner?.username).replace(/^./, char => char.toUpperCase())}</p>
        </div>
        <p className='text-xs'>{(video?.description)?.length>170? (video?.description)?.slice(0,170)+"....." :video?.description}</p>
      </div>
    </div>
    </Link>
  )
}

export default VideoListView
