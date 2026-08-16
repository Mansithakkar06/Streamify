import React, { useState } from 'react'
import { formatTime } from '../utils/formatTime'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { api } from '../api/api'

function CommentView({ comment, onDelete, onUpdate }) {
    const user = useSelector(state => state.user.userData)
    const [isEditable, setIsEditable] = useState(false)
    const [showDeleteToast, setShowDeleteToast] = useState(false)
    const [content, setContent] = useState(comment.content)

    const handleEdit = (id) => {
        setIsEditable(true)
    }

    const handleUpdate = async (e, id) => {
        e.preventDefault()
        try {
            const res = await api.patch(`/comments/updateComment/${id}`, { content })
            if (res.status === 200) {
                onUpdate(res.data.data)
                setIsEditable(false)
            }
        } catch (error) {
            console.log("error in updating comment", error)
        }
    }

    const confirmDeleteComment = async () => {
        try {
            await api.delete(`/comments/deleteComment/${comment._id}`)
            onDelete(comment._id)
        } catch (error) {
            console.log("error in deleting comment", error)
        } finally {
            setShowDeleteToast(false)
        }
    }

    return (
        <div className='py-2 flex justify-between items-start gap-2 w-full relative'>
            <div className='flex items-start gap-2 flex-1 min-w-0'>
                <div className='p-1 shrink-0'>
                    <img src={comment?.owner?.avatar?.url} alt="avatar" className='rounded-full h-9 w-9 sm:h-12 sm:w-12 object-cover shadow-md mt-1' />
                </div>
                <div className='p-1 flex-1 min-w-0'>
                    <p className='text-sm sm:text-base font-medium truncate'>{comment?.owner?.fullName} <span className='text-xs text-gray-400 font-normal'>. {formatTime(comment?.createdAt)}</span></p>
                    <p className='text-xs sm:text-sm text-gray-400'>@{comment?.owner?.username}</p>
                    {isEditable ? (
                        <form onSubmit={(e) => handleUpdate(e, comment._id)}>
                            <input type="text" placeholder='Add a Comment' className='border rounded-md px-2 py-1 my-2 w-full text-white bg-transparent text-sm focus:outline-none' value={content} onChange={(e) => setContent(e.target.value)} />
                            <button type='submit'></button>
                        </form>
                    ) : (
                        <p className='text-sm sm:text-md mt-1 break-words'>{comment?.content}</p>
                    )}
                </div>
            </div>
            {
                comment?.owner?._id === user?._id && (
                    <div className='shrink-0 p-1 sm:p-3 flex items-center gap-1'>
                        {showDeleteToast ? (
                            <div className='flex items-center gap-2 bg-red-950/90 border border-red-500/70 text-red-100 text-xs px-2.5 py-1 rounded-md shadow-lg animate-fade-in'>
                                <span className='font-medium'>Delete?</span>
                                <button 
                                    onClick={confirmDeleteComment} 
                                    className='px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-xs cursor-pointer transition-colors'
                                >
                                    Yes
                                </button>
                                <button 
                                    onClick={() => setShowDeleteToast(false)} 
                                    className='px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded text-xs cursor-pointer transition-colors'
                                >
                                    No
                                </button>
                            </div>
                        ) : (
                            <>
                                <button className='hover:cursor-pointer p-1'><FontAwesomeIcon icon={faEdit} className='mx-1' onClick={() => handleEdit(comment._id)} /></button>
                                <button className='hover:cursor-pointer p-1' onClick={() => setShowDeleteToast(true)}><FontAwesomeIcon icon={faTrash} className='mx-1' /></button>
                            </>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default CommentView
