import React from 'react'
import { formatTime } from '../utils/formatTime'
import { formatDuration } from '../utils/formatDuration'
import { Link } from 'react-router-dom'

function VideoListView({video}) {
  return (
    <Link to={`/videoDetail/${video?._id}`}>
    <div className='flex flex-col sm:flex-row gap-3 my-3 border-b border-gray-800 pb-3'>
      <div className='w-full sm:w-72 shrink-0'>
        <div className='relative'>
        <img src={video?.thumbnail?.url} alt="thumbnail" className="h-44 sm:h-40 w-full object-cover rounded-md shadow-md" /> 
        <div className='absolute bottom-0 right-0'>
            <p className='bg-black/80 px-2 py-0.5 text-xs m-1 rounded-md text-white'>{formatDuration(video?.duration)}</p>
        </div>

        </div>
      </div>
      <div className='flex-1 min-w-0'>
        <div>
        <p className='text-base sm:text-lg font-medium line-clamp-2'>{(video?.title)?.replace(/^./, char => char.toUpperCase())}</p>
        <span className='text-xs sm:text-sm text-gray-400'>{video?.views} Views . </span><span className='text-xs sm:text-sm text-gray-400'>{formatTime(video?.createdAt)}</span> 
        </div>
        <div className='flex items-center my-2 gap-2'>
            <img src={video?.owner?.avatar?.url} alt="avatar" className='rounded-full h-8 w-8 sm:h-10 sm:w-10 object-cover shadow-md' />
            <p className='text-sm sm:text-base text-gray-300'>{(video?.owner?.username)?.replace(/^./, char => char.toUpperCase())}</p>
        </div>
        <p className='text-xs sm:text-sm text-gray-400 line-clamp-2'>{(video?.description)?.length>170? (video?.description)?.slice(0,170)+"....." :video?.description}</p>
      </div>
    </div>
    </Link>
  )
}

export default VideoListView
