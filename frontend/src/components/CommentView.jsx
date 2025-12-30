import React, { useState } from 'react'
import { formatTime } from '../utils/formatTime'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { api } from '../api/api'

function CommentView({ comment, onDelete,onUpdate }) {
    const user = useSelector(state => state.user.userData)
    const [isEditable, setIsEditable] = useState(false)
    const [content, setContent] = useState(comment.content)

    const handleEdit = (id) => {
        setIsEditable(true)
    }

    const handleUpdate=async(e,id)=>{
        e.preventDefault()
        try {
            const res=await api.patch(`/comments/updateComment/${id}`,{content})
            if(res.status===200){
                onUpdate(res.data.data)
                setIsEditable(false)
            }
        } catch (error) {
            console.log("error in updating comment",error)
        }
    }
    const handleDeleteComment = async (id) => {
        try {
            await api.delete(`/comments/deleteComment/${id}`)
            onDelete(comment._id)
        } catch (error) {
            console.log("error in deleting comment", error)
        }
    }
    return (
        <div className='py-2 flex justify-between'>
            <div className='flex'>
                <div className='p-1 m-1'>
                    <img src={comment?.owner?.avatar?.url} alt="avatar" className='rounded-full h-12 w-12 object-cover shadow-md mt-1' />
                </div>
                <div className='p-1 m-1'>
                    <p>{comment?.owner?.fullName}<span> . {formatTime(comment?.createdAt)}</span></p>
                    <p className='text-sm'>@{comment?.owner?.username}</p>
                    {isEditable?
                    <form onSubmit={(e)=>handleUpdate(e,comment._id)}>
                        <input type="text" placeholder='Add a Comment' className='border rounded-md px-2 py-1 my-2 w-full text-white' value={content} onChange={(e) => setContent(e.target.value)} />
                        <button type='submit'></button>
                    </form>
                    :
                    <p className='text-md mt-1'>{comment?.content}</p>
                    }
                </div>
            </div>
            {
                comment.owner._id === user?._id &&
                <div className='right-0 p-3 mx-3'>
                    <button className='hover:cursor-pointer'><FontAwesomeIcon icon={faEdit} className='mx-1' onClick={() => handleEdit(comment._id)} /></button>
                    <button className='hover:cursor-pointer' onClick={() => handleDeleteComment(comment._id)}><FontAwesomeIcon icon={faTrash} className='mx-1' /></button>
                </div>
            }
        </div>
    )
}

export default CommentView
