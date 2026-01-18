import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { api } from '../api/api'

function DeleteVideo({id,onClose,videos,setVideos}) {
    const handleDelete=async()=>{
        try {
            const res=await api.delete(`/videos/deleteVideo/${id}`)
            if(res.status===200){
                const newVideos=videos.filter((video)=>(
                    video._id!==id
                ))
                setVideos(newVideos)
                onClose()
            }
        } catch (error) {
            console.log("error in deleting video",error)
        }
    }
  return (
    <div>
      <div className='flex gap-5'>
        <div>
            <p className='bg-red-200 p-2 rounded-full'><FontAwesomeIcon icon={faTrash} className='text-red-700 text-lg'/></p>
        </div>
        <div>
            <h3 className='text-xl font-semibold'>Delete Video</h3>
            <p className='text-sm'>Are you sure you want to delete this video? Once its deleted, you will not be able to recover it.</p>
        </div>
        <div>
            <button className='hover:cursor-pointer' onClick={()=>onClose()}><FontAwesomeIcon icon={faXmark}/></button>
        </div>
      </div>
      <div className='flex justify-between mx-2 mt-5 gap-3'>
        <button className='border p-3 w-56 hover:cursor-pointer' onClick={()=>onClose()}>Cancel</button>
        <button className='border p-3 w-56 bg-red-600 hover:cursor-pointer' onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}

export default DeleteVideo
