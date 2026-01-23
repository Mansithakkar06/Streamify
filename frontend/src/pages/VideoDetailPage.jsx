import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/api';
import VideoSuggestionView from '../components/VideoSuggestionView';
import { formatTime } from '../utils/formatTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faFolderPlus, faUserPlus, faThumbsUp as solidThumbsUp, faThumbsDown as solidThumbsDown, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import CommentView from '../components/CommentView';
import { FadeLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import Modal from '../components/Modal'
import CreatePlaylist from './CreatePlaylist'
import AddToPlayList from './AddToPlayList';

function VideoDetailPage() {
    const { id } = useParams()
    const user = useSelector(state => state.user.userData)
    const [video, setVideo] = useState({})
    const [url, setUrl] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [likes, setLikes] = useState(0)
    const [disLikes, setDislikes] = useState(0)
    const [comments, setComments] = useState([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isDisLiked, setIsDisLiked] = useState(false)
    const [subscribers, setSubscribers] = useState(0)
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const commentHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post(`/comments/addComment/${id}`, { content })
            if (res.status === 200) {
                setContent("")
                setComments(prev => [...prev, res.data.data])
            }
        } catch (error) {
            console.log("error in adding comment", error)
        }

    }

    const updateComment = (updatedCmnt) => {
        setComments(prev =>
            prev.map(comment =>
                comment._id === updatedCmnt._id
                    ? updatedCmnt
                    : comment
            )
        )
    }

    const removeComment = (cmntid) => {
        setComments(prev => prev.filter(cmnt => cmnt._id !== cmntid))
    }

    const handleLike = async () => {
        try {
            let reactionType;
            if (isLiked) {
                reactionType = "";
            }
            else {
                reactionType = "like"
            }
            const res = await api.post(`/likes/toggleVideoLike/${id}`, { reactionType });
            if ((res.status === 201 || res.status === 200) && res?.data?.data?.reaction === "like") {
                setIsLiked(true)
                setIsDisLiked(false)
            }
            else {
                setIsLiked(false)
            }
        } catch (error) {
            console.log("error in like", error)
            navigate('/login')
        }
    }
    const handleDislike = async () => {
        try {
            let reactionType;
            if (isDisLiked) {
                reactionType = "";
            }
            else {
                reactionType = "dislike"
            }
            const res = await api.post(`/likes/toggleVideoLike/${id}`, { reactionType });
            if ((res.status === 201 || res.status === 200) && res?.data?.data?.reaction === "dislike") {
                setIsDisLiked(true)
                setIsLiked(false)
            }
            else {
                setIsDisLiked(false)
            }
        } catch (error) {
            console.log("error in dislike", error)
            navigate('/login')
        }
    }

    const handleSubscription = async () => {
        try {
            const channelId = video.owner._id;
            const res = await api.post(`/subscriptions/toggleSubscription/${channelId}`)
            if (res.status === 201) {
                setIsSubscribed(true)
            }
            else {
                setIsSubscribed(false)
            }
        } catch (error) {
            console.log("error in subscription", error)
            navigate('/login')
        }

    }

    const playListHandler = () => {
        setModalType("add")
    }
    const handleCreatePL=()=>{
        setModalType("create")
    }
    const handleAfterCreate=()=>{
        setModalType("add")
    }
    const closeModal=()=>setModalType(null)

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/getVideoById/${id}`)
                setVideo(res.data.data)
                setUrl(res.data.data.videoFile.url)
                const channelId = res.data.data.owner._id
                const subscribers = await api.get(`/subscriptions/getChannelSubscribers/${channelId}`)
                setSubscribers(subscribers?.data?.data?.length)
                const channelsubscribed = subscribers?.data?.data
                const subscribed = channelsubscribed.filter((subscribed) => (
                    subscribed?.subscriber._id === user?._id && channelId === subscribed?.channel
                ))
                if (subscribed?.length !== 0) {
                    setIsSubscribed(true)
                }

            } catch (error) {
                console.log("error in fetching video", error)
            }
        }
        fetchVideo()
        const fetchComments = async () => {
            try {
                const comments = await api.get(`/comments/getVideoComments/${id}`)
                setComments(comments.data.data)
            } catch (error) {
                console.log("error in fetching comments", error)
            }
        }
        fetchComments()
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [id, isSubscribed]);
    useEffect(() => {
        const fetchVideoLikes = async () => {
            try {
                const res = await api.get(`/likes/getVideoLikes/${id}`)
                const likes = res.data.data.likes
                const like = likes.filter((like) => (
                    like.video === id && like.likedBy === user?._id
                ))
                if (like.length === 1) {
                    setIsLiked(true)
                }
                else {
                    setIsLiked(false)
                }
                setLikes(res.data.data.likes_count)
            } catch (error) {
                console.log("error in fetching likes", error)
            }
        }
        fetchVideoLikes()
        const fetchVideoDislikes = async () => {
            try {
                const res = await api.get(`/likes/getVideoDislikes/${id}`)
                const dislikes = res.data.data.dislikes
                const dislike = dislikes.filter((dislike) => (
                    dislike.video === id && dislike.likedBy === user?._id
                ))
                if (dislike.length === 1) {
                    setIsDisLiked(true)
                }
                else {
                    setIsDisLiked(false)
                }
                setDislikes(res.data.data.dislikes_count)

            } catch (error) {
                console.log("error in fetching likes", error)
            }
        }
        fetchVideoDislikes()
    }, [isLiked, isDisLiked]);
    useEffect(() => {
        const suggestionVideos = async () => {
            try {
                setLoading(true)
                const videos = await api.get("/videos/getAllVideos")
                const allvideos = videos.data.data
                const otherVideos = allvideos.filter((v) => (
                    v._id !== video._id
                ))
                setSuggestions(otherVideos)
            } catch (error) {
                console.log("error in fetching suggestion videos!!", error)
            }
        }
        suggestionVideos()
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [video]);
    // useEffect(() => {
    //     console.log(video)
    //     console.log(url)
    // }, []);

    return (
        <div className='p-4 flex gap-3'>
            {
                loading ? (
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

                    : (
                        <>
                            <div className='w-full'>
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
                                    <div className='flex justify-between'>
                                        <div>
                                            <h2 className='text-lg'>{(video.title)?.replace(/^./, char => char.toUpperCase())}</h2>
                                            <span>{video.views} Views . </span><span>{formatTime(video.createdAt)}</span>
                                        </div>
                                        <div className='p-3'>
                                            <button className='py-2 px-4 border rounded-l-md hover:cursor-pointer' onClick={handleLike}><FontAwesomeIcon icon={isLiked ? solidThumbsUp : faThumbsUp} /><span>{likes}</span></button>
                                            <button className='py-2 px-4 border rounded-r-md hover:cursor-pointer' onClick={handleDislike}><FontAwesomeIcon icon={isDisLiked ? solidThumbsDown : faThumbsDown} /><span>{disLikes}</span></button>
                                            <button onClick={playListHandler} className='ms-5 border p-2 rounded-md hover:cursor-pointer'><FontAwesomeIcon icon={faFolderPlus} /><span className='px-1'>Save</span></button>
                                        </div>
                                    </div>
                                    <div className='flex justify-between py-2'>
                                        <Link to={`/channel/${video.owner?.username}/Videos`}>
                                            <div className='flex'>
                                                <img src={video?.owner?.avatar?.url} alt="avatar" className='rounded-full h-12 w-12 object-cover shadow-md mt-1' />
                                                <div className='p-1 mx-2'>
                                                    <p className='text-lg'>{(video?.owner?.username)?.replace(/^./, char => char.toUpperCase())}</p>
                                                    <p className='text-sm text-slate-400'>{subscribers} {subscribers === 1 ? "Subscriber" : "Subscribers"}</p>
                                                </div>
                                            </div>
                                        </Link>
                                        {video?.owner?.username !== user?.username &&
                                            <div className='p-4'>
                                                <button className='w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 cursor-pointer' onClick={handleSubscription}><FontAwesomeIcon icon={isSubscribed ? faUserXmark : faUserPlus} className='mx-1' /> {isSubscribed ? "Unsubscribe" : "Subscribe"}</button>
                                            </div>
                                        }
                                    </div>
                                    <hr />
                                    <div className='p-1'>
                                        <p className='text-sm py-2'>
                                            {video.description}
                                        </p>
                                    </div>
                                </div>
                                <div className='border rounded-md p-3 my-4 w-full'>
                                    <p>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</p>
                                    {
                                        user &&
                                        (
                                            <form onSubmit={commentHandler} className='mb-2'>
                                                <input type="text" placeholder='Add a Comment' className='border rounded-md px-2 py-1 my-2 w-full text-white' value={content} onChange={(e) => setContent(e.target.value)} />
                                                <button type='submit'></button>
                                            </form>
                                        )
                                    }
                                    <hr className="my-1" />
                                    {
                                        comments.map((comment) => (
                                            <div key={comment._id} className='my-1'>
                                                <CommentView comment={comment} onDelete={removeComment} onUpdate={updateComment} />
                                                <hr />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                {
                                    suggestions.map((suggestion) => (
                                        <div key={suggestion._id}>
                                            <VideoSuggestionView video={suggestion} />
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )
            }
            <Modal isOpen={modalType !== null} onClose={closeModal} title={modalType === "add" ? "Add to PlayList" : "Create PlayList"}>
                {modalType === 'add' && <AddToPlayList onCreate={handleCreatePL} videoid={id}  onclose={closeModal}/>}
                {modalType === "create" && <CreatePlaylist onclose={handleAfterCreate} />}
            </Modal>
           
        </div>
    )

}

export default VideoDetailPage
