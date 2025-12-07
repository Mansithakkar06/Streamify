import React from 'react'
import { formatTime } from '../utils/formatTime'

function CommentView({ comment }) {
    return (
        <div className='py-2'>
            <div className='flex'>
                <div className='p-1 m-1'>
                    <img src={comment.owner.avatar.url} alt="avatar" className='rounded-full h-12 w-12 object-cover shadow-md mt-1' />
                </div>
                <div className='p-1 m-1'>
                    <p>{comment.owner.fullName}<span> . {formatTime(comment.createdAt)}</span></p>
                    <p className='text-sm'>@{comment.owner.username}</p>
                    <p className='text-md mt-1'>{comment.content}</p>
                </div>
            </div>
        </div>
    )
}

export default CommentView
