import React from 'react'

function VideoCardView({video}) {
    function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 365 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    week: 7 * 24 * 60 * 60,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
    second: 1
  };

  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value > 0) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

  return (
    
    <div className='w-75'>
      {/* <Link> */}
        <img src={video.thumbnail.url} alt="thumbnail" className="h-48 w-full object-cover shadow" />
        <div className='py-2 my-1 flex'>
            <div className='rounded-full h-10 w-10 shrink-0 overflow-hidden'>
                <img src={video.owner.avatar.url} alt="avatar" className='rounded-full h-10 w-10 object-cover' />
            </div>
            <div className='px-1 ms-2'>
                <p>{video.title}</p>
                <span>{video.views} Views . </span><span>{timeAgo(video.createdAt)}</span>
                <p>{(video.owner.username).replace(/^./, char => char.toUpperCase())}</p>
            </div>
        </div>
      {/* </Link> */}
    </div>
  )
}

export default VideoCardView
