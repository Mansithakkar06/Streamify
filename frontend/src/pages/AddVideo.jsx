import React, { useState } from 'react'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import TextAreaBox from '../components/TextAreaBox'
import { api } from '../api/api'

function AddVideo({onUploading,onUploaded}) {
    const { register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm()

    const addVideoHandler=async(data)=>{
        try {
            const formData=new FormData();
            formData.append("videoFile",data.videoFile[0])
            formData.append("thumbnail",data.thumbnail[0])
            formData.append("title",data.title)
            formData.append("description",data.description)
            onUploading()
            const res=await api.post("/videos/publish_video",formData)
            if(res.status===201){
                onUploaded()
            }
        } catch (error) {
            console.log("error in uploading video",error)
        }
        

    }
    return (
        <div>
            <form onSubmit={handleSubmit(addVideoHandler)}>
                <InputBox
                    type='file'
                    id="videoFile"
                    label="Video File"
                    placeholder="slect video file"
                    register={register("videoFile", {
                        required: "VideoFile is required!!"
                    })}
                    error={errors.videoFile?.message}
                    required={true}
                />
                <InputBox
                    type='file'
                    id="thumbnail"
                    label="Thumbnail"
                    placeholder="slect thumbnail"
                    register={register("thumbnail", {
                        required: "Thumbnail is required!!"
                    })}
                    error={errors.thumbnail?.message}
                    required={true}
                />
                <InputBox
                    id="title"
                    label="Title"
                    placeholder="Enter Video Title"
                    register={register("title", {
                        required: "title is required!!"
                    })}
                    error={errors.title?.message}
                    required={true}
                />
                <TextAreaBox
                id="description"
                label="Description"
                placeholder="Enter video description"
                register={register("description",{
                    required:"Description is required!!"
                })}
                error={errors.description?.message}
                required={true}
                >
                    
                </TextAreaBox>
                <div className='flex justify-center m-2 p-2'>
                <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-10 py-2.5 rounded-full transition-colors duration-200 cursor-pointer">Add</button>
                </div>
            </form>
        </div>
    )
}

export default AddVideo
