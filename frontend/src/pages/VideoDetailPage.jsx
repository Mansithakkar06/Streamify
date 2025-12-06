import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api';
import VideoSuggestionView from '../components/VideoSuggestionView';
import { formatTime } from '../utils/formatTime';

function VideoDetailPage() {
    const { id } = useParams()
    const [video, setVideo] = useState({})
    const [url,setUrl]=useState("")
    const [suggestions,setSuggestions]=useState([])

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/getVideoById/${id}`)
                setVideo(res.data.data)
                setUrl(res.data.data.videoFile.url)
            } catch (error) {
                console.log("error in fetching video", error)
            }
        }
        fetchVideo()
    }, []);
    useEffect(() => {
        const suggestionVideos=async()=>{
            try {
                const videos=await api.get("/videos/getAllVideos")
                const allvideos=videos.data.data
                const otherVideos=allvideos.filter((v)=>(
                    v._id!==video._id
                ))
                setSuggestions(otherVideos)
            } catch (error) {
                console.log("error in fetching suggestion videos!!",error)
            }
        }
        suggestionVideos()
    }, [video]);
    useEffect(() => {
        console.log(video)
        console.log(url)
    }, []);
   
    return (
        <div className='flex gap-3'>
            <div className=''>
                <video
                    src={url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={true}
                    style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "cover",
                        background: "#000"
                    }}
                />
                <div className='border rounded-md my-4 p-3'>
                    <h2 className='text-lg'>{video.title}</h2>
                {/* <h2 className='text-lg'>{(video.title).replace(/^./, char => char.toUpperCase())}</h2> */}
                 <span>{video.views} Views . </span><span>{formatTime(video.createdAt)}</span>
                </div>
            </div>
            <div>
                {
                    suggestions.map((suggestion)=>(
                        <div key={suggestion._id}>
                            <VideoSuggestionView video={suggestion}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default VideoDetailPage
