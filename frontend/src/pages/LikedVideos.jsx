import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
import { FadeLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import VideoCardView from '../components/VideoCardView';
function LikedVideos() {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getLikedVideos = async () => {
      try {
        const res = await api.get("/likes/getLikedVideos");
        if(res.status===200){
          setVideos(res.data.data)
          setLoading(false)
        }  
        setLoading(false)
      } catch (error) {
        console.log("eroro in getting liked videos", error)
      }
    }
    getLikedVideos()
  }, []);
  

  if (loading) {
    return (
      <div className='p-4 flex items-center m-auto justify-center h-screen w-full'>
        <div className='m-auto items-center'>
          <FadeLoader
            color="#f3faff"
            height={11}
            width={9}
            radius={3}
          />
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  else {
    return !videos ? (
      <div className='p-4 flex items-center m-auto justify-center h-screen w-full'>
        <div className='m-auto'>
          <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faPlayCircle} /> </p>
          <h2 className='text-center text-2xl'>No Liked videos Available!!</h2>
          <p className='text-lg'>You haven't liked any videos yet!!</p>
        </div>
      </div>
    )
      : (
        <div className='p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
          {videos?.map((video) => (
            <div key={video?._id} className='w-full'>
              <VideoCardView video={video.video} />
            </div>
          ))}
        </div>
      )
  }
}


export default LikedVideos
