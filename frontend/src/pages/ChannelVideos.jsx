import { faPlayCircle, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import VideoCardView from '../components/VideoCardView'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ChannelVideos({ videos }) {
    // const { username } = useParams();
    // const user = useSelector(state => state.user.userData)
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
                                {/* {
                                    username === user.username && (
                                        <div className='flex justify-center p-2 m-3'>
                                            <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-6 py-2.5 rounded-full transition-colors duration-200 cursor-pointer">
                                                <FontAwesomeIcon icon={faPlus} />
                                                <span> New Video</span>
                                            </button>
                                        </div>
                                    )
                                } */}
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
