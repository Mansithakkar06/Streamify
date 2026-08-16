import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/api';
import PlayListView from '../components/PlayListView';
import VideoListView from '../components/VideoListView';
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function PlaylistVideos() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [videos, setVideos] = useState(null);
    const [playlist, setPlaylist] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const user = useSelector(state => state.user.userData)

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.get(`/playLists/getPlayListById/${id}`)
                setPlaylist(res.data.data[0])
                setVideos(res.data.data[0]?.videos || [])
                setName(res.data.data[0]?.name || "")
            } catch (error) {
                console.log("error in fetching videos", error)
            }
        }
        fetchVideos()
    }, [id]);

    const handleUpdateName = async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        try {
            const res = await api.patch(`/playLists/updatePlayList/${id}`, { name })
            if (res.status === 200) {
                setPlaylist(prev => ({ ...prev, name: res.data.data.name }))
                setIsEditing(false)
            }
        } catch (error) {
            console.log("error in updating playlist", error)
        }
    }

    const handleDeletePlaylist = async () => {
        try {
            const res = await api.delete(`/playLists/deletePlayList/${id}`)
            if (res.status === 200) {
                navigate(`/channel/${user?.username}/Playlist`)
            }
        } catch (error) {
            console.log("error in deleting playlist", error)
        }
    }

    const isOwner = user?._id && (playlist?.owner === user?._id || playlist?.owner?._id === user?._id)

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 p-3 sm:p-5 gap-4'>
            <div className='my-2'>
                <PlayListView 
                    playlist={playlist} 
                    onDelete={() => navigate(`/channel/${user?.username}/Playlist`)}
                    onUpdate={(updated) => setPlaylist(prev => ({ ...prev, name: updated.name }))}
                />
                <div className='mt-4 sm:mt-5 mx-1 space-y-3'>
                    {isEditing ? (
                        <form onSubmit={handleUpdateName} className='flex items-center gap-2 px-2'>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className='bg-black/40 border border-gray-600 rounded px-2.5 py-1 text-sm text-white flex-1 focus:outline-none focus:border-purple-500'
                            />
                            <button type="submit" className='px-3 py-1 bg-[#ae7aff] text-black text-xs font-semibold rounded cursor-pointer'>Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} className='px-3 py-1 border border-gray-600 text-xs rounded text-gray-300 cursor-pointer'>Cancel</button>
                        </form>
                    ) : (
                        <div className='flex justify-between items-center px-2'>
                            <p className='text-xl sm:text-2xl font-semibold text-white truncate'>{playlist?.name}</p>
                            {isOwner && (
                                <div className='flex items-center gap-2 shrink-0'>
                                    <button 
                                        onClick={() => setIsEditing(true)} 
                                        className='p-1.5 text-gray-400 hover:text-purple-400 transition cursor-pointer' 
                                        title="Edit Playlist Name"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteToast(true)} 
                                        className='p-1.5 text-gray-400 hover:text-red-400 transition cursor-pointer' 
                                        title="Delete Playlist"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {showDeleteToast && (
                        <div className='mx-2 flex items-center justify-between bg-red-950/90 border border-red-700/60 p-2.5 rounded-md text-xs text-red-200'>
                            <span>Delete playlist permanently?</span>
                            <div className='flex gap-2'>
                                <button onClick={handleDeletePlaylist} className='px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded cursor-pointer'>Yes, Delete</button>
                                <button onClick={() => setShowDeleteToast(false)} className='px-2.5 py-1 bg-gray-700 text-gray-200 font-semibold rounded cursor-pointer'>Cancel</button>
                            </div>
                        </div>
                    )}

                    <div className='flex items-center gap-2 px-2 pt-1'>
                        <img src={user?.avatar?.url} alt="avatar" className='rounded-full h-9 w-9 sm:h-10 sm:w-10 object-cover shadow-md' /> 
                        <p className='text-sm sm:text-base text-gray-300'>by {user?.username}</p>
                    </div>
                </div>
            </div>
            <div className='lg:col-span-2 space-y-3'>
                {videos?.length === 0 ? (
                    <div className='p-6 text-center text-gray-400 border border-gray-800 rounded-md'>
                        No videos in this playlist yet.
                    </div>
                ) : (
                    videos?.map((video) => (
                        <div key={video?._id} className='border border-gray-700 rounded-md p-1 bg-black/20'>
                            <VideoListView video={video} />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default PlaylistVideos
