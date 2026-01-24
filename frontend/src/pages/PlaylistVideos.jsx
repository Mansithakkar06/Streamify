import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api';
import PlayListView from '../components/PlayListView';
import VideoSuggestionView from '../components/VideoSuggestionView';
import PlayListVideoView from '../components/PlayListVideoView';
import VideoListView from '../components/VideoListView';

function PlaylistVideos() {
    const { id } = useParams()
    const [videos, setVideos] = useState(null);
    const [playlist, setPlaylist] = useState(null);
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
    console.log(videos)
    return (
        <div className='grid grid-cols-3 py-4 px-8 gap-5'>
            <div>
                <PlayListView playlist={playlist} />
            </div>
            <div className='col-span-2'>
                {
                    videos?.map((video) => (
                        <div key={video._id} className='border my-2 mx-1 p-1'>
                            <VideoListView video={video} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PlaylistVideos
