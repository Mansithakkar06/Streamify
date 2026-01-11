import React, { useEffect, useState } from 'react'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import TextAreaBox from '../components/TextAreaBox'
import { api } from '../api/api'

function EditVideo({ onUploading, onUploaded, id }) {
    const { register,
        handleSubmit,
        reset,
        formState: {
            errors
        }
    } = useForm()
    const [image, setImage] = useState(null);

    const updateVideoHandler = async (data) => {
        try {
            const formData = new FormData();
            if(data.thumbnail[0]){
                formData.append("thumbnail", data.thumbnail[0])
            }
            formData.append("title", data.title)
            formData.append("description", data.description)
            onUploading()
            const res = await api.patch(`/videos/updateVideoDetails/${id}`, formData)
            if (res.status === 200) {
                onUploaded()
            }
        } catch (error) {
            console.log("error in updating video", error)
        }
    }
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/getVideoById/${id}`)
                setImage(res.data.data.thumbnail.url)

                reset({
                    title: res.data.data.title,
                    description: res.data.data.description
                })
            } catch (error) {
                console.log("error in fetching video details", error)
            }
        }
        fetchVideo()
    }, []);
    return (
        <div>
            <form onSubmit={handleSubmit(updateVideoHandler)}>
                <div className='w-full border p-2'>
                    <img src={image} alt="thumbnail" className='w-full h-64 mx-auto' />
                </div>
                <InputBox
                    type='file'
                    id="thumbnail"
                    label="Thumbnail"
                    placeholder="slect thumbnail"
                    register={register("thumbnail")}
                    error={errors.thumbnail?.message}
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
                    register={register("description", {
                        required: "Description is required!!"
                    })}
                    error={errors.description?.message}
                    required={true}
                >
                </TextAreaBox>
                <div className='flex justify-center m-2 p-2'>
                    <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-10 py-2.5 rounded-full transition-colors duration-200 cursor-pointer">Update</button>
                </div>
            </form>
        </div>
    )
}

export default EditVideo
