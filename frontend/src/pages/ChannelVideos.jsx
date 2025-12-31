import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import VideoCardView from '../components/VideoCardView'

function ChannelVideos({videos}) {
    return (
        <div>
            {
                !videos ?
                    (
                        <div className='p-4 flex items-center m-auto justify-center'>
                            <div className='m-auto'>
                                <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faPlayCircle} /> </p>
                                <h2 className='text-center text-xl'>No videos uploaded!!</h2>
                                <p className='text-md w-100 text-center my-1'>This page has yet to upload a video. Search another page in order to find more videos.</p>
                            </div>
                        </div>
                    ) :
                    (
                        <div className='p-4 grid grid-cols-4 gap-x-5 gap-y-1'>
                            {videos?.map((video) => (
                                <div key={video._id} className='mx-2'>
                                    <VideoCardView video={video} />
                                </div>
                            ))}
                        </div>
                    )
            }
        </div>
    )
}

export default ChannelVideos
