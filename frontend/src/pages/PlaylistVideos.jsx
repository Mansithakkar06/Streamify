import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api';
import PlayListView from '../components/PlayListView';
import VideoListView from '../components/VideoListView';
import {useSelector} from 'react-redux'

function PlaylistVideos() {
    const { id } = useParams()
    const [videos, setVideos] = useState(null);
    const [playlist, setPlaylist] = useState(null);
    const user= useSelector(state=>state.user.userData)

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.get(`/playLists/getPlayListById/${id}`)
                setPlaylist(res.data.data[0])
                setVideos(res.data.data[0].videos)
            } catch (error) {
                console.log("error in fetching videos", error)
            }
        }
        fetchVideos()
    }, []);
    return (
        <div className='grid grid-cols-3 py-4 px-5 gap-3'>
            <div className='my-2'>
                <PlayListView playlist={playlist} />
                <div className='mt-5 mx-1'>
                    <p className='text-2xl px-2 pb-3'>{playlist?.name}</p>
                    <div className='flex gap-2'>
                    <img src={user?.avatar?.url} alt="avatar" className='rounded-full h-12 w-12 object-cover shadow-md' /> 
                    <p className='text-xl p-2'>by {user?.username}</p>
                    </div>
                </div>
            </div>
            <div className='col-span-2'>
                {
                    videos?.map((video) => (
                        <div key={video?._id} className='border-2 my-2 mx-1 p-1'>
                            <VideoListView video={video} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PlaylistVideos
