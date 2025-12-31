import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { api } from '../api/api'
import VideoListView from '../components/VideoListView'

function VideoListPage() {
    const location = useLocation()
    const query = new URLSearchParams(location.search).get("query")
    const [videos, setVideos] = useState([])

    
    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/videos/getAllVideos?query=${query}`)
                setVideos(res.data.data)
            } catch (error) {
                console.log("error in fetching result!!", error)
            }
        }
        fetchResult()
    }, []);
    
    return (
        <div className='p-4 h-full'>
            {
                videos.map((video) => (
                    <div key={video._id}>
                        <VideoListView video={video} />
                    </div>
                ))
            }
        </div>
    )
}

export default VideoListPage
