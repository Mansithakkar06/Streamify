import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api';

function VideoDetailPage() {
    const { id } = useParams()
    const [video, setVideo] = useState({})

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/getVideoById/${id}`)
                setVideo(res.data.data)
            } catch (error) {
                console.log("error in fetching video", error)
            }
        }
        fetchVideo()
    }, []);
    useEffect(() => {
        console.log(video)
    }, [video]);
    return (
        <div>
            <div>
                 <video src={video.videoFile} width="600" height={500} controls={false}>
    </video>

            </div>
        </div>
    )
}

export default VideoDetailPage
