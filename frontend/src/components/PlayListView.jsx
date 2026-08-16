import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faTrash, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { api } from '../api/api'

function PlayListView({ playlist, onDelete, onUpdate }) {
    const user = useSelector(state => state.user.userData)
    const [menuOpen, setMenuOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(playlist?.name || "")
    const [showDeleteToast, setShowDeleteToast] = useState(false)
    const menuRef = useRef(null)

    const isOwner = user?._id && (playlist?.owner === user?._id || playlist?.owner?._id === user?._id)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        try {
            const res = await api.patch(`/playLists/updatePlayList/${playlist._id}`, { name })
            if (res.status === 200) {
                if (onUpdate) onUpdate(res.data.data)
                setIsEditing(false)
                setMenuOpen(false)
            }
        } catch (error) {
            console.log("error in updating playlist", error)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const res = await api.delete(`/playLists/deletePlayList/${playlist._id}`)
            if (res.status === 200) {
                if (onDelete) onDelete(playlist._id)
            }
        } catch (error) {
            console.log("error in deleting playlist", error)
        } finally {
            setShowDeleteToast(false)
            setMenuOpen(false)
        }
    }

    return (
        <div className='relative group'>
            {/* Top Right 3-Dots Menu (Owner Only) */}
            {isOwner && (
                <div className='absolute top-2 right-2 z-20' ref={menuRef}>
                    <button 
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setMenuOpen(!menuOpen)
                        }}
                        className='text-white hover:text-purple-400 p-1.5 cursor-pointer transition'
                        title="Options"
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} className='text-base drop-shadow-md' />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className='absolute right-0 mt-1 w-36 bg-slate-900 border border-gray-700 rounded-md shadow-xl z-30 py-1 text-xs text-gray-200'>
                            {!isEditing && !showDeleteToast && (
                                <>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setIsEditing(true)
                                        }}
                                        className='w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2 cursor-pointer'
                                    >
                                        <FontAwesomeIcon icon={faEdit} className='text-purple-400' />
                                        <span>Edit Name</span>
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setShowDeleteToast(true)
                                        }}
                                        className='w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-red-400 cursor-pointer'
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        <span>Delete</span>
                                    </button>
                                </>
                            )}

                            {isEditing && (
                                <form onSubmit={handleUpdate} className='p-2 space-y-2' onClick={(e) => e.stopPropagation()}>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className='bg-black/60 border border-gray-600 rounded px-2 py-1 text-xs text-white w-full focus:outline-none focus:border-purple-500'
                                        placeholder="New Name"
                                        autoFocus
                                    />
                                    <div className='flex gap-1 justify-end'>
                                        <button type="submit" className='px-2 py-0.5 bg-[#ae7aff] text-black font-semibold rounded text-xs cursor-pointer'>Save</button>
                                        <button type="button" onClick={() => setIsEditing(false)} className='px-2 py-0.5 border border-gray-600 text-xs rounded text-gray-300 cursor-pointer'>Cancel</button>
                                    </div>
                                </form>
                            )}

                            {showDeleteToast && (
                                <div className='p-2 space-y-1.5' onClick={(e) => e.stopPropagation()}>
                                    <p className='text-[11px] text-red-300 font-semibold'>Delete playlist?</p>
                                    <div className='flex gap-1 justify-end'>
                                        <button onClick={handleDelete} className='px-2 py-0.5 bg-red-600 text-white font-semibold rounded text-xs cursor-pointer'>Yes</button>
                                        <button onClick={() => setShowDeleteToast(false)} className='px-2 py-0.5 bg-gray-700 text-gray-200 font-semibold rounded text-xs cursor-pointer'>No</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Original Card Layout */}
            <NavLink to={`/playlistVideos/${playlist?._id}`}>
                <div className='relative'>
                    <img src={playlist?.videos?.[0]?.thumbnail?.url} alt="thumbnail" className='w-full h-75 object-cover' />
                    <div className='absolute bg-gray-500 opacity-80 border-t py-4 px-4 w-full bottom-0 h-16 flex justify-between items-center'>
                        <p className='text-white font-medium truncate pr-2'>{(playlist?.name || name)?.replace(/^./, char => char.toUpperCase())}</p>
                        <p className='text-white text-sm shrink-0'>{playlist?.videos?.length || 0} {playlist?.videos?.length === 1 ? "Video" : "Videos"}</p>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default PlayListView
