import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React,{useEffect, useState} from 'react'
import { api } from '../api/api';
import VideoCardView from '../components/VideoCardView';

function Home() {
  const [videos,setVideos]=useState([])

  useEffect(() => {
    const getVideos=async()=>{
      const videos=await api.get("/videos/getAllVideos")
      setVideos(videos.data.data)
    }
    getVideos()
  }, []);
  

  return videos.length===0?(
    <div className='flex items-center m-auto justify-center h-full w-full'>
      <div className='m-auto'>
      <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faPlayCircle} /> </p>
      <h2 className='text-center text-2xl'>No videos Available!!</h2>
      <p className='text-lg'>There are no videos available. Please try to search something else!!</p>
      </div>
    </div>
  )
  :(
    <div className='grid grid-cols-4 gap-x-5 gap-y-1'>
      {videos.map((video)=>(
        <div key={video._id} className='mx-2'>
          <VideoCardView video={video}/>
        </div>
      ))}
    </div>
  )
}

export default Home
